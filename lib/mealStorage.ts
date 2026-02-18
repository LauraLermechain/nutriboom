import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Meal } from "./models";

const STORAGE_KEY = "MEALS_STORAGE";

export async function getMeals(): Promise<Meal[]> {
  const json = await AsyncStorage.getItem(STORAGE_KEY);
  return json ? JSON.parse(json) : [];
}

export async function saveMeals(meals: Meal[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

export async function addMeal(meal: Meal) {
  const meals = await getMeals();
  meals.push(meal);
  await saveMeals(meals);
}

export async function deleteMeal(id: string) {
  const meals = await getMeals();
  const updated = meals.filter((m) => m.id !== id);
  await saveMeals(updated);
}
