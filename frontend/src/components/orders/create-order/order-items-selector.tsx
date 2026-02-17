'use client';

import { useState, useEffect } from 'react';
import { productService } from '@/services/product-service';
import { Product, PlateType } from '@/dto/product.dto';
import { OrderItemRequest } from '@/dto/order.dto';
import { useAuthStore } from '@/store/use-auth-store';
import { toast } from 'sonner';

interface OrderItemsSelectorProps {
  onItemsChange: (items: OrderItemRequest[]) => void;
}

export function OrderItemsSelector({ onItemsChange }: OrderItemsSelectorProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        toast.error('فشل تحميل المنتجات');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>جاري تحميل المنتجات...</div>;

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-white shadow-sm">
      <h3 className="font-bold text-lg border-b pb-2">2. المنتجات</h3>
      <p className="text-gray-500 text-sm">قائمة المنتجات ستكون هنا...</p>
      {/* Implementation simplified for initial skeleton */}
    </div>
  );
}
