# EF_OdontologiaGuerrero

Aplicación móvil desarrollada con React Native y Expo para gestionar el acceso de doctores y las atenciones odontológicas.

## Tecnologías y responsabilidad

- **Firebase Authentication:** registro, inicio y cierre de sesión de doctores.
- **Cloud Firestore:** perfil profesional del doctor (DNI, nombres, colegiatura, especialidad y correo).
- **SQLite:** CRUD y persistencia local de pacientes y atenciones.
- **API REST GET:** términos y condiciones de Odontología Guerrero.
- **Expo Router:** navegación entre pantallas.

## Funcionalidades principales

- Registro de doctores con Firebase Authentication.
- Validación de correo único mediante Firebase Authentication.
- Validación de DNI y colegiatura únicos mediante Firestore.
- Inicio de sesión y cierre de sesión.
- Protección de pantallas para usuarios autenticados.
- Lectura del perfil del doctor desde Firestore.
- Actualización de `ultimoAcceso` en Firestore al iniciar sesión.
- CRUD completo de pacientes y atenciones en SQLite.
- Persistencia local al cerrar o reiniciar la aplicación.
- Asociación de cada nueva atención con el UID y correo del doctor autenticado.
- Consumo REST mediante `GET /api/terminos-condiciones`.

## Arquitectura

```text
app/                   Rutas de Expo Router

domain/                Modelos y tipos

infrastructure/
  database/             SQLite
  firebase/             Configuración Firebase
  repositories/         Repositorios SQLite y Firebase
  services/             Servicio REST

presentation/
  components/           Componentes reutilizables
  context/              Sesión Firebase
  hooks/                Formularios y lógica reutilizable
  screens/              Pantallas
  utils/                Validaciones y constantes

api-terminos/           API propia de términos
```

## Instalación

```bash
npm install
```

Si todavía no se actualizaron las dependencias después de integrar Firebase, ejecuta:

```bash
npx expo install firebase @react-native-async-storage/async-storage
```

## Configuración de Firebase

1. Crea un proyecto en Firebase Console.
2. Registra una **aplicación Web** dentro del proyecto.
3. Activa **Authentication > Sign-in method > Email/Password**.
4. Crea una base de datos **Cloud Firestore**.
5. Copia `.env.example` como `.env` y pega los valores de `firebaseConfig`.
6. En Firestore > Rules, utiliza las reglas incluidas en `firestore.rules`.

Consulta `GUIA_FIREBASE.md` para el procedimiento paso a paso.

## Ejecución

```bash
npx expo start -c
```

## Cómo probar Firebase Authentication y Firestore

1. Abre **Registrar doctor**.
2. Registra un doctor con DNI, colegiatura, correo y contraseña.
3. Verifica en Firebase Console > Authentication que aparezca la cuenta.
4. Verifica en Firestore que exista `doctores/{uid}`.
5. Inicia sesión desde la app.
6. Abre **Mi perfil** y comprueba los datos recuperados desde Firestore.
7. Cierra sesión y verifica que las pantallas principales vuelvan a quedar protegidas.

## Cómo probar SQLite

1. Inicia sesión con un doctor Firebase.
2. Registra una nueva atención.
3. Cierra y vuelve a abrir la aplicación.
4. Verifica que la atención continúe en el listado.
5. Prueba editar y eliminar el registro.

## API REST

```bash
cd api-terminos
npm start
```

Endpoint:

```text
GET http://localhost:3000/api/terminos-condiciones
```

En el emulador Android la app usa `http://10.0.2.2:3000/api/terminos-condiciones`.
Para un dispositivo físico, configura `EXPO_PUBLIC_API_URL` en `.env` con la IP local de la computadora.
