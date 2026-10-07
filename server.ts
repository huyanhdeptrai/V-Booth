import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI with telemetry User-Agent as instructed by the gemini-api skill
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Cultural Guardian endpoint
app.post('/api/cultural-guardian', async (req: Request, res: Response) => {
  try {
    const {
      costumeName,
      gender,
      garmentType,
      primaryColor,
      accessories = [],
      context = 'Dạo phố Tràng Tiền & Chụp Photobooth',
      budget = 350000,
      isAltered = false,
      alterationType = 'none'
    } = req.body;

    // Check for obvious cultural red flags
    const hasShortHemAlteration = alterationType === 'cropped_short' || isAltered;
    const hasReverseLapel = alterationType === 'reverse_lapel';
    const isSacredAtParty = costumeName === 'Áo Nhật Bình' && context.toLowerCase().includes('bar');

    // Default fallback calculation in case Gemini API is not configured or fails
    const fallbackTitleOptions = [
      'Tiểu Thư Ngũ Thân Y2K',
      'Bá Kiến Trượt Ván',
      'Công Tử Tràng Tiền Lịch Lãm',
      'Nàng Thơ Kinh Bắc Neo-Retro',
      'Tử Tế Cung Đình Gen Z',
      'Mỹ Nam Áo Tấc Phố Cổ'
    ];
    const randomTitle = fallbackTitleOptions[Math.floor(Math.random() * fallbackTitleOptions.length)];

    let score = 92;
    let status: 'APPROVED' | 'WARNING' | 'ALERT' = 'APPROVED';
    let badge = 'Bảo Chứng Di Sản Chuẩn Mực';
    let reason = `${costumeName} mang form dáng trang nhã, bảo toàn cấu trúc cổ lập lĩnh truyền thống và tinh thần đoan chính người Việt.`;
    let fixSuggestion: string | null = null;

    if (hasReverseLapel) {
      score = 42;
      status = 'ALERT';
      badge = 'Cảnh Báo Vạt Khuy Sai Quy Chuẩn';
      reason = 'Việt phục truyền thống luôn cài khuy sang bên phải (tả nhậm/hữu nhậm theo nghi lễ). Cài ngược vạt là điều kiêng kỵ trong nghi lễ cổ truyền.';
      fixSuggestion = 'Chuyển vạt áo và hàng khuy cài sang bên phải để chuẩn mực phong thái.';
    } else if (hasShortHemAlteration) {
      score = 58;
      status = 'WARNING';
      badge = 'Biến Tướng Tà Áo Cần Lưu Tâm';
      reason = 'Áo tấc và ngũ thân vốn đề cao sự kín đáo và phong thái khoan thai với tà dài quá gối. Việc xẻ tà cao hở eo làm mất tính cân đối của trang phục.';
      fixSuggestion = 'Giữ nguyên độ dài tà áo chuẩn và kết hợp cùng quần lụa trắng hoặc quần tây dáng suông.';
    } else if (isSacredAtParty) {
      score = 65;
      status = 'WARNING';
      badge = 'Hoàn Cảnh Sử Dụng Cần Tinh Tế';
      reason = 'Áo Nhật Bình là lễ phục cung đình trang trọng bậc nhất của hoàng tộc triều Nguyễn, thích hợp cho sự kiện văn hóa, lễ cưới hỏi và chụp ảnh kỷ niệm hơn là không gian bar ồn ào.';
      fixSuggestion = 'Chuyển sang phong cách dạo phố với Áo Ngũ Thân tay chẽn hoặc Áo Tứ Thân năng động hơn.';
    }

    // Call Gemini API if available
    if (aiClient) {
      try {
        const prompt = `
Bạn là AI Cultural Guardian (Người gác cổng di sản) kiêm Giám đốc Sáng tạo Thời trang Việt Phục cho Gen Z tại Việt Nam.
Hãy thẩm định một bản phối đồ photobooth Việt phục sau đây:
- Trang phục: ${costumeName} (${garmentType})
- Giới tính avatar: ${gender === 'nu' ? 'Nữ' : 'Nam'}
- Màu sắc chủ đạo: ${primaryColor}
- Phụ kiện kết hợp: ${accessories.join(', ') || 'Không có phụ kiện phụ'}
- Bối cảnh / Mục đích: ${context}
- Ngân sách: ${budget.toLocaleString('vi-VN')} VNĐ
- Dị biến trang phục: ${alterationType} (${isAltered ? 'Có can thiệp cắt xẻ' : 'Giữ nguyên phom dáng gốc'})

YÊU CẦU:
1. Đánh giá culturalScore (0-100). Nếu có biến tướng phản cảm (cài ngược khuy, xẻ tà hở bụng phản cảm, báng bổ lễ phục cung đình Nhật Bình) thì cho điểm dưới 65. Nếu sáng tạo văn minh (áo ngũ thân mix sneaker, kính mát, headphone, nón quai thao) thì điểm cao từ 88-98 điểm.
2. Xác định status: 'APPROVED' (đèn xanh), 'WARNING' (đèn vàng), hoặc 'ALERT' (đèn đỏ).
3. Đặt danh hiệu Gen Z độc quyền dí dỏm, thời thượng (ví dụ: "Tiểu thư Ngũ Thân Y2K", "Bá Kiến Trượt Ván", "Công tử Tràng Tiền", "Chị Cả Tứ Thân").
4. Giải thích lịch sử súc tích trong 2 câu, văn phong gần gũi, giàu tri thức.
5. Phân tích ngũ hành hoặc độ tương phản phối màu.
6. Đưa ra gợi ý sửa nhanh nếu có cảnh báo.
7. Đề xuất 2-3 tiệm thuê đồ cổ phục uy tín tại Việt Nam (kèm giá 120k-250k/ngày) và phụ kiện Shopee tương thích với ngân sách sinh viên.
`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                culturalScore: { type: Type.INTEGER },
                status: { type: Type.STRING },
                badge: { type: Type.STRING },
                title: { type: Type.STRING },
                historicalReason: { type: Type.STRING },
                colorHarmonyAnalysis: { type: Type.STRING },
                quickFixSuggestion: { type: Type.STRING },
                rentalStores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      location: { type: Type.STRING },
                      pricePerDay: { type: Type.STRING },
                      address: { type: Type.STRING },
                      note: { type: Type.STRING },
                    },
                    required: ['name', 'location', 'pricePerDay', 'address'],
                  },
                },
                shopeeAccessories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      estimatedPrice: { type: Type.STRING },
                      searchKeyword: { type: Type.STRING },
                    },
                    required: ['name', 'category', 'estimatedPrice', 'searchKeyword'],
                  },
                },
                wardrobeAdvice: { type: Type.STRING },
              },
              required: [
                'culturalScore',
                'status',
                'badge',
                'title',
                'historicalReason',
                'colorHarmonyAnalysis',
                'rentalStores',
                'shopeeAccessories',
                'wardrobeAdvice',
              ],
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          // Attach Shopee deeplinks safely
          parsed.shopeeAccessories = (parsed.shopeeAccessories || []).map((acc: any) => ({
            ...acc,
            shopeeDeepLink: `https://shopee.vn/search?keyword=${encodeURIComponent(acc.searchKeyword || acc.name)}`,
          }));
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to curated guardian database:', geminiError);
      }
    }

    // High quality fallback payload matching requirements
    const payload = {
      culturalScore: score,
      status,
      badge,
      title: randomTitle,
      historicalReason: reason,
      colorHarmonyAnalysis: `Sắc ${primaryColor} tôn vinh vẻ thanh lịch của chất liệu gấm tơ tằm. Khi phối cùng phụ kiện hiện đại, tổng thể mang tính chiết trung (eclectic) hài hòa giữa quá khứ và đương đại.`,
      quickFixSuggestion: fixSuggestion,
      rentalStores: [
        {
          name: 'Đại Nam Chân Ảnh (V-Rental HN)',
          location: 'Hà Nội',
          pricePerDay: '120.000đ - 180.000đ/ngày',
          address: 'Số 18 Hàng Bạc, Hoàn Kiếm, Hà Nội',
          note: 'Có ưu đãi thẻ HSSV giảm 15%, tặng kèm quạt phiến.',
        },
        {
          name: 'Hoa Niên - Cổ Phục Viện',
          location: 'TP. Hồ Chí Minh',
          pricePerDay: '150.000đ - 220.000đ/ngày',
          address: '42 Nguyễn Huệ, Quận 1, TP.HCM',
          note: 'Chuyên Áo Tấc và Ngũ Thân chuẩn phom dáng triều Nguyễn.',
        },
        {
          name: 'Cố Đô Y Phục (Huế)',
          location: 'Thừa Thiên Huế',
          pricePerDay: '100.000đ - 160.000đ/ngày',
          address: '84 Bạch Đằng, Phú Cát, TP. Huế',
          note: 'Vải tơ lụa dệt thủ công làng nghề truyền thống.',
        },
      ],
      shopeeAccessories: accessories.map((acc: string) => ({
        name: acc,
        category: 'Phụ kiện Gen Z',
        estimatedPrice: '35.000đ - 110.000đ',
        searchKeyword: acc,
        shopeeDeepLink: `https://shopee.vn/search?keyword=${encodeURIComponent(acc)}`,
      })),
      wardrobeAdvice: 'Tận dụng quần tây ống suông màu kem hoặc đen có sẵn, phối cùng giày sneaker trắng sạch để tiết kiệm 100% chi phí mua sắm!',
    };

    return res.json(payload);
  } catch (err: any) {
    console.error('Error in cultural-guardian endpoint:', err);
    return res.status(500).json({ error: 'Internal server error', details: err?.message });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`V-Booth Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
