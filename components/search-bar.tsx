"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { debounce } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = "Search for products...", className }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useAppStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounced search to avoid too many updates
  const debouncedSearch = debounce((query: string) => {
    setSearchQuery(query)
  }, 300)

  useEffect(() => {
    debouncedSearch(localQuery)
  }, [localQuery, debouncedSearch])

  const handleClear = () => {
    setLocalQuery("")
    setSearchQuery("")
  }

  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="pl-10 pr-10 py-2 w-full border-green-200 focus:border-green-500"
      />
      {localQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
          onClick={handleClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
