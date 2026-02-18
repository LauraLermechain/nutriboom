import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProductByBarcode } from "../../../lib/openFoodFacts";

export default function ProductFromBarcode() {
  const { barcode } = useLocalSearchParams<{ barcode?: string }>();
  const router = useRouter();

  const [loading, setLoading] = React.useState(true);
  const [product, setProduct] = React.useState<any>(null);

  React.useEffect(() => {
    const run = async () => {
      if (!barcode) return;
      setLoading(true);
      const p = await getProductByBarcode(String(barcode));
      setProduct(p);
      setLoading(false);
    };
    run();
  }, [barcode]);

  if (!barcode) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text>Code-barres manquant.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: "#0a7ea4" }}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text>Chargement du produit...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Produit introuvable
        </Text>
        <Text>Ce code-barres n’existe pas dans Open Food Facts.</Text>
        <Pressable
          onPress={() => router.replace("/(main)/add/camera")}
          style={{
            backgroundColor: "#0a7ea4",
            padding: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            Rescanner
          </Text>
        </Pressable>
      </View>
    );
  }

  const name =
    product.product_name || product.product_name_fr || product.product_name_en || "Nom inconnu";

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>{name}</Text>
      <Text>Marque: {product.brands || "Non renseigné"}</Text>
      <Text>Nutriscore: {product.nutriscore_grade || "N/A"}</Text>

      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={{ width: 180, height: 180, marginTop: 8 }}
        />
      ) : null}

      <View style={{ marginTop: 10, gap: 6 }}>
        <Text style={{ fontWeight: "700" }}>Nutriments (pour 100g)</Text>
        <Text>Calories: {product.nutriments?.["energy-kcal_100g"] ?? "N/A"} kcal</Text>
        <Text>Protéines: {product.nutriments?.proteins_100g ?? "N/A"} g</Text>
        <Text>Glucides: {product.nutriments?.carbohydrates_100g ?? "N/A"} g</Text>
        <Text>Lipides: {product.nutriments?.fat_100g ?? "N/A"} g</Text>
      </View>
    </View>
  );
}
