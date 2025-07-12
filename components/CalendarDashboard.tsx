"use client"

import { useState } from "react"
import type { Teacher, PaymentRecord } from "@/lib/types"

interface CalendarDashboardProps {
  teachers: Teacher[]
  paymentRecords: PaymentRecord[]
}

export default function CalendarDashboard({ teachers, paymentRecords }: CalendarDashboardProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
  // Using paymentRecords to show payment events on calendar
  const paymentEvents = paymentRecords.map(record => ({
    id: record.id,
    date: new Date(record.date),
    title: `Payment: ${record.teacherName}`,
    amount: record.amount,
    type: 'payment'
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calendar Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule Overview</h2>
            <div className="space-y-2">
              {paymentEvents.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {event.date.toLocaleDateString()}
                    </span>
                  </div>
                  <span className="text-green-600 font-semibold">
                    ${event.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Teachers</span>
                <span className="font-semibold">{teachers.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Payment Records</span>
                <span className="font-semibold">{paymentRecords.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}