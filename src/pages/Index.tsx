"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Layout from '@/components/Layout';
import { PlusCircleIcon } from 'lucide-react'; // Using PlusCircleIcon for Add Variation
import VariationInput from '@/components/VariationInput';

type Currency = "USD" | "CNY" | "EUR" | "GBP";

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

const categories = [
  "Eletrónicos",
  "Vestuário",
  "Calçado",
  "Acessórios",
  "Casa e Decoração",
  "Beleza e Saúde",
  "Brinquedos e Jogos",
  "Desporto e Lazer",
  "Automóvel",
  "Alimentos e Bebidas",
  "Livros e Papelaria",
  "Ferramentas",
  "Outros"
];

const Index = () => {
  const navigate = useNavigate();

  const [productName, setProductName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [currency, setCurrency] = useState<Currency>("USD");
  const [variations, setVariations] = useState<Variation[]>([
    { id: crypto.randomUUID(), name: '', unitPrice: '', quantity: '', totalWeight: '', totalWeightUnit: 'gramas', freightPerUnit: '', optionalExtraCost: '', profitMargin: 30 } // Default profit margin 30%
  ]);
  const [exchangeRateKz, setExchangeRateKz] = useState<number | ''>(() => {
    const savedRate = localStorage.getItem('defaultExchangeRateKz');
    return savedRate ? parseFloat(savedRate) : '';
  });
  const [extraGlobalFees, setExtraGlobalFees] = useState<number | ''>('');
  const [vatPercentage, setVatPercentage] = useState<number | ''>(16);

  useEffect(() => {
    if (typeof exchangeRateKz === 'number' && !isNaN(exchangeRateKz)) {
      localStorage.setItem('defaultExchangeRateKz', exchangeRateKz.toString());
    }
  }, [exchangeRateKz]);

  const addVariation = () => {
    setVariations([...variations, { id: crypto.randomUUID(), name: '', unitPrice: '', quantity: '', totalWeight: '', totalWeightUnit: 'gramas', freightPerUnit: '', optionalExtraCost: '', profitMargin: 30 }]); // Default profit margin 30%
  };

  const removeVariation = (id: string) => {
    setVariations(variations.filter(v => v.id !== id));
  };

  const handleVariationChange = (id: string, field: keyof Variation, value: string | number) => {
    setVariations(variations.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleCalculate = () => {
    const rateKz = parseFloat(exchangeRateKz as string || '0');
    const globalFees = parseFloat(extraGlobalFees as string || '0');
    const vat = parseFloat(vatPercentage as string || '0');

    if (rateKz <= 0 || isNaN(rateKz)) {
      toast.error("A taxa de câmbio deve ser um número positivo.");
      return;
    }
    if (globalFees < 0 || isNaN(globalFees)) {
      toast.error("As taxas globais extras devem ser um número válido.");
      return;
    }
    if (vat < 0 || isNaN(vat)) {
      toast.error("A taxa de IVA deve ser um número válido.");
      return;
    }

    const calculatedVariations = variations.map(variation => {
      const unitPrice = parseFloat(variation.unitPrice as string || '0');
      const quantity = parseFloat(variation.quantity as string || '0');
      let totalWeight = parseFloat(variation.totalWeight as string || '0'); // Weight is now informational
      const freightPerUnit = parseFloat(variation.freightPerUnit as string || '0');
      const optionalExtraCost = parseFloat(variation.optionalExtraCost as string || '0');
      const profitMargin = parseFloat(variation.profitMargin as string || '0'); // Get profit margin from variation

      if (isNaN(unitPrice) || isNaN(quantity) || isNaN(freightPerUnit) || isNaN(optionalExtraCost) || isNaN(profitMargin)) {
        toast.error(`Por favor, insira números válidos para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}'.`);
        return null;
      }
      if (quantity <= 0) {
        toast.error(`A quantidade para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}' deve ser maior que zero.`);
        return null;
      }
      if (freightPerUnit < 0) {
        toast.error(`O frete por unidade para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}' não pode ser negativo.`);
        return null;
      }
      if (optionalExtraCost < 0) {
        toast.error(`O custo extra para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}' não pode ser negativo.`);
        return null;
      }
      if (profitMargin < 0) {
        toast.error(`A margem de lucro para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}' não pode ser negativa.`);
        return null;
      }

      // Validation for totalWeight (informational only, not for freight calculation)
      if (totalWeight < 0) {
        toast.error(`O peso para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}' não pode ser negativo.`);
        return null;
      }
      if (variation.totalWeightUnit === "gramas" && totalWeight > 10000) {
        toast.warning(`O peso em gramas para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}' é superior a 10.000g (10kg). Verifique se a unidade está correta.`);
      }
      if (variation.totalWeightUnit === "kg" && totalWeight > 200) {
        toast.warning(`O peso em kg para a variação '${variation.name || `Variação ${variations.findIndex(v => v.id === variation.id) + 1}`}' é superior a 200kg. Verifique se a unidade está correta.`);
      }

      // Store original weight and unit for display in results
      const originalTotalWeight = variation.totalWeight;
      const originalTotalWeightUnit = variation.totalWeightUnit;

      // Convert totalWeight to KG if unit is grams for informational display
      let totalWeightInKg = totalWeight;
      if (variation.totalWeightUnit === "gramas") {
        totalWeightInKg = totalWeight / 1000;
      }

      const productCost = unitPrice * quantity * rateKz;
      const freightCost = freightPerUnit * quantity; // Freight per unit * quantity
      const totalCost = productCost + freightCost + optionalExtraCost;
      const suggestedSellingPrice = totalCost * (1 + profitMargin / 100); // Use variation's profit margin
      const profit = suggestedSellingPrice - totalCost;

      const vatAmountPerUnit = suggestedSellingPrice * (vat / 100);
      const finalSellingPriceWithVATPerUnit = suggestedSellingPrice + vatAmountPerUnit;

      return {
        ...variation,
        productCost,
        freightCost,
        totalCost,
        suggestedSellingPrice,
        profit,
        vatAmountPerUnit,
        finalSellingPriceWithVATPerUnit,
        originalTotalWeight, // Pass original weight
        originalTotalWeightUnit, // Pass original unit
        totalWeightInKg, // Pass converted weight in kg
      };
    }).filter(Boolean);

    if (calculatedVariations.length !== variations.length) {
      return;
    }

    const totalInvestment = calculatedVariations.reduce((sum, v) => sum + v.totalCost, 0) + globalFees;
    const totalSellingValueBeforeVAT = calculatedVariations.reduce((sum, v) => sum + (v.suggestedSellingPrice * (v.quantity as number)), 0);
    const totalVATCollected = calculatedVariations.reduce((sum, v) => sum + (v.vatAmountPerUnit * (v.quantity as number)), 0);
    const totalSellingValueWithVAT = totalSellingValueBeforeVAT + totalVATCollected;
    const totalEstimatedProfit = totalSellingValueBeforeVAT - totalInvestment;

    navigate('/results', {
      state: {
        productName,
        category,
        currency,
        calculatedVariations,
        totalInvestment,
        totalSellingValueBeforeVAT,
        totalVATCollected,
        totalSellingValueWithVAT,
        totalEstimatedProfit,
        exchangeRateKz: rateKz,
        extraGlobalFees,
        vatPercentage: vat,
      },
    });
  };

  return (
    <Layout>
      <Card className="w-full max-w-md mx-auto shadow-lg mb-6 border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 rounded-t-lg">
          <CardTitle className="text-center text-xl text-gray-800 dark:text-gray-100">Detalhes do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-4">
          {/* Product Setup */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-gray-700 dark:text-gray-300">Nome do Produto</Label>
            <Input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ex: Smartphone X"
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">Categoria (Opcional)</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Global Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Label htmlFor="currency" className="text-gray-700 dark:text-gray-300">Moeda Base do Produto</Label>
            <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
              <SelectTrigger id="currency" className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="CNY">CNY</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>

            <Label htmlFor="exchangeRateKz" className="text-gray-700 dark:text-gray-300">Taxa de Câmbio (Kz por {currency})</Label>
            <Input
              id="exchangeRateKz"
              type="number"
              value={exchangeRateKz}
              onChange={(e) => setExchangeRateKz(parseFloat(e.target.value) || '')}
              placeholder="0.00"
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />

            <Label htmlFor="extraGlobalFees" className="text-gray-700 dark:text-gray-300">Taxas Globais Extras (Kz, opcional)</Label>
            <Input
              id="extraGlobalFees"
              type="number"
              value={extraGlobalFees}
              onChange={(e) => setExtraGlobalFees(parseFloat(e.target.value) || '')}
              placeholder="0.00"
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />

            <Label htmlFor="vatPercentage" className="text-gray-700 dark:text-gray-300">Taxa de IVA (%)</Label>
            <Input
              id="vatPercentage"
              type="number"
              value={vatPercentage}
              onChange={(e) => setVatPercentage(parseFloat(e.target.value) || '')}
              placeholder="16"
              className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Dynamic Variations List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Variações do Produto</h2>
            <div className="max-h-96 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
              {variations.map((variation, index) => (
                <VariationInput
                  key={variation.id}
                  variation={variation}
                  index={index}
                  currency={currency}
                  onChange={handleVariationChange}
                  onRemove={removeVariation}
                />
              ))}
            </div>
            <Button onClick={addVariation} variant="outline" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center">
              <PlusCircleIcon className="h-5 w-5 mr-2" /> Adicionar Variação
            </Button>
          </div>

          <Button onClick={handleCalculate} className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-3 px-4 rounded-md text-lg">
            Calcular
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-md mx-auto shadow-lg border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 rounded-t-lg">
          <CardTitle className="text-center text-xl text-gray-800 dark:text-gray-100">Dicas e Sugestões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300 p-4">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Verifique as Taxas de Câmbio:</strong> As taxas de câmbio flutuam. Use sempre a taxa mais atualizada para obter cálculos precisos.
            </li>
            <li>
              <strong>Peso Real vs. Peso Volumétrico:</strong> Para o frete, as transportadoras podem cobrar pelo peso real ou pelo peso volumétrico (o que for maior). Certifique-se de usar o peso correto.
            </li>
            <li>
              <strong>Taxas Alfandegárias:</strong> Lembre-se de que podem existir taxas alfandegárias e impostos de importação adicionais que não estão incluídos nesta calculadora. Consulte as regulamentações locais.
            </li>
            <li>
              <strong>Seguro de Carga:</strong> Considere adicionar seguro à sua carga para proteger contra perdas ou danos durante o transporte.
            </li>
            <li>
              <strong>Negocie com Fornecedores:</strong> Tente negociar o preço do produto e as taxas de frete com os seus fornecedores para otimizar os custos.
            </li>
          </ul>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Index;