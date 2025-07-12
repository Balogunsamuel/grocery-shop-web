"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Menu, User, MapPin, ShoppingCart, Filter, Truck, Zap, Leaf, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { SearchBar } from "@/components/search-bar"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useCartStore, useUserStore } from "@/lib/store"
import type { Product, Category } from "@/lib/types"

const promoSlides = [
  {
    id: 1,
    title: "Fresh Fruits & Vegetables",
    subtitle: "Up to 30% off on organic produce",
    cta: "Shop Now",
    link: "/category/1",
    color: "bg-gradient-to-r from-green-500 to-green-600",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    title: "Dairy Products",
    subtitle: "Farm fresh milk and cheese",
    cta: "Explore",
    link: "/category/3",
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function HomePage() {
  const { getTotalItems } = useCartStore()
  const { user } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [productsByCategory, setProductsByCategory] = useState<Record<number, Product[]>>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch("/api/categories")
        const categoriesData = await categoriesResponse.json()

        if (categoriesData.success) {
          setCategories(categoriesData.data)

          // Fetch products for each category
          const productsData: Record<number, Product[]> = {}

          for (const category of categoriesData.data) {
            const productsResponse = await fetch(`/api/products?category=${category.id}&limit=4`)
            const categoryProducts = await productsResponse.json()

            if (categoryProducts.success) {
              productsData[category.id] = categoryProducts.data
            }
          }

          setProductsByCategory(productsData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const totalItems = getTotalItems()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading fresh groceries...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
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
                <SearchBar />
                <Button className="bg-green-600 hover:bg-green-700">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Deliver to {user?.name ? user.name.split(" ")[0] : "12345"}</span>
                </div>
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden mt-3">
              <SearchBar />
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
                      <Link href={slide.link}>
                        <Button variant="secondary" className="bg-white text-gray-800 hover:bg-gray-100">
                          {slide.cta}
                        </Button>
                      </Link>
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

        {/* Products by Category */}
        {categories.map((category) => {
          const categoryProducts = productsByCategory[category.id] || []

          if (categoryProducts.length === 0) return null

          return (
            <section key={category.id} className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                <Link href={`/category/${category.id}`}>
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                  >
                    View All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Features */}
        <section className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Truck className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Free Delivery</h3>
                <p className="text-sm opacity-90">On orders over $50</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Express Delivery</h3>
                <p className="text-sm opacity-90">In 30 minutes</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Leaf className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Organic</h3>
                <p className="text-sm opacity-90">Fresh & Natural</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Best Prices</h3>
                <p className="text-sm opacity-90">Guaranteed</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Stay Fresh with Our Newsletter</h3>
              <p className="text-gray-600 mb-6">
                Get the latest deals, recipes, and fresh produce updates delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button className="bg-green-600 hover:bg-green-700 px-6">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Floating Cart Button (Mobile) */}
        {totalItems > 0 && (
          <div className="fixed bottom-4 right-4 md:hidden z-50">
            <Link href="/cart">
              <Button className="bg-green-600 hover:bg-green-700 rounded-full h-14 w-14 shadow-lg">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                    {totalItems}
                  </Badge>
                </div>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
