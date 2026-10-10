import React from 'react';

interface VBoothLogoProps {
  className?: string;
  variant?: 'full' | 'icon';
}

export const VBoothLogo: React.FC<VBoothLogoProps> = ({ className = 'h-12 w-auto', variant = 'full' }) => {
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 120 120"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="vBoothGradientIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#BE185D" />
            <stop offset="50%" stopColor="#9F1239" />
            <stop offset="100%" stopColor="#4C0519" />
          </linearGradient>
          <linearGradient id="goldFlashIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="50%" stopColor="#D97706" />
          </linearGradient>
        </defs>
        <g transform="translate(5, 10)">
          {/* Vạt áo trái */}
          <path
            d="M15 10 C 25 35, 45 65, 55 80 C 50 60, 35 30, 30 10 Z"
            fill="url(#vBoothGradientIcon)"
            opacity="0.85"
          />
          {/* Vạt áo phải */}
          <path
            d="M95 10 C 85 35, 65 65, 55 80 C 60 60, 75 30, 80 10 Z"
            fill="url(#vBoothGradientIcon)"
          />
          {/* Đường chỉ viền */}
          <path
            d="M20 12 L 55 78 L 90 12"
            fill="none"
            stroke="#FDA4AF"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
          {/* Ngôi sao Flash 4 cánh */}
          <path
            d="M55 22 Q 55 32 65 32 Q 55 32 55 42 Q 55 32 45 32 Q 55 32 55 22 Z"
            fill="url(#goldFlashIcon)"
          />
          <circle cx="55" cy="32" r="1.5" fill="#FFFBEB" />
        </g>
      </svg>
    );
  }

  // Chế độ full: Icon V Giao Lĩnh + chữ V-BOOTH lớn đậm rõ nét, không bị kẹt chữ H, tỷ lệ thoáng đãng
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 96"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="vBoothGradientFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BE185D" />
          <stop offset="50%" stopColor="#9F1239" />
          <stop offset="100%" stopColor="#4C0519" />
        </linearGradient>
        
        <linearGradient id="goldFlashFull" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* BIỂU TƯỢNG (ICON CHỮ V GIAO LĨNH X FLASH) */}
      <g transform="translate(10, 6)">
        {/* Vạt áo trái (Nét thanh lịch buông xuống) */}
        <path 
          d="M15 10 C 25 35, 45 65, 55 80 C 50 60, 35 30, 30 10 Z" 
          fill="url(#vBoothGradientFull)" 
          opacity="0.85" 
        />
        
        {/* Vạt áo phải (Cắt vát dứt khoát tạo góc chữ V đối xứng) */}
        <path 
          d="M95 10 C 85 35, 65 65, 55 80 C 60 60, 75 30, 80 10 Z" 
          fill="url(#vBoothGradientFull)" 
        />

        {/* Đường chỉ viền tà áo tối giản */}
        <path 
          d="M20 12 L 55 78 L 90 12" 
          fill="none" 
          stroke="#FDA4AF" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          opacity="0.75" 
        />

        {/* Ngôi sao Flash 4 cánh tinh tế ở đỉnh giao thoa */}
        <path 
          d="M55 22 Q 55 32 65 32 Q 55 32 55 42 Q 55 32 45 32 Q 55 32 55 22 Z" 
          fill="url(#goldFlashFull)" 
        />
        {/* Chấm ngọc trung tâm */}
        <circle cx="55" cy="32" r="1.8" fill="#FFFBEB" />
      </g>

      {/* TYPOGRAPHY CHỮ V-BOOTH TO RÕ, ĐẦY ĐỦ KHÔNG BỊ CẮT CHỮ H */}
      <g transform="translate(120, 62)">
        <text 
          fontFamily="'Playfair Display', 'Cinzel', 'Times New Roman', Georgia, serif" 
          fontSize="46" 
          fontWeight="700" 
          letterSpacing="3" 
          fill="#881337"
        >
          V-BOOTH
        </text>
      </g>
    </svg>
  );
};
