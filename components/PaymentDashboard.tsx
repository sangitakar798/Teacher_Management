"use client"

import { useState } from "react"
import type { Teacher, PaymentRecord } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, DollarSign, Calendar, User, Filter, Download } from "lucide-react"

interface PaymentDashboardProps {
  teachers: Teacher[]
  paymentRecords: PaymentRecord[]
  onPayTeacher: (teacher: Teacher) => void
}

export default function PaymentDashboard({ teachers, paymentRecords, onPayTeacher }: PaymentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredRecords = paymentRecords.filter((record) => {
    const matchesSearch =
      record.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || record.status === statusFilter
    const matchesType = typeFilter === "all" || record.paymentType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const teachersWithPendingPayments = teachers.filter((t) => (t.pendingPayment || 0) > 0)

  const getStatusColor = (status: PaymentRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: PaymentRecord["paymentType"]) => {
    switch (type) {
      case "salary":
        return "bg-blue-100 text-blue-800"
      case "bonus":
        return "bg-purple-100 text-purple-800"
      case "reimbursement":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Payment Management</h2>
          <p className="text-gray-600 mt-1">Process payments and view transaction history</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Pending Payments Section */}
      {teachersWithPendingPayments.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pending Payments ({teachersWithPendingPayments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachersWithPendingPayments.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-lg p-4 border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{teacher.department}</p>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${teacher.pendingPayment?.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Last paid: {teacher.lastPaymentDate || "Never"}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onPayTeacher(teacher)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="bonus">Bonus</SelectItem>
                <SelectItem value="reimbursement">Reimbursement</SelectItem>
                <SelectItem value="course-fee">Course Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Records */}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Filter className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{record.teacherName || "System Payment"}</h3>
                        <p className="text-sm text-gray-600">{record.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                          {record.transactionId && (
                            <p className="text-xs text-gray-500 font-mono">{record.transactionId}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">${record.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{record.method}</p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                        <Badge className={getTypeColor(record.paymentType)}>{record.paymentType}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
