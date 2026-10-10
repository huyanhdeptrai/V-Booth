import React, { useState, useEffect, useRef } from 'react';
import { FittingConfig } from './FittingRoom';
import { AvatarCanvas } from './AvatarCanvas';
import { PHOTOBOOTH_POSES } from '../data/garments';
import { fetchBoothCompositeGemini } from '../services/geminiService';
import { buildOutfitPrompt, generateVBoothTryOn, ShotType } from '../services/tryOnService';
import {
  RotateCcw,
  Wand2,
  AlertTriangle
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
    imageUrl?: string;
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
  const [currentPoseIndex, setCurrentPoseIndex] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [capturedPoses, setCapturedPoses] = useState<number[]>([]);
  const [isAutoShooting, setIsAutoShooting] = useState<boolean>(false);

  // WEBCAM & AI VIRTUAL TRY-ON STATES
  const [captureMode, setCaptureMode] = useState<'webcam' | 'mannequin'>('webcam');
  const [shotType, setShotType] = useState<ShotType>('half-body');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImages, setCapturedImages] = useState<Record<number, string>>({});
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState<boolean>(false);
  const [tryOnStatusMessage, setTryOnStatusMessage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const cabinFileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and stop webcam
  const startWebcam = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Trình duyệt chưa hỗ trợ camera trực tiếp. Bạn hãy bấm chọn tải ảnh selfie có sẵn nhé!');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 960 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Webcam permission error:', err);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Quyền truy cập camera bị từ chối hoặc chặn bởi trình duyệt. Bạn có thể bấm Cho phép hoặc chọn Tải ảnh selfie bên dưới!'
          : 'Không thể mở camera thiết bị. Bạn có thể chọn Tải ảnh selfie từ máy để thử đồ ngay!'
      );
      setCameraActive(false);
    }
  };

  const handleCabinFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          const tryOnUrl = await processTryOnFrame(base64, currentPoseIndex);
          setCapturedImages((prev) => ({ ...prev, [currentPoseIndex]: tryOnUrl }));
          setCapturedPoses((prev) => [...new Set([...prev, currentPoseIndex])]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (captureMode === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [captureMode]);

  // Synchronize stream to video element when ready
  useEffect(() => {
    if (cameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraActive, captureMode]);

  // Capture snapshot from webcam
  const captureWebcamSnapshot = (): string | null => {
    if (!videoRef.current) return null;
    const video = videoRef.current;
    const canvas = captureCanvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Mirror horizontal for natural selfie feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.92);
  };

  // Fetch Cultural Guardian Assessment from Gemini endpoint
  const evaluateStyling = async (cfg: FittingConfig) => {
    setIsLoadingGuardian(true);

    if (cfg.geminiComposite) {
      const comp = cfg.geminiComposite;
      const shopeeAccs = comp.shopping_breakdown.items
        .filter((it) => it.action === 'MUA_SHOPEE' || it.shopee_keyword)
        .map((it) => ({
          name: it.name,
          category: 'Phụ kiện',
          estimatedPrice: `${it.price_est.toLocaleString('vi-VN')}đ`,
          searchKeyword: it.shopee_keyword,
          shopeeDeepLink: `https://shopee.vn/search?keyword=${encodeURIComponent(it.shopee_keyword)}`
        }));

      setAssessment({
        culturalScore: comp.cultural_guardrail.score,
        status: comp.cultural_guardrail.status === 'WARNING' ? 'WARNING' : 'APPROVED',
        badge: comp.cultural_guardrail.status === 'WARNING' ? 'Cần Lưu Ý Chuẩn Mực' : 'BẢO CHỨNG DI SẢN',
        title: comp.photobooth_badge.title,
        historicalReason: comp.photobooth_badge.history_fact,
        colorHarmonyAnalysis: comp.cultural_guardrail.warning_text || 'Hài hòa chuẩn mực di sản Việt Nam.',
        quickFixSuggestion: comp.cultural_guardrail.remedy_fix || null,
        rentalStores: [
          {
            name: 'Đại Nam Chân Ảnh',
            location: 'Hà Nội',
            pricePerDay: '120.000đ - 180.000đ/ngày',
            address: '18 Hàng Bạc, Hoàn Kiếm, Hà Nội',
            note: 'Có sẵn đầy đủ phom áo ngũ thân và áo tấc cổ truyền'
          },
          {
            name: 'Hoa Niên Cổ Phục',
            location: 'TP.HCM',
            pricePerDay: '150.000đ - 220.000đ/ngày',
            address: '42 Nguyễn Huệ, Quận 1, TP.HCM',
            note: 'Hỗ trợ phụ kiện nón quai thao và hài thêu cung đình'
          }
        ],
        shopeeAccessories:
          shopeeAccs.length > 0
            ? shopeeAccs
            : cfg.selectedAccessories.map((a) => ({
                name: a,
                category: 'Phụ kiện',
                estimatedPrice: '45.000đ',
                searchKeyword: a,
                shopeeDeepLink: `https://shopee.vn/search?keyword=${encodeURIComponent(a)}`
              })),
        wardrobeAdvice: 'Tận dụng quần tây suông và giày sneaker trắng sẵn có trong tủ đồ.'
      });
      setIsLoadingGuardian(false);
      return;
    }

    try {
      const compRes = await fetchBoothCompositeGemini({
        garment: cfg.garment.name,
        fabric: cfg.fabricId,
        color: cfg.fabricColor,
        accessories: cfg.selectedAccessories,
        event: cfg.context,
        budget: cfg.budget,
        isAltered: cfg.isAltered,
        alterationType: cfg.alterationType
      });

      const shopeeAccs = compRes.shopping_breakdown.items
        .filter((it) => it.action === 'MUA_SHOPEE' || it.shopee_keyword)
        .map((it) => ({
          name: it.name,
          category: 'Phụ kiện',
          estimatedPrice: `${it.price_est.toLocaleString('vi-VN')}đ`,
          searchKeyword: it.shopee_keyword,
          shopeeDeepLink: `https://shopee.vn/search?keyword=${encodeURIComponent(it.shopee_keyword)}`
        }));

      setAssessment({
        culturalScore: compRes.cultural_guardrail.score,
        status: compRes.cultural_guardrail.status === 'WARNING' ? 'WARNING' : 'APPROVED',
        badge: compRes.cultural_guardrail.status === 'WARNING' ? 'Cần Lưu Ý Chuẩn Mực' : 'BẢO CHỨNG DI SẢN',
        title: compRes.photobooth_badge.title,
        historicalReason: compRes.photobooth_badge.history_fact,
        colorHarmonyAnalysis: compRes.cultural_guardrail.warning_text,
        quickFixSuggestion: compRes.cultural_guardrail.remedy_fix || null,
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
        shopeeAccessories: shopeeAccs,
        wardrobeAdvice: 'Tận dụng quần tây suông và giày sneaker trắng sẵn có.'
      });
    } catch (err) {
      console.warn('Evaluation fallback:', err);
      setAssessment({
        culturalScore: cfg.isAltered ? 58 : 94,
        status: cfg.isAltered ? 'WARNING' : 'APPROVED',
        badge: cfg.isAltered ? 'Biến Tướng Tà Áo Cần Lưu Ý' : 'Bảo Chứng Di Sản Chuẩn Mực',
        title: 'Tiểu Thư Ngũ Thân Y2K',
        historicalReason: `${cfg.garment.name} tuân thủ cấu trúc cổ áo lập lĩnh và ngũ thường đoan trang.`,
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

  // Perform Virtual Try-on on captured snapshot
  const processTryOnFrame = async (snapshot: string, poseIdx: number): Promise<string> => {
    const outfitPrompt = buildOutfitPrompt({
      garmentName: currentConfig.garment.name,
      dynasty: currentConfig.garment.dynasty,
      fabricName: currentConfig.fabricId,
      fabricColorHex: currentConfig.fabricColor,
      selectedBottomId: currentConfig.selectedBottomId,
      selectedFootwearId: currentConfig.selectedFootwearId,
      selectedAccessories: currentConfig.selectedAccessories,
      shotType
    });

    setIsGeneratingTryOn(true);
    setTryOnStatusMessage('AI đang thay trang phục và xử lý ảnh (chờ 3-5s)...');

    try {
      const res = await generateVBoothTryOn(snapshot, outfitPrompt, shotType, currentConfig);
      return res.imageUrl;
    } catch (err) {
      console.warn('TryOn failed:', err);
      return snapshot;
    } finally {
      setIsGeneratingTryOn(false);
      setTryOnStatusMessage('');
    }
  };

  // If user snapped a photo in the fitting room mirror, pre-process all frames
  useEffect(() => {
    if (initialConfig.initialSnapshot) {
      processTryOnFrame(initialConfig.initialSnapshot, 0).then((imgUrl) => {
        setCapturedImages({ 0: imgUrl, 1: imgUrl, 2: imgUrl, 3: imgUrl });
        setCapturedPoses([0, 1, 2, 3]);
      });
    }
  }, []);

  // Trigger Photobooth 4-Shot Sequence
  const start4ShotSequence = () => {
    if (countdown !== null || isAutoShooting || isGeneratingTryOn) return;
    setIsAutoShooting(true);
    setCapturedPoses([]);
    setCapturedImages({});
    shootSingleFrame(0, [], {});
  };

  const shootSingleFrame = (poseIdx: number, accumulated: number[], imagesAcc: Record<number, string>) => {
    setCurrentPoseIndex(poseIdx);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(async () => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);

        // Flash Trigger & Shutter Sound
        setIsFlashing(true);
        playShutterSound();

        // Capture snapshot from webcam if in webcam mode
        let currentFrameImg: string | undefined = undefined;
        if (captureMode === 'webcam') {
          const snapshot = captureWebcamSnapshot();
          if (snapshot) {
            const tryOnResultUrl = await processTryOnFrame(snapshot, poseIdx);
            currentFrameImg = tryOnResultUrl;
          }
        }

        const nextImages = {
          ...imagesAcc,
          ...(currentFrameImg ? { [poseIdx]: currentFrameImg } : {})
        };
        setCapturedImages(nextImages);

        const nextAccumulated = [...accumulated, poseIdx];
        setCapturedPoses(nextAccumulated);

        setTimeout(() => {
          setIsFlashing(false);
          if (poseIdx < 3) {
            setTimeout(() => {
              shootSingleFrame(poseIdx + 1, nextAccumulated, nextImages);
            }, 1000);
          } else {
            setTimeout(() => {
              finishShooting(nextAccumulated, nextImages);
            }, 800);
          }
        }, 500);
      }
    }, 900);
  };

  // Single Quick Try-On Shot (Instant 1-shot applied to all 4 frames)
  const shootSingleQuickTryOn = async () => {
    if (countdown !== null || isAutoShooting || isGeneratingTryOn) return;
    setIsAutoShooting(true);
    setCountdown(3);

    let count = 3;
    const interval = setInterval(async () => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(interval);
        setCountdown(null);

        setIsFlashing(true);
        playShutterSound();

        let generatedImg: string | undefined = undefined;
        if (captureMode === 'webcam') {
          const snapshot = captureWebcamSnapshot();
          if (snapshot) {
            generatedImg = await processTryOnFrame(snapshot, 0);
          }
        }

        setTimeout(() => {
          setIsFlashing(false);
          const allPoses = [0, 1, 2, 3];
          const allImages: Record<number, string> = {};
          if (generatedImg) {
            allPoses.forEach((idx) => {
              allImages[idx] = generatedImg!;
            });
          }
          setCapturedImages(allImages);
          setCapturedPoses(allPoses);
          finishShooting(allPoses, allImages);
        }, 500);
      }
    }, 900);
  };

  const finishShooting = (allPoses: number[], allImages: Record<number, string>) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const finalScore = assessment?.culturalScore ?? currentConfig.culturalScore ?? 96;
    const finalSeal = assessment?.badge ?? currentConfig.sealTitle ?? 'BẢO CHỨNG DI SẢN';

    const result: PhotoBoothResult = {
      config: currentConfig,
      assessment: assessment || {
        culturalScore: finalScore,
        status: 'APPROVED',
        badge: finalSeal,
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
        timestamp: timeStr,
        imageUrl: allImages[pIdx]
      }))
    };
    onPhotosCaptured(result);
  };

  return (
    <div className="min-h-screen bg-[#FFF0F4] text-[#1E1B18] relative overflow-hidden pb-16">
      {/* Hidden Canvas and File Input for Frame Capture */}
      <canvas ref={captureCanvasRef} className="hidden" />
      <input
        type="file"
        ref={cabinFileInputRef}
        accept="image/*"
        onChange={handleCabinFileUpload}
        className="hidden"
      />

      {/* Flash Overlay Simulation */}
      {isFlashing && (
        <div className="fixed inset-0 z-50 bg-white flash-active pointer-events-none" />
      )}

      {/* AI Virtual Try-On Loading Modal */}
      {isGeneratingTryOn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-white text-center animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#881337] to-[#FF7597] flex items-center justify-center shadow-lg mb-4">
            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-base font-serif-heritage font-bold text-rose-100 mb-1">
            {tryOnStatusMessage || 'AI đang thay trang phục và xử lý ảnh (chờ 3-5s)...'}
          </h3>
          <p className="text-xs text-rose-200 max-w-sm leading-relaxed">
            AI đang phân tích người trong ảnh và tạo ra bức ảnh mới hoàn chỉnh đã được mặc {currentConfig.garment.name} khớp với cơ thể...
          </p>
        </div>
      )}

      {/* Top Header */}
      <header className="px-4 py-3 bg-white/90 backdrop-blur-md border-b border-rose-200 flex items-center justify-between z-30 relative">
        <button
          onClick={onBackToFitting}
          disabled={countdown !== null || isAutoShooting}
          className="text-xs font-medium text-slate-600 hover:text-rose-900 flex items-center gap-1.5 transition-colors disabled:opacity-40"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Về Bàn Chuẩn Bị</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-mono font-bold tracking-wider text-[#881337] uppercase">
            V-BOOTH STUDIO CABIN #01
          </span>
          <span className="block text-[10px] text-slate-400">
            AI Virtual Try-On & Photobooth Di Sản
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Capture Mode Toggle */}
          <div className="flex items-center p-0.5 bg-rose-50 rounded-xl border border-rose-200 text-[11px]">
            <button
              onClick={() => setCaptureMode('webcam')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                captureMode === 'webcam'
                  ? 'bg-[#881337] text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Webcam Thật
            </button>
            <button
              onClick={() => setCaptureMode('mannequin')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                captureMode === 'mannequin'
                  ? 'bg-[#881337] text-white font-medium shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ma Nơ Canh
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="max-w-4xl mx-auto px-4 pt-4 lg:pt-6 relative z-10">
        
        {/* Cultural Guardian Guardrail Card */}
        <section className="mb-4 bg-white/95 rounded-3xl border border-rose-200/90 p-4 shadow-[0_4px_16px_rgba(255,117,151,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                  AI Cultural Guardian
                </h3>
                <span className="text-[10px] bg-rose-100 text-[#881337] px-2 py-0.5 rounded-full font-mono">
                  Bảo Chứng Di Sản
                </span>
              </div>
              <p className="text-[12px] text-slate-600 font-medium mt-0.5">
                {isLoadingGuardian ? 'Đang thẩm định phom dáng & bối cảnh văn hóa...' : assessment?.badge}
              </p>
            </div>

            {/* Score Metric */}
            <div className="flex items-baseline gap-1 bg-rose-50 border border-rose-200 px-3 py-1 rounded-2xl self-start sm:self-auto">
              <span className="text-[10px] text-slate-500 font-semibold">ĐIỂM DI SẢN:</span>
              <span className="text-base font-bold font-mono text-[#881337] tabular-nums">
                {isLoadingGuardian ? '...' : assessment?.culturalScore}
              </span>
              <span className="text-[10px] text-slate-400">/100</span>
            </div>
          </div>

          {/* Assessment Body */}
          {isLoadingGuardian ? (
            <div className="py-2 text-xs text-slate-500">
              Đang đối chiếu hoa văn cung đình và quy thức ngũ thường...
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div>
                  <span className="font-semibold text-slate-800">Danh hiệu set đồ: </span>
                  <span className="font-serif-heritage font-bold text-[#881337] text-sm">
                    "{assessment?.title}"
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 italic">
                  {assessment?.colorHarmonyAnalysis}
                </div>
              </div>

              {assessment?.quickFixSuggestion && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
                  <div className="text-xs text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{assessment.quickFixSuggestion}</span>
                  </div>
                  <button
                    onClick={handleApplyQuickFix}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 shrink-0 flex items-center gap-1"
                  >
                    <Wand2 className="w-3 h-3" />
                    <span>Sửa nhanh</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Photobooth Viewport & Live Studio */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* Main Viewport Frame (Webcam or Avatar Canvas) */}
          <div className="md:col-span-8 flex flex-col items-center justify-center relative">
            <div className="relative w-full max-w-[340px] aspect-[3/4] rounded-3xl overflow-hidden border-2 border-rose-300/80 shadow-lg bg-[#FAF5EE]">
              
              {/* Softbox ambient lighting effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-300/20 via-rose-300/15 to-pink-300/20 rounded-[40px] blur-xl -z-10 pointer-events-none" />

              {/* MODE 1: WEBCAM WITH SILHOUETTE OVERLAY */}
              {captureMode === 'webcam' && (
                <div className="relative w-full h-full bg-slate-900 overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />

                  {/* Silhouette Frame Overlay (Khung vẽ mờ dáng người hồng nhạt) */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                    {/* SVG Human Silhouette Guide */}
                    <svg
                      viewBox="0 0 300 400"
                      className="w-full h-full max-h-[360px] opacity-75 drop-shadow-[0_0_8px_rgba(255,117,151,0.5)]"
                    >
                      {/* Head Oval Guide */}
                      <ellipse
                        cx="150"
                        cy="105"
                        rx="46"
                        ry="58"
                        fill="none"
                        stroke="#FF7597"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      />
                      {/* Neck */}
                      <path
                        d="M 132 163 L 132 188 M 168 163 L 168 188"
                        stroke="#FF7597"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                      {/* Shoulders & Torso */}
                      <path
                        d="M 75 225 Q 110 188 132 188 L 168 188 Q 190 188 225 225 L 235 370 L 65 370 Z"
                        fill="rgba(255, 117, 151, 0.08)"
                        stroke="#FF7597"
                        strokeWidth="2"
                        strokeDasharray="6 4"
                      />
                      {/* Center Crosshair Marker */}
                      <circle cx="150" cy="115" r="3" fill="#FF7597" />
                    </svg>

                    {/* Instruction Caption inside camera */}
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <span className="inline-block px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-rose-100 border border-rose-300/40 shadow-sm">
                        Hãy căn chỉnh vai và khuôn mặt vào giữa khung nhé!
                      </span>
                    </div>
                  </div>

                  {/* Camera Error Message */}
                  {cameraError && (
                    <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-5 text-center text-white z-30">
                      <p className="text-xs text-rose-200 mb-3 leading-relaxed">{cameraError}</p>
                      <div className="flex flex-col gap-2 w-full max-w-[200px]">
                        <button
                          type="button"
                          onClick={startWebcam}
                          className="w-full py-2 px-3 rounded-xl bg-[#881337] text-white text-xs font-semibold hover:bg-[#9F1239] cursor-pointer"
                        >
                          Thử Lại Camera
                        </button>
                        <button
                          type="button"
                          onClick={() => cabinFileInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-xl bg-white text-[#881337] text-xs font-semibold hover:bg-rose-50 cursor-pointer"
                        >
                          📂 Tải Ảnh Selfie Từ Máy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: MANNEQUIN AVATAR CANVAS */}
              {captureMode === 'mannequin' && (
                <div className="w-full h-full flex items-center justify-center">
                  <AvatarCanvas
                    garment={currentConfig.garment}
                    gender={currentConfig.gender}
                    fabricColor={currentConfig.fabricColor}
                    fabricId={currentConfig.fabricId}
                    selectedAccessories={currentConfig.selectedAccessories}
                    selectedBottomId={currentConfig.selectedBottomId}
                    selectedFootwearId={currentConfig.selectedFootwearId}
                    poseIndex={currentPoseIndex}
                    isAltered={currentConfig.isAltered}
                    showXRayPins={false}
                    culturalScore={assessment?.culturalScore ?? currentConfig.culturalScore}
                    sealTitle={assessment?.badge ?? currentConfig.sealTitle}
                    showSealBadge={true}
                  />
                </div>
              )}

              {/* Countdown Overlay (3... 2... 1...) */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center z-40 text-white animate-in zoom-in-90 duration-150">
                  <span className="text-8xl font-bold font-mono tracking-tighter drop-shadow-xl text-[#FF7597]">
                    {countdown}
                  </span>
                  <span className="text-xs font-medium mt-2 tracking-wider uppercase text-rose-100">
                    Flash chuẩn bị nháy!
                  </span>
                </div>
              )}
            </div>

            {/* Current Frame Status */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-medium text-[#881337] bg-white border border-rose-200 px-3 py-1 rounded-full shadow-xs">
                {captureMode === 'webcam'
                  ? `Khung hình: ${shotType === 'half-body' ? 'Chân dung / Nửa người' : 'Toàn thân'}`
                  : `Dáng ${currentPoseIndex + 1}/4: ${PHOTOBOOTH_POSES[currentPoseIndex]?.name}`}
              </span>
            </div>
          </div>

          {/* Side Controls Drawer */}
          <div className="md:col-span-4 space-y-4">
            
            {/* Shot Framing Selector (Half-body vs Full-body) */}
            <div className="bg-white rounded-2xl border border-rose-200 p-3.5 shadow-xs">
              <span className="text-[11px] font-semibold text-[#881337] uppercase tracking-wider block mb-2">
                Góc Chụp & Tỷ Lệ
              </span>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-rose-50/70 rounded-xl border border-rose-200/60">
                <button
                  type="button"
                  onClick={() => setShotType('half-body')}
                  className={`py-1.5 px-2 rounded-lg text-xs transition-all ${
                    shotType === 'half-body'
                      ? 'bg-white text-[#881337] font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Nửa Người (Selfie)
                </button>
                <button
                  type="button"
                  onClick={() => setShotType('full-body')}
                  className={`py-1.5 px-2 rounded-lg text-xs transition-all ${
                    shotType === 'full-body'
                      ? 'bg-white text-[#881337] font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Toàn Thân
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                {shotType === 'half-body'
                  ? 'AI sẽ chỉ thay đổi áo ngũ thân và phụ kiện cổ/đầu, không làm biến dạng tỷ lệ cơ thể.'
                  : 'AI sẽ thay trọn bộ áo ngũ thân, quần lụa và giày dép đã chọn.'}
              </p>
            </div>

            {/* 4-Frame Thumbnail Strip Progress */}
            <div className="bg-white rounded-2xl border border-rose-200 p-3.5 shadow-xs">
              <span className="text-[11px] font-semibold text-[#881337] uppercase tracking-wider block mb-2">
                Dải Ảnh 4 Ô Tiến Trình
              </span>
              <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                {PHOTOBOOTH_POSES.map((pose, idx) => {
                  const isCaptured = capturedPoses.includes(idx);
                  const isCurrent = currentPoseIndex === idx;
                  const thumbImg = capturedImages[idx];

                  return (
                    <div
                      key={pose.id}
                      className={`relative aspect-[3/4] rounded-xl border flex flex-col items-center justify-center p-1 transition-all text-center overflow-hidden ${
                        isCaptured
                          ? 'bg-rose-100/90 border-rose-400 text-[#881337]'
                          : isCurrent
                          ? 'bg-rose-50 border-[#FF7597] ring-1 ring-[#FF7597]/40'
                          : 'bg-[#FAF7F2] border-slate-200 text-slate-400'
                      }`}
                    >
                      {thumbImg ? (
                        <img
                          src={thumbImg}
                          alt={`Ô ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <span className="text-[10px] font-mono font-bold">Ô {idx + 1}</span>
                          <span className="text-[9px] line-clamp-1 mt-0.5 leading-tight">
                            {isCaptured ? 'Đã chụp' : pose.subtitle}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shoot Actions */}
            <div className="space-y-2 pt-1">
              {/* Primary 4-Shot Sequence Button */}
              <button
                type="button"
                onClick={start4ShotSequence}
                disabled={countdown !== null || isAutoShooting || isGeneratingTryOn}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#881337] hover:bg-[#9F1239] text-white font-semibold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {countdown !== null
                    ? `Đếm ngược ${countdown}...`
                    : isGeneratingTryOn
                    ? 'AI đang khoác thử trang phục...'
                    : isAutoShooting
                    ? 'Đang chụp liên hoàn 4 ô...'
                    : 'Chụp Dải 4 Ảnh Liên Hoàn 📸'}
                </span>
              </button>

              {/* Single Quick Shot Button */}
              <button
                type="button"
                onClick={shootSingleQuickTryOn}
                disabled={countdown !== null || isAutoShooting || isGeneratingTryOn}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-rose-200 text-[#881337] hover:bg-rose-50 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <span>Chụp Nhanh 1 Ảnh (Ghép 4 Ô)</span>
              </button>

              {/* Upload Selfie from device */}
              <button
                type="button"
                onClick={() => cabinFileInputRef.current?.click()}
                disabled={countdown !== null || isAutoShooting || isGeneratingTryOn}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-rose-300 text-[#881337] hover:bg-rose-50 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📂 Tải Ảnh Selfie Từ Máy</span>
              </button>

              <span className="block text-center text-[10px] text-slate-400 mt-1 font-mono">
                Flash nháy & chụp tự động với bảo chứng di sản
              </span>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
