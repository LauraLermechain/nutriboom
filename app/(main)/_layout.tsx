import React from "react";
import { Tabs, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { View, Text } from "react-native";

export default function MainLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {/* Tab 1 : Accueil */}
      <Tabs.Screen name="(home)" options={{ title: "Accueil" }} />

      {/* Tab 2 : Ajouter */}
      <Tabs.Screen name="add" options={{ title: "Ajouter" }} />

      {/* Tab 3 : Profil */}
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
