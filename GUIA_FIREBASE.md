# Guía rápida de Firebase para EF_OdontologiaGuerrero

## 1. Crear el proyecto

En Firebase Console crea un proyecto, por ejemplo:

```text
EF-OdontologiaGuerrero
```

No necesitas habilitar Google Analytics para esta evaluación.

## 2. Registrar una aplicación Web

Dentro del proyecto selecciona **Agregar app > Web (`</>`)**.

Nombre sugerido:

```text
EF_OdontologiaGuerrero
```

Firebase mostrará un objeto parecido a:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

Copia esos valores; no copies `initializeApp` porque el proyecto ya lo tiene implementado.

## 3. Crear el archivo .env

Copia `.env.example` y renómbralo a `.env`.

Completa:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=valor_de_firebase
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=valor_de_firebase
EXPO_PUBLIC_FIREBASE_PROJECT_ID=valor_de_firebase
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=valor_de_firebase
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=valor_de_firebase
EXPO_PUBLIC_FIREBASE_APP_ID=valor_de_firebase
```

Mantén también `EXPO_PUBLIC_API_URL` si pruebas la API desde un celular físico.

## 4. Activar Firebase Authentication

En Firebase Console:

```text
Authentication
→ Get started
→ Sign-in method
→ Email/Password
→ Enable
→ Save
```

La app utiliza:

- `createUserWithEmailAndPassword` para registrar doctores.
- `signInWithEmailAndPassword` para iniciar sesión.
- `signOut` para cerrar sesión.

## 5. Crear Cloud Firestore

En Firebase Console:

```text
Firestore Database
→ Create database
```

Elige una región cercana y crea la base.

Después entra a **Rules** y reemplaza las reglas por el contenido de `firestore.rules`:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /doctores/{doctorId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null
        && request.auth.uid == doctorId;
    }
  }
}
```

Presiona **Publish**.

## 6. Instalar dependencias

En la terminal del proyecto:

```bash
npx expo install firebase @react-native-async-storage/async-storage
```

Después:

```bash
npx expo start -c
```

## 7. Prueba de registro

Registra un doctor desde la aplicación.

En Firebase Console debe aparecer:

```text
Authentication > Users
```

con su correo.

En Firestore debe aparecer:

```text
doctores
  └── UID_DEL_DOCTOR
      ├── dni
      ├── nombres
      ├── apellidos
      ├── colegiatura
      ├── especialidad
      ├── email
      └── fechaRegistro
```

La contraseña no se guarda en Firestore.

## 8. Duplicidad

- **Correo repetido:** lo rechaza Firebase Authentication.
- **DNI repetido:** lo rechaza la consulta a Firestore.
- **Colegiatura repetida:** lo rechaza la consulta a Firestore.

Si DNI o colegiatura ya existen, la app elimina automáticamente la credencial temporal que Firebase acababa de crear.

## 9. Prueba de login y perfil

Inicia sesión con el correo y contraseña registrados.

La aplicación:

1. autentica con Firebase Authentication;
2. lee `doctores/{uid}` desde Firestore;
3. actualiza `ultimoAcceso`;
4. permite acceder a Home, Pacientes, Términos y Perfil.

En **Mi perfil** podrás mostrar al profesor el DNI, colegiatura, correo y UID Firebase.

## 10. Pacientes continúan en SQLite

No se creó un segundo CRUD en Firestore.

```text
Firebase Authentication → sesión del doctor
Firestore              → perfil del doctor
SQLite                  → pacientes y atenciones
API REST                → términos y condiciones
```

Cada nueva atención guarda además `doctorUid` y `doctorEmail` en SQLite para identificar quién la registró.
