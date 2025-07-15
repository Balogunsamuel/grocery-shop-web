'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Category {
  _id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  price: number;
  original_price: number;
  category: string;
  category_id: string;
  brand: string;
  description: string;
  weight: string;
  origin: string;
  stock_count: number;
  in_stock: boolean;
  image: string;
  images: string[];
  features: string[];
  nutrition_facts: {
    calories: number;
    carbs: string;
    fiber: string;
    sugar: string;
    protein: string;
    fat: string;
  };
  tags: string[];
  sku: string;
}

export function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    original_price: 0,
    category: '',
    category_id: '',
    brand: '',
    description: '',
    weight: '',
    origin: '',
    stock_count: 0,
    in_stock: true,
    image: '/placeholder.svg?height=300&width=300',
    images: ['/placeholder.svg?height=300&width=300'],
    features: [],
    nutrition_facts: {
      calories: 0,
      carbs: '0g',
      fiber: '0g',
      sugar: '0g',
      protein: '0g',
      fat: '0g',
    },
    tags: [],
    sku: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate SKU when name or brand changes
      if (field === 'name' || field === 'brand') {
        const name = field === 'name' ? value as string : prev.name;
        const brand = field === 'brand' ? value as string : prev.brand;
        if (name && brand) {
          const sku = `${brand.replace(/\s+/g, '').substring(0, 4).toUpperCase()}-${name.replace(/\s+/g, '').substring(0, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
          updated.sku = sku;
        }
      }
      
      // Set category_id when category changes
      if (field === 'category') {
        const selectedCategory = categories.find(cat => cat.name === value);
        if (selectedCategory) {
          updated.category_id = selectedCategory._id;
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure all required fields have default values
      const productData = {
        ...formData,
        images: formData.images.length > 0 ? formData.images : [formData.image],
        nutrition_facts: {
          calories: formData.nutrition_facts.calories || 0,
          carbs: formData.nutrition_facts.carbs || '0g',
          fiber: formData.nutrition_facts.fiber || '0g',
          sugar: formData.nutrition_facts.sugar || '0g',
          protein: formData.nutrition_facts.protein || '0g',
          fat: formData.nutrition_facts.fat || '0g',
        },
        features: formData.features.length > 0 ? formData.features : [],
        tags: formData.tags.length > 0 ? formData.tags : ['new'],
        sku: formData.sku || `PROD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      };

      const response = await apiClient.createProduct(productData);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          price: 0,
          original_price: 0,
          category: '',
          category_id: '',
          brand: '',
          description: '',
          weight: '',
          origin: '',
          stock_count: 0,
          in_stock: true,
          image: '/placeholder.svg?height=300&width=300',
          images: ['/placeholder.svg?height=300&width=300'],
          features: [],
          nutrition_facts: {
            calories: 0,
            carbs: '0g',
            fiber: '0g',
            sugar: '0g',
            protein: '0g',
            fat: '0g',
          },
          tags: [],
          sku: '',
        });
      }
    } catch (error) {
      console.error('Failed to create product:', error);
      toast({
        title: 'Error',
        description: 'Failed to create product. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                min="0"
                value={formData.original_price}
                onChange={(e) => handleInputChange('original_price', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight/Size *</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="e.g., 1 lb, 500g, 12 oz"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock_count">Stock Count *</Label>
              <Input
                id="stock_count"
                type="number"
                min="0"
                value={formData.stock_count}
                onChange={(e) => handleInputChange('stock_count', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
                placeholder="e.g., Local Farm, California"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.nutrition_facts.calories}
                onChange={(e) => handleInputChange('nutrition_facts', {
                  ...formData.nutrition_facts,
                  calories: parseInt(e.target.value) || 0
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs</Label>
              <Input
                id="carbs"
                value={formData.nutrition_facts.carbs}
                onChange={(e) => handleInputChange('nutrition_facts', {
                  ...formData.nutrition_facts,
                  carbs: e.target.value
                })}
                placeholder="25g"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="protein">Protein</Label>
              <Input
                id="protein"
                value={formData.nutrition_facts.protein}
                onChange={(e) => handleInputChange('nutrition_facts', {
                  ...formData.nutrition_facts,
                  protein: e.target.value
                })}
                placeholder="5g"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiber">Fiber</Label>
              <Input
                id="fiber"
                value={formData.nutrition_facts.fiber}
                onChange={(e) => handleInputChange('nutrition_facts', {
                  ...formData.nutrition_facts,
                  fiber: e.target.value
                })}
                placeholder="3g"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sugar">Sugar</Label>
              <Input
                id="sugar"
                value={formData.nutrition_facts.sugar}
                onChange={(e) => handleInputChange('nutrition_facts', {
                  ...formData.nutrition_facts,
                  sugar: e.target.value
                })}
                placeholder="2g"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fat">Fat</Label>
              <Input
                id="fat"
                value={formData.nutrition_facts.fat}
                onChange={(e) => handleInputChange('nutrition_facts', {
                  ...formData.nutrition_facts,
                  fat: e.target.value
                })}
                placeholder="1g"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags.join(', ')}
              onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
              placeholder="organic, fresh, healthy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sku">SKU (auto-generated)</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              placeholder="Will be auto-generated"
              className="bg-gray-50"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => handleInputChange('in_stock', checked)}
              />
              <Label htmlFor="in_stock">In Stock</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}