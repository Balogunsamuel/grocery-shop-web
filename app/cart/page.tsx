"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingCart, Tag, Truck } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const initialCartItems = [
  { id: 1, name: "Fresh Organic Apples", price: 4.99, quantity: 2, image: "/placeholder.svg", inStock: true },
  { id: 2, name: "Premium Avocados", price: 3.49, quantity: 1, image: "/placeholder.svg", inStock: true },
  { id: 3, name: "Organic Spinach", price: 2.99, quantity: 3, image: "/placeholder.svg", inStock: true },
  { id: 4, name: "Fresh Salmon Fillet", price: 12.99, quantity: 1, image: "/placeholder.svg", inStock: false },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
    } else {
      setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo({ code: promoCode, discount: 0.1 })
      setPromoCode("")
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = appliedPromo ? subtotal * appliedPromo.discount : 0
  const deliveryFee = subtotal > 50 ? 0 : 4.99
  const total = subtotal - discount + deliveryFee

  const inStockItems = cartItems.filter((item) => item.inStock)
  const outOfStockItems = cartItems.filter((item) => !item.inStock)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-xl font-bold text-green-800">Shopping Cart</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {cartItems.length} items
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some fresh groceries to get started!</p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* In Stock Items */}
              {inStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Available Items</span>
                      <Badge className="bg-green-100 text-green-800">{inStockItems.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {inStockItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-green-600 font-bold">${item.price}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Out of Stock Items */}
              {outOfStockItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Unavailable Items</span>
                      <Badge variant="destructive">{outOfStockItems.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {outOfStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50 opacity-60"
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg object-cover grayscale"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-600">{item.name}</h3>
                          <p className="text-gray-500">${item.price}</p>
                          <Badge variant="destructive" className="mt-1">
                            Out of Stock
                          </Badge>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Promo Code */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Tag className="h-5 w-5" />
                    <span>Promo Code</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <span className="font-medium text-green-800">Code: {appliedPromo.code}</span>
                        <p className="text-sm text-green-600">{appliedPromo.discount * 100}% discount applied</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={applyPromoCode}
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                      >
                        Apply
                      </Button>
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
                  <div className="flex justify-between">
                    <span>Subtotal ({inStockItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedPromo.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1">
                      <Truck className="h-4 w-4" />
                      <span>Delivery</span>
                    </span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-sm text-gray-600">Add ${(50 - subtotal).toFixed(2)} more for free delivery</p>
                  )}

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  <Link href="/checkout">
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 mt-4"
                      disabled={inStockItems.length === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Truck className="h-4 w-4" />
                      <span className="font-medium">Free delivery on orders over $50</span>
                    </div>
                    <div className="text-gray-600">
                      <p>• Same-day delivery available</p>
                      <p>• 30-minute express delivery in select areas</p>
                      <p>• Fresh guarantee on all products</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
