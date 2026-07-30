# Odontología Guerrero

Aplicación móvil desarrollada con React Native, Expo Router, TypeScript y NativeWind para gestionar pacientes y sus atenciones odontológicas.

## Requisitos

- Node.js 20 o superior.
- npm.
- Expo Go en Android/iOS o un emulador configurado.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npx expo start --clear
```

También se puede usar:

```bash
npm run android
npm run ios
```

## Credenciales de prueba

- `ruben@gmail.com` / `123456`
- `santiago@gmail.com` / `123456`

## Flujo CRUD

1. Iniciar sesión con un usuario válido.
2. Desde Inicio seleccionar **Registrar paciente**.
3. Completar los datos y registrar la atención.
4. Ingresar a **Gestionar pacientes** para buscar y filtrar.
5. Abrir una tarjeta para editar tratamiento, prioridad, descripción o estado.
6. Guardar los cambios o eliminar el registro con confirmación.

## Arquitectura

- `app/`: rutas y navegación con Expo Router.
- `src/screens/`: pantallas completas.
- `src/components/`: componentes visuales reutilizables.
- `src/context/`: estado global del CRUD.
- `src/reducers/`: acciones y actualización del estado.
- `src/hooks/`: lógica reutilizable de formularios.
- `src/models/`: modelos y tipos TypeScript.
- `src/utils/`: datos simulados, constantes y validaciones.

Los datos se mantienen en memoria porque el alcance del proyecto no utiliza base de datos.
