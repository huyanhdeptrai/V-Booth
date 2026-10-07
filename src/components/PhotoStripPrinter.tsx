import React, { useRef, useState, useEffect } from 'react';
import { PhotoBoothResult } from './PhotoBoothCabin';
import { PHOTOBOOTH_FRAME_STYLES, PHOTOBOOTH_STICKERS } from '../data/garments';
import { AvatarCanvas } from './AvatarCanvas';
import {
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Printer,
  Check,
  ShoppingBag,
  ExternalLink,
  Store,
  Shirt,
  Calendar,
  MapPin,
  Heart
} from 'lucide-react';

interface PhotoStripPrinterProps {
  result: PhotoBoothResult;
  onRetake: () => void;
  onGoToFitting: () => void;
}

export const PhotoStripPrinter: React.FC<PhotoStripPrinterProps> = ({
  result,
  onRetake,
  onGoToFitting
}) => {
  const [selectedFrameStyle, setSelectedFrameStyle] = useState(PHOTOBOOTH_FRAME_STYLES[0]);
  const [selectedStickers, setSelectedStickers] = useState<string[]>(['chim-hac', 'hoa-sen', 'tem-thu']);
  const [isPrinting, setIsPrinting] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'rental' | 'shopee' | 'wardrobe'>('rental');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const stripRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate slide-down printing animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPrinting(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleSticker = (stickerId: string) => {
    if (selectedStickers.includes(stickerId)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== stickerId));
    } else {
      setSelectedStickers([...selectedStickers, stickerId]);
    }
  };

  // Render photo strip directly onto HTML5 Canvas API for crisp HD PNG download
  const handleDownloadHD = async () => {
    setIsExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 600;
      const height = 1800;
      canvas.width = width;
      canvas.height = height;

      // 1. Draw Strip Background
      ctx.fillStyle = selectedFrameStyle.bgColor;
      ctx.fillRect(0, 0, width, height);

      // 2. Outer decorative border
      ctx.strokeStyle = selectedFrameStyle.borderColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, width - 24, height - 24);

      // 3. Header Title
      ctx.fillStyle = selectedFrameStyle.textColor;
      ctx.font = 'bold 24px "Fraunces", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('V-BOOTH • VIỆT PHỤC DI SẢN', width / 2, 55);

      ctx.font = '14px "Space Mono", monospace';
      ctx.fillText(`HÀ NỘI · ${new Date().toLocaleDateString('vi-VN')}`, width / 2, 80);

      // 4. Render 4 Photo frames
      const frameWidth = 520;
      const frameHeight = 360;
      const startX = 40;
      let startY = 105;
      const gapY = 24;

      // Color representations
      const garmentColor = result.config.fabricColor;

      for (let i = 0; i < 4; i++) {
        // Frame Card background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(startX, startY, frameWidth, frameHeight);

        ctx.strokeStyle = selectedFrameStyle.borderColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, frameWidth, frameHeight);

        // Frame inner background gradient
        const grad = ctx.createLinearGradient(startX, startY, startX, startY + frameHeight);
        grad.addColorStop(0, '#FFF5F7');
        grad.addColorStop(1, '#FAF5EE');
        ctx.fillStyle = grad;
        ctx.fillRect(startX + 8, startY + 8, frameWidth - 16, frameHeight - 16);

        // Silhouette representation with garment color
        ctx.fillStyle = garmentColor;
        ctx.beginPath();
        // Stylized Vietnamese garment torso
        ctx.roundRect(startX + 180, startY + 120, 160, 210, 16);
        ctx.fill();

        // Collar band
        ctx.fillStyle = '#FEF08A';
        ctx.fillRect(startX + 235, startY + 105, 50, 18);

        // Face & Head
        ctx.fillStyle = '#FFDFC4';
        ctx.beginPath();
        ctx.arc(startX + 260, startY + 75, 34, 0, Math.PI * 2);
        ctx.fill();

        // Hat or Hair
        ctx.fillStyle = '#24140D';
        ctx.beginPath();
        ctx.arc(startX + 260, startY + 58, 26, Math.PI, 0);
        ctx.fill();

        // Pose caption
        ctx.fillStyle = selectedFrameStyle.textColor;
        ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`KHUNG 0${i + 1}: ${result.capturedFrames[i]?.poseName || 'TẠO DÁNG'}`, startX + 16, startY + frameHeight - 14);

        startY += frameHeight + gapY;
      }

      // 5. AI Exclusive Title & Cultural Score Badge
      ctx.fillStyle = selectedFrameStyle.textColor;
      ctx.font = 'italic bold 26px "Fraunces", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(`"${result.assessment.title}"`, width / 2, height - 125);

      ctx.font = '13px "Be Vietnam Pro", sans-serif';
      ctx.fillText(
        `AI Cultural Score: ${result.assessment.culturalScore}/100 · ${result.assessment.badge}`,
        width / 2,
        height - 98
      );

      // 6. Barcode & Serial number
      ctx.font = '11px "Space Mono", monospace';
      ctx.fillText('||| | ||||| || |||| ||||| ||| ||||| ||', width / 2, height - 60);
      ctx.fillText('SERIAL #VB-2026-HERITAGE-GENZ', width / 2, height - 42);

      // 7. Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `V-BOOTH_${result.assessment.title.replace(/\s+/g, '_')}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export canvas:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Web Share API support
  const handleShareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `V-Booth: ${result.assessment.title}`,
          text: `Mình vừa chụp ảnh Việt Phục tại Tiệm V-Booth! Điểm bảo chứng di sản: ${result.assessment.culturalScore}/100. Danh hiệu: "${result.assessment.title}".`,
          url: window.location.href
        });
      } catch (e) {
        // user cancelled or share failed
      }
    } else {
      // Fallback copy link
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const currentStickers = PHOTOBOOTH_STICKERS.filter((s) => selectedStickers.includes(s.id));

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B18] pb-24">
      {/* Hidden Canvas for High Res Rendering */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-rose-200/60 px-4 lg:px-8 py-3 flex items-center justify-between">
        <button
          onClick={onRetake}
          className="text-xs font-medium text-slate-600 hover:text-rose-900 flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Chụp Lại Kiểu Khác</span>
        </button>

        <div className="flex items-center gap-2">
          <Printer className="w-4 h-4 text-[#881337]" />
          <h1 className="text-xs font-mono font-bold tracking-wider text-[#881337] uppercase">
            V-PRINT MACHINE #01
          </h1>
        </div>

        <button
          onClick={onGoToFitting}
          className="text-xs font-semibold text-[#881337] hover:underline"
        >
          Đổi Trang Phục
        </button>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 lg:px-8 pt-6">
        
        {/* Success Banner */}
        <div className="mb-6 bg-gradient-to-r from-rose-50 via-white to-rose-50 border border-rose-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#881337] to-[#FF7597] flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-5 h-5 text-rose-100" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#881337] font-semibold uppercase tracking-wider block">
                IN DẢI ẢNH THÀNH CÔNG
              </span>
              <h2 className="text-base font-serif-heritage font-bold text-[#881337]">
                Danh hiệu độc quyền: "{result.assessment.title}"
              </h2>
              <p className="text-xs text-slate-600">
                Điểm văn hóa: <strong className="text-[#881337]">{result.assessment.culturalScore}/100</strong> · {result.assessment.badge}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDownloadHD}
              disabled={isExporting}
              className="px-4 py-2.5 rounded-xl bg-[#881337] text-white text-xs font-semibold hover:bg-[#9F1239] tactile-press flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Đang xuất HD...' : 'Lưu Ảnh HD'}</span>
            </button>
            <button
              onClick={handleShareStory}
              className="px-4 py-2.5 rounded-xl bg-white border border-rose-200 text-[#881337] text-xs font-semibold hover:bg-rose-50 tactile-press flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Đã chép link!' : 'Chia Sẻ Story'}</span>
            </button>
          </div>
        </div>

        {/* 2-Column Layout: Left = Photo Strip (Film look), Right = Shopping Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: The Iconic 4-Frame Photo Strip */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Frame Customizer Controls */}
            <div className="w-full max-w-[320px] mb-3 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold">Đổi màu viền dải ảnh:</span>
              <div className="flex items-center gap-1.5">
                {PHOTOBOOTH_FRAME_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedFrameStyle(style)}
                    title={style.name}
                    className={`w-5 h-5 rounded-full border transition-all ${
                      selectedFrameStyle.id === style.id
                        ? 'ring-2 ring-[#881337] scale-110 shadow-sm'
                        : 'border-slate-300'
                    }`}
                    style={{ backgroundColor: style.bgColor }}
                  />
                ))}
              </div>
            </div>

            {/* Sticker Toggles */}
            <div className="w-full max-w-[320px] mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PHOTOBOOTH_STICKERS.map((stk) => {
                const isSelected = selectedStickers.includes(stk.id);
                return (
                  <button
                    key={stk.id}
                    onClick={() => toggleSticker(stk.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium border shrink-0 transition-all ${
                      isSelected
                        ? 'bg-rose-100 border-rose-300 text-[#881337] font-semibold'
                        : 'bg-white border-slate-200 text-slate-500'
                    }`}
                  >
                    <span>{stk.symbol} {stk.label}</span>
                  </button>
                );
              })}
            </div>

            {/* THE PHYSICAL PHOTO STRIP CONTAINER */}
            <div
              ref={stripRef}
              className={`w-full max-w-[320px] p-3.5 rounded-2xl shadow-[0_12px_36px_rgba(136,19,55,0.15)] border transition-all duration-700 relative overflow-hidden film-grain ${
                isPrinting ? 'translate-y-[-40px] opacity-0' : 'translate-y-0 opacity-100'
              }`}
              style={{
                backgroundColor: selectedFrameStyle.bgColor,
                borderColor: selectedFrameStyle.borderColor,
                color: selectedFrameStyle.textColor,
                transform: 'rotate(-0.5deg)'
              }}
            >
              {/* Header Stamp */}
              <div className="text-center pb-2.5 border-b border-black/10 mb-3">
                <span className="font-serif-heritage font-bold text-xs tracking-wider block">
                  V-BOOTH • TIỆM VIỆT PHỤC ẢO
                </span>
                <span className="text-[9px] font-mono opacity-60">
                  HÀ NỘI · {new Date().toLocaleDateString('vi-VN')} · STUDIO #01
                </span>
              </div>

              {/* 4 Photo Frames */}
              <div className="space-y-3">
                {[0, 1, 2, 3].map((poseIdx) => (
                  <div
                    key={poseIdx}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-black/10 shadow-sm"
                  >
                    <AvatarCanvas
                      garment={result.config.garment}
                      gender={result.config.gender}
                      fabricColor={result.config.fabricColor}
                      selectedAccessories={result.config.selectedAccessories}
                      poseIndex={poseIdx}
                      isAltered={result.config.isAltered}
                      showXRayPins={false}
                      renderMode="photostrip"
                      className="border-none shadow-none rounded-none aspect-auto h-full"
                    />

                    {/* Frame Index Watermark */}
                    <span className="absolute bottom-1 right-2 text-[8px] font-mono opacity-40 font-bold">
                      0{poseIdx + 1} / 04
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative Stickers layer */}
              <div className="mt-3 flex items-center justify-between text-base px-2">
                {currentStickers.slice(0, 4).map((s) => (
                  <span key={s.id} title={s.label}>{s.symbol}</span>
                ))}
              </div>

              {/* Footer Exclusive Title & Cultural Score */}
              <div className="mt-3 text-center border-t border-black/10 pt-2.5">
                <span className="font-serif-heritage font-bold text-sm block">
                  "{result.assessment.title}"
                </span>
                <span className="text-[10px] block opacity-75 mt-0.5">
                  Điểm Văn Hóa: {result.assessment.culturalScore}/100 · {result.assessment.badge}
                </span>

                {/* Barcode representation */}
                <div className="mt-2 font-mono text-[9px] opacity-40 tracking-widest">
                  ||| | ||||| || |||| ||||| ||| ||||| ||
                </div>
                <div className="text-[8px] font-mono opacity-40 mt-0.5">
                  V-BOOTH-HERITAGE-SERIAL-2026
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-mono mt-3 text-center">
              * Dải ảnh có độ nghiêng tự nhiên và hiệu ứng phim Polaroid cổ điển
            </p>
          </div>

          {/* Column 2: Bóc tách Giỏ Đồ Đa Kênh (Smart Budget & Shopping Breakdown) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-3xl border border-rose-200/80 p-5 shadow-[0_4px_16px_rgba(255,117,151,0.08)]">
              
              <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-4">
                <div>
                  <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider block">
                    Bóc Tách Giỏ Đồ & Mua Sắm Tiết Kiệm
                  </span>
                  <h3 className="text-base font-serif-heritage font-bold text-[#881337]">
                    Tối ưu theo ngân sách {result.config.budget.toLocaleString('vi-VN')} đ
                  </h3>
                </div>

                {result.config.isStudentMode && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-300">
                    ⚡ Tiết kiệm HSSV
                  </span>
                )}
              </div>

              {/* Segmented Filter Control for 3 Shopping Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-rose-50/70 rounded-2xl border border-rose-200/60 mb-5">
                <button
                  onClick={() => setActiveTab('rental')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'rental'
                      ? 'bg-white text-[#881337] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Thuê Cổ Phục</span>
                </button>

                <button
                  onClick={() => setActiveTab('shopee')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'shopee'
                      ? 'bg-white text-[#881337] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Sắm Shopee</span>
                </button>

                <button
                  onClick={() => setActiveTab('wardrobe')}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'wardrobe'
                      ? 'bg-white text-[#881337] shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shirt className="w-3.5 h-3.5" />
                  <span>Tủ Đồ Có Sẵn</span>
                </button>
              </div>

              {/* TAB 1: THUÊ ĐỒ QUANH KHU VỰC (V-Rental O2O) */}
              {activeTab === 'rental' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Trang phục chính: <strong>{result.config.garment.name}</strong></span>
                    <span>Giá thuê ước tính: 100k - 200k/ngày</span>
                  </div>

                  {result.assessment.rentalStores.map((store, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-rose-100 bg-[#FFFDF9] hover:border-rose-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{store.name}</h4>
                          <span className="text-[10px] bg-rose-50 text-[#881337] border border-rose-200 px-2 py-0.5 rounded-full font-medium">
                            {store.location}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{store.address}</span>
                        </p>
                        {store.note && (
                          <p className="text-[10px] text-emerald-700 italic">
                            💡 {store.note}
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="text-xs font-mono font-bold text-[#881337]">
                          {store.pricePerDay}
                        </span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.name + ' ' + store.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-[#881337] border border-rose-200 hover:bg-rose-100 text-[11px] font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Chỉ đường</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: SẮM PHỤ KIỆN TMĐT SHOPEE / LAZADA */}
              {activeTab === 'shopee' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <p className="text-xs text-slate-600 mb-2">
                    Các phụ kiện Gen Z phối cùng đã được tạo deeplink tìm kiếm trực tiếp trên Shopee với từ khóa chuẩn xác nhất:
                  </p>

                  {result.assessment.shopeeAccessories.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                      Bạn chưa chọn phụ kiện rời nào. Hãy quay lại Bàn Chuẩn Bị nếu muốn mix thêm sneaker, kính mắt hoặc quạt phiến!
                    </div>
                  ) : (
                    result.assessment.shopeeAccessories.map((acc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl border border-rose-100 bg-[#FFFDF9] hover:border-rose-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                      >
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{acc.name}</h4>
                          <span className="text-[11px] text-slate-500 block mt-0.5">
                            Phân loại: {acc.category} · Ước tính: <strong className="text-rose-900">{acc.estimatedPrice}</strong>
                          </span>
                        </div>

                        <a
                          href={acc.shopeeDeepLink || `https://shopee.vn/search?keyword=${encodeURIComponent(acc.searchKeyword)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-semibold tactile-press flex items-center gap-1.5 shadow-sm shadow-orange-500/20"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Sắm trên Shopee</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: TỦ ĐỒ CÁ NHÂN (FREE WARDROBE HACKS) */}
              {activeTab === 'wardrobe' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 space-y-2">
                    <h4 className="text-xs font-bold flex items-center gap-1.5 text-emerald-900">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Gợi Ý Tiết Kiệm 0 Đồng Từ Tủ Đồ
                    </h4>
                    <p className="text-xs leading-relaxed">
                      {result.assessment.wardrobeAdvice}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-xl border border-slate-200 bg-white">
                      <strong className="text-xs font-semibold text-slate-800 block">
                        👖 Quần Tây Ống Suông
                      </strong>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Dùng thay thế quần lụa trắng thụng. Màu đen hoặc be tạo nét hiện đại, lịch thiệp.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-white">
                      <strong className="text-xs font-semibold text-slate-800 block">
                        👟 Giày Sneaker Trắng
                      </strong>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tận dụng giày thể thao sẵn có, vừa êm chân vừa tạo phong cách Gen Z năng động.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Estimated Cost Card */}
            <div className="p-4 rounded-2xl bg-white border border-rose-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500">Tổng chi phí dự kiến trải nghiệm:</span>
                <span className="block text-base font-bold font-mono text-[#881337]">
                  {(result.config.garment.baseRentalPrice + (result.config.selectedAccessories.length > 0 ? 50000 : 0)).toLocaleString('vi-VN')} đ
                </span>
              </div>
              <button
                onClick={handleDownloadHD}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#881337] to-[#FF7597] text-white font-semibold text-xs shadow-md shadow-rose-900/20 tactile-press flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải Dải Ảnh Về Máy</span>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
