"use client"

import { useState } from "react"
import type { PaymentMethod, PaymentState, BillingAddress, CardDetails, Teacher, PaymentData } from "@/lib/types"
import { paymentMethods } from "@/lib/mockData"
import PaymentMethodSelector from "./PaymentMethodSelector"
import CardPaymentForm from "./CardPaymentForm"
import BillingAddressForm from "./BillingAddressForm"
import PaymentSummary from "./PaymentSummary"
import PaymentResult from "./PaymentResult"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Shield, Lock, User } from "lucide-react"

interface PaymentInterfaceProps {
  teacher?: Teacher | null
  onSuccess: (paymentData: PaymentData & { transactionId: string }) => void
  onCancel: () => void
}

export default function PaymentInterface({ teacher, onSuccess, onCancel }: PaymentInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [paymentType, setPaymentType] = useState<PaymentData["paymentType"]>("salary")
  const [paymentAmount, setPaymentAmount] = useState(teacher?.pendingPayment || 0)
  const [paymentDescription, setPaymentDescription] = useState(
    teacher
      ? `${paymentType === "salary" ? "Monthly salary" : "Payment"} for ${teacher.firstName} ${teacher.lastName}`
      : "",
  )
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  })
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isProcessing: false,
    isSuccess: false,
    isError: false,
  })

  const orderCurrency = "USD"

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    if (method.type === "card") {
      setCurrentStep(2)
    } else {
      setCurrentStep(3)
    }
  }

  const handleCardDetailsSubmit = (details: CardDetails) => {
    setCardDetails(details)
    setCurrentStep(3)
  }

  const handleBillingAddressSubmit = (address: BillingAddress) => {
    setBillingAddress(address)
    setCurrentStep(4)
  }

  const handlePaymentSubmit = async () => {
    setPaymentState({ isProcessing: true, isSuccess: false, isError: false })

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const isSuccess = Math.random() > 0.1 // 90% success rate

      if (isSuccess) {
        const transactionId = `TXN${Date.now()}`
        const paymentData: PaymentData & { transactionId: string } = {
          amount: paymentAmount,
          currency: orderCurrency,
          method: selectedMethod!,
          cardDetails: selectedMethod?.type === "card" ? cardDetails : undefined,
          billingAddress,
          paymentType,
          teacherId: teacher?.id,
          description: paymentDescription,
          transactionId,
        }

        setPaymentState({
          isProcessing: false,
          isSuccess: true,
          isError: false,
          transactionId,
        })

        onSuccess(paymentData)
      } else {
        throw new Error("Payment failed. Please try again.")
      }
    } catch (error) {
      setPaymentState({
        isProcessing: false,
        isSuccess: false,
        isError: true,
        errorMessage: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Payment Method", active: currentStep >= 1 },
      { number: 2, title: "Card Details", active: currentStep >= 2, show: selectedMethod?.type === "card" },
      { number: 3, title: "Billing Info", active: currentStep >= 3 },
      { number: 4, title: "Review & Pay", active: currentStep >= 4 },
    ].filter((step) => step.show !== false)

    return (
      <div className="flex items-center justify-center mb-8 px-4">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                  step.active ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`ml-2 text-xs sm:text-sm font-medium hidden sm:inline ${
                  step.active ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-4 transition-colors duration-300 ${
                    currentStep > step.number ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (paymentState.isSuccess || paymentState.isError) {
    return (
      <PaymentResult
        isSuccess={paymentState.isSuccess}
        errorMessage={paymentState.errorMessage}
        transactionId={paymentState.transactionId}
        amount={paymentAmount}
        currency={orderCurrency}
        onStartOver={onCancel}
        teacher={teacher}
      />
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 font-poppins">Process Payment</h1>
          {teacher && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Payment for {teacher.firstName} {teacher.lastName} - {teacher.department}
                </span>
              </div>
            </div>
          )}
          <p className="text-gray-600 text-lg">Complete the payment safely and securely</p>
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
            <Shield className="w-4 h-4 mr-2" />
            <span>256-bit SSL encryption</span>
            <Lock className="w-4 h-4 ml-4 mr-2" />
            <span>PCI DSS compliant</span>
          </div>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8">
                {/* Back Button */}
                {currentStep > 1 && (
                  <Button
                    variant="ghost"
                    onClick={handleBackStep}
                    className="mb-6 text-gray-600 hover:text-gray-800 p-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}

                {/* Step Content */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    {/* Payment Details */}
                    <div className="space-y-4">
                      <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Payment Details</h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="paymentType">Payment Type</Label>
                          <Select
                            value={paymentType}
                            onValueChange={(value: PaymentData["paymentType"]) => setPaymentType(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="salary">Salary</SelectItem>
                              <SelectItem value="bonus">Bonus</SelectItem>
                              <SelectItem value="reimbursement">Reimbursement</SelectItem>
                              <SelectItem value="course-fee">Course Fee</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="amount">Amount ($)</Label>
                          <input
                            type="number"
                            id="amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={paymentDescription}
                          onChange={(e) => setPaymentDescription(e.target.value)}
                          placeholder="Enter payment description..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <PaymentMethodSelector
                      methods={paymentMethods}
                      selectedMethod={selectedMethod}
                      onMethodSelect={handleMethodSelect}
                    />
                  </div>
                )}

                {currentStep === 2 && selectedMethod?.type === "card" && (
                  <CardPaymentForm cardDetails={cardDetails} onSubmit={handleCardDetailsSubmit} />
                )}

                {currentStep === 3 && (
                  <BillingAddressForm billingAddress={billingAddress} onSubmit={handleBillingAddressSubmit} />
                )}

                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Review Your Payment</h2>

                    {/* Payment Details Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Payment Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium capitalize">{paymentType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">${paymentAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Description:</span>
                          <span className="font-medium">{paymentDescription}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Payment Method</h3>
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{selectedMethod?.icon}</span>
                        <div>
                          <p className="font-medium">{selectedMethod?.name}</p>
                          {selectedMethod?.type === "card" && cardDetails.number && (
                            <p className="text-sm text-gray-600">•••• •••• •••• {cardDetails.number.slice(-4)}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Billing Address Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Billing Address</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          {billingAddress.firstName} {billingAddress.lastName}
                        </p>
                        <p>{billingAddress.address}</p>
                        <p>
                          {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
                        </p>
                        <p>{billingAddress.email}</p>
                      </div>
                    </div>

                    <Button
                      onClick={handlePaymentSubmit}
                      disabled={paymentState.isProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      {paymentState.isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Processing Payment...
                        </div>
                      ) : (
                        `Pay $${paymentAmount.toFixed(2)}`
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Sidebar */}
          <div className="lg:col-span-1">
            <PaymentSummary
              amount={paymentAmount}
              currency={orderCurrency}
              isProcessing={paymentState.isProcessing}
              teacher={teacher}
              paymentType={paymentType}
              description={paymentDescription}
            />
          </div>
        </div>

        {/* Cancel Button */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={onCancel} className="px-8 bg-transparent">
            Cancel Payment
          </Button>
        </div>
      </div>
    </div>
  )
}
