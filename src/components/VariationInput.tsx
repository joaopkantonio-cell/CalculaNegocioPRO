"use client";

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { XIcon } from 'lucide-react';

interface Variation {
  id: string;
  name: string;
  unitPrice: number | '';
  quantity: number | '';
  totalWeight: number | ''; // Now optional and informational
  totalWeightUnit: "kg" | "gramas"; // Now optional and informational
  freightPerUnit: number | ''; // Freight cost per unit for this variation
  optionalExtraCost: number | ''; // in Kz
  profitMargin: number | ''; // NEW: Profit margin per variation
}

interface VariationInputProps {
  variation: Variation;
  index: number;
  currency: string;
  onChange: (id: string, field: keyof Variation, value: string | number) => void;
  onRemove: (id: string) => void;
}

const VariationInput: React.FC<VariationInputProps> = ({ variation, index, currency, onChange, onRemove }) => {
  return (
    <Card className="p-4 border-t-2 border-gray-200 dark:border-gray-700 mt-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Variação {index + 1}</h3>
        <Button variant="destructive" size="sm" onClick={() => onRemove(variation.id)} className="bg-red-500 hover:bg-red-600 text-white">
          <XIcon className="h-4 w-4 mr-1" /> Remover
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`variation-name-${variation.id}`} className="text-gray-700 dark:text-gray-300">Nome da Variação</Label>
          <Input
            id={`variation-name-${variation.id}`}
            type="text"
            value={variation.name}
            onChange={(e) => onChange(variation.id, 'name', e.target.value)}
            placeholder="Ex: Tamanho P, Cor Azul"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`unit-price-${variation.id}`} className="text-gray-700 dark:text-gray-300">Preço Unitário ({currency})</Label>
          <Input
            id={`unit-price-${variation.id}`}
            type="number"
            value={variation.unitPrice}
            onChange={(e) => onChange(variation.id, 'unitPrice', parseFloat(e.target.value) || '')}
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`quantity-${variation.id}`} className="text-gray-700 dark:text-gray-300">Quantidade</Label>
          <Input
            id={`quantity-${variation.id}`}
            type="number"
            value={variation.quantity}
            onChange={(e) => onChange(variation.id, 'quantity', parseInt(e.target.value) || '')}
            placeholder="1"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`freight-per-unit-${variation.id}`} className="text-gray-700 dark:text-gray-300">Frete por Unidade (Kz)</Label>
          <Input
            id={`freight-per-unit-${variation.id}`}
            type="number"
            value={variation.freightPerUnit}
            onChange={(e) => onChange(variation.id, 'freightPerUnit', parseFloat(e.target.value) || '')}
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`optional-extra-cost-${variation.id}`} className="text-gray-700 dark:text-gray-300">Custo Extra Opcional (Kz)</Label>
          <Input
            id={`optional-extra-cost-${variation.id}`}
            type="number"
            value={variation.optionalExtraCost}
            onChange={(e) => onChange(variation.id, 'optionalExtraCost', parseFloat(e.target.value) || '')}
            placeholder="0.00"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`profit-margin-${variation.id}`} className="text-gray-700 dark:text-gray-300">Margem de Lucro (%)</Label> {/* NEW FIELD */}
          <Input
            id={`profit-margin-${variation.id}`}
            type="number"
            value={variation.profitMargin}
            onChange={(e) => onChange(variation.id, 'profitMargin', parseFloat(e.target.value) || '')}
            placeholder="30"
            className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="space-y-2 col-span-full">
          <Label htmlFor={`total-weight-${variation.id}`} className="text-gray-700 dark:text-gray-300">Peso (Opcional)</Label>
          <div className="flex gap-2">
            <Input
              id={`total-weight-${variation.id}`}
              type="number"
              value={variation.totalWeight}
              onChange={(e) => onChange(variation.id, 'totalWeight', parseFloat(e.target.value) || '')}
              placeholder="0.00"
              className="flex-grow border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <Select
              value={variation.totalWeightUnit}
              onValueChange={(value: "kg" | "gramas") => onChange(variation.id, 'totalWeightUnit', value)}
            >
              <SelectTrigger className="w-[100px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Unidade" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <SelectItem value="gramas">g</SelectItem>
                <SelectItem value="kg">kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VariationInput;