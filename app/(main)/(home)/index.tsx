import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getMeals } from "../../../lib/mealStorage";
import { mealTotalCalories } from "../../../lib/meals";
import type { Meal } from "../../../lib/models";

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = React.useState<Meal[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const load = async () => {
        const stored = await getMeals();
        setMeals(stored);
      };
      load();
    }, [])
  );

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Mes repas</Text>

      <Pressable
        onPress={() => router.push("/(main)/add")}
        style={{
          backgroundColor: "#0a7ea4",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          Ajouter un repas
        </Text>
      </Pressable>

      {meals.length === 0 ? (
        <Text style={{ marginTop: 20, opacity: 0.7 }}>
          Aucun repas enregistré pour le moment.
        </Text>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/(main)/(home)/${item.id}`)}
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor: "#eee",
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              <Text style={{ fontWeight: "700" }}>{item.name}</Text>
              <Text>Date : {item.date}</Text>
              <Text>Total : {mealTotalCalories(item)} kcal</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
