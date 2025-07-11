"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Plus } from "lucide-react"
import type { Teacher, PaymentRecord } from "@/lib/types"

interface CalendarDashboardProps {
  teachers: Teacher[]
  paymentRecords: PaymentRecord[]
}

export default function CalendarDashboard({ teachers, paymentRecords }: CalendarDashboardProps) {
  const upcomingEvents = [
    {
      id: 1,
      title: "Monthly Salary Processing",
      date: "2024-01-31",
      time: "09:00 AM",
      type: "payment",
      description: "Process monthly salaries for all active teachers",
    },
    {
      id: 2,
      title: "Performance Review Meeting",
      date: "2024-02-05",
      time: "02:00 PM",
      type: "meeting",
      description: "Quarterly performance review with department heads",
    },
    {
      id: 3,
      title: "New Teacher Orientation",
      date: "2024-02-10",
      time: "10:00 AM",
      type: "event",
      description: "Orientation session for newly hired teachers",
    },
  ]

  const getEventColor = (type: string) => {
    switch (type) {
      case "payment":
        return "bg-green-100 text-green-800"
      case "meeting":
        return "bg-blue-100 text-blue-800"
      case "event":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Calendar & Events</h2>
          <p className="text-gray-600 mt-1">Schedule and manage important dates</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Calendar View
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Integration</h3>
                <p className="text-gray-600 mb-4">
                  Full calendar view with event management will be available in the next update.
                </p>
                <Button variant="outline">View Full Calendar</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm">{event.title}</h3>
                      <Badge className={getEventColor(event.type)}>{event.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{event.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                      <Clock className="w-3 h-3 ml-3 mr-1" />
                      {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-blue-600">Scheduled events</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Due</p>
                <p className="text-2xl font-bold text-gray-900">Jan 31</p>
                <p className="text-sm text-orange-600">Monthly salaries</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teachers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.filter((t) => t.status === "active").length}
                </p>
                <p className="text-sm text-green-600">Currently working</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
