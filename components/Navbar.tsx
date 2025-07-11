"use client"

import { Button } from "@/components/ui/button"
import { Bell, Settings, ArrowLeft, Home, Users, CreditCard } from "lucide-react"

interface NavbarProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
  onBackClick?: () => void
  currentPage?: "dashboard" | "teachers" | "payments" | "payment-process"
  disabled?: boolean // Add this prop
}

export default function Navbar({
  title = "Teacher Management",
  subtitle = "Teacher Management & Payment System",
  showBackButton = false,
  onBackClick,
  currentPage = "dashboard",
  disabled = false, // Add this prop
}: NavbarProps) {
  const getBreadcrumb = () => {
    switch (currentPage) {
      case "teachers":
        return "Teachers"
      case "payments":
        return "Payments"
      case "payment-process":
        return "Process Payment"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button variant="ghost" size="sm" onClick={onBackClick} className="text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins">{title}</h1>
                {currentPage !== "dashboard" && (
                  <div className="hidden sm:flex items-center text-sm text-gray-500">
                    <span className="mx-2">/</span>
                    <span>{getBreadcrumb()}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Navigation Links - Hidden on mobile during payment process */}
            {currentPage !== "payment-process" && !disabled && (
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={currentPage === "dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-600"}
                  disabled={disabled}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={currentPage === "teachers" ? "bg-blue-50 text-blue-600" : "text-gray-600"}
                  disabled={disabled}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Teachers
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={currentPage === "payments" ? "bg-blue-50 text-blue-600" : "text-gray-600"}
                  disabled={disabled}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payments
                </Button>
              </div>
            )}

            {/* Show payment process indicator */}
            {currentPage === "payment-process" && (
              <div className="hidden md:flex items-center space-x-2">
                <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                  🔒 Secure Payment in Progress
                </div>
              </div>
            )}

            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <Bell className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Notifications</span>
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              <span className="hidden lg:inline">Settings</span>
            </Button>

            {/* Mobile menu button */}
            <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile breadcrumb */}
        {currentPage !== "dashboard" && (
          <div className="sm:hidden pb-2">
            <div className="flex items-center text-sm text-gray-500">
              <Home className="w-4 h-4 mr-1" />
              <span className="mr-2">Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{getBreadcrumb()}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
