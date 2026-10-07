import React, { useState } from 'react';
import { GARMENTS, GarmentItem, ACCESSORIES_DATABASE, AccessoryItem } from '../data/garments';
import { AvatarCanvas } from './AvatarCanvas';
import {
  Sparkles,
  Layers,
  Palette,
  Sliders,
  DollarSign,
  Footprints,
  Wind,
  Glasses,
  Headphones,
  ShoppingBag,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FittingRoomProps {
  onEnterBooth: (config: FittingConfig) => void;
}

export interface FittingConfig {
  garment: GarmentItem;
  gender: 'nu' | 'nam';
  fabricColor: string;
  selectedAccessories: string[];
  budget: number;
  isStudentMode: boolean;
  isAltered: boolean;
  alterationType: 'none' | 'cropped_short' | 'reverse_lapel';
  context: string;
}

export const FittingRoom: React.FC<FittingRoomProps> = ({ onEnterBooth }) => {
  const [selectedGarment, setSelectedGarment] = useState<GarmentItem>(GARMENTS[0]);
  const [gender, setGender] = useState<'nu' | 'nam'>('nu');
  const [fabricColor, setFabricColor] = useState<string>(selectedGarment.defaultColor);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    'quat-phien-lua',
    'sneaker-chunky-trang'
  ]);
  const [budget, setBudget] = useState<number>(350000);
  const [isAltered, setIsAltered] = useState<boolean>(false);
  const [alterationType, setAlterationType] = useState<'none' | 'cropped_short' | 'reverse_lapel'>('none');
  const [context, setContext] = useState<string>('Dạo phố Tràng Tiền & Chụp Photobooth');

  const isStudentMode = budget < 400000;

  const handleSelectGarment = (item: GarmentItem) => {
    setSelectedGarment(item);
    setFabricColor(item.defaultColor);
  };

  const toggleAccessory = (accId: string) => {
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter((id) => id !== accId));
    } else {
      setSelectedAccessories([...selectedAccessories, accId]);
    }
  };

  const handleStartBooth = () => {
    onEnterBooth({
      garment: selectedGarment,
      gender,
      fabricColor,
      selectedAccessories,
      budget,
      isStudentMode,
      isAltered,
      alterationType,
      context
    });
  };

  const getAccessoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-4 h-4" />;
      case 'Wind':
        return <Wind className="w-4 h-4" />;
      case 'Glasses':
        return <Glasses className="w-4 h-4" />;
      case 'Headphones':
        return <Headphones className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-32 lg:pb-12 text-[#1E1B18]">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-rose-200/60 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#881337] to-[#FF7597] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            VB
          </div>
          <div>
            <h1 className="text-base font-serif-heritage font-bold text-[#881337] tracking-tight">
              Bàn Chuẩn Bị & Soi Gương
            </h1>
            <p className="text-[11px] text-slate-500">
              V-Booth Heritage Stylist · Thử đồ đa tầng
            </p>
          </div>
        </div>

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
      </header>

      {/* Main Content Grid: 3-column layout on desktop, responsive viewport on mobile */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Column 1 (Desktop) / Settings Drawer: Garments & Occasion */}
          <div className="order-2 lg:order-1 lg:col-span-3 space-y-5">
            {/* Garment Selection */}
            <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#FF7597]" />
                  Chọn Mẫu Việt Phục
                </span>
                <span className="text-[11px] text-slate-400 font-mono">4 Dáng Áo</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {GARMENTS.map((item) => {
                  const isSelected = selectedGarment.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectGarment(item)}
                      className={`text-left p-2.5 rounded-xl border transition-all tactile-press ${
                        isSelected
                          ? 'bg-rose-50/80 border-[#FF7597] shadow-sm ring-1 ring-[#FF7597]/40'
                          : 'bg-[#FFFDF9] border-slate-100 hover:border-rose-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1E1B18] leading-tight">
                          {item.name}
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7597] shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5 line-clamp-1">
                        {item.dynasty}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cultural Context */}
            <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
              <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7597]" />
                Bối Cảnh / Phong Cách
              </span>
              <div className="space-y-1.5">
                {[
                  'Dạo phố Tràng Tiền & Chụp Photobooth',
                  'Chụp ảnh kỷ yếu phong cách Retro',
                  'Lễ hội Văn hóa Cố Đô',
                  'Thử nghiệm đi Bar / Nightclub (Test lỗi AI)'
                ].map((ctx) => (
                  <button
                    key={ctx}
                    onClick={() => setContext(ctx)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors border ${
                      context === ctx
                        ? 'bg-rose-50/90 border-rose-300 text-[#881337] font-medium'
                        : 'border-slate-100 hover:border-rose-200 text-slate-600'
                    }`}
                  >
                    {ctx}
                  </button>
                ))}
              </div>
            </div>

            {/* Cultural Guardian Tester Switch (For testing warnings) */}
            <div className="bg-amber-50/70 rounded-2xl border border-amber-200/80 p-3.5 text-amber-900">
              <div className="flex items-start gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-amber-900">
                    Phòng Thí Nghiệm Di Sản (AI Guardrail)
                  </h4>
                  <p className="text-[11px] text-amber-800 leading-snug">
                    Bật thử các biến tướng để xem Người Gác Cổng Di Sản Gemini phản ứng:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
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
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                    alterationType === 'cropped_short'
                      ? 'bg-amber-600 text-white border-amber-700 font-semibold shadow-sm'
                      : 'bg-white/90 text-amber-900 border-amber-300 hover:bg-amber-100'
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
                  className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                    alterationType === 'reverse_lapel'
                      ? 'bg-amber-600 text-white border-amber-700 font-semibold shadow-sm'
                      : 'bg-white/90 text-amber-900 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  Cài ngược khuy áo
                </button>
              </div>
            </div>
          </div>

          {/* Column 2 (Middle): Interactive Mannequin on Mirror */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center">
            {/* Mirror Frame Header */}
            <div className="w-full flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
                Chạm vào các điểm tròn phát sáng để soi X-Ray Di sản
              </span>
              {(isAltered || alterationType !== 'none') && (
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Đang bật biến tấu
                </span>
              )}
            </div>

            {/* Mannequin Avatar Canvas */}
            <div className="w-full max-w-[380px] relative">
              <AvatarCanvas
                garment={selectedGarment}
                gender={gender}
                fabricColor={fabricColor}
                selectedAccessories={selectedAccessories}
                isAltered={isAltered}
                showXRayPins={true}
              />
            </div>

            {/* Color Palette Selection */}
            <div className="w-full max-w-[380px] mt-4 bg-white rounded-2xl border border-rose-200/70 p-3 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-[#FF7597]" />
                  Bảng Màu Lụa Truyền Thống
                </span>
                <span className="text-[10px] text-[#881337] font-medium">
                  {selectedGarment.availableColors.find((c) => c.hex === fabricColor)?.name || 'Tùy chọn'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                {selectedGarment.availableColors.map((color) => {
                  const isSelected = fabricColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => setFabricColor(color.hex)}
                      title={`${color.name}: ${color.meaning}`}
                      className={`group relative flex-1 h-9 rounded-xl border transition-all tactile-press flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-[#881337] scale-105 border-white shadow-sm'
                          : 'border-black/10 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white shadow-sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3 (Desktop) / Accessories Drawer & Budget Slider */}
          <div className="order-3 lg:col-span-4 space-y-5">
            {/* Budget Slider */}
            <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-[#FF7597]" />
                  Thanh Trượt Ngân Sách
                </span>
                <span className="text-sm font-bold font-mono text-[#881337] tabular-nums">
                  {budget.toLocaleString('vi-VN')} đ
                </span>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="100000"
                max="2000000"
                step="50000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#FF7597] h-2 bg-rose-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>100k (Thuê/Phối Sẵn)</span>
                <span>1 Triệu</span>
                <span>2 Triệu+</span>
              </div>

              {/* HSSV Mode Badge Auto-Trigger */}
              {isStudentMode ? (
                <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-start gap-2 text-emerald-800 animate-in fade-in duration-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 animate-ping" />
                  <div className="text-[11px] leading-snug">
                    <strong className="font-semibold block text-emerald-900">
                      ⚡ Mode HSSV: Tiết kiệm tối đa
                    </strong>
                    Thuê trang phục chính (~120k-150k), kết hợp sneaker và phụ kiện có sẵn trong tủ đồ để chi phí dưới 400k!
                  </div>
                </div>
              ) : (
                <div className="mt-3 bg-rose-50/60 border border-rose-200/50 rounded-xl p-2.5 text-[11px] text-rose-900 leading-snug">
                  Ngân sách thoải mái: Bạn có thể vừa thuê trang phục cao cấp vừa sắm phụ kiện Shopee độc quyền giữ làm kỷ niệm.
                </div>
              )}
            </div>

            {/* Horizontal Snap / Grid Accessory Selection */}
            <div className="bg-white rounded-2xl border border-rose-200/70 p-4 shadow-[0_2px_8px_rgba(255,117,151,0.06)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7597]" />
                  Phụ Kiện Cổ Điển x Gen Z
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {selectedAccessories.length} đã chọn
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                {ACCESSORIES_DATABASE.map((acc) => {
                  const isSelected = selectedAccessories.includes(acc.id);
                  return (
                    <button
                      key={acc.id}
                      onClick={() => toggleAccessory(acc.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all tactile-press flex flex-col justify-between ${
                        isSelected
                          ? 'bg-rose-50/80 border-[#FF7597] shadow-sm ring-1 ring-[#FF7597]/40'
                          : 'bg-[#FFFDF9] border-slate-100 hover:border-rose-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <div className="p-1 rounded-lg bg-white border border-rose-100 text-[#881337]">
                          {getAccessoryIcon(acc.iconName)}
                        </div>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#FF7597]" />}
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-[#1E1B18] line-clamp-1">
                          {acc.name}
                        </span>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                          <span>{acc.category === 'heritage' ? 'Cổ phong' : 'Gen Z'}</span>
                          <span className="font-mono font-medium text-rose-900">
                            ~{acc.estimatedPrice.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Desktop CTA Trigger */}
            <div className="hidden lg:block pt-2">
              <button
                onClick={handleStartBooth}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#881337] to-[#FF7597] text-white font-semibold text-sm shadow-[0_6px_20px_rgba(136,19,55,0.25)] hover:shadow-[0_8px_25px_rgba(136,19,55,0.35)] tactile-press flex items-center justify-center gap-2 group"
              >
                <span>Bước Vào Buồng Chụp</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar / Mobile One-Thumb Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200/80 p-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-mono">Dự toán set đồ</span>
            <span className="text-sm font-bold font-mono text-[#881337] tabular-nums">
              {(selectedGarment.baseRentalPrice + (selectedAccessories.length > 0 ? 45000 : 0)).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <button
            onClick={handleStartBooth}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#881337] to-[#FF7597] text-white font-semibold text-xs shadow-md shadow-rose-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Bước Vào Buồng Chụp</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
