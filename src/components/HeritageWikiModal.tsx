import React, { useState } from 'react';
import { GarmentVisual } from './GarmentVisual';
import {
  X,
  BookOpen,
  AlertTriangle,
  GraduationCap,
  PartyPopper,
  HeartHandshake,
  ArrowRight,
  ShieldAlert,
  Search,
  CheckCircle2
} from 'lucide-react';

interface HeritageWikiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGarment: (garmentId: string) => void;
}

export const HeritageWikiModal: React.FC<HeritageWikiModalProps> = ({
  isOpen,
  onClose,
  onSelectGarment
}) => {
  const [activeTab, setActiveTab] = useState<'garments' | 'etiquette'>('garments');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  // Dữ liệu 5 dòng cổ phục tiêu biểu
  const HERITAGE_GARMENTS = [
    {
      id: 'ao-tac',
      name: 'Áo Tấc (Áo Thụng Ngũ Thân)',
      subName: 'Đại Lễ Phục Trang Trọng Bậc Nhất',
      dynasty: 'Thời Chúa Nguyễn & Hoàng Triều Nguyễn (Thế kỷ XIX - XX)',
      colorHex: '#881337',
      role: 'Đại lễ phục cung đình & dân gian',
      keyTraits: [
        'Tay thụng rộng buông dài quá đầu ngón tay',
        'Cổ đứng lập lĩnh cao 3 - 4cm trang nghiêm',
        '5 khuy cài tượng trưng ngũ thường: Nhân - Lễ - Nghĩa - Trí - Tín',
        '5 thân áo biểu trưng tứ thân phụ mẫu ôm ấp lấy đứa con ở giữa'
      ],
      description:
        'Áo Tấc là biểu tượng cao quý của lễ phục triều Nguyễn, được cả hoàng tộc lẫn dân gian sử dụng trong các dịp đại lễ, hôn lễ, tế tự tổ tiên và bang giao. Khi hai tay chắp lại trước ngực hành lễ, tay thụng buông dài kín đáo tạo nên phong thái tôn nghiêm, khiêm cung và thanh tao của người Việt.',
      historicalInsight:
        'Cấu trúc 5 thân áo mang hàm nghĩa đạo hiếu sâu sắc: 2 thân trước và 2 thân sau tượng trưng cho tứ thân phụ mẫu (cha mẹ đẻ và cha mẹ chồng/vợ), thân con thứ năm nằm ẩn bên trong tượng trưng cho người con được cha mẹ yêu thương, bao bọc.',
      recommendedContext: 'Lễ tốt nghiệp, lễ cưới gia tiên, đại lễ văn hóa',
      tag: 'Lễ Phục Cung Đình'
    },
    {
      id: 'ngu-than-tay-chen',
      name: 'Áo Ngũ Thân Tay Chẽn',
      subName: 'Thường Phục Thanh Lịch & Tiền Thân Áo Dài',
      dynasty: 'Thời Chúa Nguyễn Phúc Khoát & Vua Minh Mạng',
      colorHex: '#1E3A8A',
      role: 'Thường phục thanh lịch, công sở & dạo phố',
      keyTraits: [
        'Tay áo bó sát gọn gàng từ khuỷu tay đến cổ tay',
        'Cổ lập lĩnh thanh thoát, cài khuy sang bên phải (hữu nhậm)',
        'Vạt áo dài qua đầu gối, xòe nhẹ tạo dáng đứng khoan thai',
        'Dễ dàng kết hợp phụ kiện hiện đại (sneaker, kính mát, túi xách)'
      ],
      description:
        'Áo Ngũ Thân tay chẽn ra đời từ cuộc cải cách trang phục của Chúa Nguyễn Phúc Khoát và được vua Minh Mạng chuẩn hóa toàn quốc vào năm 1837. Với ống tay bó gọn gàng, trang phục vừa giữ trọn nét kín đáo, đoan chính của cổ phục vừa linh hoạt cho đời sống sinh hoạt, công sở và dạo phố.',
      historicalInsight:
        'Là tiền thân trực tiếp của Áo Dài tân thời hiện đại. Người mặc Ngũ Thân tay chẽn luôn toát lên vẻ nho nhã, lịch thiệp của bậc sĩ tử tri thức.',
      recommendedContext: 'Chụp kỷ yếu, dạo phố Tràng Tiền - Phố Cổ, cà phê retro',
      tag: 'Biểu Tượng Tri Thức'
    },
    {
      id: 'nhat-binh',
      name: 'Áo Nhật Bình',
      subName: 'Tuyệt Tác Lễ Phục Hậu Phi & Công Chúa Triều Nguyễn',
      dynasty: 'Hoàng Triều Nhà Nguyễn (1802 - 1945)',
      colorHex: '#9F1239',
      role: 'Thường triều phục của Hoàng hậu, Công chúa & Mệnh phụ',
      keyTraits: [
        'Cổ áo hình chữ nhật viền hoa văn tinh xảo trước ngực',
        'Dải dệt ngũ sắc ở cổ tay tượng trưng Ngũ Hành tương sinh',
        'Hai dải dệt buông rủ thướt tha trước thân áo',
        'Thêu hoa văn phượng hoàng, hoa quả, mây cuộn vàng kim'
      ],
      description:
        'Khởi nguồn từ áo Phi Phong thời Minh nhưng được người Việt bản địa hóa hoàn toàn. Tên gọi "Nhật Bình" bắt nguồn từ chiếc cổ áo khi cài lại ghép thành hình chữ nhật phẳng ngay ngắn trước ngực. Đây là trang phục quyền quý bậc nhất chỉ dành cho phái nữ tôn quý trong hoàng cung triều Nguyễn.',
      historicalInsight:
        'Dải vải ngũ sắc nơi cửa tay áo tượng trưng cho 5 yếu tố Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ), biểu thị trật tự vũ trụ và sự hài hòa thịnh vượng của hoàng gia.',
      recommendedContext: 'Lễ vu quy, chụp ảnh kỷ niệm concept hoàng gia cung đình',
      tag: 'Hoàng Tộc Quyền Quý'
    },
    {
      id: 'ao-tu-than',
      name: 'Áo Tứ Thân Kinh Bắc',
      subName: 'Nét Duyên Dáng Dân Gian Đồng Bằng Bắc Bộ',
      dynasty: 'Bắc Bộ Việt Nam (Thế kỷ XII - XX)',
      colorHex: '#B91C1C',
      role: 'Trang phục truyền thống phụ nữ Bắc Bộ trẩy hội',
      keyTraits: [
        'Bốn vạt áo buông thướt tha, hai vạt trước buộc chéo trước bụng',
        'Mặc khoác ngoài yếm đào e ấp phối lưng ong thắt đáy',
        'Kết hợp thắt lưng bao lụa xanh/hồng rực rỡ',
        'Đội nón quai thao bản rộng hoặc khăn mỏ quạ đen tuyền'
      ],
      description:
        'Áo Tứ Thân gắn liền với hình tượng liền chị quan họ Kinh Bắc và người phụ nữ Việt Nam cần cù, đôn hậu, đảm đang. Áo không đơm khuy cúc phía trước mà mặc khoác mở để lộ chiếc yếm đào nhuộm hoa hiên hoặc cánh sen bên trong, thể hiện nét gợi cảm tinh tế, kín đáo của vẻ đẹp Á Đông.',
      historicalInsight:
        'Tứ thân áo tượng trưng cho 4 vị phụ mẫu: cha mẹ mình và cha mẹ chồng. Phần yếm thắm e ấp bên trong thể hiện sự chở che, đức tính đoan trang của người con gái.',
      recommendedContext: 'Hội Lim, du xuân lễ chùa, trải nghiệm văn hóa dân gian',
      tag: 'Dân Gian Kinh Bắc'
    },
    {
      id: 'ao-ba-ba',
      name: 'Áo Bà Ba Nam Bộ',
      subName: 'Biểu Tượng Hào Sảng, Phóng Khoáng Phương Nam',
      dynasty: 'Nam Bộ Việt Nam (Thế kỷ XIX - Hiện đại)',
      colorHex: '#0D9488',
      role: 'Trang phục dân dã miệt vườn & biểu tượng văn hóa Nam Bộ',
      keyTraits: [
        'Thân áo không có cổ, cổ tròn xẻ ngực hoặc xẻ chữ V dịu dàng',
        'Hai vạt áo xẻ tà bên hông tạo sự linh hoạt khi chèo ghe, di chuyển',
        'Hai túi vuông to tiện lợi may ở phía trước vạt',
        'Thường may bằng lụa mềm mại hoặc vải Lãnh Mỹ A đen tuyền trứ danh'
      ],
      description:
        'Áo Bà Ba là linh hồn của vùng đất phù sa trù phú miền Tây Nam Bộ. Với thiết kế tối giản, vạt áo ôm nhẹ đường cong mềm mại mà không hề gò bó, áo bà ba toát lên vẻ đẹp mộc mạc, chất phác nhưng vô cùng thanh lịch của người dân Nam Bộ hào sảng, trọng nghĩa tình.',
      historicalInsight:
        'Chất liệu quý tộc nhất từng được dùng may Áo Bà Ba là Lãnh Mỹ A (Tân Châu, An Giang) - dệt từ tơ tằm thượng hạng và nhuộm bằng mủ trái mặc nưa suốt hàng tháng trời, càng giặt càng óng ả màu đen tuyền.',
      recommendedContext: 'Du lịch miền Tây sông nước, chụp ảnh phong cảnh thiên nhiên, lễ hội ẩm thực',
      tag: 'Phóng Khoáng Miệt Vườn'
    }
  ];

  // Dữ liệu Điển lễ & Hoàn cảnh sử dụng
  const ETIQUETTE_TOPICS = [
    {
      id: 'ky-yeu',
      title: 'Lễ Tốt Nghiệp & Kỷ Yếu Học Đường',
      badge: 'Trang Trọng & Thanh Tân',
      icon: GraduationCap,
      garmentRecommend: 'Áo Ngũ Thân Tay Chẽn hoặc Áo Tấc',
      meaning:
        'Khoác lên mình bộ Áo Tấc hay Ngũ Thân trong ngày nhận bằng cử nhân là cách bạn trẻ tiếp nối tinh thần hiếu học của cha ông. Cổ lập lĩnh nghiêm cẩn và 5 khuy ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín) nhắc nhở người trẻ về đạo làm người và tinh thần dấn thân vì cộng đồng.',
      tip: 'Nên chọn màu xanh lam (Trí tuệ), xanh ngọc hoặc hồng phấn thanh lịch. Kết hợp giày sneaker trắng để tạo phong thái năng động, trẻ trung.'
    },
    {
      id: 'hoi-he',
      title: 'Lễ Hội Truyền Thống, Du Xuân & Lễ Chùa',
      badge: 'Giao Hòa Thiên Địa',
      icon: PartyPopper,
      garmentRecommend: 'Áo Tứ Thân Kinh Bắc hoặc Áo Ngũ Thân',
      meaning:
        'Dịp Tết Nguyên Đán và lễ hội đầu năm là thời khắc vạn vật sinh sôi. Việc diện cổ phục đi lễ chùa, trẩy hội Lim thể hiện lòng thành kính hướng về nguồn cội, nguyện cầu cho gia đạo bình an, phúc lộc trường tồn.',
      tip: 'Chọn sắc áo tương sinh bản mệnh (Mộc chọn Xanh, Hỏa chọn Đỏ/Hồng, Kim chọn Vàng/Trắng) để thu hút may mắn và chụp ảnh photobooth rực rỡ.'
    },
    {
      id: 'cuoi-hoi',
      title: 'Hôn Lễ & Nghi Thức Gia Tiên Trang Trọng',
      badge: 'Kết Duyên Trăm Năm',
      icon: HeartHandshake,
      garmentRecommend: 'Cặp Đôi Áo Tấc hoặc Chú Rể Áo Tấc - Cô Dâu Áo Nhật Bình',
      meaning:
        'Trong lễ gia tiên, Áo Tấc đôi tượng trưng cho sự hòa hợp âm dương và lòng hiếu kính đối với tổ tiên hai họ. Màu đỏ thắm hoặc hồng hoàng kim biểu trưng cho sự gắn kết son sắt, viên mãn và lời chúc phúc trăm năm hạnh phúc.',
      tip: 'Cô dâu có thể kết hợp khăn vành dây ngũ sắc hoặc mấn nhung; chú rể đội khăn đóng đen hoặc xanh thẫm truyền thống.'
    }
  ];

  // Cảnh báo quy chuẩn văn hóa (Cultural Guardrails)
  const CULTURAL_WARNINGS = [
    {
      rule: 'Tuyệt đối không cắt ngắn tà áo lễ phục hở eo',
      reason:
        'Áo Tấc, Ngũ Thân chuẩn mực luôn có tà dài quá gối để bảo vệ phong thái trang trọng, đoan chính. Việc xẻ tà cao hở eo làm biến tướng cấu trúc thiêng liêng của lễ phục truyền thống.',
      correctWay: 'Giữ nguyên tà áo dài phủ gối, kết hợp cùng quần lụa trắng hoặc quần âu ống suông lịch lãm.'
    },
    {
      rule: 'Không cài ngược vạt áo sang bên trái (Kiêng kỵ tả nhậm)',
      reason:
        'Trang phục người Việt từ ngàn đời luôn tuân theo quy tắc "Hữu nhậm" (vạt áo và hàng khuy cài sang bên phải). Theo phong tục cổ truyền, "Tả nhậm" (cài sang trái) chỉ dùng trong nghi thức khâm liệm tang ma, là điều đại kỵ trong sinh hoạt thường nhật.',
      correctWay: 'Luôn cài khuy áo và vắt tà từ trái sang phải theo đúng quy thức.'
    },
    {
      rule: 'Hoàn cảnh sử dụng Áo Nhật Bình cần tôn nghiêm',
      reason:
        'Áo Nhật Bình là lễ phục cung đình trang trọng bậc nhất của hoàng tộc triều Nguyễn, không phù hợp để mặc vào những không gian ồn ào như quán bar, hộp đêm.',
      correctWay: 'Sử dụng Nhật Bình trong lễ cưới, chụp ảnh kỷ niệm di sản hoặc sự kiện văn hóa nghệ thuật.'
    }
  ];

  const filteredGarments = HERITAGE_GARMENTS.filter((g) =>
    searchQuery === ''
      ? true
      : g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.dynasty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFDF9] rounded-3xl border border-rose-200/90 shadow-[0_20px_60px_rgba(136,19,55,0.25)] flex flex-col overflow-hidden z-10">
        
        {/* Modal Header */}
        <header className="px-5 sm:px-7 py-4.5 bg-gradient-to-r from-rose-100/70 via-[#FFFDF9] to-pink-50/60 border-b border-rose-200/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#881337] text-white flex items-center justify-center shadow-sm shrink-0">
              <BookOpen className="w-5 h-5 text-rose-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif-heritage font-bold text-[#881337] tracking-tight">
                  Từ Điển Di Sản V-Booth
                </h2>
                <span className="text-[10px] bg-rose-200/80 text-[#881337] px-2 py-0.5 rounded-full font-mono font-semibold">
                  Heritage Wiki
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-normal">
                Cẩm nang tri thức 5 dòng cổ phục tiêu biểu & điển lễ văn hóa chuẩn mực người Việt
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white border border-rose-200 text-slate-500 hover:text-[#881337] hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Tab Switcher & Search Bar */}
        <div className="px-5 sm:px-7 pt-4 pb-3 bg-white/60 border-b border-rose-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center p-1 bg-rose-100/70 rounded-2xl border border-rose-200/80 self-start sm:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('garments')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'garments'
                  ? 'bg-white text-[#881337] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>5 Dòng Cổ Phục Tiêu Biểu</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('etiquette')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center ${
                activeTab === 'etiquette'
                  ? 'bg-white text-[#881337] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Điển Lễ & Hoàn Cảnh Sử Dụng</span>
            </button>
          </div>

          {activeTab === 'garments' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm dòng áo, thời kỳ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#881337]"
              />
            </div>
          )}
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 scrollbar-thin">
          
          {/* TAB 1: 5 DÒNG CỔ PHỤC TIÊU BIỂU */}
          {activeTab === 'garments' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGarments.map((garment) => (
                  <div
                    key={garment.id}
                    className="bg-white rounded-2xl border border-rose-200/90 p-5 shadow-[0_2px_12px_rgba(255,117,151,0.06)] hover:border-rose-300 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Card Header with Miniature SVG Visual */}
                      <div className="flex items-start gap-3.5 mb-3.5 pb-3 border-b border-rose-100">
                        <div className="w-16 h-20 rounded-xl bg-rose-50/70 border border-rose-200/80 p-1 flex items-center justify-center shrink-0 shadow-xs">
                          <GarmentVisual
                            id={garment.id}
                            name={garment.name}
                            color={garment.colorHex}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-mono font-bold text-[#881337] bg-rose-100/80 px-2 py-0.5 rounded-md inline-block mb-1">
                            {garment.tag}
                          </span>
                          <h3 className="text-sm font-serif-heritage font-bold text-[#1E1B18] leading-tight block">
                            {garment.name}
                          </h3>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            {garment.dynasty}
                          </span>
                        </div>
                      </div>

                      {/* Description & Traits */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {garment.description}
                      </p>

                      <div className="bg-[#FFFDF9] rounded-xl border border-rose-100/90 p-3 mb-3 space-y-1.5">
                        <span className="text-[11px] font-bold text-[#881337] uppercase tracking-wider block">
                          Đặc Trưng Cốt Lõi:
                        </span>
                        <ul className="text-[11px] text-slate-700 space-y-1">
                          {garment.keyTraits.map((trait, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#881337] font-bold shrink-0">•</span>
                              <span>{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="text-[11px] text-slate-600 italic bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 mb-4">
                        💡 <strong>Điểm nhấn di sản:</strong> {garment.historicalInsight}
                      </div>
                    </div>

                    {/* Interactive CTA: Mặc Thử Phom Áo Này */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectGarment(garment.id);
                        onClose();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] transition-all group-hover:brightness-105"
                    >
                      <span>Mặc thử phom áo này</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ĐIỂN LỄ & HOÀN CẢNH SỬ DỤNG */}
          {activeTab === 'etiquette' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Context Guides */}
              <div>
                <h3 className="text-xs font-bold text-[#881337] uppercase tracking-wider mb-3">
                  Hoàn Cảnh Xuất Hiện & Ý Nghĩa Văn Hóa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {ETIQUETTE_TOPICS.map((topic) => {
                    const IconComp = topic.icon;
                    return (
                      <div
                        key={topic.id}
                        className="bg-white rounded-2xl border border-rose-200/90 p-4.5 shadow-[0_2px_12px_rgba(255,117,151,0.06)] space-y-2.5 flex flex-col justify-between"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="w-8 h-8 rounded-xl bg-rose-100 text-[#881337] flex items-center justify-center shrink-0">
                              <IconComp className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                              {topic.badge}
                            </span>
                          </div>

                          <h4 className="text-sm font-serif-heritage font-bold text-slate-900 leading-snug">
                            {topic.title}
                          </h4>

                          <div className="text-[11px] font-semibold text-[#881337] bg-[#FFFDF9] p-2 rounded-lg border border-rose-100">
                            Ưu tiên: <strong>{topic.garmentRecommend}</strong>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {topic.meaning}
                          </p>
                        </div>

                        <div className="text-[11px] text-slate-500 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 leading-snug">
                          <strong>Gợi ý phối:</strong> {topic.tip}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cultural Guardrail Warning Section */}
              <div className="bg-amber-50/90 rounded-2xl border-2 border-amber-300 p-5 shadow-sm space-y-3.5">
                <div className="flex items-center gap-2 text-amber-900">
                  <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                  <h3 className="text-xs font-bold uppercase tracking-wider">
                    Cảnh Báo Nghi Lễ & Bắt Lỗi Di Sản (AI Cultural Guardrail)
                  </h3>
                </div>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  Để gìn giữ nét đoan chính và giá trị lịch sử của cổ phục Việt Nam, nền tảng V-Booth khuyến cáo và tự động thẩm định nghiêm ngặt các quy chuẩn sau:
                </p>

                <div className="space-y-2.5">
                  {CULTURAL_WARNINGS.map((warn, i) => (
                    <div
                      key={i}
                      className="bg-white/95 rounded-xl p-3.5 border border-amber-200 text-xs space-y-1 shadow-xs"
                    >
                      <div className="flex items-center gap-2 font-bold text-amber-900">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{warn.rule}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] pl-5 leading-relaxed">
                        {warn.reason}
                      </p>
                      <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] pl-5 pt-0.5 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Cách mặc chuẩn: {warn.correctWay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <footer className="px-5 sm:px-7 py-3.5 bg-rose-50/60 border-t border-rose-200/70 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 shrink-0">
          <span className="font-mono text-[11px]">
            V-BOOTH DI SẢN ARCHIVE • NỀN TẢNG STYLIST CỔ PHỤC THÔNG MINH
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-rose-300 text-[#881337] font-semibold hover:bg-rose-50 transition-colors cursor-pointer self-stretch sm:self-auto text-center"
          >
            Đóng từ điển
          </button>
        </footer>

      </div>
    </div>
  );
};
