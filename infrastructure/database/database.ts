// Yo inicializo SQLite y creo las tablas necesarias para doctores y atenciones odontológicas.
import { SQLiteDatabase } from "expo-sqlite";

async function asegurarColumna(
  db: SQLiteDatabase,
  tabla: "doctores" | "pacientes",
  columna: string,
  definicion: string,
) {
  // Yo reviso la estructura existente para actualizar bases creadas con versiones anteriores.
  const columnas = await db.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${tabla});`,
  );

  if (!columnas.some((item) => item.name === columna)) {
    await db.execAsync(
      `ALTER TABLE ${tabla} ADD COLUMN ${columna} ${definicion};`,
    );
  }
}

export async function inicializarBaseDatos(db: SQLiteDatabase) {
  console.log("[DB INIT] Yo preparo la base de datos EF_OdontologiaGuerrero");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS doctores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dni TEXT NOT NULL UNIQUE,
      nombres TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      colegiatura TEXT NOT NULL UNIQUE,
      especialidad TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT NOT NULL,
      fechaRegistro TEXT NOT NULL
    );

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
      fechaRegistro TEXT NOT NULL
    );
  `);

  // Yo agrego el DNI sin borrar información cuando la base ya fue creada anteriormente.
  await asegurarColumna(db, "doctores", "dni", "TEXT");
  await asegurarColumna(db, "pacientes", "dni", "TEXT");

  // Yo refuerzo la unicidad del DNI incluso en bases migradas desde una versión anterior.
  await db.execAsync(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_doctores_dni_unico
      ON doctores(dni)
      WHERE dni IS NOT NULL AND TRIM(dni) <> '';

    CREATE UNIQUE INDEX IF NOT EXISTS idx_pacientes_dni_unico
      ON pacientes(dni)
      WHERE dni IS NOT NULL AND TRIM(dni) <> '';
  `);

  // Yo creo una cuenta inicial para que el docente pueda ingresar aun antes de registrar otro doctor.
  const totalDoctores = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM doctores;",
  );

  if ((totalDoctores?.total ?? 0) === 0) {
    await db.runAsync(
      `INSERT INTO doctores
        (dni, nombres, apellidos, colegiatura, especialidad, email, password, fechaRegistro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "00000001",
        "Administrador",
        "Guerrero",
        "COP-00001",
        "Odontología general",
        "admin@odontologiaguerrero.com",
        "123456",
        new Date().toISOString(),
      ],
    );
  }

  // Yo agrego datos demostrativos solo cuando la tabla de pacientes está vacía.
  const totalPacientes = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM pacientes;",
  );

  if ((totalPacientes?.total ?? 0) === 0) {
    await db.runAsync(
      `INSERT INTO pacientes
        (dni, pacienteNombre, edad, telefono, tratamiento, sesiones, precio, prioridad, descripcion, estado, fechaRegistro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "70000001",
        "José Torrealva",
        30,
        "987654321",
        "ENDODONCIA",
        2,
        450,
        "ALTA",
        "Presenta dolor intenso y sensibilidad persistente en una pieza dental.",
        "PENDIENTE",
        "2026-07-04T09:30:00.000Z",
      ],
    );

    await db.runAsync(
      `INSERT INTO pacientes
        (dni, pacienteNombre, edad, telefono, tratamiento, sesiones, precio, prioridad, descripcion, estado, fechaRegistro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "70000002",
        "Carlos Mendoza",
        34,
        "956123478",
        "ORTODONCIA",
        12,
        1800,
        "MEDIA",
        "Control de brackets y evaluación del avance del tratamiento de ortodoncia.",
        "EN_PROCESO",
        "2026-07-03T15:15:00.000Z",
      ],
    );

    await db.runAsync(
      `INSERT INTO pacientes
        (dni, pacienteNombre, edad, telefono, tratamiento, sesiones, precio, prioridad, descripcion, estado, fechaRegistro)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        "70000003",
        "Gloria Torres",
        22,
        "912345678",
        "LIMPIEZA",
        1,
        120,
        "BAJA",
        "Limpieza dental preventiva y revisión general de encías.",
        "FINALIZADO",
        "2026-07-02T11:00:00.000Z",
      ],
    );
  }
}
