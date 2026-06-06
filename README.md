# Medical Plus

Medical Plus is a full-stack medical web project consisting of a React/TypeScript frontend and a Node.js/Express backend with MongoDB.

## Overview

This project provides the foundation for a medical services and e-commerce platform, including:
- User management and authentication
- Product and category management
- File upload support (such as medical prescriptions)
- Order processing
- General application settings

## Project Structure

```
medical-plus-final/
├── backend/         # Express server and API files
├── frontend/        # React + TypeScript + Vite application
└── README.md        # Main project documentation
```

### backend/
- `server.js` - backend entry point
- `config/db.js` - MongoDB connection setup
- `models/` - Mongoose models
- `routes/` - API routes
- `middleware/` - middleware such as auth checks
- `scripts/seed.js` - seed script for initial data
- `uploads/` - uploaded user files

### frontend/
- `src/` - React application source code
- `src/api/api.ts` - Axios configuration for backend requests
- `src/store/` - Redux store setup
- `src/components/`, `src/layouts/`, `src/pages/` - UI components and pages
- `public/` - static public assets

## Technology Stack

### backend
- Node.js
- Express
- MongoDB + Mongoose
- dotenv
- cors
- jsonwebtoken
- bcryptjs
- multer

### frontend
- React
- TypeScript
- Vite
- Redux Toolkit
- React Redux
- React Router DOM
- Axios
- Bootstrap
- FontAwesome
- React Toastify

## Requirements

- Node.js v18 or newer
- npm
- MongoDB available locally or via Atlas

## Running the Project

### 1. Start the backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with the following values:

```env
MONGO_URI=mongodb://localhost:27017/medical-plus
PORT=5000
NODE_ENV=development
```

Then start the server:

```bash
npm run dev
```

For production mode:

```bash
npm start
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend uses `http://localhost:5000/api` as the API base URL via `src/api/api.ts`.

To change the API base URL, create a `.env` file in `frontend/` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Main Routes

Backend API routes:
- `/api/auth`
- `/api/products`
- `/api/categories`
- `/api/upload`
- `/api/orders`
- `/api/settings`

The frontend normally runs at `http://localhost:5173`.

## Notes

- Ensure the `uploads/` directory in the backend exists so uploaded files and images are stored correctly.
- JWT is used for authentication, so the frontend may store the token in `localStorage`.

## Project Development

- Add new frontend features in `frontend/src/features/` and `frontend/src/store/`
- Add new backend models in `backend/models/`
- Add new API routes in `backend/routes/`
- Use `frontend/src/api/api.ts` for Axios request configuration

## Additional Resources

A frontend-specific README exists at `frontend/README.md` with more details about the app structure and Vite commands.

## License

This project is private and proprietary.
