// Yo realizo un único consumo REST GET para obtener los términos y condiciones.
import { Platform } from "react-native";

import { TerminosResponse } from "@/domain/models/Termino";

const urlPorDefecto =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api/terminos-condiciones"
    : "http://localhost:3000/api/terminos-condiciones";

export const TERMINOS_API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? urlPorDefecto;

export const terminosService = {
  async obtener(): Promise<TerminosResponse> {
    console.log("[API GET] Yo consulto", TERMINOS_API_URL);

    const response = await fetch(TERMINOS_API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `La API respondió con el estado ${response.status}.`,
      );
    }

    const data = (await response.json()) as TerminosResponse;

    // Yo verifico el contrato mínimo antes de mostrar información.
    if (
      !data.success ||
      !data.documento ||
      !Array.isArray(data.terminos)
    ) {
      throw new Error(
        "La respuesta de la API no tiene el formato esperado.",
      );
    }

    return data;
  },
};