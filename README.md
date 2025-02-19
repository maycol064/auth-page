# Proyecto de Autenticación React

Un sistema de autenticación con MFA construido con React, que incluye registro seguro de usuarios, inicio de sesión.

## Características

- Registro de usuarios
- Inicio de sesión con y sin MFA
- Funcionalidad de configuración de MFA
- Sistema de rutas protegidas

## Tecnologías Utilizadas

- React 19.x
- React Router v7
- Axios para peticiones API
- Zustand para estado global
- Tailwind CSS para estilos

## Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener:

- Node.js (v18 o superior)
- Gestor de paquetes yarn
- Variable de entorno VITE_URL para la API de Django

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/maycol064/auth-page
cd auth-page
```

2. Instala las dependencias:
```bash
yarn install
```

3. Crea un archivo `.env` en el directorio raíz:
```
VITE_URL=tu_url_api
```

4. Inicia el servidor de desarrollo:
```bash
yarn dev
```

## Integración con API

El proyecto espera los siguientes endpoints de API:

  - `POST /auth/login/` → Iniciar sesión
  - `POST /auth/logout/` → Cerrar sesión
  - `POST /auth/register/` → Registrar usuario
  - `POST /auth/verify_mfa/` → Verificar token
  - `POST /auth/initiate_mfa_setup/` → Inicializar la configuración
  - `POST /auth/verify_and_enable_mfa/` → Verificacar token por primerq vez y habilitar mfa
  - `POST /auth/disable_mfa/` → Deshabilitar mfa
