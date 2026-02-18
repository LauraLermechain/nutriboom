import { Tabs } from "expo-router";

export default function MainLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="(home)" options={{ title: "Accueil" }} />
      <Tabs.Screen name="add" options={{ title: "Ajouter" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
