import React, { useState, useEffect, useRef } from 'react';
import { FittingConfig } from './FittingRoom';
import { AvatarCanvas } from './AvatarCanvas';
import { PHOTOBOOTH_POSES, XRayPoint } from '../data/garments';
import {
  Camera,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Sparkles,
  RotateCcw,
  Wand2,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';

interface PhotoBoothCabinProps {
  config: FittingConfig;
  onPhotosCaptured: (result: PhotoBoothResult) => void;
  onBackToFitting: () => void;
}

export interface GuardianAssessment {
  culturalScore: number;
  status: 'APPROVED' | 'WARNING' | 'ALERT';
  badge: string;
  title: string;
  historicalReason: string;
  colorHarmonyAnalysis: string;
  quickFixSuggestion: string | null;
  rentalStores: Array<{
    name: string;
    location: string;
    pricePerDay: string;
    address: string;
    note?: string;
  }>;
  shopeeAccessories: Array<{
    name: string;
    category: string;
    estimatedPrice: string;
    searchKeyword: string;
    shopeeDeepLink: string;
  }>;
  wardrobeAdvice: string;
}

export interface PhotoBoothResult {
  config: FittingConfig;
  assessment: GuardianAssessment;
  capturedFrames: Array<{
    poseIndex: number;
    poseName: string;
    timestamp: string;
  }>;
}

// Synthesize physical shutter and flash sound using Web Audio API
function playShutterSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Shutter click (high click + low mechanical thump)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);

    // Flash charge pop
    setTimeout(() => {
      try {
        const flashOsc = ctx.createOscillator();
        const flashGain = ctx.createGain();
        flashOsc.type = 'sine';
        flashOsc.frequency.setValueAtTime(320, ctx.currentTime);
        flashOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
        flashGain.gain.setValueAtTime(0.3, ctx.currentTime);
        flashGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        flashOsc.connect(flashGain);
        flashGain.connect(ctx.destination);
        flashOsc.start();
        flashOsc.stop(ctx.currentTime + 0.13);
      } catch (e) {
        // audio fail silent
      }
    }, 40);
  } catch (err) {
    // Audio unsupported or blocked
  }
}

