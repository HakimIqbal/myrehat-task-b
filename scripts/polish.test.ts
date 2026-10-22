import { describe, expect, it } from "vitest";
import { createMockOpencodeModel, polishDescription } from "./polish";

describe("Fitur F3: scripts/polish.ts (Listing Description Polisher)", () => {
  it("should polish a raw description into a marketing-friendly text using mock mode", async () => {
    const rawInput = "condo 2 bilik klcc view dekat lrt fully furnished";
    const result = await polishDescription(rawInput, { mock: true });

    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(20);
    expect(result).toContain("MyRehat AI");
  });

  it("should support a custom mock provider for deterministic assertion", async () => {
    const customText =
      "🏡 Stunning 2-Bedroom Luxury Suite overlooking the iconic KLCC skyline! Steps from LRT, fully designer-furnished for maximum Airbnb ROI.";
    const mockModel = createMockOpencodeModel(customText);

    const result = await polishDescription(
      "condo 2 bilik klcc view dekat lrt",
      { provider: mockModel, modelName: "opencode/mock-test-v1" },
    );

    expect(result).toBe(customText);
  });

  it("should support dynamic custom mock provider function based on input", async () => {
    const dynamicModel = createMockOpencodeModel((prompt) => {
      return `[POLISHED]: High-performing Airbnb listing refined from prompt: ${prompt.slice(0, 30)}...`;
    });

    const result = await polishDescription("villa bali private pool", {
      provider: dynamicModel,
    });

    expect(result).toContain("[POLISHED]: High-performing Airbnb listing");
  });

  it("should throw an informative error when raw description is empty or whitespace", async () => {
    await expect(polishDescription("")).rejects.toThrow(
      "Raw description must not be empty",
    );
    await expect(polishDescription("   \n\t  ")).rejects.toThrow(
      "Raw description must not be empty",
    );
  });

  it("should create a valid LanguageModel conforming to AI SDK specification", () => {
    const model = createMockOpencodeModel("test output");

    expect(model).toBeDefined();
    expect((model as any).specificationVersion).toBe("v4");
    expect((model as any).provider).toBe("opencode-mock");
    expect(typeof (model as any).doGenerate).toBe("function");
  });
});

