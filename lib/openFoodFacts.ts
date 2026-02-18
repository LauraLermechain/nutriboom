export type Product = {
  code: string;
  product_name?: string;
  product_name_fr?: string;
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
