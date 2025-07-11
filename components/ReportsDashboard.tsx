"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, DollarSign } from "lucide-react"
import type { Teacher, PaymentRecord } from "@/lib/types"

interface ReportsDashboardProps {
  teachers: Teacher[]
  paymentRecords: PaymentRecord[]
}

export default function ReportsDashboard({ teachers, paymentRecords }: ReportsDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and data analysis</p>
        </div>
        <Button className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export All Reports
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Teacher Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Teachers</span>
                <span className="font-semibold">{teachers.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Active</span>
                <span className="font-semibold text-green-600">
                  {teachers.filter((t) => t.status === "active").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>On Leave</span>
                <span className="font-semibold text-yellow-600">
                  {teachers.filter((t) => t.status === "on-leave").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Payment Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Payments</span>
                <span className="font-semibold">{paymentRecords.length}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month</span>
                <span className="font-semibold text-green-600">
                  $
                  {paymentRecords
                    .filter((p) => new Date(p.date).getMonth() === new Date().getMonth())
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Avg. Experience</span>
                <span className="font-semibold">
                  {Math.round(teachers.reduce((sum, t) => sum + t.experience, 0) / teachers.length)} years
                </span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Salary</span>
                <span className="font-semibold">
                  ${Math.round(teachers.reduce((sum, t) => sum + t.salary, 0) / teachers.length).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Teacher Summary Report</h3>
              <p className="text-sm text-gray-600 mb-4">Complete overview of all teaching staff</p>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Payment History Report</h3>
              <p className="text-sm text-gray-600 mb-4">Detailed payment transaction history</p>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Department Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">Department-wise performance metrics</p>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Financial Summary</h3>
              <p className="text-sm text-gray-600 mb-4">Monthly and yearly financial overview</p>
              <Button size="sm" variant="outline">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
