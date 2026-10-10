// Gemini API Service for V-Booth (Tiệm Photobooth Việt Phục Ảo)
// Using Gemini Flash Latest REST endpoint with structured JSON GenerationConfig

export interface HoroscopeGeminiInput {
  birthDate: string; // YYYY-MM-DD
  gender: string; // 'Nữ' | 'Nam' | 'Khác'
  event: string;
}

export interface HoroscopeGeminiResponse {
  element_name: string; // vd: "Lộ Bàng Thổ", "Sơn Đầu Hỏa"
  vibe_quote: string;
  lucky_colors: string[]; // ["#BE123C", "#FF7597", "#0D9488"]
  unlucky_colors: string[]; // ["#1E3A8A"]
}

export interface BoothCompositeInput {
  garment: string;
  fabric: string;
  color: string;
  accessories: string[];
  event: string;
  budget: number;
  isAltered?: boolean;
  alterationType?: string;
}

export interface ShoppingBreakdownItem {
  name: string;
  action: 'THUÊ' | 'MUA_SHOPEE' | 'CÓ_SẴN';
  price_est: number;
  shopee_keyword: string;
}

export interface BoothCompositeGeminiResponse {
  cultural_guardrail: {
    score: number;
    status: 'APPROVED' | 'WARNING';
    warning_text: string;
    remedy_fix: string;
  };
  photobooth_badge: {
    title: string;
    history_fact: string;
  };
  shopping_breakdown: {
    total_estimated: number;
    items: ShoppingBreakdownItem[];
  };
}

/**
 * Helper to call Gemini REST API with json output mode
 */
async function callGeminiApi<T>(endpoint: string, input: object): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input),
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini service error [${res.status}]: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

/**
 * LUỒNG 1: API TÍNH BẢN MỆNH & GỢI Ý MÀU SẮC
 * Trigger: Khi user nhập Ngày sinh/Giới tính ở Bước 1 / Bước 0
 */
export async function fetchHoroscopeGemini(
  input: HoroscopeGeminiInput
): Promise<HoroscopeGeminiResponse> {
  try {
    const result = await callGeminiApi<HoroscopeGeminiResponse>('/api/horoscope', input);
    if (result && result.element_name && Array.isArray(result.lucky_colors)) {
      return result as HoroscopeGeminiResponse;
    }
    throw new Error('Invalid JSON format from Gemini Horoscope');
  } catch (err) {
    console.warn('[Gemini Service] Luồng 1 fetch error, using local fallback:', err);
    // Fallback based on birth year
    const year = parseInt(input.birthDate.split('-')[0], 10) || 2002;
    return getFallbackHoroscope(year, input.gender);
  }
}

/**
 * LUỒNG 2: API BUỒNG CHỤP TỔNG HỢP
 * Trigger: Khi bấm nút "Bước Vào Buồng Chụp / Bấm Flash"
 * Gộp chung cả 3 tính năng vào 1 request duy nhất:
 * 1. Cultural Guardrail
 * 2. Dải Ảnh Photobooth Badge & History Fact
 * 3. Smart E-Commerce Matcher
 */
export async function fetchBoothCompositeGemini(
  input: BoothCompositeInput
): Promise<BoothCompositeGeminiResponse> {
  try {
    const result = await callGeminiApi<BoothCompositeGeminiResponse>(
      '/api/booth-composite',
      input
    );
    if (
      result &&
      result.cultural_guardrail &&
      result.photobooth_badge &&
      result.shopping_breakdown
    ) {
      return result as BoothCompositeGeminiResponse;
    }
    throw new Error('Invalid JSON structure from Gemini Composite');
  } catch (err) {
    console.warn('[Gemini Service] Luồng 2 fetch error, using local fallback:', err);
    return getFallbackBoothComposite(input);
  }
}

// Fallback Horoscope generator when API is offline
function getFallbackHoroscope(year: number, gender: string): HoroscopeGeminiResponse {
  const elements = [
    { name: 'Hải Trung Kim', element: 'Kim', lucky: ['#D97706', '#FAF5EE', '#FEF08A'], unlucky: ['#BE123C', '#FF7597'] },
    { name: 'Lư Trung Hỏa', element: 'Hỏa', lucky: ['#BE123C', '#FF7597', '#0D9488'], unlucky: ['#1E3A8A', '#0F172A'] },
    { name: 'Đại Lâm Mộc', element: 'Mộc', lucky: ['#0D9488', '#1E3A8A', '#FF7597'], unlucky: ['#FAF5EE'] },
    { name: 'Lộ Bàng Thổ', element: 'Thổ', lucky: ['#D97706', '#BE123C', '#FF7597'], unlucky: ['#0D9488'] },
    { name: 'Kiếm Phong Kim', element: 'Kim', lucky: ['#D97706', '#FAF5EE'], unlucky: ['#BE123C'] },
    { name: 'Sơn Đầu Hỏa', element: 'Hỏa', lucky: ['#BE123C', '#FF7597', '#0D9488'], unlucky: ['#1E3A8A'] },
    { name: 'Giản Hạ Thủy', element: 'Thủy', lucky: ['#1E3A8A', '#FAF5EE', '#0D9488'], unlucky: ['#D97706'] },
    { name: 'Thành Đầu Thổ', element: 'Thổ', lucky: ['#D97706', '#BE123C'], unlucky: ['#0D9488'] },
    { name: 'Bạch Lạp Kim', element: 'Kim', lucky: ['#D97706', '#FAF5EE'], unlucky: ['#BE123C'] },
    { name: 'Dương Liễu Mộc', element: 'Mộc', lucky: ['#0D9488', '#1E3A8A'], unlucky: ['#FAF5EE'] }
  ];

  const matched = elements[Math.abs(year) % elements.length];
  return {
    element_name: matched.name,
    vibe_quote: `Năng lượng ${matched.element} bùng nổ, khoác sắc phục phong thủy hợp mệnh tự tin chiếm trọn spotlight photobooth!`,
    lucky_colors: matched.lucky,
    unlucky_colors: matched.unlucky
  };
}

