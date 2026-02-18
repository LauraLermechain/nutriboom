import { Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function MainLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  // Pendant que Clerk charge (au démarrage)
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // Pas connecté -> on renvoie vers l'auth
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Connecté -> on laisse accéder aux pages de (main)
  return (
    <Tabs>
      <Tabs.Screen name="(home)" options={{ title: "Accueil" }} />
      <Tabs.Screen name="add" options={{ title: "Ajouter" }} />
      <Tabs.Screen name="profile" options={{ title: "Profil" }} />
    </Tabs>
  );
}
