// Yo concentro el registro, autenticación y perfil del doctor usando Firebase Authentication y Firestore.
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { DoctorPerfil, RegistrarDoctorDto } from "@/domain/models/Doctor";
import {
  firebaseAuth,
  firestoreDb,
} from "@/infrastructure/firebase/firebaseConfig";

class DoctorDuplicadoError extends Error {
  campo: "dni" | "colegiatura";

  constructor(campo: "dni" | "colegiatura", mensaje: string) {
    super(mensaje);
    this.name = "DoctorDuplicadoError";
    this.campo = campo;
  }
}

async function verificarDatoUnico(campo: "dni" | "colegiatura", valor: string) {
  // Yo consulto Firestore después de crear la cuenta temporal para mantener la colección protegida por autenticación.
  const consulta = query(
    collection(firestoreDb, "doctores"),
    where(campo, "==", valor),
    limit(1),
  );
  const resultado = await getDocs(consulta);

  if (!resultado.empty) {
    throw new DoctorDuplicadoError(
      campo,
      campo === "dni"
        ? "Este DNI ya está registrado."
        : "Esta colegiatura ya pertenece a otro doctor.",
    );
  }
}

export const doctorFirebaseRepository = {
  async registrar(dto: RegistrarDoctorDto): Promise<DoctorPerfil> {
    const email = dto.email.trim().toLowerCase();
    const dni = dto.dni.trim();
    const colegiatura = dto.colegiatura.trim().toUpperCase();

    // Yo creo primero la credencial en Firebase Authentication; Firebase controla que el correo sea único.
    const credencial = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      dto.password,
    );

    try {
      await verificarDatoUnico("dni", dni);
      await verificarDatoUnico("colegiatura", colegiatura);

      const perfil: DoctorPerfil = {
        uid: credencial.user.uid,
        dni,
        nombres: dto.nombres.trim().replace(/\s+/g, " "),
        apellidos: dto.apellidos.trim().replace(/\s+/g, " "),
        colegiatura,
        especialidad: dto.especialidad.trim().replace(/\s+/g, " "),
        email,
        fechaRegistro: new Date().toISOString(),
      };

      // Yo uso el UID de Authentication como ID del documento para relacionar credenciales y perfil.
      await setDoc(doc(firestoreDb, "doctores", credencial.user.uid), {
        ...perfil,
        creadoEnServidor: serverTimestamp(),
      });

      // Yo cierro la sesión creada automáticamente para que el doctor pruebe el login con sus credenciales.
      await signOut(firebaseAuth);
      return perfil;
    } catch (error) {
      // Yo elimino la credencial temporal si el perfil no puede completarse para evitar cuentas huérfanas.
      await deleteUser(credencial.user).catch(() => undefined);
      throw error;
    }
  },

  async autenticar(email: string, password: string): Promise<DoctorPerfil> {
    const credencial = await signInWithEmailAndPassword(
      firebaseAuth,
      email.trim().toLowerCase(),
      password,
    );

    const referencia = doc(firestoreDb, "doctores", credencial.user.uid);
    const snapshot = await getDoc(referencia);

    if (!snapshot.exists()) {
      await signOut(firebaseAuth);
      throw new Error(
        "No existe el perfil profesional asociado a esta cuenta.",
      );
    }

    // Yo actualizo el último acceso para evidenciar también una operación UPDATE en Firestore.
    await updateDoc(referencia, { ultimoAcceso: serverTimestamp() }).catch(
      () => undefined,
    );

    return snapshot.data() as DoctorPerfil;
  },

  async obtenerPorUid(uid: string): Promise<DoctorPerfil | null> {
    const snapshot = await getDoc(doc(firestoreDb, "doctores", uid));
    return snapshot.exists() ? (snapshot.data() as DoctorPerfil) : null;
  },

  async cerrarSesion(): Promise<void> {
    await signOut(firebaseAuth);
  },
};

export function obtenerCampoDuplicado(error: unknown) {
  return error instanceof DoctorDuplicadoError ? error.campo : null;
}