// Fallback Composite generator when API is offline
function getFallbackBoothComposite(input: BoothCompositeInput): BoothCompositeGeminiResponse {
  const isShortLapel = input.alterationType === 'cropped_short' || input.isAltered;
  const isReverse = input.alterationType === 'reverse_lapel';
  const isBar = input.event.toLowerCase().includes('bar') && input.garment.includes('Nhật Bình');

  let score = 95;
  let status: 'APPROVED' | 'WARNING' = 'APPROVED';
  let warning_text = 'Trang phục chuẩn mực cổ truyền, bảo tồn cốt cách thanh tao và khí chất đoan chính người Việt.';
  let remedy_fix = '';

  if (isReverse) {
    score = 45;
    status = 'WARNING';
    warning_text = 'Khuy áo cổ truyền phải cài sang bên phải theo quy thức nghi lễ. Cài ngược sang trái là điều kiêng kỵ.';
    remedy_fix = 'Chuyển hàng khuy ngũ thường và vạt hữu nhậm cài sang bên phải.';
  } else if (isShortLapel) {
    score = 60;
    status = 'WARNING';
    warning_text = 'Áo tấc và ngũ thân vốn mang tà dài quá gối khoan thai; xẻ tà ngắn hở eo làm mất tính cân đối.';
    remedy_fix = 'Giữ nguyên chiều dài tà áo và phối cùng quần suông ống rộng.';
  } else if (isBar) {
    score = 68;
    status = 'WARNING';
    warning_text = 'Áo Nhật Bình là đại lễ phục cung đình triều Nguyễn, không phù hợp không gian vũ trường bar.';
    remedy_fix = 'Đổi bối cảnh dạo phố cổ hoặc chuyển sang áo Bà Ba / Ngũ Thân tay chẽn.';
  }

  const items: ShoppingBreakdownItem[] = [
    {
      name: `${input.garment} (${input.fabric})`,
      action: 'THUÊ',
      price_est: 150000,
      shopee_keyword: `thuê ${input.garment.toLowerCase()} việt phục`
    }
  ];

  if (input.accessories.includes('quat-phien-lua') || input.accessories.some((a) => a.includes('quat'))) {
    items.push({
      name: 'Quạt Phiến Tròn Lụa Tơ Tằm',
      action: 'MUA_SHOPEE',
      price_est: 65000,
      shopee_keyword: 'quạt phiến tròn lụa chụp ảnh cổ trang'
    });
  }

  if (input.accessories.includes('vong-ngoc-boi') || input.accessories.some((a) => a.includes('ngoc'))) {
    items.push({
      name: 'Ngọc Bội Cung Đình Khắc Hoa Sen',
      action: 'MUA_SHOPEE',
      price_est: 45000,
      shopee_keyword: 'ngọc bội đeo thắt lưng việt phục'
    });
  }

  if (input.accessories.includes('sneaker-chunky-trang') || input.accessories.some((a) => a.includes('sneaker'))) {
    items.push({
      name: 'Sneaker Chunky Trắng Retro',
      action: 'CÓ_SẴN',
      price_est: 0,
      shopee_keyword: 'giày sneaker chunky trắng'
    });
  }

  if (input.accessories.includes('non-quai-thao')) {
    items.push({
      name: 'Nón Quai Thao Quan Họ Bắc Ninh',
      action: 'THUÊ',
      price_est: 50000,
      shopee_keyword: 'thuê nón quai thao chụp ảnh kỷ yếu'
    });
  }

  const total = items.reduce((sum, item) => sum + item.price_est, 0);

  return {
    cultural_guardrail: {
      score,
      status,
      warning_text,
      remedy_fix
    },
    photobooth_badge: {
      title: input.garment.includes('Nhật Bình') ? 'Tiểu Thư Hoàng Triều Y2K' : 'Bá Kiến Trượt Ván',
      history_fact: `${input.garment} mang biểu trưng văn hóa đặc sắc, lưu giữ hồn cốt lễ nghi qua nhiều thế hệ.`
    },
    shopping_breakdown: {
      total_estimated: total,
      items
    }
  };
}
