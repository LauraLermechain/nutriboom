import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { searchProducts, Product } from "../../../lib/openFoodFacts";

export default function AddScreen() {
  const router = useRouter();

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const products = await searchProducts(query.trim());
    setResults(products);
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        Ajouter un repas
      </Text>

      {/* Recherche texte */}
      <TextInput
        placeholder="Ex: Coca Cola"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginTop: 12,
          backgroundColor: "white",
        }}
      />

      <Pressable
        onPress={handleSearch}
        style={{
          backgroundColor: "#0a7ea4",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Rechercher
        </Text>
      </Pressable>

      {/* Bouton scanner */}
      <Pressable
        onPress={() => router.push("/(main)/add/camera")}
        style={{
          backgroundColor: "#444",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Scanner un code-barres
        </Text>
      </Pressable>

      {loading && <Text style={{ marginTop: 12 }}>Chargement...</Text>}

      {/* Résultats */}
      <FlatList
        style={{ marginTop: 16 }}
        data={results}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 12,
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {item.product_name ||
                item.product_name_fr ||
                "Nom inconnu"}
            </Text>

            {item.image_url && (
              <Image
                source={{ uri: item.image_url }}
                style={{ width: 100, height: 100, marginTop: 8 }}
              />
            )}

            <Text>Marque: {item.brands || "Non renseigné"}</Text>
            <Text>Nutriscore: {item.nutriscore_grade || "N/A"}</Text>
          </View>
        )}
      />
    </View>
  );
}
