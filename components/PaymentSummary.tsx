"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Shield, Truck } from "lucide-react"
import type { Teacher } from "@/lib/types" // Declare the Teacher variable

interface PaymentSummaryProps {
  amount: number
  currency: string
  isProcessing?: boolean
  teacher?: Teacher | null
  paymentType?: string
  description?: string
}

export default function PaymentSummary({
  amount,
  currency,
  isProcessing = false,
  teacher,
  paymentType,
  description,
}: PaymentSummaryProps) {
  const subtotal = amount
  const tax = amount * 0.08 // 8% tax
  const shipping = 0 // Free shipping
  const total = subtotal + tax + shipping

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Item */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              {teacher ? <span className="text-2xl">👨‍🏫</span> : <span className="text-2xl">💳</span>}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {teacher ? `${teacher.firstName} ${teacher.lastName}` : "Payment"}
              </h3>
              <p className="text-sm text-gray-600">
                {paymentType ? paymentType.charAt(0).toUpperCase() + paymentType.slice(1) : "Payment"}
              </p>
              {teacher && <p className="text-sm text-gray-500">{teacher.department}</p>}
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${amount.toFixed(2)}</p>
            </div>
          </div>

          <Separator />

          {/* Price Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-gray-900">
              ${total.toFixed(2)} {currency}
            </span>
          </div>

          {isProcessing && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-sm text-blue-700 font-medium">Processing your payment...</span>
              </div>
            </div>
          )}

          {description && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800">
                <strong>Description:</strong> {description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-600">256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-600">On all digital products</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-purple-500">🔄</span>
              <div>
                <p className="text-sm font-medium text-gray-900">30-Day Returns</p>
                <p className="text-xs text-gray-600">Money-back guarantee</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="text-center space-y-2">
        <p className="text-xs text-gray-500">Trusted by 50,000+ customers</p>
        <div className="flex justify-center space-x-4 opacity-60">
          <span className="text-2xl">🔒</span>
          <span className="text-2xl">✅</span>
          <span className="text-2xl">⭐</span>
        </div>
      </div>
    </div>
  )
}
