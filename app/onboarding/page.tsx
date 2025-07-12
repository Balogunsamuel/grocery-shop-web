"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShoppingCart, Truck, Leaf, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Step = {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  image: string
}

const steps: Step[] = [
  {
    id: 1,
    title: "Fresh Groceries Delivered",
    description: "Get the freshest produce, meats, and pantry essentials delivered right to your doorstep.",
    icon: ShoppingCart,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    title: "Fast & Reliable Delivery",
    description: "Choose from same-day delivery, scheduled delivery, or express 30-minute delivery options.",
    icon: Truck,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    title: "100% Organic Options",
    description: "Shop from our wide selection of certified organic products for a healthier lifestyle.",
    icon: Leaf,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    title: "Save Time, Live Better",
    description: "Skip the grocery store lines and spend more time doing what you love.",
    icon: Clock,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)

  const next = () => step < steps.length - 1 && setStep(step + 1)
  const prev = () => step > 0 && setStep(step - 1)

  const { title, description, icon: Icon, image } = steps[step]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600">
            <span className="text-2xl font-bold text-white">G</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">GroceryFresh</h1>
        </div>

        {/* Progress Dots */}
        <div className="mb-8 flex justify-center space-x-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === step ? "bg-green-600" : i < step ? "bg-green-300" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step Card */}
        <Card className="mb-8 border-green-100 shadow-lg">
          <CardContent className="p-8 text-center">
            <Icon className="mx-auto mb-6 h-16 w-16 text-green-600" />

            <div className="mb-6">
              <Image
                src={image || "/placeholder.svg"}
                alt={title}
                width={300}
                height={200}
                className="mx-auto rounded-lg object-cover"
              />
            </div>

            <h2 className="mb-4 text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{description}</p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" disabled={step === 0} onClick={prev}>
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            {step + 1} / {steps.length}
          </span>

          {step < steps.length - 1 ? (
            <Button onClick={next} className="bg-green-600 hover:bg-green-700">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Skip */}
        <div className="text-center">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
              Skip Introduction
            </Button>
          </Link>
        </div>

        {/* Feature Teasers (only on last step) */}
        {step === steps.length - 1 && (
          <div className="mt-8 grid grid-cols-2 gap-4">
            <Feature emoji="🚚" title="Free Delivery" subtitle="On orders $50+" />
            <Feature emoji="⚡" title="30-min Express" subtitle="Ultra-fast" />
            <Feature emoji="🌱" title="100% Organic" subtitle="Healthy choices" />
            <Feature emoji="💳" title="Secure Checkout" subtitle="PCI-DSS" />
          </div>
        )}
      </div>
    </div>
  )
}

interface FeatureProps {
  emoji: string
  title: string
  subtitle: string
}

function Feature({ emoji, title, subtitle }: FeatureProps) {
  return (
    <div className="rounded-lg border border-green-100 bg-white p-4 text-center">
      <div className="mb-2 text-2xl">{emoji}</div>
      <p className="text-xs font-medium">{title}</p>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  )
}
