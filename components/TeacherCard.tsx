"use client"

import type { Teacher } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Mail, Phone, Calendar, GraduationCap, MoreVertical, Edit, Trash2, DollarSign } from "lucide-react"

interface TeacherCardProps {
  teacher: Teacher
  onEdit: (teacher: Teacher) => void
  onDelete: (id: string) => void
  onPay: (teacher: Teacher) => void
  viewMode: "grid" | "list"
}

export default function TeacherCard({ teacher, onEdit, onDelete, onPay, viewMode }: TeacherCardProps) {
  const getStatusColor = (status: Teacher["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "on-leave":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (viewMode === "list") {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(teacher.firstName, teacher.lastName)}
            </AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-gray-900">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              {teacher.subject} • {teacher.department}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Badge className={getStatusColor(teacher.status)}>{teacher.status.replace("-", " ")}</Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(teacher)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(teacher.id)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPay(teacher)} className="text-green-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Pay Salary
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(teacher.firstName, teacher.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {teacher.firstName} {teacher.lastName}
            </h3>
            <p className="text-sm text-gray-600">{teacher.employeeId}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(teacher)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(teacher.id)} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onPay(teacher)} className="text-green-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Pay Salary
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {teacher.email}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {teacher.phone}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <GraduationCap className="w-4 h-4 mr-2" />
          {teacher.qualification}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {teacher.experience} years experience
        </div>
      </div>

      {teacher.pendingPayment && teacher.pendingPayment > 0 && (
        <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800 font-medium">
            Pending Payment: ${teacher.pendingPayment.toLocaleString()}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{teacher.subject}</p>
          <p className="text-sm text-gray-600">{teacher.department}</p>
        </div>
        <Badge className={getStatusColor(teacher.status)}>{teacher.status.replace("-", " ")}</Badge>
      </div>
    </div>
  )
}
