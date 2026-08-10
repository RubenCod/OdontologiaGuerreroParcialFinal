// Yo mantengo disponible la sesión Firebase y el perfil del doctor para todas las pantallas protegidas.
import { User, onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DoctorPerfil } from "@/domain/models/Doctor";
import { firebaseAuth } from "@/infrastructure/firebase/firebaseConfig";
import { doctorFirebaseRepository } from "@/infrastructure/repositories/doctorFirebaseRepository";

type AuthContextValue = {
  user: User | null;
  doctor: DoctorPerfil | null;
  loading: boolean;
  refrescarPerfil: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<DoctorPerfil | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarPerfil = async (uid: string) => {
    const perfil = await doctorFirebaseRepository.obtenerPorUid(uid);
    setDoctor(perfil);
  };

  useEffect(() => {
    // Yo escucho los cambios de Firebase para proteger la navegación y recuperar sesiones existentes.
    const cancelar = onAuthStateChanged(firebaseAuth, async (usuario) => {
      setUser(usuario);

      if (!usuario) {
        setDoctor(null);
        setLoading(false);
        return;
      }

      try {
        await cargarPerfil(usuario.uid);
      } catch (error) {
        console.log("[AUTH] Yo no pude cargar el perfil del doctor", error);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    });

    return cancelar;
  }, []);

  const refrescarPerfil = async () => {
    if (firebaseAuth.currentUser) {
      await cargarPerfil(firebaseAuth.currentUser.uid);
    }
  };

  const cerrarSesion = async () => {
    await doctorFirebaseRepository.cerrarSesion();
  };

  const value = useMemo(
    () => ({ user, doctor, loading, refrescarPerfil, cerrarSesion }),
    [user, doctor, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider.");
  return context;
}
