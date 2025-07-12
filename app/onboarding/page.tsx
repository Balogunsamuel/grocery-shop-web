"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ShoppingCart, Truck, Leaf, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const onboardingSteps = [
  {
    id: 1,
    title: "Fresh Groceries Delivered",
    description: "Get the freshest produce, meats, and pantry essentials delivered right to your doorstep.",
    icon: <ShoppingCart className="h-16 w-16 text-green-600" />,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Fast & Reliable Delivery",
    description: "Choose from same-day delivery, scheduled delivery, or express 30-minute delivery options.",
    icon: <Truck className="h-16 w-16 text-blue-600" />,
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "100% Organic Options",
    description: "Shop from our wide selection of certified organic products for a healthier lifestyle.",
    icon: <Leaf className="h-16 w-16 text-green-600" />,
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Save Time, Live Better",
    description: "Skip the grocery store lines and spend more time doing what you love.",
    icon: <Clock className="h-16 w-16 text-purple-600" />,
    image: "/placeholder.svg",
  },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = onboardingSteps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">G</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">GroceryFresh</h1>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-green-600' : 
                index < currentStep ? 'bg-green-300' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Onboarding Card */}
        <Card className="border-green-100 shadow-lg mb-8">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className="mb-6">
              {currentStepData.icon}
            </div>

            {/* Image */}
            <div className="mb-6">
              <Image
                src={currentStepData.image || "/placeholder.svg"}
                alt={currentStepData.title}
                width={200}
                height={150}
                className="mx-auto rounded-lg"
              />
            </div>

            {/* Content */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="text-gray-600"
          >
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            {currentStep + 1} of {onboardingSteps.length}
          </span>

          {currentStep < onboardingSteps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* Skip Button */}
        <div className="text-center">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
              Skip Introduction
            </Button>
          </Link>
        </div>

        {/* Features Preview */}
        {currentStep === onboardingSteps.length - 1 && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-100">
              <div className="text-2xl mb-2">🚚</div>
              <p className="text-xs font-medium">Free Delivery</p>
              <p className="text-xs text-gray-600">On orders $50+</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-100">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-xs font-medium">30min Express</p>
              <p className="text-xs text-gray-600">Ultra-fast delivery</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-100">
              <div className="text-2xl mb-2">🌱</div>
              <p className="text-xs font-medium">100% Organic</p>
              <p className="text-xs text-gray-600">\
