"use client"

import type { PaymentMethod } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[]
  selectedMethod: PaymentMethod | null
  onMethodSelect: (method: PaymentMethod) => void
}

export default function PaymentMethodSelector({ methods, selectedMethod, onMethodSelect }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-poppins">Choose Payment Method</h2>
        <p className="text-gray-600">Select your preferred payment method to continue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {methods.map((method) => (
          <Card
            key={method.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
              selectedMethod?.id === method.id
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onMethodSelect(method)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{method.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
                {selectedMethod?.id === method.id && <CheckCircle className="w-6 h-6 text-blue-500" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-500 mr-3">ℹ️</div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Secure Payment Processing</h4>
            <p className="text-sm text-blue-700">
              All payments are processed securely using industry-standard encryption. Your payment information is never
              stored on our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
