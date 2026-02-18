import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function MealDetail() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Détail du repas : {id}</Text>
    </View>
  );
}
