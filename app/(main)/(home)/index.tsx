import React from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { mockMeals } from "../../../lib/mockMeals";
import { mealTotalCalories } from "../../../lib/meals";
import type { Meal } from "../../../lib/models";

export default function HomeScreen() {
  const router = useRouter();

  const meals: Meal[] = mockMeals;

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

      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const total = mealTotalCalories(item);

          return (
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
              <Text>Total : {total} kcal</Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
