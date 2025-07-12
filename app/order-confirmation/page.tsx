"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Package, Truck, MapPin, Clock, Phone, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const orderDetails = {
  id: "ORD-12345",
  date: "January 15, 2024",
  estimatedDelivery: "January 17, 2024",
  total: 45.67,
  items: [
    { id: 1, name: "Fresh Organic Apples", price: 4.99, quantity: 2, image: "/placeholder.svg" },
    { id: 2, name: "Premium Avocados", price: 3.49, quantity: 1, image: "/placeholder.svg" },
    { id: 3, name: "Organic Spinach", price: 2.99, quantity: 3, image: "/placeholder.svg" },
  ],
  deliveryAddress: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  },
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your order. We'll send you updates via email.</p>
          </div>

          {/* Order Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Order #{orderDetails.id}</span>
                <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">Placed on {orderDetails.date}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Delivery Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2 flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Delivery Address</span>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {orderDetails.deliveryAddress.street}
                    <br />
                    {orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state}{" "}
                    {orderDetails.deliveryAddress.zipCode}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2 flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Estimated Delivery</span>
                  </h3>
                  <p className="text-gray-600 text-sm">{orderDetails.estimatedDelivery}</p>
                  <p className="text-xs text-gray-500 mt-1">Between 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium">Order Confirmed</h3>
                    <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Preparing Order</h3>
                    <p className="text-sm text-gray-400">We're getting your items ready</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Out for Delivery</h3>
                    <p className="text-sm text-gray-400">Your order is on the way</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Delivered</h3>
                    <p className="text-sm text-gray-400">Order delivered successfully</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">1-800-GROCERY</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">support@groceryfresh.com</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Track Order
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-700">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
