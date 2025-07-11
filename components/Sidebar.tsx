"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Home,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  UserPlus,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  teachers: any[]
  paymentRecords: any[]
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  disabled?: boolean // Add this prop
}

export default function Sidebar({
  activeTab,
  onTabChange,
  teachers,
  paymentRecords,
  isCollapsed = false,
  onToggleCollapse,
  disabled = false, // Add this prop
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const pendingPayments = teachers.filter((t) => (t.pendingPayment || 0) > 0).length
  const activeTeachers = teachers.filter((t) => t.status === "active").length
  const totalPendingAmount = teachers.reduce((sum, t) => sum + (t.pendingPayment || 0), 0)
  const recentPayments = paymentRecords.filter((p) => {
    const paymentDate = new Date(p.date)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return paymentDate >= weekAgo
  }).length

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      badge: null,
      description: "Overview and analytics",
    },
    {
      id: "teachers",
      label: "Teachers",
      icon: Users,
      badge: activeTeachers,
      description: "Manage teaching staff",
    },
    {
      id: "payments",
      label: "Payments",
      icon: CreditCard,
      badge: pendingPayments > 0 ? pendingPayments : null,
      description: "Process and track payments",
      urgent: pendingPayments > 0,
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      badge: null,
      description: "Analytics and insights",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      badge: null,
      description: "Schedule and events",
    },
  ]

  const quickActions = [
    {
      id: "add-teacher",
      label: "Add Teacher",
      icon: UserPlus,
      action: () => onTabChange("teachers"),
      color: "bg-blue-500",
    },
    {
      id: "process-payment",
      label: "Process Payment",
      icon: DollarSign,
      action: () => onTabChange("payments"),
      color: "bg-green-500",
    },
    {
      id: "generate-report",
      label: "Generate Report",
      icon: FileText,
      action: () => onTabChange("reports"),
      color: "bg-purple-500",
    },
  ]

  const stats = [
    {
      label: "Active Teachers",
      value: activeTeachers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Pending Payments",
      value: `$${totalPendingAmount.toLocaleString()}`,
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      label: "Recent Payments",
      value: recentPayments,
      icon: CheckCircle,
      color: "text-green-600",
    },
  ]

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      } flex flex-col h-screen sticky top-0 z-40`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              {/* <h2 className="text-lg font-bold text-gray-900 font-poppins">EduManage</h2> */}
              <p className="text-xs text-gray-500">Teacher Management</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="p-1 h-8 w-8">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-gray-600">{stat.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Button
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start h-10 ${
                    activeTab === item.id ? "bg-blue-600 text-white shadow-md" : "text-gray-700 hover:bg-gray-100"
                  } ${isCollapsed ? "px-2" : "px-3"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !disabled && onTabChange(item.id)}
                  disabled={disabled}
                >
                  <item.icon
                    className={`w-4 h-4 ${isCollapsed ? "" : "mr-3"} ${
                      item.urgent && activeTab !== item.id ? "text-orange-500" : ""
                    }`}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant={item.urgent ? "destructive" : "secondary"} className="ml-2 h-5 px-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && hoveredItem === item.id && (
                  <div className="absolute left-full top-0 ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-md shadow-lg z-50 whitespace-nowrap">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                    {item.badge && (
                      <div className="text-xs mt-1">
                        <Badge variant={item.urgent ? "destructive" : "secondary"} className="h-4 px-1 text-xs">
                          {item.badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4">
            <Separator className="mb-4" />
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</h3>
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  className={`w-full justify-start h-8 text-xs bg-transparent ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => !disabled && action.action()}
                  disabled={disabled}
                >
                  <div className={`w-2 h-2 rounded-full ${action.color} mr-2`} />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Urgent Notifications */}
        {!isCollapsed && pendingPayments > 0 && (
          <div className="p-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-orange-800">Attention Required</h4>
                  <p className="text-xs text-orange-700 mt-1">
                    {pendingPayments} teacher{pendingPayments > 1 ? "s have" : " has"} pending payments
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 h-6 text-xs bg-orange-600 hover:bg-orange-700"
                    onClick={() => onTabChange("payments")}
                  >
                    Review Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        {!isCollapsed ? (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start h-8 text-xs">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full p-2">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-full p-2">
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
