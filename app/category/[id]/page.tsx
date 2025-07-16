"use client"

import { useState, useEffect } from "react"
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
import type { Product, Category } from "@/lib/types"
import { useCartStore } from "@/lib/store"


export default function CategoryPage({ params }: { params: { id: string } }) {
  const { items, addItem, updateQuantity, getTotalItems } = useCartStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 50])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch all categories to find the current one
        const categoriesResponse = await fetch("/api/categories")
        if (!categoriesResponse.ok) {
          throw new Error(`Categories API failed: ${categoriesResponse.status}`)
        }
        const categoriesData = await categoriesResponse.json()
        
        if (categoriesData.success && categoriesData.data) {
          // Find the current category by ID
          const currentCategory = categoriesData.data.find((cat: Category) => cat.id === parseInt(params.id))
          if (currentCategory) {
            setCategory(currentCategory)
          }
        }
        
        // Fetch products for this category
        const productsResponse = await fetch(`/api/products?category=${params.id}`)
        if (!productsResponse.ok) {
          throw new Error(`Products API failed: ${productsResponse.status}`)
        }
        const productsData = await productsResponse.json()
        
        if (productsData.success && productsData.data) {
          setProducts(productsData.data || [])
        }
      } catch (error) {
        console.error("Failed to fetch category data:", error)
        // Set empty states on error
        setProducts([])
        setCategory(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchCategoryData()
    }
  }, [params.id])

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    })
  }

  const removeFromCart = (productId: string | number) => {
    const currentItem = items.find(item => item.id === productId)
    if (currentItem && currentItem.quantity > 1) {
      updateQuantity(productId, currentItem.quantity - 1)
    } else {
      updateQuantity(productId, 0)
    }
  }

  const getProductQuantity = (productId: string | number) => {
    const item = items.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || "")
    return matchesSearch && matchesPrice && matchesBrand
  })

  // Get unique brands from products
  const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))]

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return (b.rating || 0) - (a.rating || 0)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

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
              <h1 className="text-xl font-bold text-green-800">{category?.name || "Loading..."}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-600 text-xs">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
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
                  <Slider value={priceRange} onValueChange={setPriceRange} max={50} step={0.5} className="mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Brands</label>
                  <div className="space-y-2">
                    {availableBrands.map((brand) => (
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
                    setPriceRange([0, 50])
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
                      {product.originalPrice && product.originalPrice > product.price && (
                        <Badge className="absolute top-2 left-2 bg-green-600">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
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
                      {product.brand && <p className="text-xs text-gray-600 mb-2">{product.brand}</p>}
                      {product.rating && (
                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-bold text-green-600">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 pt-0">
                      {product.inStock ? (
                        getProductQuantity(product.id) > 0 ? (
                          <div className="flex items-center justify-between w-full">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-green-600 text-green-600 bg-transparent"
                              onClick={() => removeFromCart(product.id)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-semibold text-green-600">{getProductQuantity(product.id)}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-green-600 text-green-600 bg-transparent"
                              onClick={() => addToCart(product)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            className="w-full bg-green-600 hover:bg-green-700 text-sm"
                            onClick={() => addToCart(product)}
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
          <Link href="/cart">
            <Button className="bg-green-600 hover:bg-green-700 rounded-full h-14 w-14 shadow-lg">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                  {getTotalItems()}
                </Badge>
              </div>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
