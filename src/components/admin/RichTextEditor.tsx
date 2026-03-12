"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Code, Eye } from "lucide-react";

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="bg-background rounded-lg border border-border overflow-hidden flex flex-col">
      {/* Header with Switcher */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0F1122] border-b border-[#1C1F36]">
        <span className="text-xs font-bold text-meta uppercase tracking-wider">İçerik Editörü</span>
        <button 
          onClick={() => setIsHtmlMode(!isHtmlMode)}
          className="flex items-center gap-2 px-3 py-1 rounded bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-colors text-xs font-bold"
          title={isHtmlMode ? "Görsel Editöre Geç" : "HTML Koduna Geç"}
          type="button"
        >
          {isHtmlMode ? (
            <><Eye className="w-3.5 h-3.5" /> Görsel Mod</>
          ) : (
            <><Code className="w-3.5 h-3.5" /> HTML Modu</>
          )}
        </button>
      </div>

      <div className="flex-1 relative">
        {isHtmlMode ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="HTML kodlarını buraya yapıştırın veya yazın..."
            className="w-full h-[500px] p-4 bg-[#0D0F1A] text-main font-mono text-sm border-none focus:outline-none resize-none overflow-y-auto custom-scrollbar"
          />
        ) : (
          <ReactQuill 
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            className="text-white rich-editor-container"
          />
        )}
      </div>

      <style jsx global>{`
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #1C1F36;
          background: #0F1122;
          position: sticky;
          top: 0;
          z-index: 5;
        }
        .ql-container.ql-snow {
          border: none;
          height: 500px;
        }
        .ql-editor {
          height: 100%;
          overflow-y: auto;
          font-size: 16px;
          line-height: 1.6;
        }
        .ql-editor::-webkit-scrollbar {
          width: 8px;
        }
        .ql-editor::-webkit-scrollbar-track {
          background: #0D0F1A;
        }
        .ql-editor::-webkit-scrollbar-thumb {
          background: #1C1F36;
          border-radius: 4px;
        }
        .ql-editor::-webkit-scrollbar-thumb:hover {
          background: #2D6BFF;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0D0F1A;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1C1F36;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2D6BFF;
        }
        .ql-snow .ql-stroke {
          stroke: #94A3B8;
        }
        .ql-snow .ql-fill {
          fill: #94A3B8;
        }
        .ql-snow .ql-picker {
          color: #94A3B8;
        }
        .ql-editor.ql-blank::before {
          color: #475569;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
