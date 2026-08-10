# EF_OdontologiaGuerrero

Aplicación móvil desarrollada con **React Native + Expo** para la gestión de doctores, pacientes y atenciones odontológicas.

El proyecto adapta los requerimientos de la evaluación final al contexto de **Odontología Guerrero**, utilizando Firebase para autenticación de doctores, Firestore para sus perfiles profesionales, SQLite para el CRUD local de pacientes y una API REST propia para términos y condiciones.

## Integrantes

- Rubén Zúñiga
- Santiago Rosado

---

## Tecnologías utilizadas

- React Native
- Expo
- Expo Router
- TypeScript
- Firebase Authentication
- Cloud Firestore
- SQLite
- API REST GET
- NativeWind

---

## Funcionalidades

### Doctores

- Registro mediante Firebase Authentication.
- Inicio y cierre de sesión.
- Validación de correo duplicado.
- Validación de DNI y colegiatura duplicados.
- Perfil profesional almacenado en Cloud Firestore.
- Protección de pantallas para usuarios autenticados.

### Pacientes y atenciones

- Registrar.
- Listar.
- Ver detalle.
- Editar.
- Eliminar.
- Persistencia local mediante SQLite.
- Asociación de cada atención con el doctor autenticado.

### API REST

- Consulta de términos y condiciones mediante:

```http
GET /api/terminos-condiciones
```

- Estado de carga.
- Manejo de errores.
- Visualización de los datos recibidos.

---

## Arquitectura

```text
app/
    Rutas de Expo Router

domain/
    Modelos y tipos

infrastructure/
    database/          SQLite
    firebase/          Configuración Firebase
    repositories/      Repositorios
    services/          API REST

presentation/
    components/        Componentes reutilizables
    context/           Sesión Firebase
    hooks/             Lógica reutilizable
    screens/           Pantallas
    utils/             Validaciones

api-terminos/
    API REST propia
```

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/RubenCod/OdontologiaGuerreroParcialFinal.git
```

Ingresar al proyecto:

```bash
cd OdontologiaGuerreroParcialFinal
```

Cambiar a la rama de evaluación final:

```bash
git switch evaluacion-final
```

Instalar dependencias:

```bash
npm install
```

---

# Configuración del archivo `.env`

El archivo `.env` no se incluye en GitHub.

Después de clonar el proyecto, crear en la raíz un archivo llamado:

```text
.env
```

Para ejecutar el proyecto en **emulador Android**, colocar:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api/terminos-condiciones

EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyC_VXEgyn7HjQQDn8tJeXm4h_H-nvappM8
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=efodontologiaguerrero.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=efodontologiaguerrero
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=efodontologiaguerrero.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=330489567365
EXPO_PUBLIC_FIREBASE_APP_ID=1:330489567365:web:2a0dd7f0892dd808b031ec
```

> Si se utiliza un dispositivo físico, reemplazar `10.0.2.2` por la IP local de la computadora.

---

# Ejecutar la aplicación

Desde la raíz del proyecto:

```bash
npx expo start -c
```

Para abrir Android desde Expo:

```text
Presionar la tecla a
```

---

# Ejecutar la API REST

La API de términos y condiciones fue desarrollada dentro del mismo proyecto y **se ejecuta localmente**, por lo que debe iniciarse antes de consultar los términos desde la aplicación.

Abrir una segunda terminal:

```bash
cd api-terminos
```

Ejecutar:

```bash
npm start
```

La API quedará disponible en:

```text
http://localhost:3000/api/terminos-condiciones
```

En el emulador Android la aplicación accede mediante:

```text
http://10.0.2.2:3000/api/terminos-condiciones
```

Por lo tanto, durante la prueba deben mantenerse abiertas:

```text
Terminal 1:
npx expo start -c

Terminal 2:
cd api-terminos
npm start
```

---

# Firebase Authentication

Firebase Authentication administra:

- Registro de doctores.
- Correo y contraseña.
- Inicio de sesión.
- Cierre de sesión.
- Control de correo duplicado.

Para probarlo:

1. Abrir **Registrar doctor**.
2. Completar el formulario.
3. Crear la cuenta.
4. Verificar el usuario en Firebase Authentication.
5. Iniciar sesión con las credenciales creadas.

---

# Cloud Firestore

Firestore almacena el perfil profesional del doctor.

Estructura:

```text
doctores
    └── UID
        ├── dni
        ├── nombres
        ├── apellidos
        ├── colegiatura
        ├── especialidad
        ├── email
        ├── fechaRegistro
        └── ultimoAcceso
```

Firestore se utiliza para:

- Crear el perfil del doctor.
- Consultar sus datos.
- Validar DNI y colegiatura.
- Actualizar el último acceso.

---

# SQLite

SQLite administra localmente los pacientes y atenciones odontológicas.

Permite:

- Crear.
- Consultar.
- Editar.
- Eliminar.
- Mantener los registros después de cerrar y volver a abrir la aplicación.

### Prueba de persistencia

1. Iniciar sesión.
2. Registrar una atención.
3. Cerrar completamente la aplicación.
4. Volver a ejecutarla.
5. Iniciar sesión nuevamente.
6. Comprobar que la atención continúa almacenada.

---

# Distribución de responsabilidades

```text
Firebase Authentication
→ Registro, login y logout de doctores

Cloud Firestore
→ Perfil profesional de doctores

SQLite
→ CRUD y persistencia de pacientes

API REST
→ Términos y condiciones

Expo Router
→ Navegación
```

---

# Flujo principal

```text
Registrar doctor
        ↓
Firebase Authentication
        ↓
Cloud Firestore
        ↓
Login
        ↓
Home
        ↓
CRUD de pacientes
        ↓
SQLite
```

Adicionalmente:

```text
Términos y condiciones
        ↓
API REST GET
```

---

## Estado del proyecto

- Firebase Authentication ✅
- Cloud Firestore ✅
- CRUD SQLite ✅
- Persistencia local ✅
- API REST GET ✅
- Validaciones ✅
- Navegación ✅
- Protección de sesión ✅
- Ejecución en emulador Android ✅

Proyecto desarrollado para la **Evaluación Final del curso Desarrollo de Aplicaciones Móviles 1**.
```

En el emulador Android la app usa `http://10.0.2.2:3000/api/terminos-condiciones`.
Para un dispositivo físico, configura `EXPO_PUBLIC_API_URL` en `.env` con la IP local de la computadora.
