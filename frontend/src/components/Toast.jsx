import React from 'react';
import { useSelections } from '../context/SelectionContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useSelections();

  if (!toastMessage) return null;

  const isError = toastMessage.type === 'error';
  const isInfo = toastMessage.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div
        className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          isError
            ? 'bg-[#FDF2F0] border-[#E8C5B8] text-[#842A1C]'
            : isInfo
            ? 'bg-[#F4F6F8] border-[#CFD9E0] text-[#2C485E]'
            : 'bg-[#FAF6EE] border-[#E2D2B8] text-[#4A3728]'
        }`}
      >
        <div className="shrink-0">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-[#C86D51]" />
          ) : isInfo ? (
            <Info className="w-5 h-5 text-[#5B8296]" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#556B52]" />
          )}
        </div>
        <div className="text-sm font-medium leading-snug">
          {toastMessage.message}
        </div>
      </div>
    </div>
  );
}
