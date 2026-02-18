import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import type { Meal, Food } from "../../../lib/models";
import {
  searchProducts,
  Product,
  getProductByBarcode,
} from "../../../lib/openFoodFacts";
import { productToFood } from "../../../lib/mappers";
import { useDebouncedValue } from "../../../lib/useDebouncedValue";
import { addMeal } from "../../../lib/mealStorage";

const MEAL_TYPES: Meal["name"][] = [
  "Petit-déjeuner",
  "Déjeuner",
  "Dîner",
  "Snack",
];

function todayYYYYMMDD() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AddMealScreen() {
  const router = useRouter();
  const { barcode } = useLocalSearchParams<{ barcode?: string }>();

  const [mealType, setMealType] =
    React.useState<Meal["name"]>("Déjeuner");

  const [foods, setFoods] = React.useState<Food[]>([]);

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const [results, setResults] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Recherche texte
  React.useEffect(() => {
    const run = async () => {
      const q = debouncedQuery.trim();
      if (q.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const products = await searchProducts(q);
        setResults(products);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedQuery]);

  // Ajout automatique après scan
  React.useEffect(() => {
    const run = async () => {
      if (!barcode) return;

      const product = await getProductByBarcode(String(barcode));

      // AJOUT DU MESSAGE D'ERREUR
      if (!product) {
        Alert.alert("Produit introuvable ❌", "Ce code-barres n'existe pas dans la base.");
        return;
      }

      const food = productToFood(product);

      setFoods((current) => {
        if (current.some((f) => f.id === food.id)) return current;
        return [...current, food];
      });
    };

    run();
  }, [barcode]);


  const addFood = (product: Product) => {
    const food = productToFood(product);
    setFoods((current) => {
      if (current.some((f) => f.id === food.id)) return current;
      return [...current, food];
    });
  };

  const removeFood = (id: string) => {
    setFoods((current) => current.filter((f) => f.id !== id));
  };

  const onValidate = async () => {
    if (foods.length === 0) {
      Alert.alert("Ajoute au moins un aliment");
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      name: mealType,
      date: todayYYYYMMDD(),
      foods,
    };

    await addMeal(meal);
    Alert.alert("Repas enregistré");

    setFoods([]);
    setQuery("");
    setResults([]);

    router.navigate("/(main)/(home)");
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>
        Ajouter un repas
      </Text>

      <Text style={{ fontWeight: "700" }}>Type de repas</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {MEAL_TYPES.map((t) => (
          <Pressable
            key={t}
            onPress={() => setMealType(t)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor:
                mealType === t ? "#0a7ea4" : "#ccc",
              backgroundColor:
                mealType === t ? "#0a7ea4" : "transparent",
            }}
          >
            <Text
              style={{
                color: mealType === t ? "white" : "black",
              }}
            >
              {t}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() =>
          router.push("/(main)/add/camera")
        }
        style={{
          backgroundColor: "#444",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          Scanner un code-barres
        </Text>
      </Pressable>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Rechercher un aliment (min 2 lettres)"
        placeholderTextColor="#666"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          backgroundColor: "white",
        }}
      />

      {loading ? <Text>Chargement...</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.code}
        style={{ maxHeight: 240 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => addFood(item)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 8,
              marginBottom: 8,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
            }}
          >
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                }}
              />
            ) : (
              <View
                style={{ width: 40, height: 40 }}
              />
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700" }}>
                {item.product_name ||
                  item.product_name_fr ||
                  item.product_name_en ||
                  "Nom inconnu"}
              </Text>
              <Text style={{ opacity: 0.7 }}>
                {item.brands ||
                  "Marque inconnue"}
              </Text>
            </View>

            <Text
              style={{
                color: "#0a7ea4",
                fontWeight: "700",
              }}
            >
              + Ajouter
            </Text>
          </Pressable>
        )}
      />

      <Text style={{ fontWeight: "700" }}>
        Aliments ajoutés
      </Text>

      {foods.length === 0 ? (
        <Text style={{ opacity: 0.7 }}>
          Aucun aliment pour le moment.
        </Text>
      ) : (
        foods.map((f) => (
          <View
            key={f.id}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 8,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{ flex: 1, paddingRight: 8 }}
            >
              <Text
                style={{ fontWeight: "700" }}
              >
                {f.name}
              </Text>
              <Text style={{ opacity: 0.7 }}>
                {f.brand}
              </Text>
            </View>

            <Pressable
              onPress={() =>
                removeFood(f.id)
              }
            >
              <Text
                style={{
                  color: "red",
                  fontWeight: "700",
                }}
              >
                Supprimer
              </Text>
            </Pressable>
          </View>
        ))
      )}

      <Pressable
        onPress={onValidate}
        style={{
          backgroundColor: "#0a7ea4",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 8,
          opacity:
            foods.length === 0 ? 0.5 : 1,
        }}
        disabled={foods.length === 0}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
          }}
        >
          Valider
        </Text>
      </Pressable>
    </View>
  );
}
