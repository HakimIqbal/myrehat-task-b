import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Zod schema for WAHA incoming webhook payload
export const wahaWebhookSchema = z.object({
  event: z.string().min(1, "Field 'event' is required"),
  payload: z.object({
    from: z.string().min(1, "Field 'payload.from' is required"),
    body: z.string().min(1, "Field 'payload.body' is required"),
  }),
});

export type WahaWebhookPayload = z.infer<typeof wahaWebhookSchema>;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "Malformed JSON body",
      },
      { status: 400 },
    );
  }

  const parseResult = wahaWebhookSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: "Invalid WAHA webhook payload",
        details: parseResult.error.format(),
        issues: parseResult.error.issues,
      },
      { status: 400 },
    );
  }

  const { from, body: messageBody } = parseResult.data.payload;

  const apiKey = process.env.OPENROUTER_API_KEY;
  const modelName = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";

  let replyText = "";

  // If OPENROUTER_API_KEY is available and not a placeholder, call generateText via OpenRouter
  if (apiKey && apiKey !== "***" && apiKey.trim().length > 0) {
    try {
      const openrouter = createOpenRouter({
        apiKey,
      });

      const { text } = await generateText({
        model: openrouter(modelName),
        system:
          "You are the official MyRehat Concierge assistant on WhatsApp. You provide polite, helpful, and concise assistance for homestay bookings, property inquiries, and BuyHomestay listings. Keep your tone warm, welcoming, and formatting WhatsApp-friendly.",
        prompt: messageBody,
      });

      replyText = text;
    } catch (error) {
      console.error("Error in OpenRouter AI generation:", error);
      replyText =
        "Thank you for reaching out to MyRehat Concierge! We have received your inquiry and our team will get back to you shortly.";
    }
  } else {
    // Fallback response when OPENROUTER_API_KEY is not configured
    replyText = `Hello! Thank you for reaching out to MyRehat Concierge regarding: "${messageBody}". How may we assist you with your homestay reservation or property search today?`;
  }

  return NextResponse.json({
    to: from,
    reply: replyText,
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "MyRehat WAHA Webhook endpoint is active. Send POST requests to interact.",
  });
}

