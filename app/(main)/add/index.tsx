import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { searchProducts, Product } from "../../../lib/openFoodFacts";

export default function AddScreen() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const products = await searchProducts(query.trim());
      setResults(products);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          Rechercher un aliment
        </Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ex: Coca Cola"
          placeholderTextColor="#666666"
          autoCapitalize="none"
          autoCorrect={false}
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
          <Text style={{ color: "white", fontWeight: "600" }}>Rechercher</Text>
        </Pressable>

        {loading ? <Text style={{ marginTop: 10 }}>Chargement...</Text> : null}

        <FlatList
          style={{ marginTop: 12 }}
          data={results}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
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
                {item.product_name || item.product_name_fr || "Nom inconnu"}
              </Text>

              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={{ width: 100, height: 100, marginTop: 8 }}
                />
              ) : null}

              <Text>Marque: {item.brands || "Non renseigné"}</Text>
              <Text>Nutriscore: {item.nutriscore_grade || "N/A"}</Text>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
