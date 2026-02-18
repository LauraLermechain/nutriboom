import React from "react";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import type { Meal } from "../../../lib/models";
import { getMeals, saveMeals } from "../../../lib/mealStorage";

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [meal, setMeal] = React.useState<Meal | null>(null);

  // Charger le repas
  React.useEffect(() => {
    const load = async () => {
      const meals = await getMeals();
      const found = meals.find((m) => m.id === id);
      setMeal(found ?? null);
    };

    load();
  }, [id]);

  // Si non trouvé
  if (!meal) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18 }}>Repas introuvable ❌</Text>
      </View>
    );
  }

  // Calcul des totaux
  const totals = meal.foods.reduce(
    (acc, f) => ({
      calories: acc.calories + (f.calories ?? 0),
      proteins: acc.proteins + (f.proteins ?? 0),
      carbs: acc.carbs + (f.carbs ?? 0),
      fats: acc.fats + (f.fats ?? 0),
    }),
    { calories: 0, proteins: 0, carbs: 0, fats: 0 }
  );

  // Supprimer le repas
  const deleteMeal = async () => {
    Alert.alert("Supprimer ce repas ?", "Cette action est définitive.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          const meals = await getMeals();
          const updated = meals.filter((m) => m.id !== id);
          await saveMeals(updated);
          router.replace("/(main)/(home)");
        },
      },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 8 }}>
        {meal.name} — {meal.date}
      </Text>

      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 8 }}>
        Aliments
      </Text>

      {meal.foods.map((f) => (
        <View
          key={f.id}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#eee",
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 16 }}>{f.name}</Text>
          <Text style={{ opacity: 0.7 }}>{f.brand}</Text>

          <View style={{ marginTop: 6 }}>
            <Text>Calories: {f.calories ?? 0}</Text>
            <Text>Protéines: {f.proteins ?? 0}</Text>
            <Text>Glucides: {f.carbs ?? 0}</Text>
            <Text>Lipides: {f.fats ?? 0}</Text>
          </View>
        </View>
      ))}

      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        Total nutritionnel
      </Text>

      <Text>Calories: {totals.calories}</Text>
      <Text>Protéines: {totals.proteins}</Text>
      <Text>Glucides: {totals.carbs}</Text>
      <Text>Lipides: {totals.fats}</Text>

      <Pressable
        onPress={deleteMeal}
        style={{
          backgroundColor: "red",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 24,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>
          Supprimer le repas
        </Text>
      </Pressable>
    </ScrollView>
  );
}
