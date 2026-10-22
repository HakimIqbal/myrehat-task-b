import { describe, expect, it } from "vitest";
import {
  createHomestayInputSchema,
  homestayCategorySchema,
} from "../packages/api/src/routers/homestays";
import { HOMESTAY_CATEGORIES } from "../packages/db/src/schema/homestays";

describe("Wajib 2: Validasi Kategori BuyHomestay (4 Diterima + 1 Ditolak)", () => {
  const validCategories = [
    "Buy Property",
    "Buy land to build homestay",
    "Buy Airbnb Profile",
    "Buy Airbnb Business",
  ] as const;

  it("Memastikan daftar konstanta HOMESTAY_CATEGORIES memuat TEPAT 4 kategori", () => {
    expect(HOMESTAY_CATEGORIES).toHaveLength(4);
    expect(HOMESTAY_CATEGORIES).toEqual(validCategories);
  });

  describe("4 Kategori Diterima (Valid)", () => {
    for (const category of validCategories) {
      it(`Menerima kategori valid: "${category}" pada enum schema`, () => {
        const result = homestayCategorySchema.safeParse(category);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(category);
        }
      });

      it(`Menerima payload lengkap dengan kategori "${category}"`, () => {
        const payload = {
          title: `Listing Uji ${category}`,
          price: 450000,
          location: "Cameron Highlands, Pahang",
          category: category,
          contactWa: "+60123456789",
        };

        const result = createHomestayInputSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });
    }
  });

  describe("Kategori Tidak Sesuai Ditolak (Invalid)", () => {
    const invalidCategories = [
      "Rent Apartment",
      "Invalid Category",
      "Buy Land",
      "Homestay Daily",
      "",
      "Random Non-Existent Category",
    ];

    for (const invalid of invalidCategories) {
      it(`Menolak kategori sembarang: "${invalid}" pada enum schema`, () => {
        const result = homestayCategorySchema.safeParse(invalid);
        expect(result.success).toBe(false);
      });

      it(`Menolak input listing lengkap dengan kategori invalid: "${invalid}"`, () => {
        const payload = {
          title: "Listing Invalid",
          price: 200000,
          location: "Kuala Lumpur",
          category: invalid,
          contactWa: "+60123456789",
        };

        const result = createHomestayInputSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    }
  });
});

