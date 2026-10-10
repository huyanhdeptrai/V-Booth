export type NguHanhElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface HoroscopeProfile {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  gender: 'nam' | 'nu' | 'other';
  canChi: string; // e.g. "Bính Tý", "Giáp Thân"
  element: NguHanhElement; // "Hỏa", "Thủy", etc.
  napAm: string; // e.g. "Sơn Đầu Hỏa", "Bạch Lạp Kim"
  luckyColorHexes: string[]; // List of recommended hex codes
  luckyColorNames: string[]; // e.g. ["Đỏ Son", "Hồng Cánh Sen", "Xanh Ngọc Bích"]
  forbiddenColorHexes: string[]; // List of colors to avoid
  forbiddenColorNames: string[]; // e.g. ["Đen Tuyền", "Xanh Chàm"]
  elementHarmonyRule: string; // e.g. "Mộc sinh Hỏa, Thủy khắc Hỏa"
  fortuneQuote: string; // Quẻ cát tường Gen Z
  recommendedOutfitId: string; // Recommended garment id
  recommendedColorHex: string; // Default recommended hex
}

// 60 Lục Thập Hoa Giáp Nạp Âm Table (Chuẩn Dân Gian Lịch Số Việt Nam)
const LUA_THAP_HOA_GIAP: Record<number, { canChi: string; napAm: string; element: NguHanhElement }> = {
  4: { canChi: 'Giáp Tý', napAm: 'Hải Trung Kim', element: 'Kim' },
  5: { canChi: 'Ất Sửu', napAm: 'Hải Trung Kim', element: 'Kim' },
  6: { canChi: 'Bính Dần', napAm: 'Lư Trung Hỏa', element: 'Hỏa' },
  7: { canChi: 'Đinh Mão', napAm: 'Lư Trung Hỏa', element: 'Hỏa' },
  8: { canChi: 'Mậu Thìn', napAm: 'Đại Lâm Mộc', element: 'Mộc' },
  9: { canChi: 'Kỷ Tỵ', napAm: 'Đại Lâm Mộc', element: 'Mộc' },
  10: { canChi: 'Canh Ngọ', napAm: 'Lộ Bàng Thổ', element: 'Thổ' },
  11: { canChi: 'Tân Mùi', napAm: 'Lộ Bàng Thổ', element: 'Thổ' },
  12: { canChi: 'Nhâm Thân', napAm: 'Kiếm Phong Kim', element: 'Kim' },
  13: { canChi: 'Quý Dậu', napAm: 'Kiếm Phong Kim', element: 'Kim' },
  14: { canChi: 'Giáp Tuất', napAm: 'Sơn Đầu Hỏa', element: 'Hỏa' },
  15: { canChi: 'Ất Hợi', napAm: 'Sơn Đầu Hỏa', element: 'Hỏa' },
  16: { canChi: 'Bính Tý', napAm: 'Giản Hạ Thủy', element: 'Thủy' },
  17: { canChi: 'Đinh Sửu', napAm: 'Giản Hạ Thủy', element: 'Thủy' },
  18: { canChi: 'Mậu Dần', napAm: 'Thành Đầu Thổ', element: 'Thổ' },
  19: { canChi: 'Kỷ Mão', napAm: 'Thành Đầu Thổ', element: 'Thổ' },
  20: { canChi: 'Canh Thìn', napAm: 'Bạch Lạp Kim', element: 'Kim' },
  21: { canChi: 'Tân Tỵ', napAm: 'Bạch Lạp Kim', element: 'Kim' },
  22: { canChi: 'Nhâm Ngọ', napAm: 'Dương Liễu Mộc', element: 'Mộc' },
  23: { canChi: 'Quý Mùi', napAm: 'Dương Liễu Mộc', element: 'Mộc' },
  24: { canChi: 'Giáp Thân', napAm: 'Tuyền Trung Thủy', element: 'Thủy' },
  25: { canChi: 'Ất Dậu', napAm: 'Tuyền Trung Thủy', element: 'Thủy' },
  26: { canChi: 'Bính Tuất', napAm: 'Ốc Thượng Thổ', element: 'Thổ' },
  27: { canChi: 'Đinh Hợi', napAm: 'Ốc Thượng Thổ', element: 'Thổ' },
  28: { canChi: 'Mậu Tý', napAm: 'Tích Lịch Hỏa', element: 'Hỏa' },
  29: { canChi: 'Kỷ Sửu', napAm: 'Tích Lịch Hỏa', element: 'Hỏa' },
  30: { canChi: 'Canh Dần', napAm: 'Tùng Bách Mộc', element: 'Mộc' },
  31: { canChi: 'Tân Mão', napAm: 'Tùng Bách Mộc', element: 'Mộc' },
  32: { canChi: 'Nhâm Thìn', napAm: 'Trường Lưu Thủy', element: 'Thủy' },
  33: { canChi: 'Quý Tỵ', napAm: 'Trường Lưu Thủy', element: 'Thủy' },
  34: { canChi: 'Giáp Ngọ', napAm: 'Sa Trung Kim', element: 'Kim' },
  35: { canChi: 'Ất Mùi', napAm: 'Sa Trung Kim', element: 'Kim' },
  36: { canChi: 'Bính Thân', napAm: 'Sơn Hạ Hỏa', element: 'Hỏa' },
  37: { canChi: 'Đinh Dậu', napAm: 'Sơn Hạ Hỏa', element: 'Hỏa' },
  38: { canChi: 'Mậu Tuất', napAm: 'Bình Địa Mộc', element: 'Mộc' },
  39: { canChi: 'Kỷ Hợi', napAm: 'Bình Địa Mộc', element: 'Mộc' },
  40: { canChi: 'Canh Tý', napAm: 'Bích Thượng Thổ', element: 'Thổ' },
  41: { canChi: 'Tân Sửu', napAm: 'Bích Thượng Thổ', element: 'Thổ' },
  42: { canChi: 'Nhâm Dần', napAm: 'Kim Bạch Kim', element: 'Kim' },
  43: { canChi: 'Quý Mão', napAm: 'Kim Bạch Kim', element: 'Kim' },
  44: { canChi: 'Giáp Thìn', napAm: 'Phú Đăng Hỏa', element: 'Hỏa' },
  45: { canChi: 'Ất Tỵ', napAm: 'Phú Đăng Hỏa', element: 'Hỏa' },
  46: { canChi: 'Bính Ngọ', napAm: 'Thiên Hà Thủy', element: 'Thủy' },
  47: { canChi: 'Đinh Mùi', napAm: 'Thiên Hà Thủy', element: 'Thủy' },
  48: { canChi: 'Mậu Thân', napAm: 'Đại Trạch Thổ', element: 'Thổ' },
  49: { canChi: 'Kỷ Dậu', napAm: 'Đại Trạch Thổ', element: 'Thổ' },
  50: { canChi: 'Canh Tuất', napAm: 'Thoa Xuyến Kim', element: 'Kim' },
  51: { canChi: 'Tân Hợi', napAm: 'Thoa Xuyến Kim', element: 'Kim' },
  52: { canChi: 'Nhâm Tý', napAm: 'Tang Đố Mộc', element: 'Mộc' },
  53: { canChi: 'Quý Sửu', napAm: 'Tang Đố Mộc', element: 'Mộc' },
  54: { canChi: 'Giáp Dần', napAm: 'Đại Khê Thủy', element: 'Thủy' },
  55: { canChi: 'Ất Mão', napAm: 'Đại Khê Thủy', element: 'Thủy' },
  56: { canChi: 'Bính Thìn', napAm: 'Sa Trung Thổ', element: 'Thổ' },
  57: { canChi: 'Đinh Tỵ', napAm: 'Sa Trung Thổ', element: 'Thổ' },
  58: { canChi: 'Mậu Ngọ', napAm: 'Thiên Thượng Hỏa', element: 'Hỏa' },
  59: { canChi: 'Kỷ Mùi', napAm: 'Thiên Thượng Hỏa', element: 'Hỏa' },
  0: { canChi: 'Canh Thân', napAm: 'Thạch Lựu Mộc', element: 'Mộc' },
  1: { canChi: 'Tân Dậu', napAm: 'Thạch Lựu Mộc', element: 'Mộc' },
  2: { canChi: 'Nhâm Tuất', napAm: 'Đại Hải Thủy', element: 'Thủy' },
  3: { canChi: 'Quý Hợi', napAm: 'Đại Hải Thủy', element: 'Thủy' }
};

