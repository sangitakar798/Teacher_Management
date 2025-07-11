"use client"

import type React from "react"

import { useState } from "react"
import type { Teacher, TeacherFormData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Save, X } from "lucide-react"

interface TeacherFormProps {
  teacher?: Teacher | null
  onSubmit: (data: Omit<Teacher, "id">) => void
  onCancel: () => void
}

export default function TeacherForm({ teacher, onSubmit, onCancel }: TeacherFormProps) {
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: teacher?.firstName || "",
    lastName: teacher?.lastName || "",
    email: teacher?.email || "",
    phone: teacher?.phone || "",
    department: teacher?.department || "",
    subject: teacher?.subject || "",
    employeeId: teacher?.employeeId || "",
    joinDate: teacher?.joinDate || "",
    qualification: teacher?.qualification || "",
    experience: teacher?.experience || 0,
    salary: teacher?.salary || 0,
  })

  const [errors, setErrors] = useState<Partial<TeacherFormData>>({})

  const departments = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
  ]

  const validateForm = (): boolean => {
    const newErrors: Partial<TeacherFormData> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.department) newErrors.department = "Department is required"
    if (!formData.subject.trim()) newErrors.subject = "Subject is required"
    if (!formData.employeeId.trim()) newErrors.employeeId = "Employee ID is required"
    if (!formData.joinDate) newErrors.joinDate = "Join date is required"
    if (!formData.qualification.trim()) newErrors.qualification = "Qualification is required"
    // if (formData.experience < 0) newErrors.experience = "Experience cannot be negative"
    // if (formData.salary <= 0) newErrors.salary = "Salary must be greater than 0"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({
        ...formData,
        status: teacher?.status || "active",
      })
    }
  }

  const handleInputChange = (field: keyof TeacherFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  value={formData.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  className={errors.employeeId ? "border-red-500" : ""}
                />
                {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                  <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className={errors.subject ? "border-red-500" : ""}
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="joinDate">Join Date *</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={(e) => handleInputChange("joinDate", e.target.value)}
                  className={errors.joinDate ? "border-red-500" : ""}
                />
                {errors.joinDate && <p className="text-red-500 text-sm mt-1">{errors.joinDate}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Qualifications & Experience */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Qualifications & Experience</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange("qualification", e.target.value)}
                  className={errors.qualification ? "border-red-500" : ""}
                  placeholder="e.g., M.Sc Mathematics"
                />
                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
              </div>

              <div>
                <Label htmlFor="experience">Experience (Years) *</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", Number.parseInt(e.target.value) || 0)}
                  className={errors.experience ? "border-red-500" : ""}
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Salary Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="salary">Annual Salary ($) *</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  value={formData.salary}
                  onChange={(e) => handleInputChange("salary", Number.parseInt(e.target.value) || 0)}
                  className={errors.salary ? "border-red-500" : ""}
                />
                {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 bg-transparent">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" className="px-6 bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {teacher ? "Update Teacher" : "Add Teacher"}
        </Button>
      </div>
    </form>
  )
}
