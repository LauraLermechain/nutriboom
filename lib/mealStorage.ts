import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Meal } from "./models";

const KEY = "meals";

export async function getMeals(): Promise<Meal[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Meal[]) : [];
}

export async function addMeal(meal: Meal): Promise<void> {
  const meals = await getMeals();
  meals.unshift(meal);
  await AsyncStorage.setItem(KEY, JSON.stringify(meals));
}
