"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MapPin, Clock, CreditCard, Truck, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const cartItems = [
  { id: 1, name: "Fresh Organic Apples", price: 4.99, quantity: 2, image: "/placeholder.svg" },
  { id: 2, name: "Premium Avocados", price: 3.49, quantity: 1, image: "/placeholder.svg" },
  { id: 3, name: "Organic Spinach", price: 2.99, quantity: 3, image: "/placeholder.svg" },
]

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    instructions: "",
  })
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = deliveryMethod === "express" ? 9.99 : deliveryMethod === "scheduled" ? 2.99 : 0
  const total = subtotal + deliveryFee

  const handlePlaceOrder = () => {
    // Place order logic
    console.log("Order placed!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-green-800">Checkout</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Delivery Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      placeholder="123 Main Street"
                      value={deliveryAddress.street}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select onValueChange={(value) => setDeliveryAddress({ ...deliveryAddress, state: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ny">New York</SelectItem>
                        <SelectItem value="ca">California</SelectItem>
                        <SelectItem value="tx">Texas</SelectItem>
                        <SelectItem value="fl">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      value={deliveryAddress.zipCode}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="instructions">Delivery Instructions (Optional)</Label>
                    <Input
                      id="instructions"
                      placeholder="Leave at front door, ring doorbell"
                      value={deliveryAddress.instructions}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, instructions: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Delivery Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="standard" id="standard" />
                    <div className="flex-1">
                      <Label htmlFor="standard" className="font-medium">
                        Standard Delivery
                      </Label>
                      <p className="text-sm text-gray-600">2-3 business days • FREE</p>
                    </div>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <div className="flex-1">
                      <Label htmlFor="scheduled" className="font-medium">
                        Scheduled Delivery
                      </Label>
                      <p className="text-sm text-gray-600">Choose your preferred time slot</p>
                    </div>
                    <span className="font-bold">$2.99</span>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="express" id="express" />
                    <div className="flex-1">
                      <Label htmlFor="express" className="font-medium">
                        Express Delivery
                      </Label>
                      <p className="text-sm text-gray-600">Within 30 minutes</p>
                    </div>
                    <span className="font-bold">$9.99</span>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center space-x-2">
                      <Image src="/placeholder.svg" alt="PayPal" width={16} height={16} />
                      <span>PayPal</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="apple" id="apple" />
                    <Label htmlFor="apple" className="flex items-center space-x-2">
                      <Image src="/placeholder.svg" alt="Apple Pay" width={16} height={16} />
                      <span>Apple Pay</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input
                        id="nameOnCard"
                        placeholder="John Doe"
                        value={paymentDetails.nameOnCard}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentDetails.expiryDate}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentDetails.cvv}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1">
                      <Truck className="h-4 w-4" />
                      <span>Delivery</span>
                    </span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-2 text-sm">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-xs leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-green-600 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-green-600 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handlePlaceOrder}>
                  Place Order • ${total.toFixed(2)}
                </Button>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Secure Checkout</span>
                  </div>
                  <div className="text-gray-600">
                    <p>• SSL encrypted payment</p>
                    <p>• Money-back guarantee</p>
                    <p>• 24/7 customer support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
