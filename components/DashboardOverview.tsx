"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, CreditCard, BarChart3, TrendingUp, AlertCircle, Calendar, DollarSign } from "lucide-react"
import type { Teacher, PaymentRecord } from "@/lib/types"

interface DashboardOverviewProps {
  teachers: Teacher[]
  paymentRecords: PaymentRecord[]
  onPayTeacher: (teacher: Teacher) => void
}

export default function DashboardOverview({ teachers, paymentRecords, onPayTeacher }: DashboardOverviewProps) {
  const totalPendingPayments = teachers.reduce((sum, teacher) => sum + (teacher.pendingPayment || 0), 0)
  const activeTeachers = teachers.filter((t) => t.status === "active").length
  const totalPaymentsThisMonth = paymentRecords
    .filter((p) => new Date(p.date).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0)

  const teachersWithPendingPayments = teachers.filter((t) => (t.pendingPayment || 0) > 0)
  const recentPayments = paymentRecords.slice(0, 5)

  const stats = [
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: Users,
      color: "bg-blue-500",
      change: `${activeTeachers} active`,
      changeColor: "text-green-600",
    },
    {
      title: "Pending Payments",
      value: `$${totalPendingPayments.toLocaleString()}`,
      icon: AlertCircle,
      color: "bg-orange-500",
      change: `${teachersWithPendingPayments.length} teachers`,
      changeColor: "text-orange-600",
    },
    {
      title: "This Month",
      value: `$${totalPaymentsThisMonth.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-500",
      change: "Payments made",
      changeColor: "text-green-600",
    },
    {
      title: "Departments",
      value: 8,
      icon: BarChart3,
      color: "bg-purple-500",
      change: "Active departments",
      changeColor: "text-blue-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Teacher Management</h1>
        {/* <p className="text-blue-100 mb-4">Your comprehensive teacher management and payment system</p> */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.changeColor}`}>{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Payments */}
        {teachersWithPendingPayments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                Urgent: Pending Payments ({teachersWithPendingPayments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachersWithPendingPayments.slice(0, 3).map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{teacher.department}</p>
                      <p className="text-lg font-bold text-orange-600">${teacher.pendingPayment?.toLocaleString()}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onPayTeacher(teacher)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Pay Now
                    </Button>
                  </div>
                ))}
                {teachersWithPendingPayments.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{teachersWithPendingPayments.length - 3} more pending payments
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{payment.teacherName || "System Payment"}</h3>
                    <p className="text-sm text-gray-600">{payment.description}</p>
                    {/* <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleDateString()}</p> */}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${payment.amount.toLocaleString()}</p>
                    <Badge
                      className={
                        payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="w-6 h-6" />
              <span>Add New Teacher</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <CreditCard className="w-6 h-6" />
              <span>Process Payment</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <BarChart3 className="w-6 h-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
