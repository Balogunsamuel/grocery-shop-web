'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CategoryFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
}

const colorOptions = [
  { value: 'bg-red-100 text-red-800', label: 'Red' },
  { value: 'bg-orange-100 text-orange-800', label: 'Orange' },
  { value: 'bg-yellow-100 text-yellow-800', label: 'Yellow' },
  { value: 'bg-green-100 text-green-800', label: 'Green' },
  { value: 'bg-blue-100 text-blue-800', label: 'Blue' },
  { value: 'bg-purple-100 text-purple-800', label: 'Purple' },
  { value: 'bg-pink-100 text-pink-800', label: 'Pink' },
  { value: 'bg-gray-100 text-gray-800', label: 'Gray' },
];

const iconOptions = [
  { value: '🍎', label: 'Apple (🍎)' },
  { value: '🥕', label: 'Carrot (🥕)' },
  { value: '🥛', label: 'Milk (🥛)' },
  { value: '🥩', label: 'Meat (🥩)' },
  { value: '🍞', label: 'Bread (🍞)' },
  { value: '🥤', label: 'Beverage (🥤)' },
  { value: '🍿', label: 'Snacks (🍿)' },
  { value: '🧊', label: 'Frozen (🧊)' },
  { value: '🧴', label: 'Household (🧴)' },
  { value: '🍯', label: 'Pantry (🍯)' },
  { value: '🍕', label: 'Prepared (🍕)' },
  { value: '🥗', label: 'Organic (🥗)' },
];

export function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    icon: '🍎',
    color: 'bg-red-100 text-red-800',
    is_active: true,
  });

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiClient.createCategory(formData);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: '',
          description: '',
          icon: '🍎',
          color: 'bg-red-100 text-red-800',
          is_active: true,
        });
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      toast({
        title: 'Error',
        description: 'Failed to create category. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="e.g., Fruits, Vegetables"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the category"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon *</Label>
            <Select value={formData.icon} onValueChange={(value) => handleInputChange('icon', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color Theme *</Label>
            <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${option.value.replace('text-', 'bg-').replace('-800', '-500')}`}></div>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{formData.icon}</div>
              <div>
                <div className="font-medium">{formData.name || 'Category Name'}</div>
                <div className={`inline-block px-2 py-1 rounded text-xs ${formData.color}`}>
                  {formData.description || 'Description'}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}