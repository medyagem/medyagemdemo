"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FAQPair {
  q: string;
  a: string;
}

interface FAQEditorProps {
  value: string; // JSON string
  onChange: (value: string) => void;
}

export default function FAQEditor({ value, onChange }: FAQEditorProps) {
  const [faqs, setFaqs] = useState<FAQPair[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Parse initial value
  useEffect(() => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) setFaqs(parsed);
      }
    } catch (e) {
      console.error("FAQ Parse Error");
    }
  }, []);

  // Update parent when faqs change
  const updateParent = (newList: FAQPair[]) => {
    setFaqs(newList);
    onChange(JSON.stringify(newList));
  };

  const addFaq = () => {
    const newList = [...faqs, { q: "", a: "" }];
    updateParent(newList);
    setOpenIndex(newList.length - 1);
  };

  const removeFaq = (index: number) => {
    const newList = faqs.filter((_, i) => i !== index);
    updateParent(newList);
  };

  const handleChange = (index: number, field: keyof FAQPair, val: string) => {
    const newList = [...faqs];
    newList[index][field] = val;
    updateParent(newList);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-heading flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-brand-primary" /> Sıkça Sorulan Sorular
        </label>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={addFaq}
          className="text-xs bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Soru Ekle
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-border rounded-xl text-center">
            <p className="text-desc text-sm italic">Henüz soru eklenmedi.</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div key={index} className="bg-background border border-border rounded-xl overflow-hidden shadow-sm transition-all hover:border-brand-primary/30">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center text-xs font-bold">
                     {index + 1}
                   </div>
                   <span className="text-sm font-medium text-main truncate max-w-[400px]">
                     {faq.q || "Soru metni girmek için tıklayın..."}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFaq(index); }}
                    className="p-1.5 text-desc hover:text-state-error transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {openIndex === index ? <ChevronUp className="w-4 h-4 text-meta" /> : <ChevronDown className="w-4 h-4 text-meta" />}
                </div>
              </div>

              {openIndex === index && (
                <div className="p-4 pt-0 border-t border-border/50 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2 mt-4">
                    <label className="text-xs font-semibold text-meta uppercase">Soru Metni</label>
                    <input 
                      value={faq.q} 
                      onChange={(e) => handleChange(index, 'q', e.target.value)}
                      className="w-full bg-surface border border-border p-3 text-sm text-white focus:border-brand-primary rounded-lg outline-none"
                      placeholder="Örn: Hizmetinizin süresi nedir?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-meta uppercase">Cevap Metni</label>
                    <textarea 
                      value={faq.a} 
                      onChange={(e) => handleChange(index, 'a', e.target.value)}
                      rows={3}
                      className="w-full bg-surface border border-border p-3 text-sm text-white focus:border-brand-primary rounded-lg outline-none resize-none"
                      placeholder="Örn: Çalışmalarımız genellikle 2-4 hafta sürmektedir."
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
