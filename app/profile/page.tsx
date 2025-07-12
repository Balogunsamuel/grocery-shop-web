"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, CreditCard, Package, Heart, Settings, Bell, LogOut, Edit } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const orderHistory = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    status: "Delivered",
    total: 45.67,
    items: 8,
    image: "/placeholder.svg",
  },
  {
    id: "ORD-002",
    date: "2024-01-10",
    status: "Delivered",
    total: 32.45,
    items: 5,
    image: "/placeholder.svg",
  },
  {
    id: "ORD-003",
    date: "2024-01-05",
    status: "Cancelled",
    total: 28.9,
    items: 4,
    image: "/placeholder.svg",
  },
]

const wishlistItems = [
  { id: 1, name: "Organic Blueberries", price: 6.99, image: "/placeholder.svg", inStock: true },
  { id: 2, name: "Premium Olive Oil", price: 12.99, image: "/placeholder.svg", inStock: true },
  { id: 3, name: "Artisan Bread", price: 4.49, image: "/placeholder.svg", inStock: false },
]

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg",
  })

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      isDefault: true,
    },
    {
      id: 2,
      type: "Work",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      isDefault: false,
    },
  ])

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
              <h1 className="text-xl font-bold text-green-800">My Profile</h1>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt={userInfo.name} />
                  <AvatarFallback className="text-2xl bg-green-100 text-green-800">
                    {userInfo.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-gray-800 mb-1">{userInfo.name}</h2>
                <p className="text-gray-600 mb-4">{userInfo.email}</p>
                <Button variant="outline" className="w-full bg-transparent">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-3" />
                    Order History
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-3" />
                    Wishlist
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <MapPin className="h-4 w-4 mr-3" />
                    Addresses
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Payment Methods
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Button>
                  <Separator className="my-2" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="addresses">Addresses</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              {/* Order History */}
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <Image
                            src={order.image || "/placeholder.svg"}
                            alt="Order"
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">Order {order.id}</h3>
                              <Badge
                                variant={
                                  order.status === "Delivered"
                                    ? "default"
                                    : order.status === "Cancelled"
                                      ? "destructive"
                                      : "secondary"
                                }
                                className={order.status === "Delivered" ? "bg-green-100 text-green-800" : ""}
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {order.items} items • ${order.total}
                            </p>
                            <p className="text-xs text-gray-500">{order.date}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist */}
              <TabsContent value="wishlist" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => (
                        <Card key={item.id} className="border-green-100">
                          <CardContent className="p-4">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={150}
                              height={150}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-semibold text-sm mb-2">{item.name}</h3>
                            <p className="text-green-600 font-bold mb-3">${item.price}</p>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={!item.inStock}
                              >
                                {item.inStock ? "Add to Cart" : "Out of Stock"}
                              </Button>
                              <Button variant="outline" size="sm">
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses */}
              <TabsContent value="addresses" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Delivery Addresses</CardTitle>
                    <Button className="bg-green-600 hover:bg-green-700">Add New Address</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div key={address.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{address.type}</h3>
                                {address.isDefault && <Badge className="bg-green-100 text-green-800">Default</Badge>}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {address.street}
                                <br />
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Account Settings */}
              <TabsContent value="account" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={userInfo.name}
                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={userInfo.phone}
                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        Login Activity
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preferences</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Email Notifications</span>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS Notifications</span>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Marketing Communications</span>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
