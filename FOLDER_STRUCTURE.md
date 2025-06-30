# Frontend Folder Structure

The frontend has been reorganized into a feature-based architecture for better maintainability and scalability.

## New Structure

```
src/
├── App.tsx                    # Main app component with routing
├── main.tsx                   # App entry point
├── index.css                  # Global styles
├── features/                  # Feature-based modules
│   ├── auth/                  # Authentication features
│   │   ├── index.ts           # Export barrel
│   │   ├── LoginPage.tsx      # Login page
│   │   ├── RegisterPage.tsx   # Registration page
│   │   └── LandingPage.tsx    # Landing page
│   ├── dashboard/             # Dashboard features
│   │   ├── index.ts           # Export barrel
│   │   └── Dashboard.tsx      # Main dashboard
│   ├── users/                 # User management features
│   │   ├── index.ts           # Export barrel
│   │   ├── Users.tsx          # Users list page
│   │   └── UserManagement.tsx # User management page
│   ├── company/               # Company management features
│   │   ├── index.ts           # Export barrel
│   │   ├── CompanySettings.tsx # Company settings page
│   │   └── CompanyApps.tsx    # Company apps page
│   └── settings/              # General settings features
│       ├── index.ts           # Export barrel
│       └── Settings.tsx       # Settings page
└── shared/                    # Shared utilities and components
    ├── components/            # Reusable components
    │   ├── index.ts           # Export barrel
    │   ├── Layout.tsx         # Main layout component
    │   └── AppConnectionModal.tsx # App connection modal
    ├── utils/                 # Utility functions
    │   ├── index.ts           # Export barrel
    │   └── api.ts             # API configuration
    ├── hooks/                 # Custom React hooks (empty for now)
    ├── types/                 # TypeScript type definitions (empty for now)
    └── services/              # Business logic services (empty for now)
```

## Benefits

1. **Feature-based Organization**: Related components are grouped together
2. **Clear Separation**: Shared utilities are separated from feature-specific code
3. **Scalability**: Easy to add new features without cluttering the structure
4. **Maintainability**: Easier to find and modify related code
5. **Reusability**: Shared components and utilities can be easily imported

## Import Examples

```typescript
// Feature imports
import { Dashboard } from './features/dashboard';
import { LoginPage, RegisterPage } from './features/auth';
import { CompanySettings, CompanyApps } from './features/company';

// Shared imports
import { Layout, AppConnectionModal } from './shared/components';
import { api } from './shared/utils';
```

## Migration Notes

All import paths have been updated to use the new structure:
- `../utils/api` → `../../shared/utils`
- `../components/Layout` → `../../shared/components`
- Components now use destructured imports from index files
