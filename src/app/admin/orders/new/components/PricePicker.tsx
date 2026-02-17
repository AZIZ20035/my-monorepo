'use client';

import { useState } from 'react';
import { Product } from '@/dto/product.dto';
import {
  X,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export interface CartItem {
  id: string;
  productId: number;
  productName: string;
  productPriceId: number;
  sizeName: string;
  portionName?: string;
  plateTypeId?: number;
  plateTypeName?: string;
  price: number;
  quantity: number;
}

interface PricePickerProps {
  product: Product;
  onAdd: (item: Omit<CartItem, 'id'>) => void;
  onClose: () => void;
}

export function PricePicker({ product, onAdd, onClose }: PricePickerProps) {
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(
    product.prices.length === 1 ? product.prices[0].productPriceId : null
  );
  const [selectedPlateTypeId, setSelectedPlateTypeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const selectedPrice = product.prices.find(p => p.productPriceId === selectedPriceId);

  const handleAdd = () => {
    if (!selectedPrice) return;

      onAdd({
      productId: product.productId,
      productName: product.nameAr,
      productPriceId: selectedPrice.productPriceId,
      sizeName: selectedPrice.sizeName,
      portionName: selectedPrice.portionName,
      plateTypeId: selectedPlateTypeId || undefined,
      plateTypeName: selectedPlateTypeId === 1 ? 'صحن عادي' : selectedPlateTypeId === 2 ? 'صحن ملكي' : undefined,
      price: selectedPrice.price,
      quantity,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200"
      >
        {/* Header - Simple & Clean */}
        <div className="p-8 pb-6 border-b border-slate-50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{product.categoryName}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                {product.isActive ? (
                  <span className="text-[10px] font-black text-emerald-600">متوفر</span>
                ) : (
                  <span className="text-[10px] font-black text-red-500">غير متوفر</span>
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900 font-cairo">{product.nameAr}</h2>
            </div>
            
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 pt-6 space-y-8">
          
          {/* Variant Selection */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              الحجم / الوزن
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {product.prices.map((price) => {
                const isSelected = selectedPriceId === price.productPriceId;
                return (
                  <button
                    key={price.productPriceId}
                    onClick={() => setSelectedPriceId(price.productPriceId)}
                    className={`relative p-5 rounded-2xl border-2 transition-all text-right group cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 shadow-lg shadow-slate-900/10'
                        : 'bg-white border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black transition-colors ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {price.sizeName}
                        </span>
                        {price.portionName && (
                          <span className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                            {price.portionName}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-baseline gap-1">
                        <span className={`text-xl font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {price.price}
                        </span>
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white/40' : 'text-slate-400'}`}>
                          ر.س
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plate Options - Simplified */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              نوع العرض
            </h3>
            <div className="flex gap-3">
              {[
                { id: 1, name: 'صحن عادي' },
                { id: 2, name: 'صحن ملكي' }
              ].map(plate => {
                const isSelected = selectedPlateTypeId === plate.id;
                return (
                  <button
                    key={plate.id}
                    onClick={() => setSelectedPlateTypeId(plate.id)}
                    className={`flex-1 p-4 rounded-xl border-2 font-black text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-sky-700'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {plate.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer - Professional & Clean */}
          <div className="pt-6 border-t border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-900 hover:text-red-500 transition-all font-black text-lg cursor-pointer"
              >
                -
              </button>
              <span className="text-xl font-black w-8 text-center text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-900 hover:text-sky-500 transition-all font-black text-lg cursor-pointer"
              >
                +
              </button>
            </div>

            <Button
              onClick={handleAdd}
              disabled={!selectedPriceId}
              className="h-12 flex-1 sm:flex-none sm:px-8 rounded-xl bg-slate-900 text-white font-black text-sm gap-2 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ShoppingBag size={18} />
              <span>إضافة للسلة</span>
              <span className="opacity-30 mx-1">|</span>
              <span className="text-sky-400">{selectedPrice ? (selectedPrice.price * quantity) : 0} ر.س</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const orderStatusLabels = {
    pending: 'قيد الانتظار',
    preparing: 'جاري التجهيز',
    ready: 'جاهز للاستلام',
    delivering: 'جاري التوصيل',
    delivered: 'تم التوصيل',
    cancelled: 'تم الإلغاء',
    confirmed: 'تم التأكيد',
  };
