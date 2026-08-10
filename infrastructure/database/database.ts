// Yo inicializo SQLite únicamente para las atenciones odontológicas y su persistencia local.
import { SQLiteDatabase } from "expo-sqlite";

async function asegurarColumna(
  db: SQLiteDatabase,
  columna: string,
  definicion: string,
) {
  // Yo actualizo bases creadas con versiones anteriores sin borrar registros existentes.
  const columnas = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(pacientes);",
  );

  if (!columnas.some((item) => item.name === columna)) {
    await db.execAsync(
      `ALTER TABLE pacientes ADD COLUMN ${columna} ${definicion};`,
    );
  }
}

export async function inicializarBaseDatos(db: SQLiteDatabase) {
  console.log("[DB INIT] Yo preparo la base local de atenciones");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS pacientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dni TEXT NOT NULL UNIQUE,
      pacienteNombre TEXT NOT NULL,
      edad INTEGER NOT NULL,
      telefono TEXT NOT NULL,
      tratamiento TEXT NOT NULL,
      sesiones INTEGER NOT NULL,
      precio REAL NOT NULL,
      prioridad TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'PENDIENTE',
      doctorUid TEXT,
      doctorEmail TEXT,
      fechaRegistro TEXT NOT NULL
    );
  `);

  await asegurarColumna(db, "dni", "TEXT");
  await asegurarColumna(db, "doctorUid", "TEXT");
  await asegurarColumna(db, "doctorEmail", "TEXT");

  // Yo mantengo el DNI como identificador único del paciente incluso después de una migración.
  await db.execAsync(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_pacientes_dni_unico
      ON pacientes(dni)
      WHERE dni IS NOT NULL AND TRIM(dni) <> '';
  `);
}
