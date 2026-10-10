import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  GARMENTS,
  GarmentItem,
  ACCESSORIES_DATABASE,
  AccessoryItem,
  BOTTOMS_DATABASE,
  BottomItem,
  BottomId,
  FOOTWEAR_DATABASE,
  FootwearItem,
  FootwearId,
  ARTISAN_FABRICS,
  FabricOption,
  HERITAGE_COLORS,
  HeritageColor,
  PRESET_STYLES,
  PresetStyle,
  CONTEXT_PRESETS,
  STANDARD_XRAY_POINTS,
  evaluateCulturalHarmonization,
  CulturalGuardrailReport,
  BodyZone,
  BODY_ZONE_KNOWLEDGE
} from '../data/garments';
import { calculateHoroscope, HoroscopeProfile } from '../data/horoscope';
import { VBoothLogo } from './VBoothLogo';
import {
  fetchHoroscopeGemini,
  fetchBoothCompositeGemini,
  HoroscopeGeminiResponse,
  BoothCompositeGeminiResponse
} from '../services/geminiService';
import { AvatarCanvas } from './AvatarCanvas';
import { GarmentVisual } from './GarmentVisual';
import { HeritageWikiModal } from './HeritageWikiModal';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface FittingRoomProps {
  onEnterBooth: (config: FittingConfig) => void;
  initialGarmentId?: string | null;
}

export interface FittingConfig {
  garment: GarmentItem;
  gender: 'nu' | 'nam';
  fabricColor: string;
  fabricId: string;
  selectedAccessories: string[];
  selectedBottomId: BottomId;
  selectedFootwearId: FootwearId;
  budget: number;
  isStudentMode: boolean;
  isAltered: boolean;
  alterationType: 'none' | 'cropped_short' | 'reverse_lapel';
  context: string;
  culturalScore: number;
  sealTitle: string;
  historicalInsight: string;
  horoscopeProfile?: HoroscopeProfile | null;
  geminiHoroscope?: HoroscopeGeminiResponse | null;
  geminiComposite?: BoothCompositeGeminiResponse | null;
  initialSnapshot?: string;
}

