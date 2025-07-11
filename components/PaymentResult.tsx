"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Download, Mail, ArrowLeft } from "lucide-react"
import type { Teacher } from "@/lib/types"

interface PaymentResultProps {
  isSuccess: boolean
  errorMessage?: string
  transactionId?: string
  amount: number
  currency: string
  onStartOver: () => void
  teacher?: Teacher | null
}

export default function PaymentResult({
  isSuccess,
  errorMessage,
  transactionId,
  amount,
  currency,
  onStartOver,
  teacher,
}: PaymentResultProps) {
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <Card className="max-w-md w-full shadow-2xl border-0 bg-white">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">Payment Successful!</h1>
              <p className="text-gray-600">Your payment has been processed successfully</p>
            </div>

            {teacher && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Payment to:</strong> {teacher.firstName} {teacher.lastName} ({teacher.department})
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="font-semibold text-gray-900">
                    ${amount.toFixed(2)} {currency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-gray-900">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>

              <Button variant="outline" className="w-full bg-transparent">
                <Mail className="w-4 h-4 mr-2" />
                Email Receipt
              </Button>

              <Button variant="ghost" onClick={onStartOver} className="w-full text-gray-600 hover:text-gray-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>A confirmation email has been sent to your email address.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <Card className="max-w-md w-full shadow-2xl border-0 bg-white">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">Payment Failed</h1>
            <p className="text-gray-600 mb-4">We couldn't process your payment</p>
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button onClick={onStartOver} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Try Again
            </Button>

            <Button variant="outline" className="w-full bg-transparent">
              Contact Support
            </Button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>If you continue to experience issues, please contact our support team.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
