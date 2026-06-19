import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  // Usa a URL configurada; senão, a origem atual do navegador (produção sem
  // build-arg); só cai em localhost em último caso (SSR sem env).
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"),
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient