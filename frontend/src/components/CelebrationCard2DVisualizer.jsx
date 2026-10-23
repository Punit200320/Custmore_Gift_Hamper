import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

export default function CelebrationCard2DVisualizer({
  cardPhoto,
  celebrationTitle = 'Celebration',
  cardMessage = '',
  cardRecipient = '',
  cardSender = ''
}) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-neutral-900">
          Card Preview
        </h3>
        <span className="text-xs text-neutral-400">
          Included with Hamper
        </span>
      </div>

      {/* Clean Minimalist Card */}
      <div className="rounded-xl border border-neutral-200 bg-[#FAF9F6] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          {/* Photo Frame */}
          <div className="w-32 sm:w-36 shrink-0 aspect-[4/5] bg-white rounded-xl p-1.5 border border-neutral-200 shadow-xs flex items-center justify-center overflow-hidden">
            {cardPhoto ? (
              <img
                src={cardPhoto}
                alt="Card photo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-neutral-50 flex flex-col items-center justify-center p-2 text-center text-neutral-400">
                <ImageIcon className="w-6 h-6 mb-1 text-neutral-300" />
                <span className="text-[10px]">Photo</span>
              </div>
            )}
          </div>

          {/* Card Message */}
          <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
            <h4 className="font-serif text-lg font-bold text-neutral-900 leading-snug">
              {celebrationTitle || 'Warmest Wishes'}
            </h4>

            {cardRecipient && (
              <p className="text-xs font-semibold text-neutral-700">
                Dear {cardRecipient},
              </p>
            )}

            <p className="font-serif italic text-xs sm:text-sm text-neutral-700 leading-relaxed min-h-[60px] whitespace-pre-line">
              "{cardMessage || 'Wishing you radiant joy and peaceful moments.'}"
            </p>

            <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-500">
              <span>{cardSender ? `With love, ${cardSender}` : ''}</span>
              <span className="text-[10px] font-serif uppercase tracking-widest text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                Wax Seal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
