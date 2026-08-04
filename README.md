# EF_OdontologiaGuerrero

Aplicación móvil desarrollada con React Native y Expo para la evaluación final. El proyecto mantiene la arquitectura utilizada empleada en clase y adapta el caso de gestión de pedidos al contexto de una clínica odontológica.

## Funcionalidades principales

- Registro local de doctores con DNI, correo, contraseña, colegiatura y especialidad.
- Login local validado contra SQLite.
- CRUD completo de atenciones odontológicas.
- Persistencia local al cerrar o reiniciar la aplicación.
- Búsqueda y filtros por estado.
- Validaciones básicas y notificaciones visuales profesionales.
- Consumo REST mediante un único endpoint GET.
- Estados de carga, éxito y error.

## Arquitectura

```text
app/               Rutas de Expo Router
domain/            Modelos y tipos
infrastructure/    Base de datos, repositorios y servicios
presentation/      Pantallas, componentes, hooks y utilidades
api-terminos/      API propia con GET /api/terminos-condiciones
```

## Instalación de la aplicación

```bash
npm install
npx expo start
```

## Acceso inicial

```text
Correo: admin@odontologiaguerrero.com
Contraseña: 123456
```

También puedes crear una cuenta nueva desde **Crear cuenta de doctor**. El sistema evita duplicados por DNI, correo y colegiatura. La cuenta quedará guardada en SQLite y podrá utilizarse después de cerrar y volver a abrir la aplicación.

## Ejecución de la API

```bash
cd api-terminos
npm start
```

Endpoint:

```text
GET http://localhost:3000/api/terminos-condiciones
```

En un emulador Android, la aplicación usa por defecto:

```text
http://10.0.2.2:3000/api/terminos-condiciones
```

Para un dispositivo físico, copia `.env.example` como `.env` y reemplaza la IP por la dirección local de tu computadora.
