import React, { useRef, useState, useEffect } from 'react';
import { PhotoBoothResult } from './PhotoBoothCabin';
import {
  PHOTOBOOTH_FRAME_STYLES,
  PHOTOBOOTH_STICKERS,
  BOTTOMS_DATABASE,
  FOOTWEAR_DATABASE
} from '../data/garments';
import { AvatarCanvas } from './AvatarCanvas';
import { GarmentVisual } from './GarmentVisual';
import {
  Download,
  Share2,
  RotateCcw,
  Check,
  ExternalLink
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

  // Derive consolidated Gemini composite attributes
  const comp = result.config.geminiComposite;
  const finalTitle = comp?.photobooth_badge?.title || result.assessment.title;
  const finalScore = comp?.cultural_guardrail?.score ?? result.assessment.culturalScore;
  const finalHistoryFact = comp?.photobooth_badge?.history_fact || result.config.historicalInsight || result.assessment.historicalReason;

  const curBottom =
    BOTTOMS_DATABASE.find((b) => b.id === result.config.selectedBottomId) || BOTTOMS_DATABASE[0];
  const curFootwear =
    FOOTWEAR_DATABASE.find((f) => f.id === result.config.selectedFootwearId) || FOOTWEAR_DATABASE[0];

  const breakdownItems = comp?.shopping_breakdown?.items || [
    {
      name: `${result.config.garment.name} (${result.config.fabricId})`,
      action: 'THUÊ' as const,
      price_est: result.config.garment.baseRentalPrice,
      shopee_keyword: `thuê ${result.config.garment.name.toLowerCase()} việt phục`
    },
    {
      name: `Phần dưới: ${curBottom.name}`,
      action: 'MUA_SHOPEE' as const,
      price_est: curBottom.estimatedPrice,
      shopee_keyword: curBottom.searchKeyword
    },
    {
      name: `Giày dép: ${curFootwear.name}`,
      action: 'MUA_SHOPEE' as const,
      price_est: curFootwear.estimatedPrice,
      shopee_keyword: curFootwear.searchKeyword
    },
    ...result.config.selectedAccessories.map((accId) => ({
      name: accId,
      action: 'MUA_SHOPEE' as const,
      price_est: 45000,
      shopee_keyword: accId
    }))
  ];

  // Render photo strip directly onto HTML5 Canvas API for crisp HD PNG download
  const handleDownloadHD = async () => {
    setIsExporting(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 600;
      const height = 1920;
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

        const frameData = result.capturedFrames[i];
        if (frameData?.imageUrl) {
          // Render Real AI Virtual Try-On Frame onto Canvas
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.save();
              ctx.beginPath();
              ctx.roundRect(startX + 8, startY + 8, frameWidth - 16, frameHeight - 16, 4);
              ctx.clip();
              ctx.drawImage(img, startX + 8, startY + 8, frameWidth - 16, frameHeight - 16);
              ctx.restore();
              resolve();
            };
            img.onerror = () => resolve();
            img.src = frameData.imageUrl!;
          });
        } else {
          // Center position for the fashion mannequin
          const cx = startX + frameWidth / 2;

          // 1. Slender White Silk Trousers
          ctx.fillStyle = '#FAF8F5';
          ctx.strokeStyle = '#E2DDD5';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 30, startY + 230);
          ctx.lineTo(cx - 38, startY + 315);
          ctx.lineTo(cx - 10, startY + 315);
          ctx.lineTo(cx - 4, startY + 250);
          ctx.lineTo(cx + 4, startY + 250);
          ctx.lineTo(cx + 10, startY + 315);
          ctx.lineTo(cx + 38, startY + 315);
          ctx.lineTo(cx + 30, startY + 230);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // 2. Footwear (Chunky Sneaker or Minimalist Shoes)
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#9CA3AF';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(cx - 44, startY + 315, 34, 15, 4);
          ctx.roundRect(cx + 10, startY + 315, 34, 15, 4);
          ctx.fill();
          ctx.stroke();

          // 3. Fashion Traditional Robe Body
          ctx.fillStyle = garmentColor;
          ctx.strokeStyle = '#6B0C23';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - 24, startY + 115);
          ctx.lineTo(cx - 52, startY + 145);
          ctx.lineTo(cx - 48, startY + 275);
          ctx.quadraticCurveTo(cx, startY + 290, cx + 48, startY + 275);
          ctx.lineTo(cx + 52, startY + 145);
          ctx.lineTo(cx + 24, startY + 115);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Robe Sleeves
          ctx.beginPath();
          ctx.moveTo(cx - 52, startY + 145);
          ctx.lineTo(cx - 85, startY + 180);
          ctx.lineTo(cx - 80, startY + 235);
          ctx.lineTo(cx - 50, startY + 225);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(cx + 52, startY + 145);
          ctx.lineTo(cx + 85, startY + 180);
          ctx.lineTo(cx + 80, startY + 235);
          ctx.lineTo(cx + 50, startY + 225);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // 4. Stand Collar (Cổ Lập Lĩnh) & Gold Accent
          ctx.fillStyle = '#FEF08A';
          ctx.fillRect(cx - 16, startY + 106, 32, 10);
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - 16, startY + 106, 32, 10);

          // 5. Statuesque Sculpted Head & Neck
          ctx.fillStyle = '#FFF0E5';
          ctx.fillRect(cx - 8, startY + 92, 16, 16);
          ctx.beginPath();
          ctx.ellipse(cx, startY + 76, 16, 22, 0, 0, Math.PI * 2);
          ctx.fill();

          // Minimalist Chic Hair / Headwear
          ctx.fillStyle = '#24140D';
          ctx.beginPath();
          ctx.arc(cx, startY + 68, 17, Math.PI, 0);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx, startY + 52, 9, 0, Math.PI * 2);
          ctx.fill();
        }

        // 6. Pose caption
        ctx.fillStyle = selectedFrameStyle.textColor;
        ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`KHUNG 0${i + 1}: ${result.capturedFrames[i]?.poseName || 'TẠO DÁNG'}`, startX + 16, startY + frameHeight - 14);

        startY += frameHeight + gapY;
      }

      // 5. AI Exclusive Title & Cultural Score Badge
      ctx.fillStyle = selectedFrameStyle.textColor;
      ctx.font = 'italic bold 25px "Fraunces", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(`"${finalTitle}"`, width / 2, startY + 28);

      ctx.font = '13px "Be Vietnam Pro", sans-serif';
      ctx.fillText(
        `AI Cultural Score: ${finalScore}/100 · ${result.assessment.badge}`,
        width / 2,
        startY + 48
      );

      // Quẻ Bản Mệnh Ngũ Hành Tem Mộc on Canvas (nếu có)
      let insightOffset = 64;
      if (result.config.horoscopeProfile) {
        const hp = result.config.horoscopeProfile;
        ctx.fillStyle = '#881337';
        ctx.font = 'bold 11px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `🔮 BẢN MỆNH: ${hp.canChi.toUpperCase()} · ${hp.napAm.toUpperCase()} (MỆNH ${hp.element.toUpperCase()})`,
          width / 2,
          startY + 66
        );
        insightOffset = 78;
      }

      // AI Historical Insight Box on Canvas (Gemini Research)
      const rawInsight = finalHistoryFact;
      if (rawInsight) {
        const boxX = 40;
        const boxY = startY + insightOffset;
        const boxW = 520;
        const boxH = 88;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.strokeStyle = selectedFrameStyle.borderColor;
        ctx.lineWidth = 1;
        if (typeof (ctx as any).roundRect === 'function') {
          ctx.beginPath();
          (ctx as any).roundRect(boxX, boxY, boxW, boxH, 10);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillRect(boxX, boxY, boxW, boxH);
          ctx.strokeRect(boxX, boxY, boxW, boxH);
        }

        ctx.fillStyle = selectedFrameStyle.textColor;
        ctx.font = 'bold 10px "Space Mono", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('✦ INSIGHT DI SẢN (GEMINI AI RESEARCH)', boxX + 16, boxY + 20);

        ctx.font = 'italic 12px "Be Vietnam Pro", sans-serif';
        const words = `"${rawInsight}"`.split(' ');
        let curLine = '';
        let lineY = boxY + 40;
        for (let w = 0; w < words.length; w++) {
          const testLine = curLine + words[w] + ' ';
          const testW = ctx.measureText(testLine).width;
          if (testW > boxW - 32 && w > 0) {
            ctx.fillText(curLine.trim(), boxX + 16, lineY);
            curLine = words[w] + ' ';
            lineY += 18;
          } else {
            curLine = testLine;
          }
        }
        ctx.fillText(curLine.trim(), boxX + 16, lineY);
      }

      // 6. Barcode & Serial number
      ctx.fillStyle = selectedFrameStyle.textColor;
      ctx.font = '11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('||| | ||||| || |||| ||||| ||| ||||| ||', width / 2, height - 48);
      ctx.fillText('SERIAL #VB-2026-HERITAGE-GENZ', width / 2, height - 30);

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
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#881337] to-[#FF7597] flex items-center justify-center text-white shadow-sm shrink-0 font-mono text-xs font-bold">
              HD
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
                {[0, 1, 2, 3].map((poseIdx) => {
                  const frameData = result.capturedFrames[poseIdx];
                  return (
                    <div
                      key={poseIdx}
                      className="relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-black/10 shadow-sm"
                    >
                      {frameData?.imageUrl ? (
                        <img
                          src={frameData.imageUrl}
                          alt={frameData.poseName || `Dáng ${poseIdx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <AvatarCanvas
                          garment={result.config.garment}
                          gender={result.config.gender}
                          fabricColor={result.config.fabricColor}
                          fabricId={result.config.fabricId}
                          selectedAccessories={result.config.selectedAccessories}
                          selectedBottomId={result.config.selectedBottomId}
                          selectedFootwearId={result.config.selectedFootwearId}
                          poseIndex={poseIdx}
                          isAltered={result.config.isAltered}
                          showXRayPins={false}
                          showSealBadge={false}
                          renderMode="photostrip"
                          className="border-none shadow-none rounded-none aspect-auto h-full"
                        />
                      )}

                      {/* Frame Index Watermark */}
                      <span className="absolute bottom-1 right-2 text-[8px] font-mono opacity-50 font-bold bg-white/70 px-1 py-0.5 rounded shadow-xs">
                        0{poseIdx + 1} / 04
                      </span>
                    </div>
                  );
                })}
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
                  "{finalTitle}"
                </span>
                <span className="text-[10px] block opacity-75 mt-0.5">
                  Điểm Văn Hóa: {finalScore}/100 · {result.assessment.badge}
                </span>

                {/* Quẻ Bản Mệnh Ngũ Hành Tem Mộc Badge */}
                {result.config.horoscopeProfile && (
                  <div className="mt-2 py-1 px-2.5 rounded-lg bg-amber-500/10 border border-amber-600/25 text-left flex items-start gap-1.5">
                    <span className="text-xs leading-none mt-0.5">🔮</span>
                    <div className="text-[9px] space-y-0.5 leading-tight">
                      <div className="font-bold text-[#881337] flex items-center gap-1">
                        <span>{result.config.horoscopeProfile.canChi} · {result.config.horoscopeProfile.napAm}</span>
                        <span className="px-1 py-0.2 rounded bg-rose-200/80 text-[8px] font-mono font-bold text-rose-900">
                          MỆNH {result.config.horoscopeProfile.element.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[8.5px] opacity-80 italic">
                        Sắc phục hợp mệnh: {result.config.horoscopeProfile.luckyColorNames.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                {/* AI Historical Insight Badge đính kèm trực tiếp vào dải ảnh photobooth */}
                <div className="mt-2.5 p-2 rounded-xl bg-black/[0.04] border border-black/10 text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] shadow-[0_0_4px_#00F5D4] animate-pulse" />
                    <span className="text-[8px] font-mono font-bold tracking-wider uppercase opacity-75">
                      ✦ Lịch Sử Di Sản (Gemini AI Fact)
                    </span>
                  </div>
                  <p className="text-[10px] font-medium leading-relaxed italic opacity-90">
                    "{finalHistoryFact}"
                  </p>
                </div>

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

              {/* GEMINI SMART E-COMMERCE MATCHER: BẢNG BÓC TÁCH GIỎ ĐỒ */}
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-rose-50/70 via-orange-50/40 to-amber-50/60 border border-rose-200/90 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#EE4D2D] text-white flex items-center justify-center font-bold text-xs shadow-sm font-mono">
                      SP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#881337] uppercase tracking-wide">
                        Gemini Smart Shopping Matcher
                      </h4>
                      <span className="text-[10px] text-slate-500">
                        Bóc tách giỏ đồ theo ngân sách & sinh link Shopee chuẩn SEO
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">DỰ KIẾN TỔNG:</span>
                    <span className="text-xs font-mono font-bold text-[#881337]">
                      {(
                        comp?.shopping_breakdown?.total_estimated ||
                        breakdownItems.reduce((acc, it) => acc + (it.price_est || 0), 0)
                      ).toLocaleString('vi-VN')}{' '}
                      đ
                    </span>
                  </div>
                </div>

                {/* Danh sách bóc tách từng món */}
                <div className="space-y-2 pt-1">
                  {breakdownItems.map((item, idx) => {
                    const isShopee = item.action === 'MUA_SHOPEE';
                    const isRental = item.action === 'THUÊ';
                    const shopeeUrl = `https://shopee.vn/search?keyword=${encodeURIComponent(item.shopee_keyword || item.name)}`;

                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white border border-rose-100 hover:border-orange-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Action Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider shrink-0 uppercase ${
                              isShopee
                                ? 'bg-orange-100 text-[#EE4D2D] border border-orange-200'
                                : isRental
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {item.action}
                          </span>

                          <div className="min-w-0">
                            <strong className="text-xs font-semibold text-slate-900 block truncate">
                              {item.name}
                            </strong>
                            <span className="text-[10px] text-slate-400 block font-mono">
                              ~{item.price_est.toLocaleString('vi-VN')} đ
                            </span>
                          </div>
                        </div>

                        {/* Shopee Deeplink Button */}
                        {item.shopee_keyword ? (
                          <a
                            href={shopeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="self-end sm:self-auto px-3 py-1.5 rounded-lg bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[10px] font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                          >
                            <span>Mua Shopee</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Có sẵn trong tủ</span>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                  <span>Tủ Đồ Có Sẵn</span>
                </button>
              </div>

              {/* TAB 1: THUÊ ĐỒ QUANH KHU VỰC (V-Rental O2O) */}
              {activeTab === 'rental' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-50/70 border border-rose-200">
                    <GarmentVisual
                      id={result.config.garment.id}
                      name={result.config.garment.name}
                      color={result.config.fabricColor}
                      className="w-14 h-16 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs text-slate-700">
                        <strong className="text-slate-900 block truncate">{result.config.garment.name}</strong>
                        <span className="font-mono font-semibold text-[#881337] flex-shrink-0">
                          {result.config.garment.baseRentalPrice.toLocaleString('vi-VN')}đ/ngày
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {result.config.garment.dynasty} · Màu sắc đã chọn
                      </span>
                    </div>
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
                        <p className="text-[11px] text-slate-500">
                          <span>{store.address}</span>
                        </p>
                        {store.note && (
                          <p className="text-[10px] text-emerald-700 italic">
                            {store.note}
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
                    <h4 className="text-xs font-bold text-emerald-900">
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
