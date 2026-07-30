import { useRouter } from "expo-router";
import { useState } from "react";

import { USUARIOS } from "@/utils/constants";
import { validarCorreo, validarPassword } from "@/utils/validations";

interface LoginErrors {
  email?: string;
  password?: string;
  credentials?: string;
}

export function useLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email || errors.credentials) {
      setErrors((actual) => ({ ...actual, email: undefined, credentials: undefined }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password || errors.credentials) {
      setErrors((actual) => ({ ...actual, password: undefined, credentials: undefined }));
    }
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: LoginErrors = {};

    if (!email.trim()) nuevosErrores.email = "El correo es obligatorio";
    else if (!validarCorreo(email)) nuevosErrores.email = "Ingresa un correo válido";

    if (!password) nuevosErrores.password = "La contraseña es obligatoria";
    else if (!validarPassword(password)) {
      nuevosErrores.password = "La contraseña debe tener entre 6 y 12 caracteres";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleLogin = () => {
    if (!validarFormulario()) return;

    const usuario = USUARIOS.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password,
    );

    if (!usuario) {
      setErrors({ credentials: "Correo o contraseña incorrectos" });
      return;
    }

    setErrors({});
    router.replace({ pathname: "/home", params: { nombre: usuario.nombre } });
  };

  return { email, password, errors, handleEmailChange, handlePasswordChange, handleLogin };
}
