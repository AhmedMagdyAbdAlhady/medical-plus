# Medical Plus

A comprehensive medical application built with React, TypeScript, and Redux Toolkit.

## 🏥 Overview

Medical Plus is a modern web application designed to provide medical and healthcare services. Built with cutting-edge technologies, it offers a scalable architecture for healthcare management systems.

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Framework** | React 19.2.5 |
| **Language** | TypeScript 5.9.3 |
| **Build Tool** | Vite 7.2.4 |
| **State Management** | Redux Toolkit 2.11.2 + React-Redux 9.2.0 |
| **HTTP Client** | Axios 1.13.6 |
| **UI Library** | Bootstrap 5.3.8 |
| **Icons** | FontAwesome 7.2.0 |
| **Notifications** | React-Toastify 11.0.5 |
| **Linting** | ESLint 9.39.1 |

## 📁 Project Structure

```
medical-plus/
├── src/
│   ├── api/                    # API configuration and Axios instance
│   │   └── api.ts              # Axios instance with base URL
│   ├── app/                    # App-level configuration
│   ├── assets/                 # Static assets (images, fonts, etc.)
│   ├── business/               # Business logic layer
│   ├── components/             # Reusable UI components
│   ├── features/               # Feature-based modules
│   │   └── posts/              # Example feature (posts thunks)
│   ├── hooks/                  # Custom React hooks
│   ├── layouts/                # Page layout components
│   ├── pages/                  # Page components
│   ├── providers/              # Context providers
│   ├── routes/                 # Routing configuration
│   ├── slices/                 # Redux Toolkit slices
│   ├── store/                  # Redux store configuration
│   │   └── store.ts            # Store setup
│   ├── styles/                 # Global styles and CSS
│   ├── tests/                  # Test files
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main application component
│   └── main.tsx                # Application entry point
├── public/                     # Public static assets
├── study/                      # Learning notes and documentation
├── package.json                # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── eslint.config.js            # ESLint configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/AhmedMagdyAbdAlhady/medical-plus.git>
cd medical-plus
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Vite |
| `npm run build` | Build for production (TypeScript + Vite) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 🏗️ Architecture

### State Management

The application uses **Redux Toolkit (RTK)** for state management with the following structure:

- **Store**: Centralized state management configured in `src/store/store.ts`
- **Slices**: Redux state logic organized in `src/slices/`
- **Thunks**: Async operations in `src/features/`
- **Hooks**: Custom hooks for Redux integration in `src/hooks/`

### API Layer

API calls are handled through **Axios** with a pre-configured instance in `src/api/api.ts`. The current setup uses JSONPlaceholder as a mock API for development and testing.

### Routing

Client-side routing will be implemented in `src/routes/` (not yet configured).

### UI Components

- **Bootstrap 5**: Primary UI framework for responsive design
- **FontAwesome**: Icon library
- **React-Toastify**: Notification system

## 📝 Development Guidelines

### Adding a New Feature

1. Create a feature directory in `src/features/`
2. Add Redux slice in `src/slices/`
3. Create components in `src/components/`
4. Add routes in `src/routes/`
5. Create pages in `src/pages/`

### Code Quality

Run the linter before committing:
```bash
npm run lint
```

### Type Safety

The project enforces strict TypeScript configuration. All new code should be fully typed.

## 🔧 Configuration Files

- **`vite.config.ts`**: Vite build configuration with React plugin
- **`tsconfig.json`**: Root TypeScript configuration
- **`tsconfig.app.json`**: Application-specific TypeScript settings
- **`tsconfig.node.json`**: Node-specific TypeScript settings
- **`eslint.config.js`**: ESLint configuration with TypeScript and React plugins

## 📚 Learning Resources

The `study/` directory contains learning notes and documentation about:
- Redux Toolkit concepts
- Store configuration
- Common commands and patterns

## 🚧 Current Status

This project is in **early development stage**. The following infrastructure is set up:

✅ React 19 + TypeScript + Vite  
✅ Redux Toolkit store configuration  
✅ Axios API instance  
✅ Bootstrap and FontAwesome integration  
✅ ESLint configuration  
✅ Project structure scaffolding  

**Pending Implementation:**
- [ ] Redux slices and reducers
- [ ] Feature modules
- [ ] Page components
- [ ] Routing configuration
- [ ] Reusable UI components
- [ ] API endpoint functions
- [ ] Custom hooks
- [ ] TypeScript type definitions
- [ ] Unit and integration tests
- [ ] Medical domain features

## 🤝 Contributing

1. Follow the established project structure
2. Write TypeScript with proper types
3. Use Redux Toolkit patterns for state management
4. Run linting before submitting
5. Add tests for new features

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or issues, please refer to the study documentation in the `study/` directory or contact the development team.

---

**Built with ❤️ using React, TypeScript, and Redux Toolkit**
