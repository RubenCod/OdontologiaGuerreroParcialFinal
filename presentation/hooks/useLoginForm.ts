// Yo administro el formulario de acceso y delego la autenticación a Firebase Authentication.
import { FirebaseError } from "firebase/app";
import { useRouter } from "expo-router";
import { useState } from "react";

import { doctorFirebaseRepository } from "@/infrastructure/repositories/doctorFirebaseRepository";
import {
  validarCorreo,
  validarPassword,
} from "@/presentation/utils/validations";

type LoginErrors = {
  email?: string;
  password?: string;
  credentials?: string;
};

export function useLoginForm(emailInicial = "") {
  const router = useRouter();
  const [email, setEmail] = useState(emailInicial);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const cambiarEmail = (value: string) => {
    setEmail(value);
    setErrors((actual) => ({
      ...actual,
      email: undefined,
      credentials: undefined,
    }));
  };

  const cambiarPassword = (value: string) => {
    setPassword(value);
    setErrors((actual) => ({
      ...actual,
      password: undefined,
      credentials: undefined,
    }));
  };

  const iniciarSesion = async () => {
    const nuevosErrores: LoginErrors = {};

    if (!email.trim()) nuevosErrores.email = "El correo es obligatorio.";
    else if (!validarCorreo(email))
      nuevosErrores.email = "Ingresa un correo válido.";

    if (!password) nuevosErrores.password = "La contraseña es obligatoria.";
    else if (!validarPassword(password)) {
      nuevosErrores.password =
        "La contraseña debe tener entre 6 y 20 caracteres.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Yo inicio sesión con correo y contraseña mediante Firebase Authentication.
      await doctorFirebaseRepository.autenticar(email, password);
      router.replace("/home");
    } catch (error) {
      console.log("[AUTH ERROR] Yo no pude iniciar sesión", error);

      if (error instanceof FirebaseError) {
        if (
          error.code === "auth/invalid-credential" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          setErrors({ credentials: "Correo o contraseña incorrectos." });
          return;
        }

        if (error.code === "auth/network-request-failed") {
          setErrors({
            credentials:
              "Revisa tu conexión a internet e inténtalo nuevamente.",
          });
          return;
        }

        if (error.code === "auth/too-many-requests") {
          setErrors({
            credentials: "Demasiados intentos. Inténtalo nuevamente más tarde.",
          });
          return;
        }
      }

      setErrors({ credentials: "No fue posible iniciar sesión." });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    errors,
    loading,
    cambiarEmail,
    cambiarPassword,
    iniciarSesion,
  };
}
