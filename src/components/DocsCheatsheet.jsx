import React, { useState } from 'react';
import { CHEATSHEETS } from '../data/cheatsheet';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  Play, 
  Tag, 
  ExternalLink,
  Code2,
  Terminal,
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function DocsCheatsheet({ onTryInSandbox }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const categories = ['all', ...CHEATSHEETS.map(c => c.category)];

  const filteredCategories = CHEATSHEETS.map(cat => {
    const matchingItems = cat.items.filter(item => {
      const matchSearch = searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });

    return {
      ...cat,
      items: matchingItems
    };
  }).filter(cat => {
    if (selectedCategory !== 'all' && cat.category !== selectedCategory) return false;
    return cat.items.length > 0;
  });

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(id);
    sounds.playCoin();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Frappe & ERPNext API Pulse & Cheatsheets</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
              v14 / v15 Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Instant syntax references, real-world copyable code blocks, and one-click sandbox testing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search API (e.g. frm.add_custom_button, db.get_value)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => { sounds.playClick(); setSelectedCategory(cat); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all capitalize ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'All Categories' : cat}
          </button>
        ))}
      </div>

      {/* Cheatsheet Categories & Cards */}
      <div className="space-y-8">
        {filteredCategories.map((cat, cIdx) => (
          <div key={cIdx} className="space-y-4">
            
            {/* Category Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Code2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                {cat.category}
              </h3>
              <span className="text-xs text-slate-500">({cat.items.length} Methods)</span>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cat.items.map((item, iIdx) => {
                const itemKey = `${cIdx}-${iIdx}`;
                const isCopied = copiedIndex === itemKey;

                return (
                  <div 
                    key={iIdx}
                    className="glass-panel p-5 space-y-3 flex flex-col justify-between hover:border-blue-500/40 transition-all"
                  >
                    <div>
                      {/* Title & Tags */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold font-mono text-blue-300">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Syntax snippet */}
                      <div className="mt-2.5 p-2 bg-slate-950/80 rounded border border-slate-800 font-mono text-[11px] text-purple-300 overflow-x-auto">
                        {item.syntax}
                      </div>

                      {/* Practical Example */}
                      {item.example && (
                        <div className="mt-2.5 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            Example Code:
                          </span>
                          <pre className="p-2.5 bg-slate-950 rounded-lg text-slate-200 font-mono text-[11px] overflow-x-auto border border-slate-800/80">
                            {item.example}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Actions footer */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => handleCopy(item.example || item.syntax, itemKey)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                      </button>

                      {item.example && (
                        <button
                          onClick={() => {
                            sounds.playClick();
                            onTryInSandbox(item.example);
                          }}
                          className="px-3 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Try in Sandbox</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
