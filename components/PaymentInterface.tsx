"use client"

import { useState } from "react"
import type { PaymentMethod, PaymentState, BillingAddress, CardDetails, Teacher, PaymentData } from "@/lib/types"
import { paymentMethods } from "@/lib/mockData"
import Navbar from "./Navbar"
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
import { ArrowLeft, Shield, Lock, User, CheckCircle } from "lucide-react"
import Sidebar from "./Sidebar"

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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Payment Details & Method"
      case 2:
        return "Card Information"
      case 3:
        return "Billing Address"
      case 4:
        return "Review & Confirm"
      default:
        return "Process Payment"
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
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-shrink-0">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                    step.active ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                </div>
                <span
                  className={`ml-2 text-xs sm:text-sm font-medium hidden sm:inline whitespace-nowrap ${
                    step.active ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
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
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          activeTab="payments"
          onTabChange={() => {}} // Disabled during payment process
          teachers={[]}
          paymentRecords={[]}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            title="Payment Complete"
            subtitle={paymentState.isSuccess ? "Transaction processed successfully" : "Payment failed"}
            showBackButton={true}
            onBackClick={onCancel}
            currentPage="payment-process"
          />
          <main className="flex-1 overflow-y-auto">
            <PaymentResult
              isSuccess={paymentState.isSuccess}
              errorMessage={paymentState.errorMessage}
              transactionId={paymentState.transactionId}
              amount={paymentAmount}
              currency={orderCurrency}
              onStartOver={onCancel}
              teacher={teacher}
            />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        activeTab="payments"
        onTabChange={() => {}} // Disabled during payment process
        teachers={teacher ? [teacher] : []}
        paymentRecords={[]}
        isCollapsed={false}
        onToggleCollapse={() => {}}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          title="Process Payment"
          subtitle={getStepTitle()}
          showBackButton={true}
          onBackClick={onCancel}
          currentPage="payment-process"
        />

        <main className="flex-1 overflow-y-auto">
          <div className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              {/* Teacher Info Banner */}
              {teacher && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">
                      Processing payment for {teacher.firstName} {teacher.lastName} - {teacher.department}
                    </span>
                  </div>
                </div>
              )}

              {/* Security Banner */}
              <div className="bg-white border rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-green-500" />
                  <span className="mr-4">256-bit SSL encryption</span>
                  <Lock className="w-4 h-4 mr-2 text-blue-500" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>

              {/* Step Indicator */}
              {renderStepIndicator()}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <Card className="shadow-xl border-0 bg-white">
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
                  <div className="sticky top-24">
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
              </div>

              {/* Cancel Button */}
              <div className="text-center mt-8">
                <Button variant="outline" onClick={onCancel} className="px-8 bg-transparent">
                  Cancel Payment
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
