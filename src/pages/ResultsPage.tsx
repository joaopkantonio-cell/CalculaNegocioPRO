"use client";

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from '@/components/Layout';
import { Share2Icon, FileTextIcon, FileSpreadsheetIcon } from 'lucide-react'; // Added icons for PDF/Excel
import { toast } from 'sonner';

interface CalculatedVariation {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  totalWeight: number; // This is the original input weight (informational)
  totalWeightUnit: "kg" | "gramas"; // This is the original input unit (informational)
  totalWeightInKg: number; // This is the normalized weight in kg (informational)
  freightPerUnit: number; // Freight cost per unit for this variation
  optionalExtraCost: number;
  profitMargin: number; // Profit margin per variation
  productCost: number;
  freightCost: number; // Calculated total freight for this variation
  totalCost: number;
  suggestedSellingPrice: number; // Preço antes do IVA
  profit: number; // Lucro antes do IVA
  vatAmountPerUnit: number; // IVA por unidade
  finalSellingPriceWithVATPerUnit: number; // Preço final com IVA
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    productName,
    category,
    currency,
    calculatedVariations,
    totalInvestment,
    totalSellingValueBeforeVAT,
    totalVATCollected,
    totalSellingValueWithVAT,
    totalEstimatedProfit,
    exchangeRateKz,
    extraGlobalFees,
    vatPercentage,
  } = location.state || {};

  if (!location.state || !calculatedVariations) {
    navigate('/');
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const shareResults = () => {
    let resultsText = `
*Calcula Negócio PRO - Resultados Detalhados:*

*Produto:* ${productName || 'N/A'}
${category ? `*Categoria:* ${category}\n` : ''}
*Moeda Base:* ${currency}
*Taxa de Câmbio:* 1 ${currency} = ${formatCurrency(exchangeRateKz)}
*Taxa de IVA:* ${vatPercentage}%
${extraGlobalFees > 0 ? `*Taxas Globais Extras:* ${formatCurrency(extraGlobalFees)}\n` : ''}

*Resumo por Variação:*
`;

    calculatedVariations.forEach((v: CalculatedVariation, index: number) => {
      resultsText += `
--- Variação ${v.name || (index + 1)} ---
  *Margem de Lucro:* ${v.profitMargin}%
  *Frete por Unidade:* ${formatCurrency(v.freightPerUnit)}
  *Peso (Info):* ${v.totalWeight} ${v.totalWeightUnit === 'gramas' ? 'g' : 'kg'} (${v.totalWeightInKg.toFixed(2)} kg)
  *Custo do Produto:* ${formatCurrency(v.productCost)}
  *Custo do Frete (Total):* ${formatCurrency(v.freightCost)}
  *Custo Total:* ${formatCurrency(v.totalCost)}
  *Preço de Venda (s/ IVA):* ${formatCurrency(v.suggestedSellingPrice)}
  *IVA (${vatPercentage}%):* ${formatCurrency(v.vatAmountPerUnit)}
  *Preço Final de Venda (c/ IVA):* ${formatCurrency(v.finalSellingPriceWithVATPerUnit)}
  *Lucro Estimado (s/ IVA):* ${formatCurrency(v.profit)}
`;
    });

    resultsText += `
*Totais Gerais:*
*Investimento Total:* ${formatCurrency(totalInvestment)}
*Valor Total de Venda (s/ IVA):* ${formatCurrency(totalSellingValueBeforeVAT)}
*IVA Total (${vatPercentage}%):* ${formatCurrency(totalVATCollected)}
*Valor Total de Venda (c/ IVA):* ${formatCurrency(totalSellingValueWithVAT)}
*Lucro Total Estimado (s/ IVA):* ${formatCurrency(totalEstimatedProfit)}

Calcule os seus próprios custos de negócio com o Calcula Negócio PRO!
    `.trim();

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(resultsText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExportPDF = () => {
    toast.info("A funcionalidade de exportar para PDF está em desenvolvimento.");
    // Implementação real de exportação para PDF seria mais complexa, possivelmente usando bibliotecas como jsPDF ou um serviço de backend.
  };

  const handleExportExcel = () => {
    toast.info("A funcionalidade de exportar para Excel está em desenvolvimento.");
    // Implementação real de exportação para Excel seria mais complexa, possivelmente usando bibliotecas como SheetJS ou um serviço de backend.
  };

  return (
    <Layout>
      <Card className="w-full max-w-md mx-auto shadow-lg border-gray-200 dark:border-gray-700">
        <CardHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <CardTitle className="text-center text-2xl">Resultados do Cálculo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
            <h2 className="text-xl font-bold mb-2">Detalhes do Produto</h2>
            <p className="text-base"><strong>Produto:</strong> {productName || 'N/A'}</p>
            {category && <p className="text-base"><strong>Categoria:</strong> {category}</p>}
            <p className="text-base"><strong>Moeda Base:</strong> {currency}</p>
            <p className="text-base"><strong>Taxa de Câmbio:</strong> 1 {currency} = {formatCurrency(exchangeRateKz)}</p>
            <p className="text-base"><strong>Taxa de IVA:</strong> {vatPercentage}%</p>
            {extraGlobalFees > 0 && <p className="text-base"><strong>Taxas Globais Extras:</strong> {formatCurrency(extraGlobalFees)}</p>}
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Resultados por Variação</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900">
            {calculatedVariations.map((v: CalculatedVariation, index: number) => (
              <div key={v.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-100">Variação: {v.name || `Variação ${index + 1}`}</h3>
                <div className="grid grid-cols-2 gap-1 text-sm text-gray-700 dark:text-gray-300">
                  <p>Margem de Lucro:</p><p className="text-right">{v.profitMargin}%</p>
                  <p>Frete por Unidade:</p><p className="text-right">{formatCurrency(v.freightPerUnit)}</p>
                  <p>Peso (Info):</p><p className="text-right">{v.totalWeight} {v.totalWeightUnit === 'gramas' ? 'g' : 'kg'} ({v.totalWeightInKg.toFixed(2)} kg)</p>
                  <p>Custo do Produto:</p><p className="text-right">{formatCurrency(v.productCost)}</p>
                  <p>Custo do Frete (Total):</p><p className="text-right">{formatCurrency(v.freightCost)}</p>
                  <p className="font-medium">Custo Total:</p><p className="text-right font-medium text-primary">{formatCurrency(v.totalCost)}</p>
                  <p className="font-medium">Preço de Venda (s/ IVA):</p><p className="text-right font-medium text-secondary">{formatCurrency(v.suggestedSellingPrice)}</p>
                  <p className="font-medium">IVA ({vatPercentage}%):</p><p className="text-right font-medium text-orange-500 dark:text-orange-400">{formatCurrency(v.vatAmountPerUnit)}</p>
                  <p className="font-medium">Preço Final de Venda (c/ IVA):</p><p className="text-right font-bold text-secondary">{formatCurrency(v.finalSellingPriceWithVATPerUnit)}</p>
                  <p className="font-medium">Lucro Estimado (s/ IVA):</p>
                  <p className={`text-right font-bold ${v.profit >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                    {formatCurrency(v.profit)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mt-6 mb-4 text-gray-800 dark:text-gray-100">Totais Gerais</h2>
          <div className="grid grid-cols-2 gap-2 text-lg p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-md text-gray-700 dark:text-gray-300">
            <p className="font-medium">Investimento Total:</p>
            <p className="text-right font-bold text-primary">{formatCurrency(totalInvestment)}</p>

            <p className="font-medium">Valor Total de Venda (s/ IVA):</p>
            <p className="text-right font-bold text-secondary">{formatCurrency(totalSellingValueBeforeVAT)}</p>

            <p className="font-medium">IVA Total ({vatPercentage}%):</p>
            <p className="text-right font-bold text-orange-500 dark:text-orange-400">{formatCurrency(totalVATCollected)}</p>

            <p className="font-medium">Valor Total de Venda (c/ IVA):</p>
            <p className="text-right font-bold text-secondary">{formatCurrency(totalSellingValueWithVAT)}</p>

            <p className="font-medium">Lucro Total Estimado (s/ IVA):</p>
            <p className={`text-right font-bold ${totalEstimatedProfit >= 0 ? 'text-secondary' : 'text-destructive'}`}>
              {formatCurrency(totalEstimatedProfit)}
            </p>
          </div>

          <div className="flex flex-col space-y-2 mt-6">
            <Button onClick={shareResults} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center">
              <Share2Icon className="mr-2 h-4 w-4" /> Partilhar no WhatsApp
            </Button>
            <Button onClick={handleExportPDF} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center">
              <FileTextIcon className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
            <Button onClick={handleExportExcel} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center">
              <FileSpreadsheetIcon className="mr-2 h-4 w-4" /> Exportar Excel
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700">
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ResultsPage;