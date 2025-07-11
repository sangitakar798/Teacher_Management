// Teacher Management Types
export interface Teacher {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  subject: string
  employeeId: string
  joinDate: string
  status: "active" | "inactive" | "on-leave"
  avatar?: string
  experience: number
  qualification: string
  salary: number
  lastPaymentDate?: string
  pendingPayment?: number
}

export interface Department {
  id: string
  name: string
  head: string
  teacherCount: number
}

export interface TeacherFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  subject: string
  employeeId: string
  joinDate: string
  qualification: string
  experience: number
  salary: number
}

// Payment Types
export interface PaymentMethod {
  id: string
  type: "card" | "paypal" | "apple-pay" | "google-pay" | "bank-transfer"
  name: string
  icon: string
  description: string
}

export interface CardDetails {
  number: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  name: string
}

export interface BillingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface PaymentData {
  amount: number
  currency: string
  method: PaymentMethod
  cardDetails?: CardDetails
  billingAddress: BillingAddress
  paymentType: "salary" | "bonus" | "reimbursement" | "course-fee" | "other"
  teacherId?: string
  description: string
}

export interface PaymentState {
  isProcessing: boolean
  isSuccess: boolean
  isError: boolean
  errorMessage?: string
  transactionId?: string
}

export interface PaymentRecord {
  id: string
  teacherId?: string
  teacherName?: string
  amount: number
  currency: string
  paymentType: "salary" | "bonus" | "reimbursement" | "course-fee" | "other"
  description: string
  date: string
  status: "completed" | "pending" | "failed"
  transactionId?: string
  method: string
}
