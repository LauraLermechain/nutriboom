import type { Meal } from "./models";

export const mockMeals: Meal[] = [
  {
    id: "1",
    name: "Petit-déjeuner",
    date: "2026-02-18",
    foods: [
      {
        id: "123",
        name: "Céréales",
        brand: "Kellogg's",
        image_url: "",
        nutriscore: "b",
        calories: 380,
        proteins: 8,
        carbs: 75,
        fats: 3,
      },
    ],
  },
  {
    id: "2",
    name: "Déjeuner",
    date: "2026-02-18",
    foods: [
      {
        id: "456",
        name: "Yaourt",
        brand: "Danone",
        image_url: "",
        nutriscore: "a",
        calories: 60,
        proteins: 4,
        carbs: 5,
        fats: 2,
      },
      {
        id: "789",
        name: "Pain",
        brand: "Boulangerie",
        image_url: "",
        nutriscore: "c",
        calories: 260,
        proteins: 9,
        carbs: 50,
        fats: 2,
      },
    ],
  },
];
