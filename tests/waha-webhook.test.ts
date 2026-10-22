import { describe, expect, it } from "vitest";
import { POST } from "../apps/web/src/app/api/webhooks/waha/route";
import { NextRequest } from "next/server";

function createPostRequest(body: string | Record<string, any>, isRawString = false) {
  return new NextRequest("http://localhost:3001/api/webhooks/waha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: isRawString ? (body as string) : JSON.stringify(body),
  });
}

describe("Wajib 1: Validasi Webhook WAHA & Format Reply", () => {
  describe("a. Validasi Webhook WAHA", () => {
    it("1. Payload valid lolos dengan HTTP 200", async () => {
      const validPayload = {
        event: "message",
        payload: {
          from: "60123456789@c.us",
          body: "Halo, saya mau tanya ketersediaan homestay di Kuala Lumpur",
        },
      };

      const req = createPostRequest(validPayload);
      const res = await POST(req);

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("to");
      expect(data).toHaveProperty("reply");
    });

    it("2. Payload tanpa field 'event' ditolak dengan HTTP 400", async () => {
      const payloadWithoutEvent = {
        payload: {
          from: "60123456789@c.us",
          body: "Halo",
        },
      };

      const req = createPostRequest(payloadWithoutEvent);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Invalid WAHA webhook payload");
    });

    it("3. Payload tanpa field 'payload.from' ditolak dengan HTTP 400", async () => {
      const payloadWithoutFrom = {
        event: "message",
        payload: {
          body: "Halo",
        },
      };

      const req = createPostRequest(payloadWithoutFrom);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Invalid WAHA webhook payload");
    });

    it("4. Payload tanpa field 'payload.body' ditolak dengan HTTP 400", async () => {
      const payloadWithoutBody = {
        event: "message",
        payload: {
          from: "60123456789@c.us",
        },
      };

      const req = createPostRequest(payloadWithoutBody);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Invalid WAHA webhook payload");
    });

    it("5. Malformed JSON body ditolak dengan HTTP 400", async () => {
      const req = createPostRequest("this is not valid json {{{", true);
      const res = await POST(req);

      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toBe("Malformed JSON body");
    });
  });

  describe("b. Format Reply WAHA", () => {
    it("Response sukses mengembalikan struktur presisi { to: payload.from, reply: string }", async () => {
      const senderFrom = "60198765432@c.us";
      const messageBody = "Berapa rate untuk homestay Cameron Highlands?";
      const payload = {
        event: "message",
        payload: {
          from: senderFrom,
          body: messageBody,
        },
      };

      const req = createPostRequest(payload);
      const res = await POST(req);

      expect(res.status).toBe(200);
      const data = await res.json();

      // Memastikan struktur kembalian persis { to, reply }
      expect(data).toHaveProperty("to");
      expect(data).toHaveProperty("reply");
      expect(typeof data.to).toBe("string");
      expect(typeof data.reply).toBe("string");
      expect(data.to).toBe(senderFrom);
      expect(data.reply.length).toBeGreaterThan(0);
    });
  });
});

