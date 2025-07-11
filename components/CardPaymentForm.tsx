"use client"

import type React from "react"

import { useState } from "react"
import type { CardDetails } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Lock } from "lucide-react"

interface CardPaymentFormProps {
  cardDetails: CardDetails
  onSubmit: (details: CardDetails) => void
}

export default function CardPaymentForm({ cardDetails, onSubmit }: CardPaymentFormProps) {
  const [formData, setFormData] = useState<CardDetails>(cardDetails)
  const [errors, setErrors] = useState<Partial<CardDetails>>({})

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, "")
    if (/^4/.test(num)) return "Visa"
    if (/^5[1-5]/.test(num)) return "Mastercard"
    if (/^3[47]/.test(num)) return "American Express"
    return "Card"
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<CardDetails> = {}

    if (!formData.number.replace(/\s/g, "")) {
      newErrors.number = "Card number is required"
    } else if (formData.number.replace(/\s/g, "").length < 13) {
      newErrors.number = "Card number is invalid"
    }

    if (!formData.name.trim()) {
      newErrors.name = "Cardholder name is required"
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = "Expiry month is required"
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = "Expiry year is required"
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV is required"
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof CardDetails, value: string) => {
    if (field === "number") {
      value = formatCardNumber(value)
    }
    if (field === "cvv") {
      value = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i)
  const months = [
    { value: "01", label: "01 - January" },
    { value: "02", label: "02 - February" },
    { value: "03", label: "03 - March" },
    { value: "04", label: "04 - April" },
    { value: "05", label: "05 - May" },
    { value: "06", label: "06 - June" },
    { value: "07", label: "07 - July" },
    { value: "08", label: "08 - August" },
    { value: "09", label: "09 - September" },
    { value: "10", label: "10 - October" },
    { value: "11", label: "11 - November" },
    { value: "12", label: "12 - December" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 font-poppins">Card Information</h2>
        <p className="text-gray-600">Enter your card details to complete the payment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Number */}
        <div className="space-y-2">
          <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">
            Card Number
          </Label>
          <div className="relative">
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.number}
              onChange={(e) => handleInputChange("number", e.target.value)}
              className={`pl-12 text-lg tracking-wider ${errors.number ? "border-red-500" : ""}`}
              maxLength={19}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {formData.number && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600">
                {getCardType(formData.number)}
              </div>
            )}
          </div>
          {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
        </div>

        {/* Cardholder Name */}
        <div className="space-y-2">
          <Label htmlFor="cardName" className="text-sm font-medium text-gray-700">
            Cardholder Name
          </Label>
          <Input
            id="cardName"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`text-lg ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Expiry Month</Label>
            <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange("expiryMonth", value)}>
              <SelectTrigger className={errors.expiryMonth ? "border-red-500" : ""}>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryMonth && <p className="text-red-500 text-sm">{errors.expiryMonth}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Expiry Year</Label>
            <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange("expiryYear", value)}>
              <SelectTrigger className={errors.expiryYear ? "border-red-500" : ""}>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expiryYear && <p className="text-red-500 text-sm">{errors.expiryYear}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">
              CVV
            </Label>
            <div className="relative">
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleInputChange("cvv", e.target.value)}
                className={`text-lg text-center ${errors.cvv ? "border-red-500" : ""}`}
                maxLength={4}
              />
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="text-yellow-500 mr-3">🔒</div>
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Your card is safe with us</h4>
              <p className="text-sm text-yellow-700">
                We use 256-bit SSL encryption to protect your card information. Your details are never stored on our
                servers.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-lg transition-colors duration-200"
        >
          Continue to Billing Address
        </Button>
      </form>
    </div>
  )
}
