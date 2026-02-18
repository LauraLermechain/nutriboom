import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <Redirect href="/(main)/(home)" /> : <Redirect href="/(auth)/sign-in" />;
}
