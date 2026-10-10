import React, { useState } from 'react';
import { ASSET_IMAGES } from '../data/garments';
import { VBoothLogo } from './VBoothLogo';
import { HeritageWikiModal } from './HeritageWikiModal';
import {
  Layers,
  ShieldCheck,
  PiggyBank,
  ArrowRight,
  Camera,
  Heart,
  Store,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onEnterStore: () => void;
  onSelectGarmentAndEnter?: (garmentId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterStore, onSelectGarmentAndEnter }) => {
  const [isWikiOpen, setIsWikiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1E1B18] selection:bg-[#FF7597]/20 selection:text-[#881337] pb-28 lg:pb-16">
      
      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-rose-200/60 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Zone 1: Wordmark & Logo */}
        <a href="#" className="h-12 flex items-center">
          <VBoothLogo className="h-11 sm:h-12 w-auto" />
        </a>

        {/* Zone 2: Clean Text Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
          <a href="#about" className="hover:text-[#881337] transition-colors">
            Giới Thiệu
          </a>
          <a href="#features" className="hover:text-[#881337] transition-colors">
            Tính Năng
          </a>
          <a href="#lookbook" className="hover:text-[#881337] transition-colors">
            Bức Tường Kỷ Niệm
          </a>
          <button
            type="button"
            onClick={() => setIsWikiOpen(true)}
            className="hover:text-[#881337] transition-colors cursor-pointer text-xs font-medium text-slate-600"
          >
            Từ Điển Di Sản
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsWikiOpen(true)}
            className="md:hidden text-xs font-medium text-slate-600 hover:text-[#881337] px-2 py-1 transition-colors"
          >
            Từ Điển Di Sản
          </button>
          <button
            onClick={onEnterStore}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#881337] to-[#FF7597] rounded-xl shadow-sm hover:shadow-md tactile-press whitespace-nowrap"
          >
            Lấy Vé Vào Tiệm
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 lg:px-8 pt-8 lg:pt-16 pb-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#881337] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF7597]" />
              <span>Tiệm Photobooth Việt Phục Đầu Tiên Trên Mây</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heritage font-bold text-[#881337] leading-[1.15] text-balance">
              Diện Việt Phục Cổ Điển, Chụp Ảnh Chuẩn Gen Z
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl text-balance">
              Nền tảng Stylist Di sản thông minh: Thử đồ đa tầng từ Áo Tấc, Ngũ Thân đến Nhật Bình, thẩm định chuẩn mực văn hóa thời gian thực bằng AI, và bóc tách giỏ đồ thuê/sắm chỉ từ 100k cho học sinh - sinh viên.
            </p>

            {/* Unboxed Metadata Stats */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span>05 Dáng Áo Cổ Truyền</span>
              <span aria-hidden="true">·</span>
              <span>Bói Mệnh Ngũ Hành</span>
              <span aria-hidden="true">·</span>
              <span>AI Cultural Guardian</span>
              <span aria-hidden="true">·</span>
              <span>Dải Ảnh 4 Ô HD</span>
            </div>

            {/* Desktop CTA Trigger */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onEnterStore}
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#881337] via-[#BE123C] to-[#FF7597] text-white font-semibold text-sm shadow-[0_8px_25px_rgba(136,19,55,0.25)] hover:shadow-[0_10px_30px_rgba(136,19,55,0.35)] tactile-press flex items-center justify-center gap-2 group"
              >
                <span>Lấy Vé Vào Tiệm Ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#lookbook"
                className="py-3.5 px-5 rounded-2xl bg-white border border-rose-200/80 text-[#881337] font-semibold text-xs hover:bg-rose-50 tactile-press flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Xem Dải Ảnh Mẫu</span>
              </a>
            </div>
          </div>

          {/* Right Visual Anchor: Photobooth Storefront & Editorial Look */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Storefront Hero Image */}
              <div className="relative rounded-3xl overflow-hidden border border-rose-200/80 shadow-[0_16px_40px_rgba(136,19,55,0.12)] aspect-[4/3]">
                <img
                  src={ASSET_IMAGES.heroStorefront}
                  alt="Mặt tiền tiệm photobooth V-Booth phong cách retro ấm cúng"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-mono tracking-wider uppercase opacity-80">
                    V-BOOTH FLAGSHIP CABIN
                  </span>
                  <h3 className="text-sm sm:text-base font-serif-heritage font-bold">
                    Tiệm Ảnh Hồng Phố Cổ · Mở Cửa 24/7
                  </h3>
                </div>
              </div>

              {/* Floating Floating Mini Polaroid Badge */}
              <div
                className="absolute -bottom-6 -left-4 sm:left-4 bg-white p-2.5 rounded-2xl border border-rose-200 shadow-[0_10px_25px_rgba(0,0,0,0.1)] flex items-center gap-3 max-w-[240px]"
                style={{ transform: 'rotate(-2deg)' }}
              >
                <img
                  src={ASSET_IMAGES.nhatBinhPortrait}
                  alt="Avatar Gen Z diện áo Nhật Bình"
                  className="w-12 h-14 object-cover rounded-lg border border-rose-100"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[10px] font-mono text-[#881337] font-bold block">
                    ★ TIỂU THƯ Y2K
                  </span>
                  <span className="text-[11px] font-semibold text-slate-800 line-clamp-1">
                    Nhật Bình x Sneaker
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Điểm AI: 96/100
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Value Cards: Bộ Ba Giá Trị Cốt Lõi */}
      <section id="features" className="px-4 lg:px-8 py-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
            Trải Nghiệm Toàn Diện
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-heritage font-bold text-[#881337] mt-1">
            Không Chỉ Là Thử Đồ, Đây Là Tuyên Ngôn Phong Cách
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-rose-200/70 p-6 shadow-[0_2px_12px_rgba(255,117,151,0.06)] hover:border-rose-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#881337]">
              <Layers className="w-6 h-6 text-[#FF7597]" />
            </div>
            <h3 className="text-base font-serif-heritage font-bold text-[#881337]">
              Thử Đồ Phân Tầng Trực Quan
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dễ dàng ướm áo ngũ thân, áo tấc, tứ thân hoặc nhật bình chỉ qua một chạm. Khám phá cổ lập lĩnh, khuy ngũ thường và tà áo với tính năng soi chiếu X-Ray Di sản.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-rose-200/70 p-6 shadow-[0_2px_12px_rgba(255,117,151,0.06)] hover:border-rose-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#881337]">
              <ShieldCheck className="w-6 h-6 text-[#FF7597]" />
            </div>
            <h3 className="text-base font-serif-heritage font-bold text-[#881337]">
              Người Gác Cổng Di Sản (Gemini AI)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tự do phá cách cùng sneaker, kính mát, headphone mà không sợ sai lệch quy chuẩn lịch sử. Cơ chế đèn tín hiệu Traffic Light bảo chứng trang phục an tâm 100%.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl border border-rose-200/70 p-6 shadow-[0_2px_12px_rgba(255,117,151,0.06)] hover:border-rose-300 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#881337]">
              <PiggyBank className="w-6 h-6 text-[#FF7597]" />
            </div>
            <h3 className="text-base font-serif-heritage font-bold text-[#881337]">
              Tiết Kiệm Học Sinh - Sinh Viên
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bật ngay chế độ Mode HSSV: Thuê trang phục chính từ tiệm uy tín quanh khu vực (Hà Nội, TP.HCM, Huế) với giá chỉ từ 100k, săn phụ kiện Shopee và tận dụng tủ đồ cá nhân.
            </p>
          </div>

        </div>
      </section>

      {/* Lookbook Showcase: Bức Tường Kỷ Niệm */}
      <section id="lookbook" className="px-4 lg:px-8 py-12 max-w-7xl mx-auto bg-gradient-to-b from-transparent via-rose-50/50 to-transparent rounded-3xl my-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold text-[#881337] uppercase tracking-wider">
              Lookbook Gallery
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-heritage font-bold text-[#881337] mt-1">
              Bức Tường Dải Ảnh Photobooth
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xs">
            Các dải ảnh 4 ô được in bằng máy in V-Print, gắn nhãn danh hiệu hóm hỉnh và tem dán ngũ sắc.
          </p>
        </div>

        {/* Carousel / Grid of 3 Sample Photo Strips */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Strip 1 */}
          <div
            className="bg-[#FFF4F6] border border-rose-200 p-4 rounded-2xl shadow-md text-center text-[#881337] space-y-2.5 transition-transform hover:scale-[1.02]"
            style={{ transform: 'rotate(-1deg)' }}
          >
            <div className="text-[10px] font-mono opacity-60">V-BOOTH #01 · TIỂU THƯ Y2K</div>
            <img
              src={ASSET_IMAGES.nhatBinhPortrait}
              alt="Dải ảnh mẫu 1"
              className="w-full aspect-[3/4] object-cover rounded-xl border border-rose-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <strong className="font-serif-heritage text-sm block">"Tiểu Thư Ngũ Thân Y2K"</strong>
              <span className="text-[10px] text-slate-500 block">Áo Tấc Hồng Sen x Quạt Phiến Lụa · Điểm: 96/100</span>
            </div>
          </div>

          {/* Strip 2 */}
          <div
            className="bg-[#FFFDF9] border border-amber-200 p-4 rounded-2xl shadow-md text-center text-[#78350F] space-y-2.5 transition-transform hover:scale-[1.02]"
            style={{ transform: 'rotate(0.5deg)' }}
          >
            <div className="text-[10px] font-mono opacity-60">V-BOOTH #02 · BÁ KIẾN TRƯỢT VÁN</div>
            <img
              src={ASSET_IMAGES.nguThanPortrait}
              alt="Dải ảnh mẫu 2"
              className="w-full aspect-[3/4] object-cover rounded-xl border border-amber-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <strong className="font-serif-heritage text-sm block">"Bá Kiến Trượt Ván"</strong>
              <span className="text-[10px] text-slate-500 block">Ngũ Thân Tay Chẽn x Chunky Sneaker · Điểm: 92/100</span>
            </div>
          </div>

          {/* Strip 3 */}
          <div
            className="bg-[#F0FDFA] border border-teal-200 p-4 rounded-2xl shadow-md text-center text-[#134E4A] space-y-2.5 transition-transform hover:scale-[1.02]"
            style={{ transform: 'rotate(-0.8deg)' }}
          >
            <div className="text-[10px] font-mono opacity-60">V-BOOTH #03 · NÀNG THƠ KINH BẮC</div>
            <img
              src={ASSET_IMAGES.boothInterior}
              alt="Dải ảnh mẫu 3"
              className="w-full aspect-[3/4] object-cover rounded-xl border border-teal-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <strong className="font-serif-heritage text-sm block">"Nàng Thơ Quan Họ"</strong>
              <span className="text-[10px] text-slate-500 block">Áo Tứ Thân x Nón Quai Thao · Điểm: 98/100</span>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-rose-200/60 pt-8 pb-12 px-4 lg:px-8 max-w-7xl mx-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-serif-heritage font-bold text-[#881337] text-sm">V-Booth</span>
          <span className="mx-2">·</span>
          <span>Bảo Tồn Di Sản & Sáng Tạo Thời Trang Gen Z</span>
        </div>
        <p className="font-mono text-[11px]">
          Thiết kế chuẩn Neo-Heritage · Powered by Gemini Flash
        </p>
      </footer>

      {/* Mobile-First Sticky Floating Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-rose-200 p-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <button
          onClick={onEnterStore}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#881337] to-[#FF7597] text-white font-bold text-sm shadow-md shadow-rose-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Lấy Vé Vào Tiệm Ngay</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Heritage Wiki Modal */}
      <HeritageWikiModal
        isOpen={isWikiOpen}
        onClose={() => setIsWikiOpen(false)}
        onSelectGarment={(garmentId) => {
          setIsWikiOpen(false);
          if (onSelectGarmentAndEnter) {
            onSelectGarmentAndEnter(garmentId);
          } else {
            onEnterStore();
          }
        }}
      />

    </div>
  );
};
