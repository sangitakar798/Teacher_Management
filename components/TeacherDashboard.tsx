"use client"

import { useState } from "react"
import type { Teacher } from "@/lib/types"
import TeacherList from "./TeacherList"
import TeacherForm from "./TeacherForm"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface TeacherDashboardProps {
  teachers: Teacher[]
  onAddTeacher: (teacherData: Omit<Teacher, "id">) => void
  onEditTeacher: (teacherData: Omit<Teacher, "id">, teacherId: string) => void
  onDeleteTeacher: (id: string) => void
  onPayTeacher: (teacher: Teacher) => void
}

export default function TeacherDashboard({
  teachers,
  onAddTeacher,
  onEditTeacher,
  onDeleteTeacher,
  onPayTeacher,
}: TeacherDashboardProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const handleAddTeacher = (teacherData: Omit<Teacher, "id">) => {
    onAddTeacher(teacherData)
    setShowForm(false)
  }

  const handleEditTeacher = (teacherData: Omit<Teacher, "id">) => {
    if (editingTeacher) {
      onEditTeacher(teacherData, editingTeacher.id)
      setEditingTeacher(null)
      setShowForm(false)
    }
  }

  const openEditForm = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingTeacher(null)
  }

  return (
    <div className="space-y-6">
      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 font-poppins">
              {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
            </h2>
            <Button variant="outline" onClick={closeForm} className="text-gray-600 hover:text-gray-800 bg-transparent">
              Cancel
            </Button>
          </div>
          <TeacherForm
            teacher={editingTeacher}
            onSubmit={editingTeacher ? handleEditTeacher : handleAddTeacher}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            {/* <div>
              <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Teacher Management</h2>
              <p className="text-gray-600 mt-1">Manage your educational staff efficiently</p>
            </div> */}
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Teacher
            </Button>
          </div>
          <TeacherList teachers={teachers} onEdit={openEditForm} onDelete={onDeleteTeacher} onPay={onPayTeacher} />
        </>
      )}
    </div>
  )
}
