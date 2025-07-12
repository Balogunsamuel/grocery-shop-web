"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Search, ShoppingCart, Star, Plus, Minus, Heart, Filter, Menu, User, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const categories = [
  { id: 1, name: "Fruits", icon: "🍎", color: "bg-red-100 text-red-800" },
  { id: 2, name: "Vegetables", icon: "🥕", color: "bg-orange-100 text-orange-800" },
  { id: 3, name: "Dairy", icon: "🥛", color: "bg-blue-100 text-blue-800" },
  { id: 4, name: "Meat", icon: "🥩", color: "bg-red-100 text-red-800" },
  { id: 5, name: "Bakery", icon: "🍞", color: "bg-yellow-100 text-yellow-800" },
  { id: 6, name: "Beverages", icon: "🥤", color: "bg-purple-100 text-purple-800" },
]

const featuredProducts = [
  {
    id: 1,
    name: "Fresh Organic Apples",
    price: 4.99,
    originalPrice: 6.99,
    image: "/placeholder.svg",
    rating: 4.5,
    category: "Fruits",
    inStock: true,
  },
  {
    id: 2,
    name: "Premium Avocados",
    price: 3.49,
    originalPrice: 4.99,
    image: "/placeholder.svg",
    rating: 4.8,
    category: "Fruits",
    inStock: true,
  },
  {
    id: 3,
    name: "Organic Spinach",
    price: 2.99,
    originalPrice: 3.99,
    image: "/placeholder.svg",
    rating: 4.3,
    category: "Vegetables",
    inStock: true,
  },
  {
    id: 4,
    name: "Fresh Salmon Fillet",
    price: 12.99,
    originalPrice: 15.99,
    image: "/placeholder.svg",
    rating: 4.7,
    category: "Meat",
    inStock: true,
  },
]

const promoSlides = [
  {
    id: 1,
    title: "Fresh Produce Sale",
    subtitle: "Up to 30% off on fruits & vegetables",
    image: "/placeholder.svg",
    color: "bg-green-500",
  },
  { id: 2, title: "Free Delivery", subtitle: "On orders over $50", image: "/placeholder.svg", color: "bg-blue-500" },
  {
    id: 3,
    title: "Organic Week",
    subtitle: "Special prices on organic products",
    image: "/placeholder.svg",
    color: "bg-yellow-500",
  },
]

export default function HomePage() {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({})
  const [searchQuery, setSearchQuery] = useState("")

  const addToCart = (productId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1),
    }))
  }

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-bold text-xl text-green-800">GroceryFresh</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border-green-200 focus:border-green-500"
                />
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Deliver to 12345</span>
              </div>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600 text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-green-200 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Promo Banner Carousel */}
      <section className="container mx-auto px-4 py-6">
        <Carousel className="w-full">
          <CarouselContent>
            {promoSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className={`${slide.color} rounded-xl p-8 text-white relative overflow-hidden`}>
                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-lg opacity-90 mb-4">{slide.subtitle}</p>
                    <Button variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
                      Shop Now
                    </Button>
                  </div>
                  <div className="absolute right-0 top-0 w-1/3 h-full opacity-20">
                    <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-100 hover:border-green-300">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-medium text-sm text-gray-700">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow border-green-100">
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-lg"
                  />
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-green-600">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                  </div>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {product.category}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="font-bold text-green-600">${product.price}</span>
                  <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                {cartItems[product.id] > 0 ? (
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-green-600 text-green-600 bg-transparent"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-semibold text-green-600">{cartItems[product.id]}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-green-600 text-green-600 bg-transparent"
                      onClick={() => addToCart(product.id)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-sm"
                    onClick={() => addToCart(product.id)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add to Cart
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-semibold mb-1">Free Delivery</h3>
              <p className="text-sm opacity-90">On orders over $50</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Express Delivery</h3>
              <p className="text-sm opacity-90">In 30 minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">🌱</div>
              <h3 className="font-semibold mb-1">Organic</h3>
              <p className="text-sm opacity-90">Fresh & Natural</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold mb-1">Best Prices</h3>
              <p className="text-sm opacity-90">Guaranteed</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Floating Cart Button (Mobile) */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 right-4 md:hidden z-50">
          <Button className="bg-green-600 hover:bg-green-700 rounded-full h-14 w-14 shadow-lg">
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                {getTotalItems()}
              </Badge>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