export const FittingRoom: React.FC<FittingRoomProps> = ({ onEnterBooth, initialGarmentId }) => {
  const [isWikiOpen, setIsWikiOpen] = useState<boolean>(false);
  // Stepper: 0: Quẻ Mệnh Ngũ Hành -> 1: Bối Cảnh & Phom Áo -> 2: Màu Bản Mệnh & Vải -> 3: Phụ Kiện & Ngân Sách -> 4: Vào Buồng Bấm Flash
  const [currentStep, setCurrentStep] = useState<number>(initialGarmentId ? 1 : 0);

  // Horoscope Profile (Bói Mệnh Ngũ Hành & Sắc Phục May Mắn)
  const [birthYear, setBirthYear] = useState<number>(2002);
  const [birthMonth, setBirthMonth] = useState<number>(8);
  const [birthDay, setBirthDay] = useState<number>(15);
  const [birthGender, setBirthGender] = useState<'nu' | 'nam' | 'other'>('nu');
  const [horoscopeProfile, setHoroscopeProfile] = useState<HoroscopeProfile | null>(() => {
    return calculateHoroscope(2002, 8, 15, 'nu');
  });

  // Gemini Live AI State
  const [geminiHoroscope, setGeminiHoroscope] = useState<HoroscopeGeminiResponse | null>(null);
  const [isLoadingHoroscope, setIsLoadingHoroscope] = useState<boolean>(false);
  const [isLoadingComposite, setIsLoadingComposite] = useState<boolean>(false);

  const [selectedGarment, setSelectedGarment] = useState<GarmentItem>(GARMENTS[0]);
  const [gender, setGender] = useState<'nu' | 'nam'>('nu');
  const [fabricColor, setFabricColor] = useState<string>(HERITAGE_COLORS[5].hex); // Default Hồng Cánh Sen #FF7597
  const [fabricId, setFabricId] = useState<string>(ARTISAN_FABRICS[1].id); // Default Lụa Vạn Phúc
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  // Bottoms (Quần / Váy) & Footwear (Giày Dép) Selection States
  const [selectedBottomId, setSelectedBottomId] = useState<BottomId>('bottom-silk-white');
  const [selectedFootwearId, setSelectedFootwearId] = useState<FootwearId>('shoes-guoc-moc');
  const [bottomFilterTab, setBottomFilterTab] = useState<'all' | 'heritage' | 'genz'>('all');
  const [footwearFilterTab, setFootwearFilterTab] = useState<'all' | 'heritage' | 'genz'>('all');

  const [budget, setBudget] = useState<number>(350000);
  const [isAltered, setIsAltered] = useState<boolean>(false);
  const [alterationType, setAlterationType] = useState<'none' | 'cropped_short' | 'reverse_lapel'>('none');
  const [context, setContext] = useState<string>('Dạo Phố Cổ Chiều Thu');

  // Tab for accessories: 'heritage' vs 'genz'
  const [accessoryTab, setAccessoryTab] = useState<'heritage' | 'genz'>('heritage');
  const [activeBodyZone, setActiveBodyZone] = useState<BodyZone | null>(null);

  // AI Cultural Research Insight State
  const [historicalInsight, setHistoricalInsight] = useState<string>(
    'Lụa Vạn Phúc dệt hoa văn song hạc nghìn năm tuổi bên dòng sông Nhuệ, từng được tiến cử may quốc phục triều đình nhà Nguyễn.'
  );
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);

  const isStudentMode = budget < 400000;

  // Webcam Booth States for Step 6 / Mirror Centerpiece
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);
  const [webcamCountdown, setWebcamCountdown] = useState<number | null>(null);
  const [isWebcamFlashing, setIsWebcamFlashing] = useState<boolean>(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const fittingVideoRef = useRef<HTMLVideoElement>(null);
  const fittingStreamRef = useRef<MediaStream | null>(null);
  const fittingCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startFittingWebcam = async () => {
    try {
      setWebcamError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setWebcamError('Trình duyệt chưa hỗ trợ camera trực tiếp. Bạn hãy bấm chọn tải ảnh selfie có sẵn nhé!');
        setIsWebcamActive(true);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false
      });
      fittingStreamRef.current = stream;
      if (fittingVideoRef.current) {
        fittingVideoRef.current.srcObject = stream;
      }
      setIsWebcamActive(true);
    } catch (err: any) {
      console.warn('Webcam permission error in fitting room:', err);
      setWebcamError(
        err?.name === 'NotAllowedError'
          ? 'Trình duyệt đang chặn camera. Bạn hãy bấm Cho phép trên thanh địa chỉ hoặc chọn Tải ảnh selfie bên dưới nhé!'
          : 'Không thể mở camera thiết bị. Bạn có thể bấm chọn Tải ảnh selfie từ máy để thử đồ ngay!'
      );
      setIsWebcamActive(true);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          handleStartBooth(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const stopFittingWebcam = () => {
    if (fittingStreamRef.current) {
      fittingStreamRef.current.getTracks().forEach((t: MediaStreamTrack) => t.stop());
      fittingStreamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  // Synchronize stream to video element whenever webcam becomes active or ref mounts
  useEffect(() => {
    if (isWebcamActive && fittingStreamRef.current && fittingVideoRef.current) {
      fittingVideoRef.current.srcObject = fittingStreamRef.current;
      fittingVideoRef.current.play().catch(() => {});
    }
  }, [isWebcamActive]);

  // Khi chuyển sang bước "Tổng Quan & Xuất Ảnh" (Step 6), tự động mở Webcam Camera thiết bị
  useEffect(() => {
    if (currentStep === 6) {
      setIsWebcamActive(true);
      startFittingWebcam();
    }
  }, [currentStep]);

  useEffect(() => {
    return () => {
      stopFittingWebcam();
    };
  }, []);

  const triggerWebcamSnapshot = () => {
    if (webcamCountdown !== null) return;
    setWebcamCountdown(3);
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setWebcamCountdown(count);
      } else {
        clearInterval(interval);
        setWebcamCountdown(null);
        setIsWebcamFlashing(true);
        setTimeout(() => setIsWebcamFlashing(false), 300);

        let snapshotBase64: string | undefined = undefined;
        if (fittingVideoRef.current) {
          const video = fittingVideoRef.current;
          const canvas = fittingCanvasRef.current || document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 800;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            snapshotBase64 = canvas.toDataURL('image/jpeg', 0.92);
          }
        }

        handleStartBooth(snapshotBase64);
      }
    }, 900);
  };

  // Real-time Cultural Guardrail Evaluation
  const guardrailReport: CulturalGuardrailReport = useMemo(() => {
    return evaluateCulturalHarmonization(
      selectedGarment,
      selectedAccessories,
      context,
      isAltered,
      alterationType,
      selectedBottomId,
      selectedFootwearId
    );
  }, [selectedGarment, selectedAccessories, context, isAltered, alterationType, selectedBottomId, selectedFootwearId]);

  // Automated AI Research Helper Function
  const fetchAiHistoricalInsight = async (
    costume: string,
    fabricName: string,
    colorName: string,
    ctx: string
  ) => {
    setIsLoadingInsight(true);
    try {
      const response = await fetch('/api/historical-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeName: costume,
          fabricName,
          colorName,
          accessories: selectedAccessories,
          context: ctx
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.insight) {
          setHistoricalInsight(data.insight);
        }
      }
    } catch (err) {
      console.warn('AI research insight fetch error:', err);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // Trigger insight update on combination change (debounced)
  useEffect(() => {
    const curFabric = ARTISAN_FABRICS.find((f) => f.id === fabricId)?.name || 'Lụa Vạn Phúc';
    const curColor = HERITAGE_COLORS.find((c) => c.hex === fabricColor)?.name || 'Hồng Cánh Sen';
    const timer = setTimeout(() => {
      fetchAiHistoricalInsight(selectedGarment.name, curFabric, curColor, context);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedGarment.id, fabricId, fabricColor, context]);

  // LUỒNG 1: API TÍNH BẢN MỆNH & GỢI Ý MÀU SẮC (Trigger: Khi user nhập Ngày sinh/Giới tính ở Bước 1)
  const runHoroscopeGemini = async (
    y: number,
    m: number,
    d: number,
    gen: 'nu' | 'nam' | 'other'
  ) => {
    setIsLoadingHoroscope(true);
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const genderStr = gen === 'nu' ? 'Nữ' : gen === 'nam' ? 'Nam' : 'Khác';

    // Immediate local computation for instant reactivity
    const localProfile = calculateHoroscope(y, m, d, gen);
    setHoroscopeProfile(localProfile);

    try {
      const res = await fetchHoroscopeGemini({
        birthDate: dateStr,
        gender: genderStr,
        event: context
      });
      if (res) {
        setGeminiHoroscope(res);
        // Highlight and auto-apply lucky color if in Step 0
        if (res.lucky_colors && res.lucky_colors.length > 0) {
          const matchHeritage = HERITAGE_COLORS.find((c) =>
            res.lucky_colors.some((lc) => lc.toLowerCase() === c.hex.toLowerCase())
          );
          if (matchHeritage) {
            setFabricColor(matchHeritage.hex);
          } else if (res.lucky_colors[0].startsWith('#')) {
            setFabricColor(res.lucky_colors[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Horoscope API call issue:', err);
    } finally {
      setIsLoadingHoroscope(false);
    }
  };

  // Run on mount
  useEffect(() => {
    runHoroscopeGemini(birthYear, birthMonth, birthDay, birthGender);
  }, []);

  // Synchronize garment if selected from Heritage Wiki
  useEffect(() => {
    if (initialGarmentId) {
      const found = GARMENTS.find((g) => g.id === initialGarmentId);
      if (found) {
        setSelectedGarment(found);
        setCurrentStep(1);
      }
    }
  }, [initialGarmentId]);

  const handleSelectGarment = (item: GarmentItem) => {
    setSelectedGarment(item);
    if (item.id === 'ao-ba-ba' && selectedBottomId === 'bottom-silk-white') {
      setSelectedBottomId('bottom-silk-black');
    }
  };

  // Direct Body Zone Click Interaction (Click-to-Inspect)
  const handleSelectZone = (zone: BodyZone) => {
    setActiveBodyZone(zone);
    if (zone === 'head') {
      setCurrentStep(5);
      setAccessoryTab('heritage');
    } else if (zone === 'torso') {
      if (currentStep !== 1 && currentStep !== 2) {
        setCurrentStep(1);
      }
    } else if (zone === 'legs') {
      setCurrentStep(3);
    } else if (zone === 'feet') {
      setCurrentStep(4);
    }
  };

  const toggleAccessory = (accId: string) => {
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter((id) => id !== accId));
    } else {
      setSelectedAccessories([...selectedAccessories, accId]);
    }
  };

  // Quick Preset Selection (One-touch styling)
  const applyPreset = (preset: PresetStyle) => {
    const foundGarment = GARMENTS.find((g) => g.id === preset.garmentId);
    if (foundGarment) {
      setSelectedGarment(foundGarment);
    }
    setFabricColor(preset.colorHex);
    setFabricId(preset.fabricId);
    setSelectedAccessories(preset.accessories);
    setContext(preset.context);
    setIsAltered(false);
    setAlterationType('none');
  };

  // Auto-Fix Action for Cultural Warnings
  const handleAutoFix = (warning: CulturalGuardrailReport['warnings'][0]) => {
    if (!warning.autoFixAction) return;
    const { removeAccessory, addAccessory, changeContext, resetAlteration } = warning.autoFixAction;

    if (removeAccessory) {
      setSelectedAccessories((prev) => prev.filter((a) => a !== removeAccessory));
    }
    if (addAccessory) {
      setSelectedAccessories((prev) => [...prev.filter((a) => a !== addAccessory), addAccessory]);
    }
    if (changeContext) {
      setContext(changeContext);
    }
    if (resetAlteration) {
      setIsAltered(false);
      setAlterationType('none');
    }
  };

  // LUỒNG 2: API BUỒNG CHỤP TỔNG HỢP (Trigger: Khi bấm nút "Bước Vào Buồng Chụp / Bấm Flash")
  const handleStartBooth = async (snapshot?: unknown) => {
    stopFittingWebcam();
    const snapshotStr = typeof snapshot === 'string' ? snapshot : undefined;
    setIsLoadingComposite(true);
    let compRes: BoothCompositeGeminiResponse | null = null;
    try {
      const accessoryNames = selectedAccessories.map(
        (id) => ACCESSORIES_DATABASE.find((a) => a.id === id)?.name || id
      );
      compRes = await fetchBoothCompositeGemini({
        garment: selectedGarment.name,
        fabric: selectedFabricObj.name,
        color: selectedColorObj.name,
        accessories: accessoryNames,
        event: context,
        budget,
        isAltered,
        alterationType
      });
    } catch (err) {
      console.warn('Error fetching composite booth data:', err);
    } finally {
      setIsLoadingComposite(false);
    }

    const finalScore = compRes?.cultural_guardrail.score ?? guardrailReport.score;
    const finalSeal = compRes?.photobooth_badge.title ?? guardrailReport.sealTitle;
    const finalFact = compRes?.photobooth_badge.history_fact ?? historicalInsight;

    onEnterBooth({
      garment: selectedGarment,
      gender,
      fabricColor,
      fabricId,
      selectedAccessories,
      selectedBottomId,
      selectedFootwearId,
      budget,
      isStudentMode,
      isAltered,
      alterationType,
      context,
      culturalScore: finalScore,
      sealTitle: finalSeal,
      historicalInsight: finalFact,
      horoscopeProfile,
      geminiHoroscope,
      geminiComposite: compRes,
      initialSnapshot: snapshotStr
    });
  };

  const filteredAccessories = ACCESSORIES_DATABASE.filter((a) => a.category === accessoryTab);

  const selectedBottomObj =
    BOTTOMS_DATABASE.find((b) => b.id === selectedBottomId) || BOTTOMS_DATABASE[0];
  const selectedFootwearObj =
    FOOTWEAR_DATABASE.find((f) => f.id === selectedFootwearId) || FOOTWEAR_DATABASE[0];

  const filteredBottoms = BOTTOMS_DATABASE.filter((b) => {
    if (bottomFilterTab === 'all') return true;
    return b.category === bottomFilterTab;
  });

  const filteredFootwear = FOOTWEAR_DATABASE.filter((f) => {
    if (footwearFilterTab === 'all') return true;
    return f.category === footwearFilterTab;
  });

  const stepsList = [
    { num: 0, label: 'Bản Mệnh' },
    { num: 1, label: 'Bối Cảnh & Áo' },
    { num: 2, label: 'Màu Sắc & Vải' },
    { num: 3, label: 'Quần & Váy' },
    { num: 4, label: 'Giày Dép' },
    { num: 5, label: 'Phụ Kiện' },
    { num: 6, label: 'Tổng Quan & Xuất Ảnh' }
  ];

  const selectedFabricObj = ARTISAN_FABRICS.find((f) => f.id === fabricId) || ARTISAN_FABRICS[1];
  const selectedColorObj = HERITAGE_COLORS.find((c) => c.hex === fabricColor) || HERITAGE_COLORS[5];

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-32 lg:pb-12 text-[#1E1B18]">
      {/* 1. Header with Gender Toggle */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-rose-200/60 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 sm:h-12 flex items-center shrink-0">
            <VBoothLogo className="h-9 sm:h-10 w-auto" />
          </div>
          <div className="hidden sm:block border-l border-rose-200/80 pl-3">
            <h1 className="text-sm font-serif-heritage font-bold text-[#881337] tracking-tight">
              Bàn Chuẩn Bị & Soi Gương
            </h1>
            <p className="text-[10px] text-slate-500">
              Heritage Stylist · Bộ Từ Điển Di Sản 5 Bước
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Heritage Wiki Modal Button */}
          <button
            type="button"
            onClick={() => setIsWikiOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-[#881337] text-xs font-semibold hover:bg-rose-50 shadow-2xs flex items-center gap-1.5 tactile-press cursor-pointer"
            title="Tra cứu 5 dòng cổ phục tiêu biểu & điển lễ"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#881337]" />
            <span className="hidden sm:inline">Từ Điển Di Sản</span>
            <span className="sm:hidden">Từ Điển</span>
          </button>

          {/* Direct Camera Button */}
          <button
            type="button"
            onClick={() => {
              setIsWebcamActive(true);
              startFittingWebcam();
              document.getElementById('center-mirror-viewport')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#881337] to-[#FF7597] text-white text-xs font-bold hover:brightness-105 shadow-xs flex items-center gap-1.5 tactile-press cursor-pointer"
          >
            <span>📸 Bật Camera</span>
          </button>

          {/* Gender Toggle */}
          <div className="flex items-center gap-1 p-1 bg-rose-50/80 rounded-xl border border-rose-200/60">
            <button
              onClick={() => setGender('nu')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                gender === 'nu'
                  ? 'bg-white text-[#881337] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nữ Phục
            </button>
            <button
              onClick={() => setGender('nam')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                gender === 'nam'
                  ? 'bg-white text-[#881337] shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nam Phục
            </button>
          </div>
        </div>
      </header>

      {/* 2. PHOTOBOOTH STEPPER: Thanh tiến trình tối giản dạng pill tab nhẹ nhàng */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-2">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-rose-200/60 p-1.5 shadow-sm">
          <div className="flex items-center justify-between sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scrollbar-none">
            {stepsList.map((step, idx) => {
              const isActive = currentStep === step.num;
              return (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => setCurrentStep(step.num)}
                    className={`px-3.5 py-1.5 rounded-full text-xs transition-all shrink-0 tactile-press ${
                      isActive
                        ? 'bg-[#881337] text-white shadow-sm font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-rose-50/80 font-normal'
                    }`}
                  >
                    {step.label}
                  </button>
                  {idx < stepsList.length - 1 && (
                    <span className="text-slate-300 text-xs select-none shrink-0 px-0.5 font-light">
                      —
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid: 3-column layout */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1 (Left): Step-based controls & Presets */}
          <div className="order-2 lg:order-1 lg:col-span-4 space-y-4">
            
            {/* STEP 0: CHECK-IN BÓI MỆNH NGŨ HÀNH & SẮC PHỤC MAY MẮN */}
            {currentStep === 0 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-[0_2px_12px_rgba(255,117,151,0.06)] space-y-4">
                  <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wide">
                      Bói Mệnh Ngũ Hành & Sắc Phục
                    </span>
                    <span className="text-[11px] font-medium bg-rose-50 text-[#881337] px-2.5 py-0.5 rounded-full border border-rose-200/60">
                      Phong Thủy Cổ Phục
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bạn có muốn V-Booth gợi ý sắc phục theo <strong>bản mệnh Ngũ hành (Kim - Mộc - Thủy - Hỏa - Thổ)</strong> để bức ảnh photobooth rạng rỡ và đắc tài đắc lộc không?
                  </p>

                  {/* Input Form: Ngày - Tháng - Năm sinh & Giới tính */}
                  <div className="p-3.5 bg-[#FFFDF9] rounded-xl border border-rose-100/90 space-y-3">
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Ngày sinh</label>
                        <select
                          value={birthDay}
                          onChange={(e) => {
                            const d = Number(e.target.value);
                            setBirthDay(d);
                            setHoroscopeProfile(calculateHoroscope(birthYear, birthMonth, d, birthGender));
                          }}
                          className="w-full text-xs font-normal border border-rose-200/90 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#881337]"
                        >
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>Ngày {d}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Tháng sinh</label>
                        <select
                          value={birthMonth}
                          onChange={(e) => {
                            const m = Number(e.target.value);
                            setBirthMonth(m);
                            setHoroscopeProfile(calculateHoroscope(birthYear, m, birthDay, birthGender));
                          }}
                          className="w-full text-xs font-normal border border-rose-200/90 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#881337]"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>Tháng {m}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">Năm sinh</label>
                        <select
                          value={birthYear}
                          onChange={(e) => {
                            const y = Number(e.target.value);
                            setBirthYear(y);
                            setHoroscopeProfile(calculateHoroscope(y, birthMonth, birthDay, birthGender));
                          }}
                          className="w-full text-xs font-normal border border-rose-200/90 rounded-lg p-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#881337]"
                        >
                          {Array.from({ length: 46 }, (_, i) => 2015 - i).map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 block mb-1">Giới tính xưng hô</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBirthGender('nu');
                            setGender('nu');
                            setHoroscopeProfile(calculateHoroscope(birthYear, birthMonth, birthDay, 'nu'));
                          }}
                          className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                            birthGender === 'nu'
                              ? 'bg-[#881337] text-white border-[#881337]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          Nữ Phục
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBirthGender('nam');
                            setGender('nam');
                            setHoroscopeProfile(calculateHoroscope(birthYear, birthMonth, birthDay, 'nam'));
                          }}
                          className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                            birthGender === 'nam'
                              ? 'bg-[#881337] text-white border-[#881337]'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                          }`}
                        >
                          Nam Phục
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Kết Quả Bản Mệnh Tức Thì */}
                  {horoscopeProfile && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-50/70 to-pink-50/50 border border-rose-200/70 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#881337] tracking-tight">
                          Bản Mệnh {horoscopeProfile.element} · {horoscopeProfile.napAm}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-rose-200/70 font-medium">
                          {horoscopeProfile.canChi} ({horoscopeProfile.birthYear})
                        </span>
                      </div>

                      {/* Màu Tương Sinh / Hợp Mệnh */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium text-emerald-800 block">
                          Màu Tương Sinh & Hợp Mệnh:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {horoscopeProfile.luckyColorNames.map((colorName, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-medium"
                            >
                              {colorName}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Màu Kỵ Nên Tránh */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-medium text-rose-800 block">
                          Màu Kỵ Nên Hạn Chế:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {horoscopeProfile.forbiddenColorNames.map((colorName, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-0.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-[11px] font-medium"
                            >
                              {colorName}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quẻ Cát Tường Phong Thủy Gen Z */}
                      <p className="text-xs italic text-slate-700 bg-white/90 p-2.5 rounded-lg border border-rose-100 leading-relaxed">
                        "{horoscopeProfile.fortuneQuote}"
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (horoscopeProfile) {
                          setFabricColor(horoscopeProfile.recommendedColorHex);
                          const matchGarment = GARMENTS.find((g) => g.id === horoscopeProfile.recommendedOutfitId);
                          if (matchGarment) setSelectedGarment(matchGarment);
                        }
                        setCurrentStep(1);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white font-semibold text-xs shadow-sm hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Áp Dụng Bản Mệnh & Sang Bước 1</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full py-1.5 px-3 text-xs text-slate-500 hover:text-slate-800 text-center font-normal transition-colors"
                    >
                      Bỏ qua, tự chọn màu theo sở thích →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: BỐI CẢNH & PHOM ÁO CỔ TRUYỀN (Gộp bối cảnh + phom áo) */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 1.1 Phom Áo Cổ Truyền */}
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      8 Phom Áo Cổ Truyền
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Bắc - Trung - Nam</span>
                  </div>

                  <div className="space-y-2.5">
                    {GARMENTS.map((item) => {
                      const isSelected = selectedGarment.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectGarment(item)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all tactile-press flex items-start gap-3.5 ${
                            isSelected
                              ? 'bg-rose-50/90 border-[#FF7597] shadow-sm ring-1 ring-[#FF7597]/40'
                              : 'bg-[#FFFDF9] border-slate-100 hover:border-rose-200 text-slate-700'
                          }`}
                        >
                          {/* Hình Ảnh Minh Họa Trang Phục Thực Tế */}
                          <GarmentVisual
                            id={item.id}
                            name={item.name}
                            color={isSelected ? fabricColor : item.defaultColor}
                            className="w-16 h-20 shadow-xs"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <strong className="text-xs font-bold text-[#1E1B18] block truncate">
                                {item.name}
                              </strong>
                              <span className="text-xs font-mono font-bold text-[#881337] flex-shrink-0">
                                {item.baseRentalPrice.toLocaleString('vi-VN')}đ/ngày
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                              {item.dynasty} · {item.region === 'ToanQuoc' ? 'Toàn quốc' : item.region}
                            </span>
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 1.2 Vé Bối Cảnh Chụp */}
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
                  <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider block mb-2.5">
                    Vé Bối Cảnh Chụp
                  </span>
                  <div className="space-y-1.5">
                    {CONTEXT_PRESETS.map((ctx) => (
                      <button
                        key={ctx.id}
                        onClick={() => setContext(ctx.label)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors border flex items-center justify-between ${
                          context === ctx.label
                            ? 'bg-rose-50/90 border-rose-300 text-[#881337] font-semibold ring-1 ring-rose-300/60'
                            : 'border-slate-100 hover:border-rose-200 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200/60 font-mono text-[10px] text-[#881337] font-semibold flex items-center justify-center shrink-0">
                            {ctx.code}
                          </span>
                          <div>
                            <span className="block font-medium">{ctx.label}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{ctx.desc}</span>
                          </div>
                        </div>
                        {context === ctx.label && <Check className="w-4 h-4 text-[#881337]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 1.3 Nút Chọn Nhanh Preset */}
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      Gợi Ý Bản Phối Nhanh
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">1-Chạm Áp Dụng</span>
                  </div>
                  <div className="space-y-1.5">
                    {PRESET_STYLES.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => applyPreset(preset)}
                        className="w-full text-left p-2 rounded-xl border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 transition-all tactile-press flex items-center justify-between group"
                      >
                        <div>
                          <strong className="text-xs font-bold text-slate-900 group-hover:text-[#881337] block">
                            {preset.name}
                          </strong>
                          <span className="text-[10px] text-slate-500 block">
                            {preset.tagline}
                          </span>
                        </div>
                        <span className="text-xs text-rose-500 font-bold">Thử →</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PHỐI MÀU BẢN MỆNH & CHẤT LIỆU DI SẢN */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Horoscope Banner nếu có */}
                {horoscopeProfile && (
                  <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-2xl border border-rose-200/90 p-3 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#881337] block">
                        Quẻ Mệnh: {horoscopeProfile.canChi} · {horoscopeProfile.napAm}
                      </span>
                      <span className="text-[10px] text-slate-600 block">
                        Hợp sắc: {horoscopeProfile.luckyColorNames.slice(0, 2).join(', ')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(0)}
                      className="text-[10px] font-semibold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors"
                    >
                      Đổi Quẻ →
                    </button>
                  </div>
                )}

                {/* Bảng Màu Ngũ Sắc Di Sản (Highlight Hợp Mệnh) */}
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      Bảng Màu Ngũ Sắc Di Sản
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-[#881337]">
                      {selectedColorObj.name} ({selectedColorObj.hex})
                    </span>
                  </div>

                  {/* 6 Heritage Color Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {HERITAGE_COLORS.map((c) => {
                      const isSelected = fabricColor === c.hex;
                      const isLucky = horoscopeProfile?.luckyColorHexes.includes(c.hex);
                      const isForbidden = horoscopeProfile?.forbiddenColorHexes.includes(c.hex);
                      return (
                        <button
                          key={c.id}
                          onClick={() => setFabricColor(c.hex)}
                          className={`p-2 rounded-xl border transition-all text-left flex flex-col justify-between h-20 relative overflow-hidden ${
                            isSelected
                              ? 'ring-2 ring-[#881337] border-white shadow-md scale-102 bg-rose-50/70'
                              : isLucky
                              ? 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-400'
                              : 'border-slate-100 hover:border-rose-200 bg-[#FFFDF9]'
                          }`}
                        >
                          {/* Lucky / Warning Tag */}
                          {isLucky && (
                            <span className="absolute top-1 right-1 text-[8px] font-bold text-emerald-800 bg-emerald-100 px-1 rounded shadow-xs">
                              Hợp
                            </span>
                          )}
                          {isForbidden && (
                            <span className="absolute top-1 right-1 text-[8px] font-bold text-rose-700 bg-rose-100 px-1 rounded">
                              Kỵ
                            </span>
                          )}

                          <div className="flex items-center justify-between">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-inner"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span className="text-[8px] font-mono px-1 rounded bg-black/5 text-slate-600">
                              {c.element}
                            </span>
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-800 block leading-tight">
                              {c.name}
                            </span>
                            <span className="text-[9px] font-mono text-slate-400">{c.hex}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Five-Elements Meaning Notice / Cautionary */}
                  {horoscopeProfile && horoscopeProfile.forbiddenColorHexes.includes(fabricColor) ? (
                    <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-[11px] leading-snug">
                      <strong className="font-semibold block text-amber-900">
                        Lưu ý phong thủy:
                      </strong>
                      <span>Màu {selectedColorObj.name} thuộc ngũ hành tương khắc với mệnh {horoscopeProfile.element} ({horoscopeProfile.elementHarmonyRule}). Nếu muốn cầu may mắn, bạn nên ưu tiên màu hợp mệnh nhé!</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 text-[11px] leading-snug">
                      <strong className="font-semibold block text-[#881337]">
                        Ngũ hành {selectedColorObj.element}:
                      </strong>
                      <span>{selectedColorObj.meaning}</span>
                    </div>
                  )}
                </div>

                {/* 5 Vải Dệt Thủ Công Việt Nam */}
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      5 Chất Liệu Vải Dệt Thủ Công
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Làng Nghề Cổ</span>
                  </div>

                  <div className="space-y-1.5">
                    {ARTISAN_FABRICS.map((fabric) => {
                      const isSelected = fabricId === fabric.id;
                      return (
                        <button
                          key={fabric.id}
                          onClick={() => setFabricId(fabric.id)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-rose-50 border-[#FF7597] ring-1 ring-[#FF7597]/40 shadow-sm'
                              : 'border-slate-100 hover:border-rose-200 bg-[#FFFDF9]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900">{fabric.name}</span>
                            <span className="text-[10px] bg-rose-100/70 text-[#881337] px-2 py-0.5 rounded-md font-medium">
                              {fabric.shortTag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                            {fabric.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Artisan Craft Village Highlight Card */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-[11px] leading-snug">
                    <strong className="font-semibold block text-amber-900">Nguồn gốc làng nghề:</strong>
                    <span>{selectedFabricObj.villageOrigin}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PHẦN DƯỚI (QUẦN / VÁY) */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div
                  id="section-bottoms"
                  className={`bg-white rounded-2xl border p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)] transition-all ${
                    activeBodyZone === 'legs'
                      ? 'border-[#FF7597] ring-2 ring-[#FF7597]/30 bg-rose-50/20'
                      : 'border-rose-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      Phần Dưới (Quần / Váy)
                    </span>
                    <span className="text-[10px] text-[#881337] font-medium bg-rose-100/70 px-2 py-0.5 rounded-full">
                      {selectedBottomObj.shortTag}
                    </span>
                  </div>

                  {/* Filter Tabs for Bottoms */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-rose-50/70 rounded-xl mb-3 border border-rose-200/50">
                    <button
                      type="button"
                      onClick={() => setBottomFilterTab('all')}
                      className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                        bottomFilterTab === 'all'
                          ? 'bg-white text-[#881337] shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tất Cả (7)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBottomFilterTab('heritage')}
                      className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                        bottomFilterTab === 'heritage'
                          ? 'bg-white text-[#881337] shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Cổ Truyền
                    </button>
                    <button
                      type="button"
                      onClick={() => setBottomFilterTab('genz')}
                      className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                        bottomFilterTab === 'genz'
                          ? 'bg-white text-[#881337] shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Gen Z Remix
                    </button>
                  </div>

                  {/* Bottoms List */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar scrollbar-none pr-0.5">
                    {filteredBottoms.map((bottom) => {
                      const isSelected = selectedBottomId === bottom.id;
                      return (
                        <div
                          key={bottom.id}
                          onClick={() => setSelectedBottomId(bottom.id)}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50/90 border-[#FF7597] shadow-xs ring-1 ring-[#FF7597]/40'
                              : 'bg-[#FFFDF9] border-slate-100 hover:border-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Color / Fabric Swatch */}
                            <span
                              className="w-5 h-5 rounded-full border border-black/15 shrink-0 shadow-inner"
                              style={{ backgroundColor: bottom.colorHex }}
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <strong className="text-xs font-semibold text-slate-900 leading-tight">
                                  {bottom.name}
                                </strong>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                    bottom.tag === 'Cổ truyền'
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-indigo-100 text-indigo-900'
                                  }`}
                                >
                                  {bottom.tag}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {bottom.description}
                              </p>
                              <span className="text-[10px] text-[#881337] font-medium block mt-0.5">
                                Ước tính: ~{bottom.estimatedPrice.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://shopee.vn/search?keyword=${encodeURIComponent(bottom.searchKeyword)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Sắm ngay trên Shopee"
                              className="px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#EE4D2D] border border-orange-200 text-[10px] font-semibold flex items-center gap-1"
                            >
                              <span>Shopee</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setSelectedBottomId(bottom.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border ${
                                isSelected
                                  ? 'bg-[#FF7597] text-white border-[#FF7597]'
                                  : 'border-slate-200 text-slate-400 hover:border-rose-300'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: GIÀY DÉP & GUỐC MỘC */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div
                  id="section-footwear"
                  className={`bg-white rounded-2xl border p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)] transition-all ${
                    activeBodyZone === 'feet'
                      ? 'border-[#FF7597] ring-2 ring-[#FF7597]/30 bg-rose-50/20'
                      : 'border-rose-200/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      Giày Dép & Guốc Mộc
                    </span>
                    <span className="text-[10px] text-[#881337] font-medium bg-rose-100/70 px-2 py-0.5 rounded-full">
                      {selectedFootwearObj.shortTag}
                    </span>
                  </div>

                  {/* Filter Tabs for Footwear */}
                  <div className="grid grid-cols-3 gap-1 p-1 bg-rose-50/70 rounded-xl mb-3 border border-rose-200/50">
                    <button
                      type="button"
                      onClick={() => setFootwearFilterTab('all')}
                      className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                        footwearFilterTab === 'all'
                          ? 'bg-white text-[#881337] shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tất Cả (8)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFootwearFilterTab('heritage')}
                      className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                        footwearFilterTab === 'heritage'
                          ? 'bg-white text-[#881337] shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Cổ Truyền
                    </button>
                    <button
                      type="button"
                      onClick={() => setFootwearFilterTab('genz')}
                      className={`py-1 text-[11px] font-medium rounded-lg transition-all ${
                        footwearFilterTab === 'genz'
                          ? 'bg-white text-[#881337] shadow-xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Gen Z Remix
                    </button>
                  </div>

                  {/* Footwear List */}
                  <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar scrollbar-none pr-0.5">
                    {filteredFootwear.map((footwear) => {
                      const isSelected = selectedFootwearId === footwear.id;
                      return (
                        <div
                          key={footwear.id}
                          onClick={() => setSelectedFootwearId(footwear.id)}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-rose-50/90 border-[#FF7597] shadow-xs ring-1 ring-[#FF7597]/40'
                              : 'bg-[#FFFDF9] border-slate-100 hover:border-rose-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <span className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200/60 font-mono text-[10px] text-[#881337] font-semibold flex items-center justify-center shrink-0">
                              {footwear.tag === 'Cổ truyền' ? 'CT' : 'GZ'}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <strong className="text-xs font-semibold text-slate-900 leading-tight">
                                  {footwear.name}
                                </strong>
                                <span
                                  className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                    footwear.tag === 'Cổ truyền'
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-indigo-100 text-indigo-900'
                                  }`}
                                >
                                  {footwear.tag}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                {footwear.description}
                              </p>
                              <span className="text-[10px] text-[#881337] font-medium block mt-0.5">
                                Ước tính: ~{footwear.estimatedPrice.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://shopee.vn/search?keyword=${encodeURIComponent(footwear.searchKeyword)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Sắm ngay trên Shopee"
                              className="px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#EE4D2D] border border-orange-200 text-[10px] font-semibold flex items-center gap-1"
                            >
                              <span>Shopee</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setSelectedFootwearId(footwear.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border ${
                                isSelected
                                  ? 'bg-[#FF7597] text-white border-[#FF7597]'
                                  : 'border-slate-200 text-slate-400 hover:border-rose-300'
                              }`}
                            >
                              {isSelected ? '✓' : ''}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: PHỤ KIỆN & NGÂN SÁCH */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 5.1 BÀN PHỤ KIỆN PHỐI KÈM */}
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      Phụ Kiện Cầm Tay & Đội Đầu
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {selectedAccessories.length} đã chọn
                    </span>
                  </div>

                  {/* Tabs */}
                  <div className="grid grid-cols-2 gap-1 p-1 bg-rose-50/70 rounded-xl mb-3 border border-rose-200/50">
                    <button
                      onClick={() => setAccessoryTab('heritage')}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        accessoryTab === 'heritage'
                          ? 'bg-white text-[#881337] shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Phụ Kiện Cổ Truyền
                    </button>
                    <button
                      onClick={() => setAccessoryTab('genz')}
                      className={`py-1.5 text-xs font-medium rounded-lg transition-all ${
                        accessoryTab === 'genz'
                          ? 'bg-white text-[#881337] shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Phụ Kiện Gen Z
                    </button>
                  </div>

                  {/* Accessories List */}
                  <div className="space-y-2 max-h-[260px] overflow-y-auto no-scrollbar scrollbar-none pr-0.5">
                    {filteredAccessories.map((acc) => {
                      const isSelected = selectedAccessories.includes(acc.id);
                      return (
                        <div
                          key={acc.id}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-rose-50/80 border-[#FF7597] shadow-sm ring-1 ring-[#FF7597]/40'
                              : 'bg-[#FFFDF9] border-slate-100 hover:border-rose-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleAccessory(acc.id)}
                            className="flex items-center gap-2.5 text-left flex-1"
                          >
                            <span className="w-6 h-6 rounded-md bg-rose-50 border border-rose-200/60 font-mono text-[10px] text-[#881337] font-semibold flex items-center justify-center shrink-0">
                              {acc.category === 'heritage' ? 'CT' : 'GZ'}
                            </span>
                            <div>
                              <strong className="text-xs font-semibold text-slate-900 block leading-tight">
                                {acc.name}
                              </strong>
                              <span className="text-[10px] text-slate-500 block">
                                Ước tính: ~{acc.estimatedPrice.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </button>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`https://shopee.vn/search?keyword=${encodeURIComponent(acc.searchKeyword)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Sắm ngay trên Shopee"
                              className="px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#EE4D2D] border border-orange-200 text-[10px] font-semibold flex items-center gap-1"
                            >
                              <span>Shopee</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => toggleAccessory(acc.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold border ${
                                isSelected
                                  ? 'bg-[#FF7597] text-white border-[#FF7597]'
                                  : 'border-slate-200 text-slate-400 hover:border-rose-300'
                              }`}
                            >
                              {isSelected ? '✓' : '+'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 5.2 THANH TRƯỢT NGÂN SÁCH */}
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                      Thanh Trượt Ngân Sách
                    </span>
                    <span className="text-xs font-bold font-mono text-[#881337] tabular-nums">
                      {budget.toLocaleString('vi-VN')} đ
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="2000000"
                    step="50000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[#FF7597] h-2 bg-rose-100 rounded-lg cursor-pointer"
                  />
                  {isStudentMode && (
                    <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-2 text-[11px] text-emerald-800 leading-snug">
                      <strong>Ưu đãi HSSV:</strong> Thuê trang phục chính, kết hợp phụ kiện Shopee và tủ đồ cá nhân để tổng chi phí dưới 400k!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 6: TỔNG KẾT & THẨM ĐỊNH */}
            {currentStep === 6 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)] space-y-3">
                  <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
                    Hồ Sơ Bản Phối Trang Phục
                  </span>

                  <div className="flex items-center gap-3.5 p-3 rounded-xl bg-rose-50/60 border border-rose-200/80">
                    <GarmentVisual
                      id={selectedGarment.id}
                      name={selectedGarment.name}
                      color={fabricColor}
                      className="w-16 h-20 shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <strong className="text-sm font-bold text-[#1E1B18] block truncate">
                        {selectedGarment.name}
                      </strong>
                      <span className="text-[11px] text-slate-500 block">
                        {selectedGarment.dynasty} · {selectedFabricObj.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shadow-xs"
                          style={{ backgroundColor: fabricColor }}
                        />
                        <span className="text-xs font-medium text-slate-700">
                          {selectedColorObj.name} ({selectedColorObj.element})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-700 bg-[#FFFDF9] p-3 rounded-xl border border-rose-100">
                    <div>• Trang phục: <strong>{selectedGarment.name}</strong></div>
                    <div>• Chất liệu: <strong>{selectedFabricObj.name}</strong> ({selectedFabricObj.shortTag})</div>
                    <div>• Sắc màu: <strong>{selectedColorObj.name}</strong> ({selectedColorObj.hex} · {selectedColorObj.element})</div>
                    <div>• Phần dưới (Quần/Váy): <strong className="text-[#881337]">{selectedBottomObj.name}</strong> ({selectedBottomObj.tag} · ~{selectedBottomObj.estimatedPrice.toLocaleString('vi-VN')}đ)</div>
                    <div>• Giày dép: <strong className="text-[#881337]">{selectedFootwearObj.name}</strong> ({selectedFootwearObj.tag} · ~{selectedFootwearObj.estimatedPrice.toLocaleString('vi-VN')}đ)</div>
                    {horoscopeProfile && (
                      <div>• Quẻ Bản Mệnh: <strong className="text-[#881337]">{horoscopeProfile.canChi} · {horoscopeProfile.napAm}</strong> (Mệnh {horoscopeProfile.element})</div>
                    )}
                    <div>• Bối cảnh: <strong>{context}</strong></div>
                    <div>• Phụ kiện: {selectedAccessories.map((id) => ACCESSORIES_DATABASE.find((a) => a.id === id)?.name).filter(Boolean).join(', ') || 'Không'}</div>
                    <div>• Bảo chứng di sản: <strong className="text-rose-900">{guardrailReport.score}/100</strong> ({guardrailReport.sealTitle})</div>
                  </div>
                </div>

                {/* DEDICATED WEBCAM & AI TRY-ON CARD IN STEP 6 */}
                <div className="bg-gradient-to-br from-rose-100/90 via-white to-pink-50 rounded-2xl border-2 border-rose-400/90 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
                      📸 Chụp Thật & AI Virtual Try-On
                    </span>
                    <span className="text-[10px] bg-rose-200 text-[#881337] px-2 py-0.5 rounded-full font-mono font-bold">
                      Camera Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Bật camera hoặc tải ảnh khuôn mặt của bạn để AI tự động khoác thử trọn bộ {selectedGarment.name} lên bạn và xuất dải ảnh photobooth 4 ô Y2K!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {isWebcamActive ? (
                      <button
                        type="button"
                        onClick={triggerWebcamSnapshot}
                        disabled={webcamCountdown !== null}
                        className="flex-1 py-3 px-3 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>
                          {webcamCountdown !== null
                            ? `Đếm ngược ${webcamCountdown}...`
                            : 'Chụp Ảo (3... 2... 1... Flash!) 📸'}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsWebcamActive(true);
                          startFittingWebcam();
                          document.getElementById('center-mirror-viewport')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="flex-1 py-3 px-3 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>📸 Bật Camera Soi Gương</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-3 px-3 rounded-xl bg-white border border-rose-300 text-[#881337] hover:bg-rose-50 text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>📂 Tải Ảnh Từ Máy</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons (Quay lại / Tiếp theo) */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2.5 rounded-xl border border-rose-200 text-xs font-semibold text-slate-600 hover:bg-rose-50 disabled:opacity-40 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Bước trước</span>
              </button>

              {currentStep < 6 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-[#881337] text-white text-xs font-semibold hover:bg-[#9F1239] tactile-press flex items-center gap-1.5 transition-colors"
                >
                  <span>Bước tiếp theo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cultural Guardian Tester Switch (For testing warnings) */}
            <div className="bg-amber-50/60 rounded-2xl border border-amber-200/70 p-3.5 text-amber-900">
              <div className="mb-2">
                <span className="text-xs font-medium text-amber-900">
                  Thử Nghiệm Bắt Lỗi Di Sản:
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (alterationType === 'cropped_short') {
                      setIsAltered(false);
                      setAlterationType('none');
                    } else {
                      setIsAltered(true);
                      setAlterationType('cropped_short');
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-normal border text-center transition-all ${
                    alterationType === 'cropped_short'
                      ? 'bg-amber-700 text-white border-amber-800 font-medium shadow-xs'
                      : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100/70'
                  }`}
                >
                  Xẻ tà ngắn hở eo
                </button>
                <button
                  onClick={() => {
                    if (alterationType === 'reverse_lapel') {
                      setIsAltered(false);
                      setAlterationType('none');
                    } else {
                      setIsAltered(true);
                      setAlterationType('reverse_lapel');
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-normal border text-center transition-all ${
                    alterationType === 'reverse_lapel'
                      ? 'bg-amber-700 text-white border-amber-800 font-medium shadow-xs'
                      : 'bg-white text-amber-900 border-amber-200 hover:bg-amber-100/70'
                  }`}
                >
                  Cài ngược khuy áo
                </button>
              </div>
            </div>
          </div>

          {/* Column 2 (Middle): Pure Minimalist Photobooth Arch Mirror / Live Webcam Booth */}
          <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col items-center justify-center">
            {/* Hidden canvas for snapshot */}
            <canvas ref={fittingCanvasRef} className="hidden" />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Mirror Viewport Toggle */}
            <div id="center-mirror-viewport" className="w-full max-w-[340px] mb-2.5">
              <div className="flex items-center p-1 bg-rose-100/70 rounded-2xl border border-rose-300 shadow-xs w-full gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsWebcamActive(false);
                    stopFittingWebcam();
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    !isWebcamActive
                      ? 'bg-white text-[#881337] font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎎 Ma Nơ Canh Ảo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsWebcamActive(true);
                    startFittingWebcam();
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isWebcamActive
                      ? 'bg-[#881337] text-white shadow-xs'
                      : 'text-[#881337] hover:bg-rose-200/50'
                  }`}
                >
                  📸 Bật Camera / Webcam
                </button>
              </div>
            </div>

            {/* Centerpiece View: Avatar Canvas or Live Webcam with Silhouette */}
            {!isWebcamActive ? (
              <div className="w-full max-w-[340px] relative">
                <AvatarCanvas
                  garment={selectedGarment}
                  gender={gender}
                  fabricColor={fabricColor}
                  fabricId={fabricId}
                  selectedAccessories={selectedAccessories}
                  selectedBottomId={selectedBottomId}
                  selectedFootwearId={selectedFootwearId}
                  isAltered={isAltered}
                  culturalScore={guardrailReport.score}
                  sealTitle={guardrailReport.sealTitle}
                  showSealBadge={true}
                  activeZone={activeBodyZone}
                  onSelectZone={handleSelectZone}
                />
              </div>
            ) : (
              <div className="w-full max-w-[340px] flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden border-2 border-rose-300 shadow-md bg-slate-900">
                  <video
                    ref={fittingVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />

                  {/* Silhouette Frame Overlay (Khung vẽ mờ dáng người hồng nhạt) */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-4">
                    <svg
                      viewBox="0 0 300 400"
                      className="w-full h-full max-h-[360px] opacity-75 drop-shadow-[0_0_8px_rgba(255,117,151,0.5)]"
                    >
                      <ellipse cx="150" cy="105" rx="46" ry="58" fill="none" stroke="#FF7597" strokeWidth="2" strokeDasharray="6 4" />
                      <path d="M 132 163 L 132 188 M 168 163 L 168 188" stroke="#FF7597" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M 75 225 Q 110 188 132 188 L 168 188 Q 190 188 225 225 L 235 370 L 65 370 Z" fill="rgba(255, 117, 151, 0.08)" stroke="#FF7597" strokeWidth="2" strokeDasharray="6 4" />
                      <circle cx="150" cy="115" r="3" fill="#FF7597" />
                    </svg>
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <span className="inline-block px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-medium text-rose-100 border border-rose-300/40 shadow-sm">
                        Hãy căn chỉnh vai và khuôn mặt vào giữa khung nhé!
                      </span>
                    </div>
                  </div>

                  {/* Camera Error Message Overlay */}
                  {webcamError && (
                    <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center p-5 text-center text-white z-30">
                      <p className="text-xs text-rose-200 mb-3 leading-relaxed">{webcamError}</p>
                      <div className="flex flex-col gap-2 w-full max-w-[220px]">
                        <button
                          type="button"
                          onClick={startFittingWebcam}
                          className="w-full py-2 px-3 rounded-xl bg-[#881337] text-white text-xs font-semibold hover:bg-[#9F1239] cursor-pointer"
                        >
                          Thử Lại Camera
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 px-3 rounded-xl bg-white text-[#881337] text-xs font-semibold hover:bg-rose-50 cursor-pointer"
                        >
                          📂 Tải Ảnh Selfie Từ Máy
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Countdown Overlay */}
                  {webcamCountdown !== null && (
                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center z-40 text-white animate-in zoom-in-90 duration-150">
                      <span className="text-8xl font-bold font-mono text-[#FF7597]">
                        {webcamCountdown}
                      </span>
                      <span className="text-xs font-medium mt-2 text-rose-100 uppercase">
                        Flash chuẩn bị nháy!
                      </span>
                    </div>
                  )}

                  {/* Flash Overlay */}
                  {isWebcamFlashing && (
                    <div className="absolute inset-0 bg-white z-50 pointer-events-none" />
                  )}
                </div>

                {/* Webcam Snapshot Trigger */}
                <div className="w-full mt-3 space-y-2">
                  <button
                    type="button"
                    onClick={triggerWebcamSnapshot}
                    disabled={webcamCountdown !== null}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#881337] hover:bg-[#9F1239] text-white font-semibold text-xs shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>
                      {webcamCountdown !== null
                        ? `Đang đếm ngược ${webcamCountdown}...`
                        : 'Chụp Ảo (3... 2... 1... Flash!) 📸'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl bg-white border border-rose-200 text-[#881337] hover:bg-rose-50 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>📂 Hoặc Tải Ảnh Selfie Từ Máy</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Column 3 (Right): THÔNG TIN DI SẢN BỘ PHẬN & BẮT LỖI VĂN HÓA */}
          <div className="order-3 lg:col-span-4 space-y-4">
            {/* Thẻ Chi Tiết Di Sản Bộ Phận & Tri Thức Lịch Sử (Khi chọn hoặc bấm vào thân áo) */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-[0_2px_12px_rgba(255,117,151,0.06)] space-y-3.5">
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div>
                  <h3 className="text-xs font-semibold text-[#881337] tracking-wide">
                    {BODY_ZONE_KNOWLEDGE[activeBodyZone || 'torso'].label}
                  </h3>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {BODY_ZONE_KNOWLEDGE[activeBodyZone || 'torso'].subLabel}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#881337] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                  {selectedGarment.shortTag}
                </span>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed bg-[#FFFDF9] p-3.5 rounded-xl border border-rose-100/80 space-y-2">
                <p className="font-medium text-slate-900 leading-relaxed">
                  {BODY_ZONE_KNOWLEDGE[activeBodyZone || 'torso'].historicalMeaning}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {BODY_ZONE_KNOWLEDGE[activeBodyZone || 'torso'].culturalDetail}
                </p>

                {/* Garment background story */}
                <div className="pt-2 border-t border-rose-100/70 text-xs text-slate-600 space-y-1">
                  <div className="font-medium text-[#881337]">
                    {selectedGarment.name} ({selectedGarment.dynasty}):
                  </div>
                  <p className="italic leading-relaxed text-slate-600">
                    "{selectedGarment.heritageStory}"
                  </p>
                </div>
              </div>

              {/* AI Cultural Research Insight Box */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/70 text-rose-950 text-xs space-y-1">
                <div className="flex items-center justify-between text-[#881337] font-medium text-[11px]">
                  <span>AI Di Sản Insight</span>
                  {isLoadingInsight && <span className="animate-pulse text-[10px]">Đang tra cứu...</span>}
                </div>
                <p className="italic text-slate-700 leading-relaxed">
                  "{historicalInsight}"
                </p>
              </div>

              {/* Quick Action Button */}
              <button
                type="button"
                onClick={() => handleSelectZone(activeBodyZone || 'torso')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-medium flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-[0.98] transition-all shadow-sm"
              >
                <span>{BODY_ZONE_KNOWLEDGE[activeBodyZone || 'torso'].quickActionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {/* Cultural Guardrail Notice Card Under Mirror / Right Column */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-[0_2px_12px_rgba(255,117,151,0.06)] space-y-3.5">
              
              {/* Header with Vermilion Seal Status */}
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <div>
                  <h3 className="text-xs font-semibold text-[#881337] tracking-wide">
                    Thẻ Ghi Chú Di Sản
                  </h3>
                  <span className="text-[11px] text-slate-500 font-normal">Kiểm định chuẩn mực thời gian thực</span>
                </div>

                <div className="flex items-center gap-1.5 bg-red-50 border border-red-200/70 px-2.5 py-0.5 rounded-full text-red-700">
                  <span className="text-[11px] font-medium">Điểm:</span>
                  <span className="text-xs font-bold tabular-nums">{guardrailReport.score}</span>
                  <span className="text-[11px] opacity-60">/100</span>
                </div>
              </div>

              {/* Warnings List (Mix chéo vùng miền / Vi phạm nghi lễ) */}
              {guardrailReport.warnings.length > 0 ? (
                <div className="space-y-2.5">
                  {guardrailReport.warnings.map((w) => (
                    <div
                      key={w.id}
                      className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 space-y-1.5 animate-in fade-in"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <strong className="text-xs font-semibold text-amber-950">
                          {w.title}
                        </strong>
                      </div>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        {w.reason}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-amber-700 italic">
                          Gợi ý: {w.fixSuggestion}
                        </span>
                        {w.autoFixAction && (
                          <button
                            type="button"
                            onClick={() => handleAutoFix(w)}
                            className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-medium shadow-sm shrink-0"
                          >
                            <span>Sửa về chuẩn</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Compliment Card when Harmonized */
                <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 space-y-1 animate-in fade-in">
                  <strong className="text-xs font-semibold text-emerald-950 block">
                    Bảo Chứng Di Sản: Chuẩn Mực & Hài Hòa
                  </strong>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {guardrailReport.compliments[0] ||
                      'Phom dáng và cách phối đồ tôn vinh trọn vẹn văn hiến Việt Nam, bảo toàn cấu trúc trang phục truyền thống.'}
                  </p>
                </div>
              )}
            </div>

            {/* Shopee & Rental Cart Quick Summary */}
            <div className="bg-white rounded-2xl border border-rose-200/80 p-5 shadow-[0_2px_12px_rgba(255,117,151,0.06)] space-y-3.5">
              <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                <span className="text-xs font-semibold text-[#881337] uppercase tracking-wide">
                  Dự Toán Giỏ Đồ & Mua Sắm
                </span>
                <span className="text-xs font-semibold text-[#881337] tabular-nums">
                  {(
                    selectedGarment.baseRentalPrice +
                    selectedBottomObj.estimatedPrice +
                    selectedFootwearObj.estimatedPrice +
                    selectedAccessories.reduce((acc, id) => {
                      const item = ACCESSORIES_DATABASE.find((a) => a.id === id);
                      return acc + (item ? item.estimatedPrice : 0);
                    }, 0)
                  ).toLocaleString('vi-VN')}{' '}
                  đ
                </span>
              </div>

              {/* Selected Items List with Shopee links */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-50/50 border border-rose-100">
                  <span>Trang phục: <strong className="font-semibold text-slate-800">{selectedGarment.name}</strong></span>
                  <span className="text-[#881337] font-medium">Thuê {selectedGarment.baseRentalPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                {/* Bottom Item */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFFDF9] border border-slate-100">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: selectedBottomObj.colorHex }} />
                    <span className="line-clamp-1 text-slate-700">Quần/Váy: <strong className="text-slate-900">{selectedBottomObj.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-800 font-medium">
                      ~{selectedBottomObj.estimatedPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <a
                      href={`https://shopee.vn/search?keyword=${encodeURIComponent(selectedBottomObj.searchKeyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#EE4D2D] hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Shopee</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {/* Footwear Item */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFFDF9] border border-slate-100">
                  <div className="min-w-0">
                    <span className="line-clamp-1 text-slate-700">Giày dép: <strong className="text-slate-900">{selectedFootwearObj.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-800 font-medium">
                      ~{selectedFootwearObj.estimatedPrice.toLocaleString('vi-VN')}đ
                    </span>
                    <a
                      href={`https://shopee.vn/search?keyword=${encodeURIComponent(selectedFootwearObj.searchKeyword)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#EE4D2D] hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Shopee</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>

                {selectedAccessories.map((accId) => {
                  const item = ACCESSORIES_DATABASE.find((a) => a.id === accId);
                  if (!item) return null;
                  return (
                    <div
                      key={accId}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#FFFDF9] border border-slate-100"
                    >
                      <span className="line-clamp-1 text-slate-700">{item.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-slate-800 font-medium">
                          ~{item.estimatedPrice.toLocaleString('vi-VN')}đ
                        </span>
                        <a
                          href={`https://shopee.vn/search?keyword=${encodeURIComponent(item.searchKeyword)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#EE4D2D] hover:underline flex items-center gap-0.5 font-medium"
                        >
                          <span>Shopee</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Primary Single CTA Button */}
              <button
                type="button"
                onClick={handleStartBooth}
                disabled={isLoadingComposite}
                className="w-full py-4 px-5 rounded-2xl bg-[#881337] hover:bg-[#9F1239] text-white font-semibold text-xs tracking-wide shadow-md shadow-rose-950/15 border border-rose-300/40 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isLoadingComposite ? 'Đang thẩm định & chuẩn bị buồng...' : 'Xem Bản Phối & Vào Buồng Chụp →'}</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Action Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200/80 p-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 font-mono">Điểm Di Sản: {guardrailReport.score}/100</span>
            <span className="text-xs font-bold font-mono text-[#881337] tabular-nums">
              {(
                selectedGarment.baseRentalPrice +
                selectedBottomObj.estimatedPrice +
                selectedFootwearObj.estimatedPrice +
                selectedAccessories.reduce((acc, id) => {
                  const item = ACCESSORIES_DATABASE.find((a) => a.id === id);
                  return acc + (item ? item.estimatedPrice : 0);
                }, 0)
              ).toLocaleString('vi-VN')}{' '}
              đ
            </span>
          </div>

          <button
            type="button"
            onClick={handleStartBooth}
            disabled={isLoadingComposite}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#881337] hover:bg-[#9F1239] text-white font-semibold text-xs tracking-wide shadow-md shadow-rose-950/20 border border-rose-300/30 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <span>{isLoadingComposite ? 'Đang chuẩn bị...' : 'Xem Bản Phối & Vào Buồng Chụp →'}</span>
          </button>
        </div>
      </div>

      {/* Heritage Wiki Modal */}
      <HeritageWikiModal
        isOpen={isWikiOpen}
        onClose={() => setIsWikiOpen(false)}
        onSelectGarment={(garmentId) => {
          setIsWikiOpen(false);
          const found = GARMENTS.find((g) => g.id === garmentId);
          if (found) {
            setSelectedGarment(found);
            setCurrentStep(1);
          }
        }}
      />
    </div>
  );
};
