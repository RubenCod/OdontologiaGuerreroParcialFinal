// Yo envío al doctor a la pantalla adecuada según exista o no una sesión Firebase.
import { Redirect } from "expo-router";

import { useAuth } from "@/presentation/context/AuthContext";

export default function IndexRoute() {
  const { user } = useAuth();
  return <Redirect href={user ? "/home" : "/login"} />;
}