export const PhotoBoothCabin: React.FC<PhotoBoothCabinProps> = ({
  config: initialConfig,
  onPhotosCaptured,
  onBackToFitting
}) => {
  const [currentConfig, setCurrentConfig] = useState<FittingConfig>(initialConfig);
  const [assessment, setAssessment] = useState<GuardianAssessment | null>(null);
  const [isLoadingGuardian, setIsLoadingGuardian] = useState<boolean>(true);
  const [isCurtainsClosing, setIsCurtainsClosing] = useState<boolean>(false);
  const [currentPoseIndex, setCurrentPoseIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [capturedPoses, setCapturedPoses] = useState<number[]>([]);
  const [isAutoShooting, setIsAutoShooting] = useState<boolean>(false);

  // Fetch Cultural Guardian Assessment from Gemini endpoint
  const evaluateStyling = async (cfg: FittingConfig) => {
    setIsLoadingGuardian(true);
    try {
      const response = await fetch('/api/cultural-guardian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeName: cfg.garment.name,
          garmentType: cfg.garment.shortTag,
          gender: cfg.gender,
          primaryColor: cfg.fabricColor,
          accessories: cfg.selectedAccessories,
          context: cfg.context,
          budget: cfg.budget,
          isAltered: cfg.isAltered,
          alterationType: cfg.alterationType
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAssessment(data);
      } else {
        throw new Error('Guardian endpoint non-200');
      }
    } catch (err) {
      console.warn('Evaluation fallback:', err);
      // Fallback structured assessment
      setAssessment({
        culturalScore: cfg.isAltered ? 58 : 94,
        status: cfg.isAltered ? 'WARNING' : 'APPROVED',
        badge: cfg.isAltered ? 'Biến Tướng Tà Áo Cần Lưu Ý' : 'Bảo Chứng Di Sản Chuẩn Mực',
        title: 'Tiểu Thư Ngũ Thân Y2K',
        historicalReason: `${cfg.garment.name} tuân thủ chặt chẽ cấu trúc cổ áo lập lĩnh và ngũ thường đoan trang.`,
        colorHarmonyAnalysis: 'Sự hòa hợp giữa sắc lụa truyền thống và nét chấm phá hiện đại tạo nên tổng thể cân đối.',
        quickFixSuggestion: cfg.isAltered ? 'Khôi phục vạt áo chuẩn mực nguyên bản để đảm bảo phong thái trang trọng.' : null,
        rentalStores: [
          {
            name: 'Đại Nam Chân Ảnh',
            location: 'Hà Nội',
            pricePerDay: '120.000đ - 180.000đ/ngày',
            address: '18 Hàng Bạc, Hoàn Kiếm, Hà Nội'
          },
          {
            name: 'Hoa Niên Cổ Phục',
            location: 'TP.HCM',
            pricePerDay: '150.000đ - 220.000đ/ngày',
            address: '42 Nguyễn Huệ, Quận 1, TP.HCM'
          }
        ],
        shopeeAccessories: cfg.selectedAccessories.map((a) => ({
          name: a,
          category: 'Phụ kiện',
          estimatedPrice: '45.000đ',
          searchKeyword: a,
          shopeeDeepLink: `https://shopee.vn/search?keyword=${encodeURIComponent(a)}`
        })),
        wardrobeAdvice: 'Tận dụng quần tây suông và giày sneaker trắng sẵn có.'
      });
    } finally {
      setIsLoadingGuardian(false);
    }
  };

  useEffect(() => {
    evaluateStyling(currentConfig);
  }, []);

  // Quick fix button clicked
  const handleApplyQuickFix = () => {
    const fixedConfig: FittingConfig = {
      ...currentConfig,
      isAltered: false,
      alterationType: 'none',
      context: 'Dạo phố Tràng Tiền & Chụp Photobooth'
    };
    setCurrentConfig(fixedConfig);
    evaluateStyling(fixedConfig);
  };

  // Trigger Photobooth 4-Shot Sequence
  const start4ShotSequence = () => {
    if (countdown !== null || isAutoShooting) return;
    setIsAutoShooting(true);
    setCapturedPoses([]);
    shootSingleFrame(0, []);
  };

  const shootSingleFrame = (poseIdx: number, accumulated: number[]) => {
    setCurrentPoseIndex(poseIdx);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);

        // Flash Trigger
        setIsFlashing(true);
        playShutterSound();
        const nextAccumulated = [...accumulated, poseIdx];
        setCapturedPoses(nextAccumulated);

        setTimeout(() => {
          setIsFlashing(false);
          // Check if sequence complete
          if (poseIdx < 3) {
            // Next frame in 1.2s
            setTimeout(() => {
              shootSingleFrame(poseIdx + 1, nextAccumulated);
            }, 1200);
          } else {
            // All 4 frames captured! Finish and go to printer
            setTimeout(() => {
              finishShooting(nextAccumulated);
            }, 1000);
          }
        }, 600);
      }
    }, 900);
  };

  const finishShooting = (allPoses: number[]) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const result: PhotoBoothResult = {
      config: currentConfig,
      assessment: assessment || {
        culturalScore: 92,
        status: 'APPROVED',
        badge: 'Bảo Chứng Di Sản Chuẩn Mực',
        title: 'Tiểu Thư Ngũ Thân Y2K',
        historicalReason: 'Bảo toàn phom dáng truyền thống kết hợp nhịp sống mới.',
        colorHarmonyAnalysis: 'Hài hòa ngũ hành sắc thái đương đại.',
        quickFixSuggestion: null,
        rentalStores: [],
        shopeeAccessories: [],
        wardrobeAdvice: ''
      },
      capturedFrames: allPoses.map((pIdx) => ({
        poseIndex: pIdx,
        poseName: PHOTOBOOTH_POSES[pIdx]?.name || `Dáng ${pIdx + 1}`,
        timestamp: timeStr
      }))
    };
    onPhotosCaptured(result);
  };

  // Status indicators for Traffic Light
  const statusColor =
    assessment?.status === 'APPROVED'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
      : assessment?.status === 'WARNING'
      ? 'text-amber-800 bg-amber-50 border-amber-300'
      : 'text-rose-900 bg-rose-50 border-rose-300';

  return (
    <div className="min-h-screen bg-[#FFF0F4] text-[#1E1B18] relative overflow-hidden pb-16">
      {/* Flash Overlay Simulation */}
      {isFlashing && (
        <div className="fixed inset-0 z-50 bg-white flash-active pointer-events-none" />
      )}

      {/* Decorative Photobooth Velvet Curtains Frame */}
      <div className="absolute top-0 left-0 bottom-0 w-8 lg:w-16 bg-gradient-to-r from-[#881337] via-[#9F1239] to-transparent pointer-events-none z-20 opacity-80" />
      <div className="absolute top-0 right-0 bottom-0 w-8 lg:w-16 bg-gradient-to-l from-[#881337] via-[#9F1239] to-transparent pointer-events-none z-20 opacity-80" />

      {/* Top Header */}
      <header className="px-4 py-3 bg-white/80 backdrop-blur-md border-b border-rose-200 flex items-center justify-between z-30 relative">
        <button
          onClick={onBackToFitting}
          disabled={countdown !== null}
          className="text-xs font-medium text-slate-600 hover:text-rose-900 flex items-center gap-1.5 transition-colors disabled:opacity-40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Về Bàn Chuẩn Bị</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-wider text-[#881337] uppercase">
            V-BOOTH PINK CABIN #01
          </span>
          <span className="block text-[10px] text-slate-400">
            Đèn Flash Softbox Hồng Phấn
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-rose-900 font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span>LIVE</span>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="max-w-4xl mx-auto px-4 pt-4 lg:pt-6 relative z-10">
        
        {/* Cultural Guardian (AI Người Gác Cổng Di Sản) Guardrail Card */}
        <section className="mb-5 bg-white/95 rounded-3xl border border-rose-200/90 p-4 shadow-[0_4px_16px_rgba(255,117,151,0.12)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#881337] to-[#FF7597] flex items-center justify-center text-white shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                    AI Cultural Guardian
                  </h3>
                  <span className="text-[10px] bg-rose-100 text-[#881337] px-2 py-0.5 rounded-full font-mono">
                    Gemini 1.5 Flash
                  </span>
                </div>
                <p className="text-[12px] text-slate-600 font-medium">
                  {isLoadingGuardian
                    ? 'Đang thẩm định phom dáng & bối cảnh văn hóa...'
                    : assessment?.badge}
                </p>
              </div>
            </div>

            {/* Score & Traffic Light Indicator */}
            <div className="flex items-center gap-3">
              {/* Traffic Light */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200">
                <span
                  title="Đèn Xanh: Chuẩn mực"
                  className={`w-3 h-3 rounded-full transition-all ${
                    assessment?.status === 'APPROVED'
                      ? 'bg-emerald-500 ring-2 ring-emerald-300 scale-110 shadow-sm'
                      : 'bg-emerald-200'
                  }`}
                />
                <span
                  title="Đèn Vàng: Cần lưu ý"
                  className={`w-3 h-3 rounded-full transition-all ${
                    assessment?.status === 'WARNING'
                      ? 'bg-amber-500 ring-2 ring-amber-300 scale-110 shadow-sm'
                      : 'bg-amber-200'
                  }`}
                />
                <span
                  title="Đèn Đỏ: Vi phạm nghi lễ"
                  className={`w-3 h-3 rounded-full transition-all ${
                    assessment?.status === 'ALERT'
                      ? 'bg-rose-600 ring-2 ring-rose-400 scale-110 shadow-sm'
                      : 'bg-rose-200'
                  }`}
                />
              </div>

              {/* Cultural Score Meter */}
              <div className="flex items-baseline gap-1 bg-rose-50 border border-rose-200 px-3 py-1 rounded-2xl">
                <span className="text-[10px] text-slate-500 font-semibold">ĐIỂM:</span>
                <span className="text-lg font-bold font-mono text-[#881337] tabular-nums">
                  {isLoadingGuardian ? '...' : assessment?.culturalScore}
                </span>
                <span className="text-[10px] text-slate-400">/100</span>
              </div>
            </div>
          </div>

          {/* Assessment Body */}
          {isLoadingGuardian ? (
            <div className="py-2 flex items-center gap-2 text-xs text-slate-500">
              <span className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
              <span>Kiểm định hoa văn, kết cấu khuy ngũ thường và độ hài hòa màu sắc...</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Title & Historical Insight */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">Danh hiệu set đồ: </span>
                  <span className="font-serif-heritage font-bold text-[#881337] text-sm">
                    "{assessment?.title}"
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  {assessment?.colorHarmonyAnalysis}
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-[#FFFDF9] border border-rose-100 rounded-xl p-2.5 leading-relaxed">
                📖 <strong>Góc nhìn di sản: </strong>
                {assessment?.historicalReason}
              </p>

              {/* Quick Fix Button if Warning / Alert */}
              {assessment?.quickFixSuggestion && (
                <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs text-amber-900 leading-snug flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{assessment.quickFixSuggestion}</span>
                  </div>
                  <button
                    onClick={handleApplyQuickFix}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 tactile-press flex items-center gap-1.5 shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Sửa nhanh theo gợi ý</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Photobooth Viewport & Live Studio */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Main Avatar Mannequin Frame (with Soft Flash glow) */}
          <div className="md:col-span-8 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[340px]">
              
              {/* Softbox Ring Lamp Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-300/30 via-rose-300/20 to-pink-300/30 rounded-[40px] blur-xl -z-10 pointer-events-none" />

              {/* Avatar Canvas with Current Pose */}
              <AvatarCanvas
                garment={currentConfig.garment}
                gender={currentConfig.gender}
                fabricColor={currentConfig.fabricColor}
                selectedAccessories={currentConfig.selectedAccessories}
                poseIndex={currentPoseIndex}
                isAltered={currentConfig.isAltered}
                showXRayPins={false}
              />

              {/* Countdown Overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center z-40 text-white animate-in zoom-in-90 duration-150">
                  <span className="text-7xl font-bold font-mono tracking-tighter drop-shadow-lg scale-125 animate-pulse text-[#FF7597]">
                    {countdown}
                  </span>
                  <span className="text-xs font-medium mt-2 tracking-wide uppercase text-rose-100">
                    Giữ nguyên nụ cười!
                  </span>
                </div>
              )}
            </div>

            {/* Current Pose Caption */}
            <div className="mt-3 text-center">
              <span className="text-xs font-semibold text-[#881337] bg-white/90 border border-rose-200 px-3 py-1 rounded-full shadow-sm">
                Khung {currentPoseIndex + 1}/4: {PHOTOBOOTH_POSES[currentPoseIndex]?.name}
              </span>
            </div>
          </div>

          {/* Side Controls & 4-Frame Progress Drawer */}
          <div className="md:col-span-4 space-y-4">
            
            {/* 4-Frame Thumbnail Strip Progress */}
            <div className="bg-white rounded-2xl border border-rose-200 p-3.5 shadow-sm">
              <span className="text-[11px] font-semibold text-[#881337] uppercase tracking-wider block mb-2">
                Dải Ảnh 4 Ô Kỷ Niệm
              </span>
              <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                {PHOTOBOOTH_POSES.map((pose, idx) => {
                  const isCaptured = capturedPoses.includes(idx);
                  const isCurrent = currentPoseIndex === idx;
                  return (
                    <div
                      key={pose.id}
                      className={`relative aspect-[3/4] rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all text-center ${
                        isCaptured
                          ? 'bg-rose-100/90 border-rose-400 text-[#881337] shadow-sm'
                          : isCurrent
                          ? 'bg-rose-50 border-[#FF7597] ring-2 ring-[#FF7597]/40'
                          : 'bg-[#FAF7F2] border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold">Ô {idx + 1}</span>
                      <span className="text-[9px] line-clamp-1 mt-0.5 leading-tight">
                        {isCaptured ? '✓ Đã chụp' : pose.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pose Switcher for Manual preview */}
            <div className="bg-white rounded-2xl border border-rose-200 p-3.5 shadow-sm">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mb-2">
                Đổi Tạo Dáng Thủ Công
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {PHOTOBOOTH_POSES.map((pose, idx) => (
                  <button
                    key={pose.id}
                    disabled={countdown !== null}
                    onClick={() => setCurrentPoseIndex(idx)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] text-left transition-all border ${
                      currentPoseIndex === idx
                        ? 'bg-rose-50 border-rose-300 text-[#881337] font-semibold'
                        : 'border-slate-100 hover:border-rose-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}. {pose.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Action: Start 4-Shot Camera Trigger */}
            <div className="pt-1">
              <button
                type="button"
                onClick={start4ShotSequence}
                disabled={countdown !== null || isAutoShooting}
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-[#881337] via-[#BE123C] to-[#FF7597] text-white font-bold text-sm shadow-[0_6px_20px_rgba(136,19,55,0.3)] hover:shadow-[0_8px_25px_rgba(136,19,55,0.4)] tactile-press flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <Camera className="w-5 h-5 text-rose-100" />
                <span>
                  {countdown !== null
                    ? `Đang đếm ngược ${countdown}...`
                    : isAutoShooting
                    ? 'Đang chụp liên hoàn 4 ô...'
                    : 'Bấm Chụp Dải 4 Ảnh Ngay 📸'}
                </span>
              </button>
              <span className="block text-center text-[10px] text-slate-400 mt-2 font-mono">
                Tự động chụp 4 dáng x nháy đèn flash & âm thanh retro
              </span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
