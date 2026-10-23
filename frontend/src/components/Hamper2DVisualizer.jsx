import { X, Plus } from 'lucide-react';

/* ========================================================================== */
/* === 2D HAMPER MODEL ASSET REPLACEMENT & CUSTOM GRAPHICS GUIDE         === */
/* ========================================================================== */
/* To replace product graphics with transparent PNG cutouts:                  */
/* Map product IDs in PRODUCT_2D_ASSETS to your custom image paths.           */
/* ========================================================================== */
const PRODUCT_2D_ASSETS = {
  'prod-aws': null,
  'prod-bb': null,
  'prod-avg': null,
  'prod-ccs': null,
  'prod-ass': null,
  'prod-lb': null,
  'prod-kj': null
};

export default function Hamper2DVisualizer({
  selectedPackaging,
  hamperSize,
  selectedProducts = [],
  onRemoveItem,
  onSelectSlot
}) {
  // Flatten products with quantity > 1 into individual visual slots
  const flattenedItems = [];
  selectedProducts.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      flattenedItems.push({
        ...item,
        instanceIndex: i
      });
    }
  });

  const maxItems = hamperSize?.maxItems || 5;
  const currentCount = flattenedItems.length;
  const isFull = currentCount >= maxItems;
  const remainingSlots = Math.max(0, maxItems - currentCount);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm space-y-4">
      {/* Minimal Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
            {selectedPackaging?.name || 'Hamper'}
          </span>
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            Hamper Preview
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-neutral-700 block">
            {currentCount} of {maxItems} items
          </span>
          <span className={`text-[11px] font-medium ${isFull ? 'text-amber-700' : 'text-emerald-700'}`}>
            {isFull ? 'Full' : `${remainingSlots} slot${remainingSlots === 1 ? '' : 's'} left`}
          </span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isFull ? 'bg-amber-600' : 'bg-neutral-800'
          }`}
          style={{ width: `${Math.min(100, (currentCount / maxItems) * 100)}%` }}
        />
      </div>

      {/* 2D Hamper Box Canvas (Minimal, clean, no busy patterns) */}
      <div className="rounded-xl border border-neutral-200 bg-[#FAFAFA] p-4 min-h-[300px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Filled Product Items */}
          {flattenedItems.map((item, index) => {
            const customCutout = PRODUCT_2D_ASSETS[item.id];
            const displayImage = customCutout || item.imageUrl;

            return (
              <div
                key={`${item.id}-${index}`}
                className="group relative bg-white rounded-xl p-2.5 border border-neutral-200/80 shadow-xs flex flex-col items-center text-center transition-all hover:border-neutral-400"
              >
                {/* Remove Button on Hover */}
                {onRemoveItem && (
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-1 right-1 p-1 rounded-full text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-colors"
                    title="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Product Thumbnail */}
                <div className="w-14 h-14 my-1 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
                  <img
                    src={displayImage}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Price */}
                <span className="font-serif text-[11px] font-semibold text-neutral-900 line-clamp-1 w-full mt-1">
                  {item.name}
                </span>
                <span className="text-[11px] font-medium text-neutral-500">
                  ₹{item.price}
                </span>
              </div>
            );
          })}

          {/* Empty Placeholder Slots */}
          {Array.from({ length: remainingSlots }).map((_, emptyIndex) => (
            <div
              key={`empty-slot-${emptyIndex}`}
              onClick={onSelectSlot}
              className="rounded-xl border border-dashed border-neutral-300 bg-white/50 p-3 min-h-[105px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-neutral-500 transition-all"
              title="Click to select a product"
            >
              <Plus className="w-4 h-4 text-neutral-400 mb-1" />
              <span className="text-[10px] font-medium text-neutral-400">
                Empty
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
