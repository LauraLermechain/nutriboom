export type Product = {
  code: string;
  product_name?: string;
  product_name_fr?: string;
  product_name_en?: string;
  brands?: string;
  image_url?: string;
  nutriscore_grade?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
};

export async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(
    `https://fr.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      query
    )}&search_simple=1&action=process&json=1&page_size=10`
  );

  const data = await response.json();
  return data.products;
}

export async function getProductByBarcode(barcode: string): Promise<Product | null> {
  const url = `https://fr.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "Nutriboom - ExpoApp",
    },
  });

  // Si l’API renvoie une page HTML / erreur serveur
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.log("OFF non-JSON response (first chars):", text.slice(0, 80));
    return null;
  }

  const data = await res.json();

  // OFF renvoie status: 1 si trouvé sinon status: 0
  return data?.status === 1 ? (data.product as Product) : null;
}

