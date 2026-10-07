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
import { useTheme } from '../context/ThemeContext';

export default function DocsCheatsheet({ onTryInSandbox }) {
  const { isDark } = useTheme();
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
      <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Frappe & ERPNext API Pulse & Cheatsheets</span>
            </h2>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              isDark ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              v14 / v15 Ready
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Instant syntax references, real-world copyable code blocks, and one-click sandbox testing.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search API (e.g. frm.add_custom_button, db.get_value)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full rounded-lg pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 border ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500' : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => { sounds.playClick(); setSelectedCategory(cat); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all capitalize cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : (isDark ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs')
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
            <div className={`flex items-center gap-2 border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <Code2 className="w-4 h-4 text-purple-500" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {cat.category}
              </h3>
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>({cat.items.length} Methods)</span>
            </div>

            {/* Methods Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {cat.items.map((item, iIdx) => {
                const itemKey = `${cIdx}-${iIdx}`;
                const isCopied = copiedIndex === itemKey;

                return (
                  <div 
                    key={iIdx}
                    className={`p-5 space-y-3 flex flex-col justify-between rounded-2xl border transition-all ${
                      isDark 
                        ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/40' 
                        : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Title & Tags */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold font-mono text-blue-600 dark:text-blue-400">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx}
                              className={`px-1.5 py-0.5 rounded text-[10px] border ${
                                isDark ? 'bg-slate-800 text-slate-400 border-slate-700/60' : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {item.description}
                      </p>

                      {/* Syntax snippet */}
                      <div className={`mt-2.5 p-2 rounded border font-mono text-[11px] overflow-x-auto ${
                        isDark ? 'bg-slate-950/80 border-slate-800 text-purple-300' : 'bg-purple-50/70 border-purple-200 text-purple-900 font-semibold'
                      }`}>
                        {item.syntax}
                      </div>

                      {/* Practical Example */}
                      {item.example && (
                        <div className="mt-2.5 space-y-1">
                          <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Example Code:
                          </span>
                          <pre className="p-2.5 bg-[#090d18] text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto border border-slate-800/80">
                            {item.example}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Actions footer */}
                    <div className={`flex items-center justify-end gap-2 pt-2 border-t ${
                      isDark ? 'border-slate-800/60' : 'border-slate-100'
                    }`}>
                      <button
                        onClick={() => handleCopy(item.example || item.syntax, itemKey)}
                        className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy Code'}</span>
                      </button>

                      {item.example && (
                        <button
                          onClick={() => {
                            sounds.playClick();
                            onTryInSandbox(item.example);
                          }}
                          className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isDark 
                              ? 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border-blue-500/30' 
                              : 'bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border-blue-200 shadow-xs'
                          }`}
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
