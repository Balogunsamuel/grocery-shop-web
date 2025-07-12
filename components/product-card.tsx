"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Star, Plus, Minus, Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { useCartStore, useUserStore } from "@/lib/store"
import { formatPrice, calculateDiscount } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  showAddToCart?: boolean
}

export function ProductCard({ product, viewMode = "grid", showAddToCart = true }: ProductCardProps) {
  const { addItem, updateQuantity, items } = useCartStore()
  const { toggleWishlist, isInWishlist } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)

  const cartItem = items.find((item) => item.id === product.id)
  const isWishlisted = isInWishlist(product.id)

  const handleAddToCart = async () => {
    if (!product.inStock) return

    setIsLoading(true)
    try {
      addItem(product)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
    } catch (error) {
      console.error("Failed to add to cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity)
  }

  const handleWishlistToggle = () => {
    toggleWishlist(product.id)
  }

  const discount = calculateDiscount(product.originalPrice, product.price)

  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200 border-green-100 group",
        viewMode === "list" ? "flex flex-row" : "",
        !product.inStock && "opacity-75",
      )}
    >
      <CardHeader className={cn("p-0", viewMode === "list" ? "w-48 flex-shrink-0" : "")}>
        <div className="relative">
          <Link href={`/product/${product.id}`}>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={200}
              height={200}
              className={cn(
                "object-cover transition-transform group-hover:scale-105",
                viewMode === "list" ? "w-full h-32 rounded-l-lg" : "w-full h-40 rounded-t-lg",
              )}
            />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleWishlistToggle}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
          </Button>

          {discount > 0 && <Badge className="absolute top-2 left-2 bg-green-600">{discount}% OFF</Badge>}

          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <div className={cn(viewMode === "list" ? "flex flex-col flex-1" : "")}>
        <CardContent className={cn("p-4", viewMode === "list" ? "flex-1" : "")}>
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-green-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-gray-600 mb-2">{product.brand}</p>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600 ml-1">{product.rating}</span>
              <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
            </div>
            <Badge variant="secondary" className="ml-2 text-xs">
              {product.category}
            </Badge>
          </div>

          <div className="flex items-center space-x-2 mb-3">
            <span className="font-bold text-green-600">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>

          {product.stockCount <= 5 && product.inStock && (
            <p className="text-xs text-orange-600 mb-2">Only {product.stockCount} left in stock!</p>
          )}
        </CardContent>

        {showAddToCart && (
          <CardFooter className="p-4 pt-0">
            {product.inStock ? (
              cartItem && cartItem.quantity > 0 ? (
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-green-600 text-green-600 bg-transparent"
                    onClick={() => handleQuantityChange(cartItem.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="font-semibold text-green-600">{cartItem.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 border-green-600 text-green-600 bg-transparent"
                    onClick={() => handleQuantityChange(cartItem.quantity + 1)}
                    disabled={cartItem.quantity >= product.stockCount}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-sm"
                  onClick={handleAddToCart}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                      <span>Adding...</span>
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add to Cart
                    </>
                  )}
                </Button>
              )
            ) : (
              <Button disabled className="w-full text-sm">
                Out of Stock
              </Button>
            )}
          </CardFooter>
        )}
      </div>
    </Card>
  )
}
