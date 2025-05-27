declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    }
  }
}

type Employee = {
  id: string
  name: string
  position: string
  department: string
  status: string
  email: string
  avatar?: string
}

type HRRequest = {
  id: string
  employeeName: string
  type: string
  status: string
  duration: number
  reason: string
} 