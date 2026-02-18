import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUser, useAuth } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "Email introuvable";

  const onLogout = async () => {
    Alert.alert("Se déconnecter", "Tu veux vraiment te déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Se déconnecter",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Profil</Text>

      <View
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: "#eee",
          borderRadius: 8,
        }}
      >
        <Text style={{ fontWeight: "700" }}>Email</Text>
        <Text style={{ marginTop: 4 }}>{email}</Text>
      </View>

      <Pressable
        onPress={onLogout}
        style={{
          backgroundColor: "red",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        }}
      >
        <Text style={{ color: "white", fontWeight: "700" }}>
          Se déconnecter
        </Text>
      </Pressable>
    </View>
  );
}
