import { cors } from "@elysiajs/cors";
import { appRouter } from "@myrehat-task-b/api/routers/index";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { Elysia } from "elysia";

import { createContext } from "./context";
import { ENV } from "./env.server";
import { auth } from "./services";

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});
const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

function createFallbackStream(text: string) {
  const msgId = `msg_${Date.now()}`;
  return createUIMessageStream({
    execute: ({ writer }) => {
      writer.write({ type: "text-start", id: msgId });
      writer.write({ type: "text-delta", id: msgId, delta: text, text } as any);
      writer.write({ type: "text-end", id: msgId });
    },
  });
}

const handleAiChat = async (context: any) => {
  let body: { messages?: UIMessage[] } = {};
  try {
    body = (await context.request.json()) as { messages?: UIMessage[] };
  } catch {
    body = { messages: [] };
  }
  console.log("POST /ai received body:", JSON.stringify(body));

  const uiMessages = body.messages || [];
  const normalizedMessages = uiMessages.map((msg: any) => {
    if (!msg.parts) {
      const text = typeof msg.content === "string" ? msg.content : (msg.text || "");
      return {
        ...msg,
        parts: [{ type: "text", text }],
      };
    }
    return msg;
  });

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const modelName = process.env.OPENROUTER_MODEL?.trim() || "google/gemini-2.5-flash";

  const isPlaceholder =
    !apiKey ||
    apiKey === "placeholder" ||
    apiKey.startsWith("placeh") ||
    apiKey === "***" ||
    apiKey.includes("your-api-key");

  if (isPlaceholder) {
    console.log("OpenRouter API key is placeholder or empty, serving concierge fallback stream.");
    return createUIMessageStreamResponse({
      stream: createFallbackStream(
        "Welcome to MyRehat Concierge! I can help you find verified homestays, check direct host rates, or explore BuyHomestay property opportunities across Malaysia. How can I assist you with your travel or property plans today?",
      ),
    });
  }

  try {
    console.log("Invoking OpenRouter with model:", modelName);
    const openrouter = createOpenRouter({
      apiKey,
    });

    const model = openrouter(modelName);

    const result = streamText({
      model,
      system:
        "You are the official MyRehat Concierge assistant. You provide polite, helpful, and concise assistance for homestay bookings, property inquiries, and BuyHomestay listings. Keep your tone warm, welcoming, and concise.",
      messages: await convertToModelMessages(normalizedMessages),
      maxOutputTokens: 1000,
      ...({ maxTokens: 1000 } as any),
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: (err) => {
          console.error("OpenRouter error in /ai:", err);
          return "MyRehat Concierge is experiencing high traffic. Please try again or reach out to hosts directly on WhatsApp!";
        },
      }),
    });
  } catch (err) {
    console.error("OpenRouter error in /ai:", err);

    return createUIMessageStreamResponse({
      stream: createFallbackStream(
        "I am currently experiencing higher than usual traffic. Please explore our verified listings on the Marketplace or contact hosts directly via WhatsApp!",
      ),
    });
  }
};

new Elysia()
  .use(
    cors({
      origin: ENV.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .all("/api/auth/*", async (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      return auth.handler(request);
    }
    return status(405);
  })
  .all(
    "/rpc*",
    async (context) => {
      const { response } = await rpcHandler.handle(context.request, {
        prefix: "/rpc",
        context: await createContext({ context }),
      });
      return response ?? new Response("Not Found", { status: 404 });
    },
    {
      parse: "none",
    },
  )
  .all(
    "/api-reference*",
    async (context) => {
      const { response } = await apiHandler.handle(context.request, {
        prefix: "/api-reference",
        context: await createContext({ context }),
      });
      return response ?? new Response("Not Found", { status: 404 });
    },
    {
      parse: "none",
    },
  )
  .post("/ai", handleAiChat)
  .post("/api/ai", handleAiChat)
  .get("/", () => "OK")
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
