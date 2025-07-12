"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Star, Heart, Share2, Plus, Minus, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const product = {
  id: 1,
  name: "Fresh Organic Apples",
  price: 4.99,
  originalPrice: 6.99,
  images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
  rating: 4.5,
  reviewCount: 128,
  category: "Fruits",
  brand: "Organic Farm",
  inStock: true,
  stockCount: 24,
  description:
    "Premium quality organic apples sourced directly from certified organic farms. These crisp, sweet apples are perfect for snacking, baking, or adding to your favorite recipes. Rich in fiber, vitamins, and antioxidants.",
  features: [
    "100% Organic certified",
    "Locally sourced",
    "No pesticides or chemicals",
    "Fresh picked daily",
    "Rich in vitamins and fiber",
  ],
  nutritionFacts: {
    calories: 95,
    carbs: "25g",
    fiber: "4g",
    sugar: "19g",
    protein: "0.5g",
    fat: "0.3g",
  },
}

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing quality! Super fresh and crispy. Will definitely order again.",
    date: "2 days ago",
    verified: true,
  },
  {
    id: 2,
    name: "Mike Chen",
    rating: 4,
    comment: "Good apples, arrived fresh. Packaging could be better but overall satisfied.",
    date: "1 week ago",
    verified: true,
  },
  {
    id: 3,
    name: "Emma Davis",
    rating: 5,
    comment: "Best organic apples I've had! Perfect for my kids' lunch boxes.",
    date: "2 weeks ago",
    verified: true,
  },
]

const relatedProducts = [
  { id: 2, name: "Premium Avocados", price: 3.49, image: "/placeholder.svg", rating: 4.8 },
  { id: 3, name: "Organic Bananas", price: 2.99, image: "/placeholder.svg", rating: 4.4 },
  { id: 4, name: "Fresh Oranges", price: 4.49, image: "/placeholder.svg", rating: 4.3 },
  { id: 5, name: "Red Strawberries", price: 5.99, image: "/placeholder.svg", rating: 4.6 },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const addToCart = () => {
    // Add to cart logic
    console.log(`Added ${quantity} items to cart`)
  }

  const ratingDistribution = [
    { stars: 5, count: 89, percentage: 70 },
    { stars: 4, count: 25, percentage: 20 },
    { stars: 3, count: 10, percentage: 8 },
    { stars: 2, count: 3, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/category/1">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-lg font-semibold text-green-800 truncate">{product.name}</h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Badge className="absolute top-4 left-4 bg-green-600">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </Badge>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-green-600" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant="outline">{product.brand}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">${product.price}</span>
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
              <Badge className="bg-red-100 text-red-800">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </Badge>
            </div>

            <div className="flex items-center space-x-2 text-sm">
              <span className={`font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
              {product.inStock && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{product.stockCount} items available</span>
                </>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={addToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
                <Button variant="outline" className="px-6 bg-transparent">
                  Buy Now
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="flex items-center space-x-2 text-sm">
                <Truck className="h-4 w-4 text-green-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Quality Guarantee</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <RotateCcw className="h-4 w-4 text-green-600" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <h3 className="font-semibold mb-3">Key Features:</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Nutrition Facts (per 100g)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{product.nutritionFacts.calories}</div>
                      <div className="text-sm text-gray-600">Calories</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{product.nutritionFacts.carbs}</div>
                      <div className="text-sm text-gray-600">Carbs</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{product.nutritionFacts.fiber}</div>
                      <div className="text-sm text-gray-600">Fiber</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{product.nutritionFacts.sugar}</div>
                      <div className="text-sm text-gray-600">Sugar</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{product.nutritionFacts.protein}</div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{product.nutritionFacts.fat}</div>
                      <div className="text-sm text-gray-600">Fat</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold">Rating Overview</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-green-600">{product.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">{product.reviewCount} reviews</div>
                    </div>

                    <div className="space-y-2">
                      {ratingDistribution.map((rating) => (
                        <div key={rating.stars} className="flex items-center space-x-2 text-sm">
                          <span className="w-8">{rating.stars}★</span>
                          <Progress value={rating.percentage} className="flex-1" />
                          <span className="w-8 text-gray-600">{rating.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.name}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                <Card className="hover:shadow-lg transition-shadow border-green-100">
                  <CardHeader className="p-0">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600 ml-1">{relatedProduct.rating}</span>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">${relatedProduct.price}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
