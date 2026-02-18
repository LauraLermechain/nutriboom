import type { Meal } from "./models";

export function mealTotalCalories(meal: Meal): number {
  return meal.foods.reduce((sum, f) => sum + (f.calories || 0), 0);
}
