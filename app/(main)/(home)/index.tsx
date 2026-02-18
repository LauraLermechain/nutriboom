import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Welcome!</Text>

      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>

      <SignedIn>
        <Text>Hello {user?.emailAddresses?.[0]?.emailAddress}</Text>

        <Pressable
          onPress={() => signOut()}
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 8,
            backgroundColor: "#0a7ea4",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Sign out</Text>
        </Pressable>
      </SignedIn>
    </View>
  );
}
