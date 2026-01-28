"use client";

import React from 'react';
import { MadeWithDyad } from './made-with-dyad';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 font-sans">

      {/* Conteúdo principal */}
      <main className="flex-grow container mx-auto p-4 max-w-md">
        {children}
      </main>

      {/* Rodapé limpo (sem Dyad visível) */}
      <footer className="p-4 text-center">
        {/* Caso queira remover anúncios no futuro, pode apagar esta div */}
        <div className="bg-gray-200 dark:bg-gray-700 h-16 flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm mb-4 rounded-md">
          Espaço para Anúncio Google
        </div>

        <MadeWithDyad />
      </footer>

    </div>
  );
};

export default Layout;
