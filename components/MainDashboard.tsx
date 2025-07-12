"use client"

import { useState } from "react"
import type { Teacher, PaymentRecord } from "@/lib/types"
import { mockTeachers, mockPaymentRecords } from "@/lib/mockData"
import Sidebar from "./Sidebar"
// import Navbar from "./Navbar"
import TeacherDashboard from "./TeacherDashboard"
import PaymentDashboard from "./PaymentDashboard"
import PaymentInterface from "./PaymentInterface"
import DashboardOverview from "./DashboardOverview"
import ReportsDashboard from "./ReportsDashboard"
import CalendarDashboard from "./CalendarDashboard"

// Payment data interface for type safety
// interface PaymentData {
//   amount: number
//   currency: string
//   paymentType: string
//   description: string
//   transactionId: string
//   method: {
//     name: string
//   }
// }

// Utility function to ensure consistent date formatting
const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}` // YYYY-MM-DD
}

export default function MainDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [paymentRecords, setPaymentRecords] = useState<PaymentRecord[]>(mockPaymentRecords)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showPaymentInterface, setShowPaymentInterface] = useState(false)
  const [selectedTeacherForPayment, setSelectedTeacherForPayment] = useState<Teacher | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleAddTeacher = (teacherData: Omit<Teacher, "id">) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: Date.now().toString(),
    }
    setTeachers([...teachers, newTeacher])
  }

  const handleEditTeacher = (teacherData: Omit<Teacher, "id">, teacherId: string) => {
    setTeachers(teachers.map((t) => (t.id === teacherId ? { ...teacherData, id: teacherId } : t)))
  }

  const handleDeleteTeacher = (id: string) => {
    setTeachers(teachers.filter((t) => t.id !== id))
  }

  const handlePayTeacher = (teacher: Teacher) => {
    setSelectedTeacherForPayment(teacher)
    setShowPaymentInterface(true)
  }

   const handlePaymentSuccess = (paymentData: any) => {
    const newPaymentRecord: PaymentRecord = {
      id: `PAY${Date.now()}`,
      teacherId: selectedTeacherForPayment?.id,
      teacherName: selectedTeacherForPayment
        ? `${selectedTeacherForPayment.firstName} ${selectedTeacherForPayment.lastName}`
        : undefined,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentType: paymentData.paymentType,
      description: paymentData.description,
      date: formatDate(new Date()),
      status: "completed",
      transactionId: paymentData.transactionId,
      method: paymentData.method.name,
    }

    setPaymentRecords([newPaymentRecord, ...paymentRecords])

    if (selectedTeacherForPayment) {
      setTeachers(
        teachers.map((t) =>
          t.id === selectedTeacherForPayment.id
            ? { ...t, pendingPayment: 0, lastPaymentDate: formatDate(new Date()) }
            : t,
        ),
      )
    }

    setShowPaymentInterface(false)
    setSelectedTeacherForPayment(null)
  }

  if (showPaymentInterface) {
    return (
      <PaymentInterface
        teacher={selectedTeacherForPayment}
        onSuccess={handlePaymentSuccess}
        onCancel={() => {
          setShowPaymentInterface(false)
          setSelectedTeacherForPayment(null)
        }}
      />
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview teachers={teachers} paymentRecords={paymentRecords} onPayTeacher={handlePayTeacher} />
      case "teachers":
        return (
          <TeacherDashboard
            teachers={teachers}
            onAddTeacher={handleAddTeacher}
            onEditTeacher={handleEditTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onPayTeacher={handlePayTeacher}
          />
        )
      case "payments":
        return <PaymentDashboard teachers={teachers} paymentRecords={paymentRecords} onPayTeacher={handlePayTeacher} />
      case "reports":
        return <ReportsDashboard teachers={teachers} paymentRecords={paymentRecords} />
      case "calendar":
        return <CalendarDashboard teachers={teachers} paymentRecords={paymentRecords} />
      default:
        return <DashboardOverview teachers={teachers} paymentRecords={paymentRecords} onPayTeacher={handlePayTeacher} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        teachers={teachers}
        paymentRecords={paymentRecords}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <Navbar currentPage={activeTab as any} /> */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}