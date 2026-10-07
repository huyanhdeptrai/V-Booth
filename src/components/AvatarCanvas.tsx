import React, { useState } from 'react';
import { GarmentItem, XRayPoint } from '../data/garments';
import { Info, X, Sparkles } from 'lucide-react';

interface AvatarCanvasProps {
  garment: GarmentItem;
  gender: 'nu' | 'nam';
  fabricColor: string;
  selectedAccessories: string[];
  poseIndex?: number; // 0 to 3
  isAltered?: boolean;
  showXRayPins?: boolean;
  onInspectPoint?: (point: XRayPoint) => void;
  className?: string;
  renderMode?: 'interactive' | 'photostrip';
}

export const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  garment,
  gender,
  fabricColor,
  selectedAccessories,
  poseIndex = 0,
  isAltered = false,
  showXRayPins = true,
  onInspectPoint,
  className = '',
  renderMode = 'interactive'
}) => {
  const [activeXRay, setActiveXRay] = useState<XRayPoint | null>(null);

  const hasAccessory = (id: string) => selectedAccessories.includes(id);

  const handlePinClick = (e: React.MouseEvent, point: XRayPoint) => {
    e.stopPropagation();
    setActiveXRay(activeXRay?.id === point.id ? null : point);
    if (onInspectPoint) {
      onInspectPoint(point);
    }
  };

  // Adjust poses
  // 0: Classic bowing/respectful
  // 1: Fan covering half face
  // 2: Peace sign / Y2K
  // 3: Hands in pocket / Cool
  const leftArmRotation = poseIndex === 1 ? -45 : poseIndex === 2 ? -75 : -15;
  const rightArmRotation = poseIndex === 0 ? 30 : poseIndex === 2 ? 65 : 15;

  return (
    <div
      className={`relative w-full aspect-[3/4] max-w-[380px] mx-auto rounded-3xl overflow-hidden select-none bg-gradient-to-b from-[#FFF5F7] via-[#FFFDF9] to-[#FAF5F0] border border-rose-200/80 shadow-[0_8px_24px_rgba(255,117,151,0.12)] ${className}`}
    >
      {/* Studio Ambient Background Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,182,193,0.35),transparent_70%)] pointer-events-none" />
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-rose-900/60 uppercase tracking-wider pointer-events-none z-10">
        <span>V-BOOTH • {gender === 'nu' ? 'NỮ PHỤC' : 'NAM PHỤC'}</span>
        <span>{garment.shortTag}</span>
      </div>

      {/* SVG Vector Layered Mannequin Engine */}
      <svg
        viewBox="0 0 400 520"
        className="w-full h-full object-contain filter drop-shadow-[0_10px_16px_rgba(136,19,55,0.08)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Fabric Shading Gradients */}
          <linearGradient id={`fabric-grad-${garment.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={fabricColor} stopOpacity="1" />
            <stop offset="60%" stopColor={fabricColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#4A0419" stopOpacity="0.45" />
          </linearGradient>

          <linearGradient id="silk-shine" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="skin-tone" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFDFC4" />
            <stop offset="100%" stopColor="#F0C29E" />
          </linearGradient>

          <linearGradient id="gold-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
        </defs>

        {/* 1. LOWER BODY: White silk pants (Quần lụa trắng thụng) */}
        <g id="silk-pants">
          <path
            d="M155 350 L140 470 Q140 480 155 480 L185 480 L195 380 L205 380 L215 480 L245 480 Q260 480 260 470 L245 350 Z"
            fill="#FAF8F5"
            stroke="#E2DDD5"
            strokeWidth="1.5"
          />
          {/* Pants Crease */}
          <path d="M162 370 L152 465" stroke="#E5E0D8" strokeWidth="1" strokeDasharray="3 3" />
          <path d="M238 370 L248 465" stroke="#E5E0D8" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* 2. FOOTWEAR */}
        {hasAccessory('sneaker-chunky-trang') ? (
          // Chunky Retro Sneakers
          <g id="sneakers">
            <path
              d="M132 475 Q135 465 155 465 L178 468 Q185 472 185 486 L130 486 Q128 480 132 475 Z"
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth="1.5"
            />
            <rect x="128" y="484" width="60" height="9" rx="3" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" />
            <line x1="145" y1="469" x2="165" y2="471" stroke="#FF7597" strokeWidth="2" />

            <path
              d="M222 468 L245 465 Q265 465 268 475 Q272 480 270 486 L215 486 Q215 472 222 468 Z"
              fill="#FFFFFF"
              stroke="#D1D5DB"
              strokeWidth="1.5"
            />
            <rect x="212" y="484" width="60" height="9" rx="3" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="1" />
            <line x1="235" y1="471" x2="255" y2="469" stroke="#FF7597" strokeWidth="2" />
          </g>
        ) : (
          // Traditional wooden clogs (Guốc Mộc)
          <g id="traditional-shoes">
            <path d="M136 478 L174 478 L170 486 L138 486 Z" fill="#78350F" />
            <path d="M142 474 Q155 468 168 474" stroke="#881337" strokeWidth="3" fill="none" />
            <path d="M226 478 L264 478 L262 486 L230 486 Z" fill="#78350F" />
            <path d="M232 474 Q245 468 258 474" stroke="#881337" strokeWidth="3" fill="none" />
          </g>
        )}

        {/* 3. HEAD & NECK */}
        <g id="head-neck">
          {/* Neck */}
          <rect x="186" y="118" width="28" height="34" rx="4" fill="url(#skin-tone)" />
          {/* Face */}
          <ellipse cx="200" cy="98" rx="34" ry="42" fill="url(#skin-tone)" />
          {/* Gentle Blush */}
          <circle cx="180" cy="108" r="8" fill="#FF7597" fillOpacity="0.25" />
          <circle cx="220" cy="108" r="8" fill="#FF7597" fillOpacity="0.25" />

          {/* Eyes & Eyebrows */}
          <path d="M174 92 Q183 89 191 93" stroke="#4A2810" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M209 93 Q217 89 226 92" stroke="#4A2810" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="183" cy="98" rx="3.5" ry="4" fill="#2E1C0C" />
          <ellipse cx="217" cy="98" rx="3.5" ry="4" fill="#2E1C0C" />
          <circle cx="182" cy="96" r="1.2" fill="#FFFFFF" />
          <circle cx="216" cy="96" r="1.2" fill="#FFFFFF" />

          {/* Nose & Smile */}
          <path d="M199 98 L197 107 L203 107" stroke="#C2885D" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M192 118 Q200 124 208 118" stroke="#BE123C" strokeWidth="2.2" strokeLinecap="round" fill="none" />

          {/* Hair */}
          {gender === 'nu' ? (
            // Female soft traditional modern hair bun
            <g id="female-hair">
              <path
                d="M165 96 C165 60 185 52 200 52 C215 52 235 60 235 96 C225 78 215 72 200 74 C185 72 175 78 165 96 Z"
                fill="#24140D"
              />
              <circle cx="200" cy="46" r="18" fill="#24140D" />
              {/* Jade hairpin */}
              <line x1="180" y1="44" x2="225" y2="40" stroke="#0D9488" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            // Male classic neat side-part hair
            <g id="male-hair">
              <path
                d="M164 94 C164 62 182 54 200 54 C218 54 236 62 236 94 C228 80 216 74 200 76 C184 74 172 80 164 94 Z"
                fill="#1C1917"
              />
            </g>
          )}
        </g>

        {/* 4. HEADWEAR ACCESSORIES */}
        {hasAccessory('non-quai-thao') && (
          // Nón Quai Thao
          <g id="non-quai-thao-svg">
            <ellipse cx="200" cy="50" rx="95" ry="24" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
            <ellipse cx="200" cy="50" rx="75" ry="18" fill="#FDE68A" />
            <circle cx="200" cy="50" r="14" fill="#B45309" fillOpacity="0.4" />
            {/* Silk ribbons buông rủ */}
            <path d="M125 58 Q130 160 145 240" stroke="#FF7597" strokeWidth="3" fill="none" />
            <path d="M275 58 Q270 160 255 240" stroke="#FF7597" strokeWidth="3" fill="none" />
          </g>
        )}

        {hasAccessory('khan-dong-truyen-thong') && !hasAccessory('non-quai-thao') && (
          // Khăn Đóng / Vấn
          <g id="khan-dong-svg">
            <path
              d="M165 78 Q200 64 235 78 L238 68 Q200 52 162 68 Z"
              fill={fabricColor}
              stroke="#881337"
              strokeWidth="1.5"
            />
            {/* Multiple folds of the turban */}
            <path d="M163 72 Q200 58 237 72" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" fill="none" />
            <path d="M165 67 Q200 54 235 67" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          </g>
        )}

        {hasAccessory('kinh-ram-y2k') && (
          // Y2K Oval Sunglasses
          <g id="y2k-sunglasses">
            <ellipse cx="182" cy="98" rx="14" ry="9" fill="#18181B" stroke="#000" strokeWidth="1.5" />
            <ellipse cx="218" cy="98" rx="14" ry="9" fill="#18181B" stroke="#000" strokeWidth="1.5" />
            <line x1="196" y1="98" x2="204" y2="98" stroke="#000" strokeWidth="2" />
            <path d="M174 95 L186 93" stroke="#FFF" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M210 95 L222 93" stroke="#FFF" strokeWidth="1" strokeOpacity="0.8" />
          </g>
        )}

        {hasAccessory('headphone-retro') && (
          // Retro Over-Ear Headphones around neck
          <g id="retro-headphones">
            <path d="M168 138 Q200 156 232 138" stroke="#475569" strokeWidth="3.5" fill="none" />
            <rect x="156" y="128" width="16" height="24" rx="7" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
            <rect x="228" y="128" width="16" height="24" rx="7" fill="#F59E0B" stroke="#78350F" strokeWidth="1.5" />
          </g>
        )}

        {/* 5. MAIN HERITAGE GARMENT ROBE */}
        <g id="main-garment">
          {/* Garment Body (Torso and Hems) */}
          {garment.id === 'ao-tac' ? (
            // Áo Tấc (Wide formal sleeves, wide flowing hem)
            <g id="ao-tac-silhouette">
              {/* Main Body */}
              <path
                d={
                  isAltered
                    ? 'M150 148 L120 180 L130 290 Q200 300 270 290 L280 180 L250 148 Z' // cropped short (warning)
                    : 'M152 148 L115 200 L118 395 Q200 415 282 395 L285 200 L248 148 Z' // full regal hem
                }
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#6B0C23"
                strokeWidth="1.5"
              />
              {/* Silk Texture Overlay */}
              <path
                d="M152 148 L118 395 Q200 415 282 395 L248 148 Z"
                fill="url(#silk-shine)"
              />

              {/* Wide Rectangular Sleeves (Tay Thụng) */}
              {/* Left Sleeve */}
              <path
                d="M152 148 L80 200 L68 330 Q92 340 120 325 L124 235 Z"
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#6B0C23"
                strokeWidth="1.5"
              />
              {/* Right Sleeve */}
              <path
                d="M248 148 L320 200 L332 330 Q308 340 280 325 L276 235 Z"
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#6B0C23"
                strokeWidth="1.5"
              />
            </g>
          ) : garment.id === 'ngu-than-tay-chen' ? (
            // Áo Ngũ Thân Tay Chẽn (Fitted sleeves, modern mobility)
            <g id="ngu-than-silhouette">
              {/* Main Body */}
              <path
                d={
                  isAltered
                    ? 'M155 148 L138 200 L140 290 Q200 295 260 290 L262 200 L245 148 Z'
                    : 'M155 148 L135 200 L132 375 Q200 385 268 375 L265 200 L245 148 Z'
                }
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#1E293B"
                strokeWidth="1.5"
              />
              <path
                d="M155 148 L132 375 Q200 385 268 375 L245 148 Z"
                fill="url(#silk-shine)"
              />
              {/* Fitted Narrow Sleeves (Tay Chẽn) */}
              <path
                d="M155 148 L105 210 L95 305 Q108 312 118 305 L135 220 Z"
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#1E293B"
                strokeWidth="1.5"
              />
              <path
                d="M245 148 L295 210 L305 305 Q292 312 282 305 L265 220 Z"
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#1E293B"
                strokeWidth="1.5"
              />
            </g>
          ) : garment.id === 'nhat-binh' ? (
            // Áo Nhật Bình (Rectangular chest motif, gold embroidery, five-element bands)
            <g id="nhat-binh-silhouette">
              <path
                d="M150 148 L110 200 L114 395 Q200 412 286 395 L290 200 L250 148 Z"
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#500724"
                strokeWidth="1.5"
              />
              {/* Large Rectangular Collar (Nhật Bình) */}
              <path
                d="M174 148 L174 275 L226 275 L226 148 Z"
                fill="#FEF08A"
                stroke="url(#gold-border)"
                strokeWidth="2"
              />
              {/* Royal Phoenix / Floral Motif inside rectangular collar */}
              <line x1="200" y1="155" x2="200" y2="270" stroke="#DC2626" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="200" cy="195" r="8" fill="#F59E0B" />
              <circle cx="200" cy="235" r="8" fill="#F59E0B" />

              {/* Five-Element Bands on Sleeves (Ngũ Sắc: Xanh, Vàng, Trắng, Đỏ, Lam) */}
              {/* Left sleeve bands */}
              <path d="M72 300 L116 295" stroke="#10B981" strokeWidth="3" />
              <path d="M70 306 L118 301" stroke="#FBBF24" strokeWidth="3" />
              <path d="M68 312 L120 307" stroke="#3B82F6" strokeWidth="3" />
              <path d="M66 318 L122 313" stroke="#EF4444" strokeWidth="3" />
              <path d="M64 324 L124 319" stroke="#F9FAFB" strokeWidth="3" />

              {/* Right sleeve bands */}
              <path d="M328 300 L284 295" stroke="#10B981" strokeWidth="3" />
              <path d="M330 306 L282 301" stroke="#FBBF24" strokeWidth="3" />
              <path d="M332 312 L280 307" stroke="#3B82F6" strokeWidth="3" />
              <path d="M334 318 L278 313" stroke="#EF4444" strokeWidth="3" />
              <path d="M336 324 L276 319" stroke="#F9FAFB" strokeWidth="3" />

              {/* Waist Hanging Streamers (Tố Sa) */}
              <rect x="188" y="275" width="10" height="90" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
              <rect x="202" y="275" width="10" height="90" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
            </g>
          ) : (
            // Áo Tứ Thân Kinh Bắc
            <g id="tu-than-silhouette">
              {/* Inner Diamond Halter Top (Yếm Đào) */}
              <path d="M182 144 L200 185 L218 144 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
              {/* Open outer robe panels */}
              <path
                d="M152 148 L120 210 L130 380 Q160 385 180 375 L175 220 Z"
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#451A03"
                strokeWidth="1.5"
              />
              <path
                d="M248 148 L280 210 L270 380 Q240 385 220 375 L225 220 Z"
                fill={`url(#fabric-grad-${garment.id})`}
                stroke="#451A03"
                strokeWidth="1.5"
              />
              {/* Front Tie Knot (Buộc chéo trước bụng) */}
              <ellipse cx="200" cy="270" rx="14" ry="10" fill={fabricColor} stroke="#451A03" strokeWidth="1.5" />
              <path d="M192 276 L182 350 L195 348 Z" fill={fabricColor} />
              <path d="M208 276 L218 350 L205 348 Z" fill={fabricColor} />
            </g>
          )}

          {/* Stand Collar (Cổ Lập Lĩnh) & 5 Buttons for Ao Tac & Ngu Than */}
          {garment.id !== 'nhat-binh' && garment.id !== 'ao-tu-than' && (
            <g id="collar-and-buttons">
              {/* Stand Collar */}
              <path
                d="M184 146 Q200 142 216 146 L218 132 Q200 128 182 132 Z"
                fill={fabricColor}
                stroke="#881337"
                strokeWidth="1.5"
              />
              <path d="M184 133 Q200 129 216 133" stroke="#FEF08A" strokeWidth="1.5" fill="none" />

              {/* Lapel seam curving down right (Hữu nhậm) */}
              <path
                d="M214 146 Q228 175 222 225 L218 375"
                stroke="#881337"
                strokeWidth="1.2"
                strokeOpacity="0.8"
                fill="none"
              />

              {/* 5 Virtues Buttons (Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín) */}
              <circle cx="214" cy="148" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
              <circle cx="224" cy="172" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
              <circle cx="225" cy="202" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
              <circle cx="223" cy="236" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
              <circle cx="220" cy="272" r="3" fill="#F59E0B" stroke="#78350F" strokeWidth="0.8" />
            </g>
          )}
        </g>

        {/* 6. HANDS & HANDHELD ACCESSORIES */}
        <g id="hands-and-props">
          {/* Hands */}
          <ellipse cx="120" cy="328" rx="8" ry="10" fill="url(#skin-tone)" />
          <ellipse cx="280" cy="328" rx="8" ry="10" fill="url(#skin-tone)" />

          {/* Handheld Fan (Quạt Phiến Tơ Lụa) */}
          {hasAccessory('quat-phien-lua') && (
            <g id="silk-fan-svg">
              <line x1="282" y1="334" x2="295" y2="390" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              <circle cx="288" cy="320" r="26" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
              {/* Lotus flower embroidery on fan */}
              <path d="M288 312 Q282 322 288 330 Q294 322 288 312 Z" fill="#F43F5E" />
              <path d="M280 320 Q286 325 296 320" stroke="#059669" strokeWidth="1" fill="none" />
              {/* Silk tassel */}
              <line x1="295" y1="390" x2="298" y2="415" stroke="#E11D48" strokeWidth="2" />
            </g>
          )}

          {/* Waist Jade Pendant (Vòng Ngọc Bội) */}
          {hasAccessory('vong-ngoc-boi') && (
            <g id="jade-pendant-svg">
              <circle cx="230" cy="285" r="10" fill="#A7F3D0" stroke="#059669" strokeWidth="1.5" />
              <circle cx="230" cy="285" r="4" fill="#FFFFFF" />
              <path d="M230 295 L230 335" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Canvas Tote Bag */}
          {hasAccessory('tui-canvas-thu-phap') && (
            <g id="canvas-bag">
              <rect x="90" y="325" width="38" height="48" rx="4" fill="#F5F5F4" stroke="#78716C" strokeWidth="1.2" />
              <path d="M100 325 L100 300 Q109 292 118 300 L118 325" stroke="#78716C" strokeWidth="1.5" fill="none" />
              {/* Calligraphy mark */}
              <text x="102" y="352" fontSize="14" fill="#1C1917" fontFamily="serif" fontWeight="bold">
                安
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* 7. TAP-TO-INSPECT X-RAY PINS (HERITAGE GUARDIAN) */}
      {showXRayPins && renderMode === 'interactive' && (
        <div className="absolute inset-0 pointer-events-none">
          {garment.xRayPoints.map((point) => {
            const isActive = activeXRay?.id === point.id;
            return (
              <div
                key={point.id}
                style={{ left: `${point.xPercent}%`, top: `${point.yPercent}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20"
              >
                <button
                  type="button"
                  onClick={(e) => handlePinClick(e, point)}
                  aria-label={`Chi tiết: ${point.name}`}
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full border shadow-md tactile-press transition-all duration-150 ${
                    isActive
                      ? 'bg-[#881337] border-rose-100 text-white scale-110 shadow-rose-900/30 ring-4 ring-rose-200'
                      : 'bg-white/95 border-rose-300 text-[#881337] hover:bg-rose-50 hover:scale-105'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-current animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00F5D4]" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* 8. X-RAY POPOVER (Tap-to-Inspect 2-sentence explanation) */}
      {activeXRay && renderMode === 'interactive' && (
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md border border-rose-200/90 rounded-2xl p-3.5 shadow-[0_8px_20px_rgba(136,19,55,0.15)] z-30 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-rose-900 font-semibold text-xs tracking-tight">
              <span className="w-2 h-2 rounded-full bg-[#FF7597]" />
              <span>{activeXRay.name}</span>
            </div>
            <button
              onClick={() => setActiveXRay(null)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[12px] font-medium text-slate-800 leading-snug mb-1">
            {activeXRay.historicalMeaning}
          </p>
          <p className="text-[11px] text-slate-500 leading-tight">
            {activeXRay.culturalDetail}
          </p>
        </div>
      )}
    </div>
  );
};
