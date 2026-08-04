// Yo redirijo el ingreso inicial hacia el login local de doctores.
import { Redirect } from "expo-router";

export default function IndexRoute() {
  return <Redirect href="/login" />;
}
