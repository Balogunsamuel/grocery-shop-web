"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, ShoppingCart, Star, Plus, Minus, Heart, Filter, ArrowLeft, Grid, List } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Fresh Organic Apples",
    price: 4.99,
    originalPrice: 6.99,
    image: "/placeholder.svg",
    rating: 4.5,
    category: "Fruits",
    inStock: true,
    brand: "Organic Farm",
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
    brand: "Fresh Valley",
  },
  {
    id: 3,
    name: "Red Strawberries",
    price: 5.99,
    originalPrice: 7.99,
    image: "/placeholder.svg",
    rating: 4.6,
    category: "Fruits",
    inStock: true,
    brand: "Berry Best",
  },
  {
    id: 4,
    name: "Organic Bananas",
    price: 2.99,
    originalPrice: 3.99,
    image: "/placeholder.svg",
    rating: 4.4,
    category: "Fruits",
    inStock: true,
    brand: "Organic Farm",
  },
  {
    id: 5,
    name: "Fresh Oranges",
    price: 4.49,
    originalPrice: 5.99,
    image: "/placeholder.svg",
    rating: 4.3,
    category: "Fruits",
    inStock: false,
    brand: "Citrus Co",
  },
  {
    id: 6,
    name: "Green Grapes",
    price: 6.99,
    originalPrice: 8.99,
    image: "/placeholder.svg",
    rating: 4.7,
    category: "Fruits",
    inStock: true,
    brand: "Vine Fresh",
  },
]

const brands = ["Organic Farm", "Fresh Valley", "Berry Best", "Citrus Co", "Vine Fresh"]

export default function CategoryPage({ params }: { params: { id: string } }) {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 20])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    return matchesSearch && matchesPrice && matchesBrand
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

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
              <h1 className="text-xl font-bold text-green-800">Fruits</h1>
            </div>

            <div className="flex items-center space-x-4">
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card className="border-green-100">
              <CardHeader>
                <h3 className="font-semibold text-lg">Filters</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-green-200 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={20} step={0.5} className="mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Brands</label>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand])
                            } else {
                              setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                            }
                          }}
                        />
                        <label htmlFor={brand} className="text-sm">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setPriceRange([0, 20])
                    setSelectedBrands([])
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="lg:hidden bg-transparent"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <p className="text-gray-600">{sortedProducts.length} products found</p>
              </div>

              <div className="flex items-center space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-r-none"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="rounded-l-none"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-4"}>
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className={`hover:shadow-lg transition-shadow border-green-100 ${
                    viewMode === "list" ? "flex flex-row" : ""
                  }`}
                >
                  <CardHeader className={`p-0 ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={200}
                        height={200}
                        className={`object-cover ${
                          viewMode === "list" ? "w-full h-32 rounded-l-lg" : "w-full h-40 rounded-t-lg"
                        }`}
                      />
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Badge className="absolute top-2 left-2 bg-green-600">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <Badge variant="destructive">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <div className={viewMode === "list" ? "flex flex-col flex-1" : ""}>
                    <CardContent className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-600 mb-2">{product.brand}</p>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-bold text-green-600">${product.price}</span>
                        <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      {product.inStock ? (
                        cartItems[product.id] > 0 ? (
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
                        )
                      ) : (
                        <Button disabled className="w-full text-sm">
                          Out of Stock
                        </Button>
                      )}
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Button (Mobile) */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-4 right-4 lg:hidden z-50">
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
