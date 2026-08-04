// Yo administro el formulario y consulto SQLite para autenticar al doctor.
import { useRouter } from "expo-router";
import { SQLiteDatabase } from "expo-sqlite";
import { useState } from "react";

import { doctorRepository } from "@/infrastructure/repositories/doctorRepository";
import {
  validarCorreo,
  validarPassword,
} from "@/presentation/utils/validations";

type LoginErrors = {
  email?: string;
  password?: string;
  credentials?: string;
};

export function useLoginForm(db: SQLiteDatabase, emailInicial = "") {
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
    else if (!validarCorreo(email)) {
      nuevosErrores.email = "Ingresa un correo válido.";
    }

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

      // Yo autentico contra los doctores guardados localmente, incluso sin internet.
      const doctor = await doctorRepository.autenticar(db, email, password);

      if (!doctor) {
        setErrors({
          credentials:
            "No encontramos un doctor con esas credenciales. Revisa los datos o crea una cuenta.",
        });
        return;
      }

      router.replace({
        pathname: "/home",
        params: {
          nombre: `${doctor.nombres} ${doctor.apellidos}`,
          especialidad: doctor.especialidad,
        },
      });
    } catch (error) {
      console.log("[APP ERROR] Yo no pude autenticar al doctor", error);
      setErrors({
        credentials: "No se pudo consultar SQLite. Inténtalo nuevamente.",
      });
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
