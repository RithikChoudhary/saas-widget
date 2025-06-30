/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_URL: string
  readonly VITE_GITHUB_REDIRECT_URI: string
  readonly VITE_SLACK_REDIRECT_URI: string
  readonly VITE_ZOOM_REDIRECT_URI: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_DEBUG: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
