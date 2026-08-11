// ---- Enums (mirror backend) ----

export type WorkStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
export type WorkType = 'ONSITE' | 'REMOTE' | 'HYBRID'
export type BudgetType = 'FIXED' | 'HOURLY'
export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
export type AssignmentStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED'
export type NotificationType = 'APPLICATION' | 'ASSIGNMENT' | 'MESSAGE' | 'REVIEW' | 'SYSTEM'
export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE'

// ---- Auth ----

export interface User {
  id: string
  email: string
  is_admin: boolean
  is_verified: boolean
  is_active: boolean
  created_at: string
  last_login: string | null
}

export interface Token {
  access_token: string
  token_type: string
}

// ---- Profile ----

export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  phone: string | null
  bio: string | null
  address: string | null
  location: string | null
  profile_image: string | null
}

export interface ProfileUpdate {
  full_name?: string
  phone?: string
  bio?: string
  address?: string
  location?: string
}

// ---- Worker Profile ----

export interface WorkerProfile {
  id: string
  user_id: string
  headline: string | null
  skills: string | null
  experience_years: number
  hourly_rate: number
  availability: AvailabilityStatus
  portfolio_url: string | null
  github_url: string | null
  linkedin_url: string | null
  average_rating: number
  completed_works: number
  is_verified: boolean
}

export interface WorkerProfileUpdate {
  headline?: string
  skills?: string
  experience_years?: number
  hourly_rate?: number
  availability?: AvailabilityStatus
  portfolio_url?: string
  github_url?: string
  linkedin_url?: string
}

// ---- Work / Job ----

export interface Work {
  id: string
  owner_id: string
  title: string
  description: string
  category: string
  work_type: WorkType
  budget: number
  budget_type: BudgetType
  location: string | null
  deadline: string | null
  status: WorkStatus
  created_at: string
  updated_at: string
}

export interface WorkCreate {
  title: string
  description: string
  category: string
  work_type: WorkType
  budget: number
  budget_type: BudgetType
  location?: string
  deadline?: string
}

export interface WorkFilter {
  search?: string
  category?: string
  location?: string
  budget_min?: number
  budget_max?: number
  page?: number
  size?: number
}

// ---- Application ----

export interface Application {
  id: string
  work_id: string
  worker_id: string
  proposal: string
  expected_budget: number
  status: ApplicationStatus
  created_at: string
  updated_at: string
}

export interface ApplicationCreate {
  work_id: string
  proposal: string
  expected_budget: number
}

// ---- Assignment ----

export interface Assignment {
  id: string
  work_id: string
  client_id: string
  worker_id: string
  accepted_budget: number
  status: AssignmentStatus
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

// ---- Message ----

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message: string
  attachment: string | null
  is_read: boolean
  created_at: string
}

export interface MessageCreate {
  message: string
  attachment?: string
}

// ---- Conversation ----

export interface Conversation {
  id: string
  assignment_id: string
  created_at: string
}

// ---- Notification ----

export interface Notification {
  id: string
  recipient_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at: string
}

// ---- Review ----

export interface Review {
  id: string
  assignment_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string
}

export interface ReviewCreate {
  assignment_id: string
  reviewee_id: string
  rating: number
  comment: string
}

// ---- Dashboard ----

export interface DashboardStats {
  open_works: number
  my_applications: number
  active_assignments: number
  unread_notifications: number
}

export interface Dashboard {
  profile: Profile
  worker_profile: WorkerProfile | null
  stats: DashboardStats
  recent_notifications: Notification[]
}

// ---- AI ----

export interface AIRequest { prompt: string }
export interface AIResponse { answer: string }

// ---- Upload ----

export interface UploadResponse { url: string }