export function calculateHoroscope(
  birthYear: number,
  birthMonth: number = 1,
  birthDay: number = 1,
  gender: 'nam' | 'nu' | 'other' = 'nu'
): HoroscopeProfile {
  // Lục Thập Hoa Giáp cycle uses year % 60
  const cycleIndex = birthYear % 60;
  const match = LUA_THAP_HOA_GIAP[cycleIndex] || {
    canChi: 'Giáp Tý',
    napAm: 'Hải Trung Kim',
    element: 'Kim'
  };

  switch (match.element) {
    case 'Hỏa':
      return {
        birthYear,
        birthMonth,
        birthDay,
        gender,
        canChi: match.canChi,
        element: 'Hỏa',
        napAm: match.napAm,
        luckyColorHexes: ['#BE123C', '#FF7597', '#0D9488', '#701A75'],
        luckyColorNames: ['Đỏ Son', 'Hồng Cánh Sen', 'Xanh Ngọc Bích (Mộc sinh Hỏa)', 'Tím Huế'],
        forbiddenColorHexes: ['#1E3A8A', '#0F172A'],
        forbiddenColorNames: ['Xanh Chàm Đậm', 'Đen Tuyền (Thủy khắc Hỏa)'],
        elementHarmonyRule: 'Mộc sinh Hỏa · Thủy khắc Hỏa',
        fortuneQuote: 'Lửa hồng nhiệt huyết, vận khí bừng sáng! Khoác sắc đỏ son hoặc hồng sen viền vàng để visual bùng nổ, khí chất vương giả!',
        recommendedOutfitId: 'nhat-binh',
        recommendedColorHex: '#BE123C'
      };

    case 'Thủy':
      return {
        birthYear,
        birthMonth,
        birthDay,
        gender,
        canChi: match.canChi,
        element: 'Thủy',
        napAm: match.napAm,
        luckyColorHexes: ['#1E3A8A', '#FAF5EE', '#0D9488'],
        luckyColorNames: ['Xanh Chàm', 'Trắng Ngà (Kim sinh Thủy)', 'Xanh Ngọc Bích'],
        forbiddenColorHexes: ['#D97706', '#78350F'],
        forbiddenColorNames: ['Vàng Hoa Hòe', 'Nâu Đất (Thổ khắc Thủy)'],
        elementHarmonyRule: 'Kim sinh Thủy · Thổ khắc Thủy',
        fortuneQuote: 'Dòng nước uyển chuyển thanh cao, sắc chàm thâm trầm như kẻ sĩ Kinh kỳ, diện vào là toát trọn vẻ bí ẩn tao nhã!',
        recommendedOutfitId: 'ao-tac',
        recommendedColorHex: '#1E3A8A'
      };

    case 'Mộc':
      return {
        birthYear,
        birthMonth,
        birthDay,
        gender,
        canChi: match.canChi,
        element: 'Mộc',
        napAm: match.napAm,
        luckyColorHexes: ['#0D9488', '#1E3A8A', '#FF7597'],
        luckyColorNames: ['Xanh Ngọc Bích', 'Xanh Chàm (Thủy sinh Mộc)', 'Hồng Cánh Sen'],
        forbiddenColorHexes: ['#FAF5EE', '#E2DDD5'],
        forbiddenColorNames: ['Trắng Bạc Kim (Kim khắc Mộc)'],
        elementHarmonyRule: 'Thủy sinh Mộc · Kim khắc Mộc',
        fortuneQuote: 'Cây cỏ mùa xuân đâm chồi nảy lộc, xanh ngọc bích tôn da rạng ngời, mang lại may mắn và bình an trọn vẹn!',
        recommendedOutfitId: 'ngu-than-tay-chen',
        recommendedColorHex: '#0D9488'
      };

    case 'Kim':
      return {
        birthYear,
        birthMonth,
        birthDay,
        gender,
        canChi: match.canChi,
        element: 'Kim',
        napAm: match.napAm,
        luckyColorHexes: ['#D97706', '#FAF5EE', '#FEF08A'],
        luckyColorNames: ['Vàng Hoa Hòe (Thổ sinh Kim)', 'Trắng Ngà Lụa', 'Vàng Hoàng Kim'],
        forbiddenColorHexes: ['#BE123C', '#FF7597'],
        forbiddenColorNames: ['Đỏ Son', 'Hồng Cánh Sen (Hỏa khắc Kim)'],
        elementHarmonyRule: 'Thổ sinh Kim · Hỏa khắc Kim',
        fortuneQuote: 'Vàng rực lộng lẫy, sắc sảo và kiêu sa! Áo vàng hòe gấm cung đình giúp bạn chiếm trọn spotlight mọi khung hình!',
        recommendedOutfitId: 'nhat-binh',
        recommendedColorHex: '#D97706'
      };

    case 'Thổ':
    default:
      return {
        birthYear,
        birthMonth,
        birthDay,
        gender,
        canChi: match.canChi,
        element: 'Thổ',
        napAm: match.napAm,
        luckyColorHexes: ['#D97706', '#BE123C', '#FF7597', '#701A75'],
        luckyColorNames: ['Vàng Hoa Hòe', 'Đỏ Son (Hỏa sinh Thổ)', 'Hồng Cánh Sen', 'Tím Huế'],
        forbiddenColorHexes: ['#0D9488'],
        forbiddenColorNames: ['Xanh Ngọc Bích (Mộc khắc Thổ)'],
        elementHarmonyRule: 'Hỏa sinh Thổ · Mộc khắc Thổ',
        fortuneQuote: 'Đất mẹ vững chãi, bao dung thịnh vượng. Phối sắc đỏ son hay vàng hoàng thổ đem lại phúc lộc và năng lượng an yên!',
        recommendedOutfitId: 'ao-tac',
        recommendedColorHex: '#D97706'
      };
  }
}
