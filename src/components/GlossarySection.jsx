import React, { useState } from 'react';
import { Layers, Search, Filter, BookOpen } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossaryData';

export default function GlossarySection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  const categories = ['Tümü', ...new Set(GLOSSARY_TERMS.map(item => item.category))];

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      {/* Başlık Alanı */}
      <div>
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Teknik Sözlük & Hızlı Referans</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Oyun Programlama & Tasarım Sözlüğü
        </h1>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">
          Oyun geliştirme literatüründe en sık karşılaşılan terimler, matematiksel formüller ve mimari tanımlar.
        </p>
      </div>

      {/* Arama & Kategori Filtresi */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Terim veya tanım ara (örn: Lerp, Raycast, FSM, Draw call)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
        </div>

        {/* Kategori Hapları */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terimler Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((term, index) => (
          <div
            key={index}
            className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl transition space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base font-mono group-hover:text-indigo-300 transition">
                {term.term}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                {term.category}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {term.definition}
            </p>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-12 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800">
          <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600" />
          <p className="text-xs">Aramanızla eşleşen bir terim bulunamadı.</p>
        </div>
      )}
    </div>
  );
}
