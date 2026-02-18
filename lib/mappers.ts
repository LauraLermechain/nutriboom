import type { Food } from "./models";
import type { Product } from "./openFoodFacts";

export function productToFood(product: Product): Food {
  return {
    id: product.code,
    name:
      product.product_name ||
      product.product_name_fr ||
      product.product_name_en ||
      "Nom inconnu",
    brand: product.brands || "Non renseigné",
    image_url: product.image_url || "",
    nutriscore: product.nutriscore_grade || "N/A",
    calories: Number(product.nutriments?.["energy-kcal_100g"] ?? 0),
    proteins: Number(product.nutriments?.proteins_100g ?? 0),
    carbs: Number(product.nutriments?.carbohydrates_100g ?? 0),
    fats: Number(product.nutriments?.fat_100g ?? 0),
  };
}
