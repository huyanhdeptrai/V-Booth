import React, { useState } from 'react';
import { GarmentItem, BodyZone, BottomId, FootwearId } from '../data/garments';

interface AvatarCanvasProps {
  garment: GarmentItem;
  gender: 'nu' | 'nam';
  fabricColor: string;
  fabricId?: string;
  selectedAccessories: string[];
  selectedBottomId?: BottomId;
  selectedFootwearId?: FootwearId;
  poseIndex?: number; // 0 to 3
  isAltered?: boolean;
  culturalScore?: number;
  sealTitle?: string;
  showSealBadge?: boolean;
  showXRayPins?: boolean;
  activeZone?: BodyZone | null;
  onSelectZone?: (zone: BodyZone) => void;
  className?: string;
  renderMode?: 'interactive' | 'photostrip';
}

export const AvatarCanvas: React.FC<AvatarCanvasProps> = ({
  garment,
  gender,
  fabricColor,
  fabricId = 'lua-van-phuc',
  selectedAccessories,
  selectedBottomId,
  selectedFootwearId,
  poseIndex = 0,
  isAltered = false,
  culturalScore = 96,
  sealTitle = 'BẢO CHỨNG DI SẢN',
  showSealBadge = true,
  activeZone = null,
  onSelectZone,
  className = '',
  renderMode = 'interactive'
}) => {
  const [hoveredZone, setHoveredZone] = useState<BodyZone | null>(null);

  const hasAccessory = (id: string) => selectedAccessories.includes(id);
  const isInteractive = renderMode === 'interactive';

  // Determine effective bottom and footwear
  const effectiveBottom: BottomId = selectedBottomId || (garment.id === 'ao-ba-ba' ? 'bottom-silk-black' : 'bottom-silk-white');
  const effectiveFootwear: FootwearId = selectedFootwearId || (hasAccessory('sneaker-chunky-trang') ? 'shoes-sneaker-chunky' : 'shoes-guoc-moc');

  const handleZoneClick = (zone: BodyZone) => {
    if (!isInteractive) return;
    if (onSelectZone) {
      onSelectZone(zone);
    }
  };

  return (
    <div
      className={`relative w-full aspect-[9/14] max-w-[360px] mx-auto select-none overflow-hidden transition-all duration-300 ${
        isInteractive
          ? 'rounded-t-[170px] rounded-b-[36px] bg-gradient-to-b from-[#FFF0F4] via-[#FFFDF9] to-[#FAF5EE] border-2 border-rose-300/85 shadow-[0_0_30px_rgba(255,117,151,0.22),0_12px_32px_rgba(136,19,55,0.09),inset_0_0_20px_rgba(255,182,193,0.15)] ring-1 ring-white/90'
          : 'rounded-2xl bg-gradient-to-b from-[#FFF5F7] to-[#FAF5EE] border border-rose-200/80 shadow-sm'
      } ${className}`}
    >
      {/* 1. Arch Mirror Ambient Glass */}
      {isInteractive && (
        <>
          <div className="absolute inset-0 rounded-t-[170px] rounded-b-[36px] pointer-events-none bg-[radial-gradient(ellipse_at_50%_15%,rgba(255,255,255,0.75),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,117,151,0.12),transparent_70%)] pointer-events-none" />
        </>
      )}

      {/* 2. SVG Vector Engine: Couture Fashion Sketch Silhouette (Scaled to ~75% to show full body head-to-toe) */}
      <svg
        viewBox="0 0 380 580"
        className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(136,19,55,0.06)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Pink Pastel Glow Filter for Hovered Zone */}
          <filter id="zone-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#FF7597" floodOpacity="0.8" />
          </filter>

          {/* Silk Shading Gradients */}
          <linearGradient id={`silk-grad-${garment.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              stopColor={fabricId === 'lanh-my-a' && fabricColor === '#1E3A8A' ? '#0F172A' : fabricColor}
              stopOpacity="1"
            />
            <stop
              offset="65%"
              stopColor={fabricColor}
              stopOpacity={fabricId === 'lanh-my-a' ? 0.98 : fabricId === 'sa-xuyen-lua' ? 0.82 : 0.95}
            />
            <stop
              offset="100%"
              stopColor={fabricId === 'lanh-my-a' ? '#020617' : '#4A0419'}
              stopOpacity={fabricId === 'lanh-my-a' ? 0.82 : 0.6}
            />
          </linearGradient>

          <linearGradient id="silk-sheen" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop
              offset="0%"
              stopColor={fabricId === 'gam-cung-dinh' ? '#FEF08A' : '#FFFFFF'}
              stopOpacity={
                fabricId === 'lanh-my-a'
                  ? 0.55
                  : fabricId === 'gam-cung-dinh'
                  ? 0.48
                  : fabricId === 'dui-nam-cao'
                  ? 0.1
                  : fabricId === 'sa-xuyen-lua'
                  ? 0.38
                  : 0.32
              }
            />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop
              offset="100%"
              stopColor="#000000"
              stopOpacity={fabricId === 'lanh-my-a' ? 0.35 : 0.2}
            />
          </linearGradient>

          {/* Mannequin Skin Tone */}
          <linearGradient id="mannequin-skin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF2E7" />
            <stop offset="100%" stopColor="#F5D8C3" />
          </linearGradient>

          {/* Gold Imperial Embroidery Gradient */}
          <linearGradient id="gold-trim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Trousers Silk White Drapery Gradient */}
          <linearGradient id="pants-silk-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#FAF7F2" />
            <stop offset="100%" stopColor="#EDE6DB" />
          </linearGradient>

          {/* Lãnh Mỹ A Black Silk Gradient */}
          <linearGradient id="pants-silk-black" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="55%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0B1120" />
          </linearGradient>

          {/* Denim Jeans Gradient */}
          <linearGradient id="pants-denim-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Linen Rustic Skirt Gradient */}
          <linearGradient id="skirt-linen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5EFE6" />
            <stop offset="60%" stopColor="#EAE0D2" />
            <stop offset="100%" stopColor="#D5C7B5" />
          </linearGradient>

          {/* Tailored Trousers Gradient */}
          <linearGradient id="trousers-tailored-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A817C" />
            <stop offset="50%" stopColor="#645C57" />
            <stop offset="100%" stopColor="#443E3B" />
          </linearGradient>

          {/* Pleated Midi Skirt Gradient */}
          <linearGradient id="skirt-pleated-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Y2K Flare Dark Indigo Gradient */}
          <linearGradient id="pants-y2k-flare-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="45%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Leather Shine Gradient for Boots & Loafers */}
          <linearGradient id="leather-shine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#52525B" />
            <stop offset="30%" stopColor="#27272A" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>
        </defs>

        {/* Scaled Mannequin Group: Scaled to 75% centered at (190, 280) so the entire figure from hat to shoes is fully visible with generous breathing room */}
        <g id="mannequin-scaled-75" transform="translate(190, 280) scale(0.75) translate(-190, -280)">

        {/* ========================================================
            VÙNG 3: QUẦN / VÁY (LEGS & TROUSERS) - ĐA DẠNG 7 PHOM DÁNG
           ======================================================== */}
        <g
          id="zone-legs"
          className={isInteractive ? 'cursor-pointer transition-all duration-200 group' : ''}
          filter={hoveredZone === 'legs' || activeZone === 'legs' ? 'url(#zone-glow)' : undefined}
          onMouseEnter={() => isInteractive && setHoveredZone('legs')}
          onMouseLeave={() => isInteractive && setHoveredZone(null)}
          onClick={() => handleZoneClick('legs')}
        >
          {/* Hit area for trousers/skirts */}
          <rect x="115" y="335" width="150" height="175" fill="transparent" pointerEvents="all" />

          {/* 1. QUẦN LỤA TRẮNG NGÀ (bottom-silk-white) */}
          {effectiveBottom === 'bottom-silk-white' && (
            <g id="bottom-silk-white-group">
              <path
                d="M150 330 C144 380, 140 440, 138 496 C138 502, 144 504, 150 504 L182 504 C186 460, 187 400, 189 360 C191 400, 192 460, 196 504 L228 504 C234 504, 240 502, 240 496 C238 440, 234 380, 228 330 Z"
                fill="url(#pants-silk-grad)"
                stroke={hoveredZone === 'legs' ? '#FF7597' : '#E2DDD5'}
                strokeWidth={hoveredZone === 'legs' ? 2 : 1.2}
              />
              <path d="M154 350 C150 395, 146 445, 144 496" stroke="#D8D1C7" strokeWidth="0.9" strokeDasharray="2 3" fill="none" />
              <path d="M172 370 C170 415, 168 460, 168 500" stroke="#D8D1C7" strokeWidth="0.8" fill="none" />
              <path d="M206 370 C208 415, 210 460, 210 500" stroke="#D8D1C7" strokeWidth="0.8" fill="none" />
              <path d="M224 350 C228 395, 232 445, 234 496" stroke="#D8D1C7" strokeWidth="0.9" strokeDasharray="2 3" fill="none" />
            </g>
          )}

          {/* 2. QUẦN LỤA ĐEN TUYỀN / LÃNH MỸ A (bottom-silk-black) */}
          {effectiveBottom === 'bottom-silk-black' && (
            <g id="bottom-silk-black-group">
              <path
                d="M150 330 C144 380, 140 440, 138 496 C138 502, 144 504, 150 504 L182 504 C186 460, 187 400, 189 360 C191 400, 192 460, 196 504 L228 504 C234 504, 240 502, 240 496 C238 440, 234 380, 228 330 Z"
                fill="url(#pants-silk-black)"
                stroke={hoveredZone === 'legs' ? '#FF7597' : '#0B1120'}
                strokeWidth={hoveredZone === 'legs' ? 2 : 1.2}
              />
              {/* Satin sheen reflection lines */}
              <path d="M148 355 C144 400, 141 450, 142 494" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <path d="M166 375 C164 420, 163 465, 163 498" stroke="#334155" strokeWidth="0.8" fill="none" />
              <path d="M214 375 C216 420, 217 465, 217 498" stroke="#334155" strokeWidth="0.8" fill="none" />
              <path d="M230 355 C234 400, 237 450, 236 494" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" fill="none" />
            </g>
          )}

          {/* 3. VÁY ĐŨI MỘC DÁNG SUÔNG (bottom-linen-skirt) */}
          {effectiveBottom === 'bottom-linen-skirt' && (
            <g id="bottom-linen-skirt-group">
              <path
                d="M152 330 C146 380, 142 440, 138 498 Q190 506 242 498 C238 440, 234 380, 228 330 Z"
                fill="url(#skirt-linen-grad)"
                stroke={hoveredZone === 'legs' ? '#FF7597' : '#C4B5A5'}
                strokeWidth={hoveredZone === 'legs' ? 2 : 1.2}
              />
              {/* Natural organic center weave fold */}
              <line x1="190" y1="340" x2="190" y2="498" stroke="#B09F8C" strokeWidth="1" strokeDasharray="4 3" />
              <path d="M160 360 C156 410, 154 460, 153 496" stroke="#B09F8C" strokeWidth="0.8" strokeDasharray="2 3" fill="none" />
              <path d="M220 360 C224 410, 226 460, 227 496" stroke="#B09F8C" strokeWidth="0.8" strokeDasharray="2 3" fill="none" />
              <path d="M140 495 Q190 503 240 495" stroke="#9A8774" strokeWidth="1.2" fill="none" />
            </g>
          )}

          {/* 4. QUẦN JEANS ỐNG SUÔNG XANH DENIM (bottom-jeans-denim) */}
          {effectiveBottom === 'bottom-jeans-denim' && (
            <g id="bottom-jeans-denim-group">
              {/* Denim Body */}
              <path
                d="M152 330 C147 380, 143 440, 141 500 L183 502 C186 460, 187 400, 189 360 C191 400, 192 460, 195 502 L237 500 C235 440, 231 380, 226 330 Z"
                fill="url(#pants-denim-grad)"
                stroke={hoveredZone === 'legs' ? '#FF7597' : '#1D4ED8'}
                strokeWidth={hoveredZone === 'legs' ? 2 : 1.3}
              />
              {/* Denim Contrast Yellow Outer Seams (Đường chỉ may vàng kinh điển) */}
              <path d="M153 336 C148 385, 144 445, 143 497" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
              <path d="M225 336 C230 385, 234 445, 235 497" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
              {/* Inseam stitching */}
              <path d="M185 498 C187 450, 188 395, 189 362 C191 395, 192 450, 193 498" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" fill="none" />
              {/* Center Fly & Coin Rivets */}
              <line x1="189" y1="330" x2="189" y2="356" stroke="#F59E0B" strokeWidth="1.2" />
              <circle cx="158" cy="336" r="1.5" fill="#FBBF24" stroke="#B45309" strokeWidth="0.5" />
              <circle cx="220" cy="336" r="1.5" fill="#FBBF24" stroke="#B45309" strokeWidth="0.5" />
            </g>
          )}

          {/* 5. QUẦN TÂY XẾP LY BE / ĐEN (bottom-tailored-trousers) */}
          {effectiveBottom === 'bottom-tailored-trousers' && (
            <g id="bottom-tailored-trousers-group">
              <path
                d="M154 330 C150 380, 147 440, 145 500 L184 501 C187 455, 188 400, 189 360 C191 400, 192 455, 194 501 L233 500 C231 440, 228 380, 224 330 Z"
                fill="url(#trousers-tailored-grad)"
                stroke={hoveredZone === 'legs' ? '#FF7597' : '#3F3935'}
                strokeWidth={hoveredZone === 'legs' ? 2 : 1.3}
              />
              {/* Sharp Pressed Center Creases (Đường xếp ly ủi ly thẳng tắp) */}
              <line x1="165" y1="336" x2="165" y2="498" stroke="#A8A29E" strokeWidth="1.2" />
              <line x1="213" y1="336" x2="213" y2="498" stroke="#A8A29E" strokeWidth="1.2" />
              <line x1="189" y1="330" x2="189" y2="352" stroke="#292524" strokeWidth="1.2" />
            </g>
          )}

          {/* 6. CHÂN VÁY XẾP LY MIDI VINTAGE (bottom-pleated-midi) */}
          {effectiveBottom === 'bottom-pleated-midi' && (
            <g id="bottom-pleated-midi-group">
              {/* Bare Lower Legs (Chân thon lộ từ bắp đến cổ chân) */}
              <path d="M158 460 C158 475, 156 490, 154 504 L168 504 C168 490, 170 475, 170 460 Z" fill="url(#mannequin-skin)" stroke="#E5D0C0" strokeWidth="0.8" />
              <path d="M208 460 C210 475, 212 490, 212 504 L226 504 C224 490, 222 475, 222 460 Z" fill="url(#mannequin-skin)" stroke="#E5D0C0" strokeWidth="0.8" />
              {/* Pleated Midi Skirt Flared Body */}
              <path
                d="M152 330 C146 370, 138 420, 134 464 Q190 472 244 464 C240 420, 232 370, 226 330 Z"
                fill="url(#skirt-pleated-grad)"
                stroke={hoveredZone === 'legs' ? '#FF7597' : '#94A3B8'}
                strokeWidth={hoveredZone === 'legs' ? 2 : 1.2}
              />
              {/* Multiple Crisp Accordion Pleats (Nếp gấp dập ly sắc sảo) */}
              <line x1="147" y1="340" x2="145" y2="465" stroke="#94A3B8" strokeWidth="1" />
              <line x1="160" y1="336" x2="160" y2="467" stroke="#64748B" strokeWidth="1" />
              <line x1="174" y1="334" x2="175" y2="469" stroke="#94A3B8" strokeWidth="1" />
              <line x1="189" y1="333" x2="190" y2="470" stroke="#64748B" strokeWidth="1" />
              <line x1="204" y1="334" x2="204" y2="469" stroke="#94A3B8" strokeWidth="1" />
              <line x1="218" y1="336" x2="219" y2="467" stroke="#64748B" strokeWidth="1" />
              <line x1="231" y1="340" x2="233" y2="465" stroke="#94A3B8" strokeWidth="1" />
            </g>
          )}

          {/* 7. QUẦN ỐNG LOE Y2K (bottom-flared-y2k) */}
          {effectiveBottom === 'bottom-flared-y2k' && (
            <g id="bottom-flared-y2k-group">
              <path
                d="M153 330 C154 370, 160 415, 158 435 C154 460, 138 485, 133 504 L184 502 C181 480, 178 450, 180 430 C182 410, 187 385, 189 360 C191 385, 196 410, 198 430 C200 450, 197 480, 194 502 L245 504 C240 485, 224 460, 220 435 C218 415, 224 370, 225 330 Z"
                fill="url(#pants-y2k-flare-grad)"
                stroke={hoveredZone === 'legs' ? '#FF7597' : '#0F172A'}
                strokeWidth={hoveredZone === 'legs' ? 2 : 1.3}
              />
              {/* Y2K Retro Flare Seam lines */}
              <path d="M169 340 C171 390, 170 435, 157 500" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" fill="none" />
              <path d="M209 340 C207 390, 208 435, 221 500" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" fill="none" />
            </g>
          )}

          {/* Legs zone closes cleanly without floating AI-slop badge */}
        </g>

        {/* ========================================================
            VÙNG 4: GIÀY DÉP & FOOTWEAR (FEET) - ĐA DẠNG 8 PHONG CÁCH
           ======================================================== */}
        <g
          id="zone-feet"
          className={isInteractive ? 'cursor-pointer transition-all duration-200 group' : ''}
          filter={hoveredZone === 'feet' || activeZone === 'feet' ? 'url(#zone-glow)' : undefined}
          onMouseEnter={() => isInteractive && setHoveredZone('feet')}
          onMouseLeave={() => isInteractive && setHoveredZone(null)}
          onClick={() => handleZoneClick('feet')}
        >
          {/* Hit area for feet */}
          <rect x="115" y="488" width="150" height="40" fill="transparent" pointerEvents="all" />

          {/* 1. GUỐC MỘC TRUYỀN THỐNG (shoes-guoc-moc) */}
          {effectiveFootwear === 'shoes-guoc-moc' && (
            <g id="shoes-guoc-moc-group">
              {/* Left Clog */}
              <path
                d="M134 504 L170 504 C172 512, 170 517, 166 518 L138 518 C134 517, 132 512, 134 504 Z"
                fill="#78350F"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#5A260B'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1}
              />
              <path d="M138 502 Q152 494 166 502" stroke="#9F1239" strokeWidth="3.2" fill="none" strokeLinecap="round" />
              <circle cx="152" cy="497" r="1.5" fill="#FEF08A" />

              {/* Right Clog */}
              <path
                d="M208 504 L244 504 C246 512, 244 517, 240 518 L212 518 C208 517, 206 512, 208 504 Z"
                fill="#78350F"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#5A260B'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1}
              />
              <path d="M212 502 Q226 494 240 502" stroke="#9F1239" strokeWidth="3.2" fill="none" strokeLinecap="round" />
              <circle cx="226" cy="497" r="1.5" fill="#FEF08A" />
            </g>
          )}

          {/* 2. GIÀY HÀI THÊU MŨI CONG CUNG ĐÌNH (shoes-hai-theu) */}
          {effectiveFootwear === 'shoes-hai-theu' && (
            <g id="shoes-hai-theu-group">
              {/* Left Pointed Upturned Embroidered Slipper */}
              <path
                d="M128 502 C125 492, 133 492, 139 497 L170 499 C175 504, 174 513, 170 517 L132 517 C128 514, 126 506, 128 502 Z"
                fill="#991B1B"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#B45309'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              {/* Curled tip ornament */}
              <path d="M128 504 Q123 493 133 494" stroke="#FDE047" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d="M142 504 Q152 499 162 504" stroke="#FEF08A" strokeWidth="1.2" fill="none" />
              <rect x="133" y="514" width="37" height="3" rx="1" fill="#78350F" />

              {/* Right Pointed Upturned Embroidered Slipper */}
              <path
                d="M210 499 L241 497 C247 492, 255 492, 252 502 C254 506, 252 514, 248 517 L210 517 C206 513, 205 504, 210 499 Z"
                fill="#991B1B"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#B45309'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              {/* Curled tip ornament */}
              <path d="M252 504 Q257 493 247 494" stroke="#FDE047" strokeWidth="1.6" fill="none" strokeLinecap="round" />
              <path d="M218 504 Q228 499 238 504" stroke="#FEF08A" strokeWidth="1.2" fill="none" />
              <rect x="210" y="514" width="37" height="3" rx="1" fill="#78350F" />
            </g>
          )}

          {/* 3. GUỐC GỖ SƠN MÀI HOÀNG GIA (shoes-guoc-son-mai) */}
          {effectiveFootwear === 'shoes-guoc-son-mai' && (
            <g id="shoes-guoc-son-mai-group">
              {/* Left Lacquer Clog */}
              <path
                d="M134 503 L170 503 C172 511, 170 517, 166 518 L138 518 C134 517, 132 511, 134 503 Z"
                fill="#0F172A"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#D97706'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              {/* Gold leaf lacquer border */}
              <rect x="135" y="514" width="33" height="3.5" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
              <path d="M138 501 Q152 492 166 501" stroke="#831843" strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <circle cx="152" cy="496" r="1.6" fill="#FDE047" />

              {/* Right Lacquer Clog */}
              <path
                d="M208 503 L244 503 C246 511, 244 517, 240 518 L212 518 C208 517, 206 511, 208 503 Z"
                fill="#0F172A"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#D97706'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              <rect x="210" y="514" width="33" height="3.5" rx="1" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
              <path d="M212 501 Q226 492 240 501" stroke="#831843" strokeWidth="3.4" fill="none" strokeLinecap="round" />
              <circle cx="226" cy="496" r="1.6" fill="#FDE047" />
            </g>
          )}

          {/* 4. SNEAKER CHUNKY TRẮNG RETRO (shoes-sneaker-chunky) */}
          {effectiveFootwear === 'shoes-sneaker-chunky' && (
            <g id="shoes-sneaker-chunky-group">
              {/* Left Sneaker Platform */}
              <path
                d="M134 496 C138 491, 148 491, 154 492 L172 494 C178 498, 178 507, 176 513 L132 513 C130 506, 131 500, 134 496 Z"
                fill="#FFFFFF"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#CBD5E1'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              <rect x="130" y="511" width="46" height="7" rx="3" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.9" />
              <line x1="144" y1="495" x2="162" y2="496" stroke="#FF7597" strokeWidth="1.6" strokeLinecap="round" />

              {/* Right Sneaker Platform */}
              <path
                d="M208 494 L226 492 C232 491, 242 491, 246 496 C249 500, 250 506, 248 513 L204 513 C202 507, 202 498, 208 494 Z"
                fill="#FFFFFF"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#CBD5E1'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              <rect x="204" y="511" width="46" height="7" rx="3" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="0.9" />
              <line x1="218" y1="496" x2="236" y2="495" stroke="#FF7597" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )}

          {/* 5. SNEAKER ĐẾ BẰNG VINTAGE (SAMBA/CANVAS) (shoes-sneaker-samba) */}
          {effectiveFootwear === 'shoes-sneaker-samba' && (
            <g id="shoes-sneaker-samba-group">
              {/* Left Sneaker (Caramel Gum Sole + 3 stripes) */}
              <path
                d="M134 498 C138 495, 146 495, 152 496 L170 497 C175 500, 174 508, 172 514 L132 514 C130 508, 131 501, 134 498 Z"
                fill="#FAFAF9"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#78716C'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1}
              />
              {/* 3 Iconic Stripes */}
              <line x1="148" y1="498" x2="146" y2="513" stroke="#1E293B" strokeWidth="1.2" />
              <line x1="153" y1="498" x2="151" y2="513" stroke="#1E293B" strokeWidth="1.2" />
              <line x1="158" y1="498" x2="156" y2="513" stroke="#1E293B" strokeWidth="1.2" />
              {/* Caramel Brown Gum Rubber Sole */}
              <rect x="131" y="513" width="43" height="5" rx="2" fill="#B45309" stroke="#92400E" strokeWidth="0.8" />

              {/* Right Sneaker */}
              <path
                d="M208 497 L226 496 C232 495, 240 495, 244 498 C247 501, 248 508, 246 514 L206 514 C204 508, 203 500, 208 497 Z"
                fill="#FAFAF9"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#78716C'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1}
              />
              <line x1="220" y1="498" x2="222" y2="513" stroke="#1E293B" strokeWidth="1.2" />
              <line x1="225" y1="498" x2="227" y2="513" stroke="#1E293B" strokeWidth="1.2" />
              <line x1="230" y1="498" x2="232" y2="513" stroke="#1E293B" strokeWidth="1.2" />
              <rect x="204" y="513" width="43" height="5" rx="2" fill="#B45309" stroke="#92400E" strokeWidth="0.8" />
            </g>
          )}

          {/* 6. CHELSEA BOOTS / ANKLE BOOTS DA ĐEN (shoes-boots-chelsea) */}
          {effectiveFootwear === 'shoes-boots-chelsea' && (
            <g id="shoes-boots-chelsea-group">
              {/* Left Boot */}
              <path
                d="M139 485 L163 485 C165 491, 169 495, 173 500 C176 505, 176 511, 174 517 L134 517 C132 511, 131 504, 135 496 C137 491, 138 488, 139 485 Z"
                fill="url(#leather-shine)"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#09090B'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.3}
              />
              {/* Side elastic gusset */}
              <path d="M148 487 L154 487 L156 498 L146 498 Z" fill="#27272A" />
              <rect x="134" y="514" width="12" height="4" fill="#09090B" />

              {/* Right Boot */}
              <path
                d="M215 485 L239 485 C240 488, 241 491, 243 496 C247 504, 246 511, 244 517 L204 517 C202 511, 202 505, 205 500 C209 495, 213 491, 215 485 Z"
                fill="url(#leather-shine)"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#09090B'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.3}
              />
              <path d="M224 487 L230 487 L232 498 L222 498 Z" fill="#27272A" />
              <rect x="232" y="514" width="12" height="4" fill="#09090B" />
            </g>
          )}

          {/* 7. GIÀY LOAFER / MARY JANE ĐẾ BÁNH MÌ (shoes-loafer-mary-jane) */}
          {effectiveFootwear === 'shoes-loafer-mary-jane' && (
            <g id="shoes-loafer-mary-jane-group">
              {/* Left Mary Jane */}
              <path
                d="M134 497 C138 493, 146 493, 152 494 L170 495 C176 499, 175 507, 173 513 L133 513 C131 506, 132 501, 134 497 Z"
                fill="#0F172A"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#000000'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              {/* Strap & Gold Buckle */}
              <line x1="142" y1="497" x2="160" y2="497" stroke="#020617" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="156" y="495" width="4" height="4" rx="0.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
              <rect x="131" y="512" width="44" height="6" rx="2" fill="#09090B" stroke="#27272A" strokeWidth="0.8" />

              {/* Right Mary Jane */}
              <path
                d="M208 495 L226 494 C232 493, 240 493, 244 497 C246 501, 247 506, 245 513 L205 513 C203 507, 202 499, 208 495 Z"
                fill="#0F172A"
                stroke={hoveredZone === 'feet' ? '#FF7597' : '#000000'}
                strokeWidth={hoveredZone === 'feet' ? 1.8 : 1.2}
              />
              <line x1="218" y1="497" x2="236" y2="497" stroke="#020617" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="218" y="495" width="4" height="4" rx="0.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />
              <rect x="203" y="512" width="44" height="6" rx="2" fill="#09090B" stroke="#27272A" strokeWidth="0.8" />
            </g>
          )}

          {/* 8. SANDAL QUAI THÔ TỐI GIẢN (shoes-sandal-minimal) */}
          {effectiveFootwear === 'shoes-sandal-minimal' && (
            <g id="shoes-sandal-minimal-group">
              {/* Left Slide Sandal */}
              <rect x="133" y="513" width="41" height="5" rx="2" fill="#27272A" stroke="#18181B" strokeWidth="0.8" />
              <rect x="137" y="501" width="13" height="12" rx="1.5" fill="#3F3F46" stroke={hoveredZone === 'feet' ? '#FF7597' : '#18181B'} strokeWidth="0.8" />
              <rect x="154" y="503" width="13" height="10" rx="1.5" fill="#3F3F46" stroke={hoveredZone === 'feet' ? '#FF7597' : '#18181B'} strokeWidth="0.8" />

              {/* Right Slide Sandal */}
              <rect x="204" y="513" width="41" height="5" rx="2" fill="#27272A" stroke="#18181B" strokeWidth="0.8" />
              <rect x="211" y="503" width="13" height="10" rx="1.5" fill="#3F3F46" stroke={hoveredZone === 'feet' ? '#FF7597' : '#18181B'} strokeWidth="0.8" />
              <rect x="228" y="501" width="13" height="12" rx="1.5" fill="#3F3F46" stroke={hoveredZone === 'feet' ? '#FF7597' : '#18181B'} strokeWidth="0.8" />
            </g>
          )}

          {/* Feet zone closes cleanly without floating AI-slop badge */}
        </g>

        {/* ========================================================
            VÙNG 2: THÂN ÁO TRUYỀN THỐNG (TORSO & VIETNAMESE ROBE)
            Form dáng thon thả, rủ tự nhiên chuẩn fashion croquis
           ======================================================== */}
        <g
          id="zone-torso"
          className={isInteractive ? 'cursor-pointer transition-all duration-200' : ''}
          filter={hoveredZone === 'torso' || activeZone === 'torso' ? 'url(#zone-glow)' : undefined}
          onMouseEnter={() => isInteractive && setHoveredZone('torso')}
          onMouseLeave={() => isInteractive && setHoveredZone(null)}
          onClick={() => handleZoneClick('torso')}
        >
          {/* Hit test area for torso */}
          <rect x="70" y="140" width="240" height="280" fill="transparent" pointerEvents="all" />

          {/* --- CASE A: ÁO NHẬT BÌNH (Hoàng Gia Triều Nguyễn) --- */}
          {garment.id === 'nhat-binh' ? (
            <g id="nhat-binh-couture">
              {/* Thân Áo Dài Buông Thẳng Tự Nhiên (Long Straight Vertical Silhouette) */}
              <path
                d="M152 146 
                   C136 180, 130 240, 128 340 
                   C127 375, 126 405, 128 420 
                   C150 426, 230 426, 252 420 
                   C254 405, 253 375, 252 340 
                   C250 240, 244 180, 228 146 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#580826'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />
              <path
                d="M152 146 C136 240, 128 350, 128 420 C150 426, 230 426, 252 420 C252 350, 244 240, 228 146 Z"
                fill="url(#silk-sheen)"
              />

              {/* Tay Áo Thụng Dài Buông Rủ (Graceful Natural Flowing Sleeves) */}
              {/* Left Sleeve */}
              <path
                d="M152 146 
                   C134 175, 112 210, 102 270 
                   C99 295, 102 322, 110 328 
                   C124 332, 134 322, 138 310 
                   C140 265, 140 210, 142 185 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#580826'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              {/* Right Sleeve */}
              <path
                d="M228 146 
                   C246 175, 268 210, 278 270 
                   C281 295, 278 322, 270 328 
                   C256 332, 246 322, 242 310 
                   C240 265, 240 210, 238 185 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#580826'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />

              {/* Dải Ngũ Sắc Lượn Sóng Tự Nhiên Ở Cổ Tay (Ngũ Hành: Lục - Vàng - Lam - Đỏ - Trắng) */}
              {/* Left Sleeve Ngũ Sắc Waves */}
              <g id="left-ngu-sac-waves">
                <path d="M102 290 Q120 296 138 290" stroke="#10B981" strokeWidth="2.8" fill="none" />
                <path d="M103 296 Q121 302 138 296" stroke="#FBBF24" strokeWidth="2.8" fill="none" />
                <path d="M104 302 Q122 308 138 302" stroke="#3B82F6" strokeWidth="2.8" fill="none" />
                <path d="M105 308 Q123 314 138 308" stroke="#EF4444" strokeWidth="2.8" fill="none" />
                <path d="M106 314 Q124 320 138 314" stroke="#FFFFFF" strokeWidth="2.8" fill="none" />
              </g>

              {/* Right Sleeve Ngũ Sắc Waves */}
              <g id="right-ngu-sac-waves">
                <path d="M278 290 Q260 296 242 290" stroke="#10B981" strokeWidth="2.8" fill="none" />
                <path d="M277 296 Q259 302 242 296" stroke="#FBBF24" strokeWidth="2.8" fill="none" />
                <path d="M276 302 Q258 308 242 302" stroke="#3B82F6" strokeWidth="2.8" fill="none" />
                <path d="M275 308 Q257 314 242 308" stroke="#EF4444" strokeWidth="2.8" fill="none" />
                <path d="M274 314 Q256 320 242 314" stroke="#FFFFFF" strokeWidth="2.8" fill="none" />
              </g>

              {/* Cổ Viền Bản To (Chữ Nhật Vát Góc) Thêu Hoa Văn Vàng Hoàng Gia */}
              <path
                d="M168 146 L168 260 L212 260 L212 146 Z"
                fill="#FEF08A"
                stroke="url(#gold-trim)"
                strokeWidth="1.8"
              />
              {/* Họa tiết hoa văn viền cổ chữ Thọ/Song Hạc */}
              <rect x="172" y="152" width="36" height="102" fill="none" stroke="#D97706" strokeWidth="0.8" strokeDasharray="3 2" />
              <line x1="190" y1="150" x2="190" y2="258" stroke="#B45309" strokeWidth="1" />
              <circle cx="190" cy="182" r="4.5" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.8" />
              <circle cx="190" cy="220" r="4.5" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.8" />

              {/* Hai Dải Thắt Lưng Buông Rủ Phía Trước Ngực */}
              <path d="M180 260 L180 355 L187 350 L187 260 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
              <path d="M193 260 L193 355 L200 350 L200 260 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            </g>
          ) : garment.id === 'ao-tac' ? (
            /* --- CASE B: ÁO TẤC (Lễ Phục Ngũ Thân Tay Thụng) --- */
            <g id="ao-tac-couture">
              {/* Thân Áo Tấc Rủ Qua Gối */}
              <path
                d={
                  isAltered
                    ? 'M154 146 C136 185, 134 240, 134 290 Q190 300 246 290 C246 240, 244 185, 226 146 Z'
                    : 'M154 146 C136 195, 130 280, 126 418 Q190 435 254 418 C250 280, 244 195, 226 146 Z'
                }
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#6B0C23'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />
              <path
                d="M154 146 C136 280, 126 380, 126 418 Q190 435 254 418 C254 380, 244 280, 226 146 Z"
                fill="url(#silk-sheen)"
              />

              {/* Tay Thụng Dáng Rủ Tự Nhiên Mềm Mại */}
              {/* Left Wide Sleeve */}
              <path
                d="M154 146 
                   C134 175, 112 210, 104 270 
                   C100 298, 103 324, 114 330 
                   C128 334, 136 322, 140 305 
                   C142 250, 143 200, 146 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#6B0C23'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              {/* Right Wide Sleeve */}
              <path
                d="M226 146 
                   C246 175, 268 210, 276 270 
                   C280 298, 277 324, 266 330 
                   C252 334, 244 322, 240 305 
                   C238 250, 237 200, 234 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#6B0C23'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
            </g>
          ) : garment.id === 'ngu-than-tay-chen' ? (
            /* --- CASE C: ÁO NGŨ THÂN TAY CHẼN (Năng Động Sinh Hoạt) --- */
            <g id="ngu-than-couture">
              <path
                d={
                  isAltered
                    ? 'M156 146 C144 195, 142 245, 142 290 Q190 298 238 290 C238 245, 236 195, 224 146 Z'
                    : 'M156 146 C144 195, 140 280, 136 395 Q190 408 244 395 C240 280, 236 195, 224 146 Z'
                }
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#1E293B'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />
              <path
                d="M156 146 C144 280, 136 360, 136 395 Q190 408 244 395 C244 360, 236 280, 224 146 Z"
                fill="url(#silk-sheen)"
              />

              {/* Tay Chẽn Ôm Gọn Cổ Tay Tự Nhiên */}
              <path
                d="M156 146 C134 185, 118 240, 110 305 Q122 312 128 305 C136 245, 144 195, 150 170 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#1E293B'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              <path
                d="M224 146 C246 185, 262 240, 270 305 Q258 312 252 305 C244 245, 236 195, 230 170 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#1E293B'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
            </g>
          ) : garment.id === 'ao-tu-than' ? (
            /* --- CASE D: ÁO TỨ THÂN KINH BẮC (Hai Vạt Buộc Chéo) --- */
            <g id="tu-than-couture">
              {/* Yếm Đào Bên Trong */}
              <path d="M176 144 L190 182 L204 144 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />

              {/* Tà Áo Hai Bên Buông Rủ */}
              <path
                d="M154 146 C136 195, 132 280, 132 396 Q156 402 174 392 C170 270, 168 210, 164 165 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#451A03'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />
              <path
                d="M226 146 C244 195, 248 280, 248 396 Q224 402 206 392 C210 270, 212 210, 216 165 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#451A03'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />

              {/* Nút Thắt Buộc Hai Vạt Trước Bụng */}
              <ellipse cx="190" cy="265" rx="14" ry="9" fill={fabricColor} stroke="#451A03" strokeWidth="1.2" />
              <path d="M182 272 C178 310, 172 345, 170 360 L182 355 Z" fill={fabricColor} stroke="#451A03" strokeWidth="0.8" />
              <path d="M198 272 C202 310, 208 345, 210 360 L198 355 Z" fill={fabricColor} stroke="#451A03" strokeWidth="0.8" />
            </g>
          ) : garment.id === 'ao-ba-ba' ? (
            /* --- CASE E: ÁO BÀ BA NAM BỘ (Cổ Tròn, 2 Tà Xẻ Hông, 2 Túi Đắp) --- */
            <g id="ao-ba-ba-couture">
              <path
                d="M154 146 C140 195, 138 250, 138 335 Q190 345 242 335 C242 250, 240 195, 226 146 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#0F766E'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />
              {/* Hai Tà Xẻ Hông Duyên Dáng */}
              <line x1="138" y1="300" x2="138" y2="335" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1="242" y1="300" x2="242" y2="335" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />

              {/* Tay Áo Vừa Vặn */}
              <path
                d="M154 146 C136 190, 122 245, 114 300 Q124 306 130 300 C138 245, 144 195, 150 170 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#0F766E'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              <path
                d="M226 146 C244 190, 258 245, 266 300 Q256 306 250 300 C242 245, 236 195, 230 170 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#0F766E'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />

              {/* Cổ tròn xẻ giọt nước nhẹ */}
              <path d="M178 146 Q190 160 202 146" stroke="#0F766E" strokeWidth="1.4" fill="#FAF5EE" />
              <line x1="190" y1="160" x2="190" y2="335" stroke="#0F766E" strokeWidth="1" />
              {/* Cúc bấm tròn ngọc trai */}
              <circle cx="190" cy="180" r="2.2" fill="#FFFFFF" stroke="#0F766E" strokeWidth="0.6" />
              <circle cx="190" cy="210" r="2.2" fill="#FFFFFF" stroke="#0F766E" strokeWidth="0.6" />
              <circle cx="190" cy="240" r="2.2" fill="#FFFFFF" stroke="#0F766E" strokeWidth="0.6" />
              <circle cx="190" cy="270" r="2.2" fill="#FFFFFF" stroke="#0F766E" strokeWidth="0.6" />

              {/* Hai Túi Đắp Nổi Trước Bụng */}
              <rect x="148" y="278" width="22" height="24" rx="3" fill="#FFFFFF" fillOpacity="0.18" stroke="#0F766E" strokeWidth="0.8" />
              <rect x="210" y="278" width="22" height="24" rx="3" fill="#FFFFFF" fillOpacity="0.18" stroke="#0F766E" strokeWidth="0.8" />
            </g>
          ) : garment.id === 'ao-giao-linh' ? (
            /* --- CASE F: ÁO GIAO LĨNH (Cổ Chéo Tràng Vạt Thời Lê) --- */
            <g id="ao-giao-linh-couture">
              <path
                d="M152 146 C134 195, 128 280, 126 420 Q190 435 254 420 C252 280, 246 195, 228 146 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#1E3A8A'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />
              <path
                d="M152 146 C134 280, 126 380, 126 420 Q190 435 254 420 C254 380, 246 280, 228 146 Z"
                fill="url(#silk-sheen)"
              />
              {/* Tay Áo Thụng Dài Thanh Thoát */}
              <path
                d="M152 146 C132 175, 110 215, 102 275 C98 300, 102 326, 112 332 C126 335, 134 322, 138 305 C140 250, 142 200, 145 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#1E3A8A'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              <path
                d="M228 146 C248 175, 270 215, 278 275 C282 300, 278 326, 268 332 C254 335, 246 322, 242 305 C240 250, 238 200, 235 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#1E3A8A'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              {/* Cổ áo giao nhau vạt chéo (Hữu Nhậm) */}
              <path d="M164 146 L216 235" stroke="#FEF08A" strokeWidth="2.4" fill="none" />
              <path d="M216 146 L182 205" stroke="#FDE68A" strokeWidth="2" fill="none" />
              {/* Đai Thắt Lưng Vải Buông Thả */}
              <rect x="144" y="235" width="92" height="14" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
              <path d="M184 249 L184 370 L196 370 L196 249 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            </g>
          ) : garment.id === 'ao-vien-linh' ? (
            /* --- CASE G: ÁO VIÊN LĨNH (Cổ Tròn Quan Phục Có Bổ Tử) --- */
            <g id="ao-vien-linh-couture">
              <path
                d="M152 146 C134 195, 128 280, 126 422 Q190 435 254 422 C252 280, 246 195, 228 146 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#991B1B'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />
              <path
                d="M152 146 C134 280, 126 380, 126 422 Q190 435 254 422 C254 380, 246 280, 228 146 Z"
                fill="url(#silk-sheen)"
              />
              {/* Tay Áo Thụng Trang Nghiêm */}
              <path
                d="M152 146 C132 175, 110 215, 102 275 C98 300, 102 326, 112 332 C126 335, 134 322, 138 305 C140 250, 142 200, 145 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#991B1B'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              <path
                d="M228 146 C248 175, 270 215, 278 275 C282 300, 278 326, 268 332 C254 335, 246 322, 242 305 C240 250, 238 200, 235 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#991B1B'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              {/* Cổ Viên Lĩnh Tròn Khít Cao */}
              <circle cx="190" cy="144" r="22" stroke="#FEF08A" strokeWidth="2.5" fill="none" />
              {/* Bổ Tử Triều Đình Trước Ngực (Thêu Chim Hạc/Kỳ Lân Hoàng Gia) */}
              <rect x="166" y="180" width="48" height="48" rx="4" fill="#FEF08A" stroke="#B45309" strokeWidth="1.4" />
              <rect x="170" y="184" width="40" height="40" rx="2" fill="#DC2626" stroke="#FEF08A" strokeWidth="0.8" />
              <circle cx="190" cy="204" r="10" fill="#FEF08A" opacity="0.85" />
              <text x="190" y="208" textAnchor="middle" fontSize="10" fill="#78350F" fontWeight="bold">壽</text>
            </g>
          ) : (
            /* --- CASE H: ÁO ĐỐI KHÂM (Song Vạt Khoác Ngoài Quý Tộc) --- */
            <g id="ao-doi-kham-couture">
              {/* Lớp áo lót thân trong: Yếm thắm thêu hoa và áo lót kín đáo */}
              <path
                d="M152 146 C144 195, 142 270, 140 418 Q190 424 240 418 C238 270, 236 195, 228 146 Z"
                fill="#FFFDF9"
                stroke="#E2DDD5"
                strokeWidth="1"
              />
              {/* Cổ áo trong & Yếm đào thắm */}
              <path d="M172 146 L190 176 L208 146 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
              <circle cx="190" cy="162" r="2.2" fill="#FEF08A" />

              {/* Đai Thắt Lưng Bằng Lụa Buông Thướt Tha (Bản Rộng Mềm Mại) */}
              <rect x="148" y="248" width="84" height="12" rx="3" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
              {/* Dải thắt lưng buông đôi trước tà áo */}
              <path d="M182 260 C180 300, 178 350, 176 390 L186 386 L188 260 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
              <path d="M192 260 C194 300, 196 350, 198 390 L204 386 L202 260 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />

              {/* Thân Áo Khoác Ngoài Đối Khâm: Vạt Trái */}
              <path
                d="M152 146 
                   C134 195, 128 280, 126 422 
                   L178 422 
                   C176 340, 174 240, 174 146 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#4A044E'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />

              {/* Thân Áo Khoác Ngoài Đối Khâm: Vạt Phải */}
              <path
                d="M228 146 
                   C246 195, 252 280, 254 422 
                   L202 422 
                   C204 340, 206 240, 206 146 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#4A044E'}
                strokeWidth={hoveredZone === 'torso' ? 2 : 1.2}
              />

              {/* Lớp bóng nếp vải gấm đối khâm */}
              <path
                d="M152 146 C134 280, 126 380, 126 422 L178 422 C176 340, 174 240, 174 146 Z"
                fill="url(#silk-sheen)"
              />
              <path
                d="M228 146 C246 280, 254 380, 254 422 L202 422 C204 340, 206 240, 206 146 Z"
                fill="url(#silk-sheen)"
              />

              {/* Viền Nẹp Cổ & Mép Áo Dệt Kim Tuyến Vàng Sang Trọng (Cân Đối Song Song) */}
              <line x1="174" y1="146" x2="178" y2="422" stroke="#FEF08A" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="174" y1="146" x2="178" y2="422" stroke="#B45309" strokeWidth="0.8" strokeDasharray="3 2" />
              
              <line x1="206" y1="146" x2="202" y2="422" stroke="#FEF08A" strokeWidth="2.8" strokeLinecap="round" />
              <line x1="206" y1="146" x2="202" y2="422" stroke="#B45309" strokeWidth="0.8" strokeDasharray="3 2" />

              {/* Tay Áo Thụng Dài Liền Vai Mềm Mại */}
              {/* Tay Trái */}
              <path
                d="M152 146 
                   C132 175, 110 215, 102 275 
                   C98 300, 102 326, 112 332 
                   C126 335, 134 322, 138 305 
                   C140 250, 142 200, 146 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#4A044E'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
              {/* Tay Phải */}
              <path
                d="M228 146 
                   C248 175, 270 215, 278 275 
                   C282 300, 278 326, 268 332 
                   C254 335, 246 322, 242 305 
                   C240 250, 238 200, 234 175 Z"
                fill={`url(#silk-grad-${garment.id})`}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#4A044E'}
                strokeWidth={hoveredZone === 'torso' ? 1.8 : 1.2}
              />
            </g>
          )}

          {/* Cổ Lập Lĩnh & Khuy Ngũ Thường (Chỉ có ở Áo Tấc & Ngũ Thân) */}
          {(garment.id === 'ao-tac' || garment.id === 'ngu-than-tay-chen') && (
            <g id="stand-collar-and-five-buttons">
              {/* Cổ Lập Lĩnh Đứng Cao 3-4cm Nghiêm Cẩn */}
              <path
                d="M176 146 Q190 141 204 146 L206 131 Q190 126 174 131 Z"
                fill={fabricColor}
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#881337'}
                strokeWidth="1.2"
              />
              <path d="M176 133 Q190 128 204 133" stroke="#FEF08A" strokeWidth="1.2" fill="none" />

              {/* Vạt Cài Hữu Nhậm Sang Phải Với 5 Hạt Khuy Ngũ Thường */}
              <path
                d="M202 146 C214 175, 212 210, 206 240 L204 380"
                stroke={hoveredZone === 'torso' ? '#FF7597' : '#881337'}
                strokeWidth="1"
                strokeOpacity="0.8"
                fill="none"
              />

              {/* 5 Hạt Khuy: Nhân - Lễ - Nghĩa - Trí - Tín */}
              <circle cx="203" cy="148" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
              <circle cx="211" cy="172" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
              <circle cx="211" cy="202" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
              <circle cx="209" cy="235" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
              <circle cx="206" cy="270" r="2.8" fill="#F59E0B" stroke="#78350F" strokeWidth="0.6" />
            </g>
          )}

          {/* Handheld Props attached to torso level */}
          {hasAccessory('quat-phien-lua') && (
            <g id="silk-fan-prop">
              <line x1="258" y1="326" x2="266" y2="375" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />
              <ellipse cx="260" cy="312" rx="18" ry="20" fill="#FFFBEB" stroke="#D97706" strokeWidth="1" />
              <path d="M260 305 Q256 312 260 318 Q264 312 260 305 Z" fill="#F43F5E" />
              <line x1="266" y1="375" x2="267" y2="395" stroke="#E11D48" strokeWidth="1.2" />
            </g>
          )}

          {hasAccessory('vong-ngoc-boi') && (
            <g id="jade-pendant-prop">
              <circle cx="216" cy="275" r="8" fill="#A7F3D0" stroke="#059669" strokeWidth="1.2" />
              <circle cx="216" cy="275" r="3" fill="#FFFFFF" />
              <path d="M216 283 L216 325" stroke="#DC2626" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* ========================================================
            VÙNG 1: ĐẦU & TÓC (HEAD, NECK & HEADWEAR)
           ======================================================== */}
        <g
          id="zone-head"
          className={isInteractive ? 'cursor-pointer transition-all duration-200' : ''}
          filter={hoveredZone === 'head' || activeZone === 'head' ? 'url(#zone-glow)' : undefined}
          onMouseEnter={() => isInteractive && setHoveredZone('head')}
          onMouseLeave={() => isInteractive && setHoveredZone(null)}
          onClick={() => handleZoneClick('head')}
        >
          {/* Hit test area for head */}
          <rect x="110" y="30" width="160" height="115" fill="transparent" pointerEvents="all" />

          {/* Cổ Thon & Gương Mặt Điêu Khắc Thanh Thoát (Minimalist Faceless Fashion Silhouette) */}
          <path d="M184 116 L184 146 L196 146 L196 116 Z" fill="url(#mannequin-skin)" />
          <ellipse cx="190" cy="96" rx="21" ry="28" fill="url(#mannequin-skin)" />

          {/* Tóc Vấn Đen Truyền Thống */}
          {gender === 'nu' ? (
            <g id="female-hair">
              <path
                d="M170 94 C170 68 180 62 190 62 C200 62 210 68 210 94 C205 82 198 76 190 77 C182 76 175 82 170 94 Z"
                fill="#24140D"
              />
              <circle cx="190" cy="58" r="12" fill="#24140D" />
              <line x1="176" y1="56" x2="206" y2="52" stroke="#0D9488" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          ) : (
            <g id="male-hair">
              <path
                d="M169 94 C169 68 180 64 190 64 C200 64 211 68 211 94 C204 84 197 78 190 79 C183 78 176 84 169 94 Z"
                fill="#1C1917"
              />
            </g>
          )}

          {/* Phụ Kiện Nón / Khăn Thuộc Vùng Đầu */}
          {hasAccessory('non-quai-thao') && (
            <g id="non-quai-thao-hat">
              <ellipse cx="190" cy="62" rx="76" ry="19" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
              <ellipse cx="190" cy="62" rx="60" ry="14" fill="#FDE68A" />
              <circle cx="190" cy="62" r="10" fill="#B45309" fillOpacity="0.35" />
              {/* Quai Thao Dệt Tơ Tằm Rủ Thanh Thoát */}
              <path d="M132 68 Q136 160 148 245" stroke="#FF7597" strokeWidth="2.2" fill="none" />
              <path d="M248 68 Q244 160 232 245" stroke="#FF7597" strokeWidth="2.2" fill="none" />
            </g>
          )}

          {hasAccessory('non-la-truyen-thong') && !hasAccessory('non-quai-thao') && (
            <g id="non-la-hat">
              <path d="M120 72 L190 42 L260 72 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
              <ellipse cx="190" cy="72" rx="70" ry="14" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
              <path d="M145 74 Q190 120 235 74" stroke="#F43F5E" strokeWidth="2" fill="none" />
            </g>
          )}

          {hasAccessory('khan-dong-truyen-thong') && !hasAccessory('non-quai-thao') && !hasAccessory('non-la-truyen-thong') && (
            <g id="khan-dong-headwear">
              <path
                d="M168 82 Q190 70 212 82 L214 72 Q190 58 166 72 Z"
                fill={fabricColor}
                stroke="#881337"
                strokeWidth="1.2"
              />
              <path d="M167 76 Q190 64 213 76" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
              <path d="M168 71 Q190 60 212 71" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.45" fill="none" />
            </g>
          )}

          {hasAccessory('kinh-ram-y2k') && (
            <g id="sunglasses-prop">
              <ellipse cx="178" cy="96" rx="9.5" ry="6" fill="#18181B" stroke="#000" strokeWidth="1" />
              <ellipse cx="202" cy="96" rx="9.5" ry="6" fill="#18181B" stroke="#000" strokeWidth="1" />
              <line x1="187.5" y1="96" x2="192.5" y2="96" stroke="#000" strokeWidth="1.2" />
              <path d="M174 94 L181 92" stroke="#FFF" strokeWidth="0.8" strokeOpacity="0.8" />
              <path d="M198 94 L205 92" stroke="#FFF" strokeWidth="0.8" strokeOpacity="0.8" />
            </g>
          )}

          {hasAccessory('headphone-retro') && (
            <g id="headphones-prop">
              <path d="M168 138 Q190 152 212 138" stroke="#475569" strokeWidth="2.5" fill="none" />
              <rect x="158" y="130" width="12" height="18" rx="5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
              <rect x="210" y="130" width="12" height="18" rx="5" fill="#F59E0B" stroke="#78350F" strokeWidth="1" />
            </g>
          )}

          {hasAccessory('khan-ran-nam-bo') && (
            <g id="khan-ran-prop">
              <path
                d="M172 142 Q190 156 208 142 L216 230 Q190 236 164 230 Z"
                fill="#FFFFFF"
                stroke="#1F2937"
                strokeWidth="1.2"
              />
              <line x1="172" y1="160" x2="208" y2="160" stroke="#111827" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="170" y1="180" x2="210" y2="180" stroke="#111827" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="168" y1="200" x2="212" y2="200" stroke="#111827" strokeWidth="1" strokeDasharray="3 3" />
            </g>
          )}
        </g>
        </g>
      </svg>
    </div>
  );
};
