export type Food = {
  id: string; 
  name: string;
  brand: string;
  image_url: string;
  nutriscore: string;
  calories: number; 
  proteins: number; 
  carbs: number;    
  fats: number;     
};

export type Meal = {
  id: string;  
  name: "Petit-déjeuner" | "Déjeuner" | "Dîner" | "Snack";
  date: string;        //YYYY-MM-DD
  foods: Food[];
};
