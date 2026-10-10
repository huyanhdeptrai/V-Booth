import React from 'react';

interface GarmentVisualProps {
  id: string;
  name: string;
  color?: string;
  className?: string;
}

export const GarmentVisual: React.FC<GarmentVisualProps> = ({
  id,
  name,
  color = '#881337',
  className = 'w-16 h-20'
}) => {
  // SVG silhouette representation of each traditional garment
  const renderGarmentSvg = () => {
    switch (id) {
      case 'ao-tac':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Áo Tấc - Tay thụng rộng, cổ lập lĩnh, vạt qua gối */}
            <path
              d="M40 22 C34 32, 22 42, 10 56 C14 62, 24 58, 28 50 C30 42, 32 36, 36 30 L34 98 C44 102, 56 102, 66 98 L64 30 C68 36, 70 42, 72 50 C76 58, 86 62, 90 56 C78 42, 66 32, 60 22 Z"
              fill={color}
              opacity="0.9"
            />
            {/* Lớp bóng nếp vải */}
            <path d="M42 26 C36 40, 32 60, 36 96" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
            <path d="M58 26 C64 40, 68 60, 64 96" stroke="#000000" strokeWidth="1.2" strokeOpacity="0.25" fill="none" />
            {/* Cổ lập lĩnh 3-4cm */}
            <path d="M44 22 Q50 18 56 22 L57 16 Q50 13 43 16 Z" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            {/* Khuy ngũ thường */}
            <circle cx="53" cy="24" r="1.2" fill="#FEF08A" />
            <circle cx="55" cy="32" r="1.2" fill="#FEF08A" />
            <circle cx="55" cy="42" r="1.2" fill="#FEF08A" />
            <circle cx="54" cy="52" r="1.2" fill="#FEF08A" />
            <circle cx="53" cy="62" r="1.2" fill="#FEF08A" />
          </svg>
        );

      case 'ngu-than-tay-chen':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Ngũ thân tay chẽn - Tay áo thon ôm sát cổ tay */}
            <path
              d="M42 22 C36 35, 26 55, 18 78 C24 81, 28 78, 30 70 C34 56, 36 42, 38 32 L36 96 C45 99, 55 99, 64 96 L62 32 C64 42, 66 56, 70 70 C72 78, 76 81, 82 78 C74 55, 64 35, 58 22 Z"
              fill={color}
              opacity="0.92"
            />
            {/* Cổ lập lĩnh */}
            <path d="M44 22 Q50 18 56 22 L57 16 Q50 13 43 16 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
            {/* Đường cài khuy sang phải */}
            <path d="M52 22 C56 36, 56 54, 54 75" stroke="#FEF08A" strokeWidth="1" strokeDasharray="1.5 2" fill="none" />
            <circle cx="53" cy="24" r="1.2" fill="#FEF08A" />
            <circle cx="55" cy="34" r="1.2" fill="#FEF08A" />
            <circle cx="55" cy="46" r="1.2" fill="#FEF08A" />
          </svg>
        );

      case 'nhat-binh':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Thân áo Nhật Bình suông dài */}
            <path
              d="M38 22 C32 34, 20 46, 12 60 C16 66, 26 62, 30 52 C32 44, 34 36, 36 30 L34 100 C45 104, 55 104, 66 100 L64 30 C66 36, 68 44, 70 52 C74 62, 84 66, 88 60 C80 46, 68 34, 62 22 Z"
              fill={color}
              opacity="0.95"
            />
            {/* Dải ngũ sắc ở cổ tay trái */}
            <path d="M14 53 Q20 57, 26 53" stroke="#10B981" strokeWidth="1.5" fill="none" />
            <path d="M15 56 Q21 60, 27 56" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
            <path d="M16 59 Q22 63, 28 59" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
            {/* Dải ngũ sắc ở cổ tay phải */}
            <path d="M86 53 Q80 57, 74 53" stroke="#10B981" strokeWidth="1.5" fill="none" />
            <path d="M85 56 Q79 60, 73 56" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
            <path d="M84 59 Q78 63, 72 59" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
            {/* Cổ viền bản to hình chữ nhật thêu hoa văn */}
            <rect x="44" y="20" width="12" height="38" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            <line x1="50" y1="20" x2="50" y2="58" stroke="#DC2626" strokeWidth="0.8" />
            <circle cx="50" cy="30" r="1.5" fill="#DC2626" />
            <circle cx="50" cy="44" r="1.5" fill="#DC2626" />
            {/* Dải dải dây buông trước ngực */}
            <line x1="47" y1="58" x2="47" y2="78" stroke="#FEF08A" strokeWidth="1" />
            <line x1="53" y1="58" x2="53" y2="78" stroke="#FEF08A" strokeWidth="1" />
          </svg>
        );

      case 'ao-tu-than':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Yếm đào bên trong */}
            <path d="M44 24 L50 36 L56 24 Z" fill="#F43F5E" />
            {/* 2 Vạt áo buông rủ 2 bên */}
            <path
              d="M38 24 C32 38, 24 54, 18 72 C22 75, 26 72, 28 66 C32 54, 34 40, 36 32 L34 94 C40 96, 45 92, 47 88 C45 60, 44 42, 42 30 Z"
              fill={color}
              opacity="0.9"
            />
            <path
              d="M62 24 C68 38, 76 54, 82 72 C78 75, 74 72, 72 66 C68 54, 66 40, 64 32 L66 94 C60 96, 55 92, 53 88 C55 60, 56 42, 58 30 Z"
              fill={color}
              opacity="0.9"
            />
            {/* Nút thắt buộc chéo hai vạt trước bụng */}
            <ellipse cx="50" cy="56" rx="5" ry="3.5" fill={color} stroke="#451A03" strokeWidth="0.8" />
            <path d="M48 58 C46 68, 43 78, 42 84" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M52 58 C54 68, 57 78, 58 84" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        );

      case 'ao-ba-ba':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Áo Bà Ba - Thân vừa vặn, tà xẻ hông, 2 túi đắp */}
            <path
              d="M40 24 C34 38, 24 56, 18 74 C23 77, 27 75, 29 68 C33 54, 35 42, 37 32 L36 82 Q50 85 64 82 L63 32 C65 42, 67 54, 71 68 C73 75, 77 77, 82 74 C76 56, 66 38, 60 24 Z"
              fill={color}
              opacity="0.9"
            />
            {/* Cổ tròn xẻ giọt nước */}
            <path d="M46 24 Q50 28 54 24" stroke="#FAF5EE" strokeWidth="1" fill="#FAF5EE" />
            <line x1="50" y1="28" x2="50" y2="80" stroke="#0F766E" strokeWidth="0.8" />
            {/* Cúc bấm tròn */}
            <circle cx="50" cy="34" r="1" fill="#FFFFFF" />
            <circle cx="50" cy="44" r="1" fill="#FFFFFF" />
            <circle cx="50" cy="54" r="1" fill="#FFFFFF" />
            <circle cx="50" cy="64" r="1" fill="#FFFFFF" />
            {/* Hai túi đắp nổi */}
            <rect x="40" y="66" width="7" height="8" rx="1" fill="#FFFFFF" fillOpacity="0.25" stroke="#0F766E" strokeWidth="0.6" />
            <rect x="53" y="66" width="7" height="8" rx="1" fill="#FFFFFF" fillOpacity="0.25" stroke="#0F766E" strokeWidth="0.6" />
          </svg>
        );

      case 'ao-giao-linh':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Giao Lĩnh - Cổ vạt chéo thời Lê */}
            <path
              d="M38 22 C30 35, 18 52, 10 65 C15 70, 24 66, 28 58 C30 48, 33 38, 35 30 L32 98 C44 102, 56 102, 68 98 L65 30 C67 38, 70 48, 72 58 C76 66, 85 70, 90 65 C82 52, 70 35, 62 22 Z"
              fill={color}
              opacity="0.9"
            />
            {/* Cổ áo giao nhau vạt chéo sang phải */}
            <path d="M38 22 L62 52" stroke="#FEF08A" strokeWidth="1.8" fill="none" />
            <path d="M62 22 L46 42" stroke="#FDE68A" strokeWidth="1.5" fill="none" />
            {/* Đai thắt lưng vải */}
            <rect x="36" y="52" width="28" height="6" fill="#FEF08A" stroke="#B45309" strokeWidth="0.8" />
            <line x1="48" y1="58" x2="48" y2="86" stroke="#FEF08A" strokeWidth="1.5" />
          </svg>
        );

      case 'ao-vien-linh':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Viên Lĩnh - Cổ tròn quan lại thời Lý - Trần - Lê */}
            <path
              d="M38 22 C30 36, 18 54, 10 66 C15 71, 24 67, 28 58 C30 48, 33 38, 35 30 L33 98 C44 102, 56 102, 67 98 L65 30 C67 38, 70 48, 72 58 C76 67, 85 71, 90 66 C82 54, 70 36, 62 22 Z"
              fill={color}
              opacity="0.9"
            />
            {/* Cổ tròn viền cao tròn khít */}
            <circle cx="50" cy="22" r="9" stroke="#FEF08A" strokeWidth="1.8" fill="none" />
            {/* Bổ tử thêu trước ngực hình chim thú phẩm cấp quan */}
            <rect x="42" y="32" width="16" height="16" rx="1.5" fill="#FEF08A" stroke="#DC2626" strokeWidth="0.8" />
            <circle cx="50" cy="40" r="4" fill="#DC2626" opacity="0.8" />
          </svg>
        );

      case 'ao-doi-kham':
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            {/* Đối Khâm - Áo khoác ngoài hai vạt song song thẳng đứng */}
            {/* Áo trong */}
            <path d="M42 24 L50 36 L58 24 L56 94 C52 95, 48 95, 44 94 Z" fill="#FFFDF9" stroke="#E2DDD5" strokeWidth="0.8" />
            {/* Hai vạt ngoài đối xứng */}
            <path
              d="M38 22 C30 36, 18 52, 12 65 C17 69, 25 65, 29 57 C31 48, 34 38, 36 30 L34 98 C40 100, 45 98, 46 95 L46 30 Z"
              fill={color}
              opacity="0.92"
            />
            <path
              d="M62 22 C70 36, 82 52, 88 65 C83 69, 75 65, 71 57 C69 48, 66 38, 64 30 L66 98 C60 100, 55 98, 54 95 L54 30 Z"
              fill={color}
              opacity="0.92"
            />
            {/* Viền hoa văn vàng hai bên mép đối khâm */}
            <line x1="46" y1="22" x2="46" y2="95" stroke="#FEF08A" strokeWidth="1.2" />
            <line x1="54" y1="22" x2="54" y2="95" stroke="#FEF08A" strokeWidth="1.2" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 100 120" className="w-full h-full" fill="none">
            <path
              d="M40 22 C34 32, 22 42, 10 56 C14 62, 24 58, 28 50 C30 42, 32 36, 36 30 L34 98 C44 102, 56 102, 66 98 L64 30 C68 36, 70 42, 72 50 C76 58, 86 62, 90 56 C78 42, 66 32, 60 22 Z"
              fill={color}
              opacity="0.85"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-gradient-to-b from-[#FFF5F7] via-[#FFFDF9] to-[#FAF5EE] border border-rose-200/80 p-1 flex items-center justify-center flex-shrink-0 shadow-sm ${className}`}
      title={name}
    >
      <div className="w-full h-full flex items-center justify-center filter drop-shadow-[0_2px_4px_rgba(136,19,55,0.12)]">
        {renderGarmentSvg()}
      </div>
      {/* Subtle shine corner */}
      <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-white/80 to-transparent pointer-events-none rounded-tr-xl" />
    </div>
  );
};
