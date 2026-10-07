export interface XRayPoint {
  id: string;
  name: string;
  historicalMeaning: string;
  culturalDetail: string;
  xPercent: number; // For positioning pin on avatar
  yPercent: number;
}

export interface GarmentItem {
  id: string;
  name: string;
  shortTag: string;
  dynasty: string;
  genderRecommendation: 'all' | 'nu' | 'nam';
  description: string;
  heritageStory: string;
  baseRentalPrice: number; // in VND
  defaultColor: string;
  availableColors: { name: string; hex: string; meaning: string }[];
  xRayPoints: XRayPoint[];
  typicalAccessories: string[];
  bannerImage?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'heritage' | 'genz';
  iconName: string;
  estimatedPrice: number;
  description: string;
  searchKeyword: string;
}

export const GARMENTS: GarmentItem[] = [
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Áo Thụng Ngũ Thân)',
    shortTag: 'Lễ Phục Trang Trọng',
    dynasty: 'Triều Nguyễn (Thế kỷ XIX - XX)',
    genderRecommendation: 'all',
    description: 'Áo thụng cổ đứng lập lĩnh, tay thụng dài quá đầu ngón tay, cài 5 khuy ngũ thường tượng trưng cho Nhân - Lễ - Nghĩa - Trí - Tín.',
    heritageStory: 'Là lễ phục bình dân đến quý tộc dùng trong các dịp đại lễ, hôn lễ, tế tự. Tay thụng rộng rãi khi chắp tay hành lễ tạo nên phong thái tôn nghiêm, cung kính.',
    baseRentalPrice: 150000,
    defaultColor: '#FF7597',
    availableColors: [
      { name: 'Hồng Sen Thắm', hex: '#FF7597', meaning: 'Sắc hoa sen Việt, trẻ trung mà dịu dàng thanh tao' },
      { name: 'Đỏ Điều Cung Đình', hex: '#BE123C', meaning: 'Hỷ sự, may mắn và quyền quý của lễ phục triều Nguyễn' },
      { name: 'Xanh Cổ Vịt', hex: '#0F766E', meaning: 'Mộc khí thanh nhã, tượng trưng cho sự trường cửu' },
      { name: 'Trắng Sữa Ngà', hex: '#FAF5EE', meaning: 'Sự thuần khiết, thanh cao như giấy dó và ngọc thạch' },
      { name: 'Vàng Hoàng Yến', hex: '#D97706', meaning: 'Quý phái, ấm áp như ánh nắng sớm cố đô' }
    ],
    typicalAccessories: ['Khăn Đóng / Vấn', 'Quạt Phiến Trầm Hương', 'Chuỗi Hạt Ngọc Bội'],
    xRayPoints: [
      {
        id: 'co-dung',
        name: 'Cổ Lập Lĩnh (Cổ Đứng)',
        historicalMeaning: 'Tượng trưng cho sự chính trực, đoan nghiêm của người quân tử và thục nữ.',
        culturalDetail: 'Cổ ôm khít quanh cổ, cao khoảng 3-4cm, giữ cho tư thế người mặc luôn ngay ngắn và khoan thai.',
        xPercent: 50,
        yPercent: 24
      },
      {
        id: 'khuy-ngu-thuong',
        name: 'Hàng 5 Khuy Cài (Ngũ Thường)',
        historicalMeaning: 'Đại diện cho 5 phẩm hạnh đạo đức cốt lõi: Nhân - Lễ - Nghĩa - Trí - Tín.',
        culturalDetail: 'Khuy bằng ngọc, đồng hoặc bọc vải, luôn cài sang bên vạt phải (hữu nhậm) theo chuẩn mực văn hiến.',
        xPercent: 56,
        yPercent: 35
      },
      {
        id: 'tay-thung',
        name: 'Tay Áo Thụng Dài',
        historicalMeaning: 'Tượng trưng cho sự khoan dung, thong dong và tôn kính bề trên khi hành lễ.',
        culturalDetail: 'Tay áo may rộng hình chữ nhật, khi buông thẳng dài che khuất bàn tay, khi nâng lên tạo thành vòng cung uyển chuyển.',
        xPercent: 22,
        yPercent: 48
      },
      {
        id: 'vat-ngu-than',
        name: 'Cấu Trúc Ngũ Thân (5 Thân Áo)',
        historicalMeaning: '4 thân ngoài là tứ thân phụ mẫu (cha mẹ ruột và cha mẹ chồng/vợ), thân thứ 5 bên trong là đứa con.',
        culturalDetail: 'Mang triết lý hiếu thảo sâu sắc: cha mẹ luôn bao bọc, chở che đứa con trong lòng gia đình gia giáo.',
        xPercent: 62,
        yPercent: 64
      }
    ]
  },
  {
    id: 'ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    shortTag: 'Tiện Dụng Sinh Hoạt',
    dynasty: 'Thời Chúa Nguyễn & Vua Minh Mạng',
    genderRecommendation: 'all',
    description: 'Form áo 5 thân với tay áo bó gọn gàng quanh cổ tay, thích hợp di chuyển năng động và mix đồ thời trang đương đại.',
    heritageStory: 'Vua Minh Mạng ban hành quy định trang phục toàn quốc vào thế kỷ 19. Tay chẽn gọn gàng trở thành trang phục công sở, dạo phố và sinh hoạt hàng ngày thanh lịch bậc nhất.',
    baseRentalPrice: 120000,
    defaultColor: '#1E3A8A',
    availableColors: [
      { name: 'Xanh Chàm Lam Thẫm', hex: '#1E3A8A', meaning: 'Vẻ nho nhã của tầng lớp trí thức, sĩ tử kinh thành' },
      { name: 'Xanh Ngọc Lụa', hex: '#0D9488', meaning: 'Màu của ngọc bích, mát lành và hiện đại' },
      { name: 'Đen Tuyền Huyền Bí', hex: '#262626', meaning: 'Trang trọng, phong trần và cực kỳ tôn dáng khi mix sneaker' },
      { name: 'Hồng Phấn Muted', hex: '#FB7185', meaning: 'Phong vị ngọt ngào, tinh nghịch cho bạn trẻ Gen Z' }
    ],
    typicalAccessories: ['Sneaker Chunky Trắng', 'Kính Mát Y2K', 'Đồng Hồ Dây Da', 'Quạt Gấp'],
    xRayPoints: [
      {
        id: 'tay-chen',
        name: 'Cổ Tay Chẽn Ôm Gọn',
        historicalMeaning: 'Thể hiện tính thực tiễn, năng động, sẵn sàng làm việc và di chuyển.',
        culturalDetail: 'Từ khuỷu tay xuống cổ tay được may thu hẹp vừa vặn, giúp người mặc dễ dàng cầm bút, đọc sách hay lái xe.',
        xPercent: 18,
        yPercent: 52
      },
      {
        id: 'co-dung-chen',
        name: 'Cổ Đứng Cài Khuy',
        historicalMeaning: 'Dấu ấn độc bản của hệ thống trang phục Việt thời kỳ cận đại.',
        culturalDetail: 'Cổ lập lĩnh tạo nên phong thái đĩnh đạc, khi phối cùng áo phông lót trong hay cà vạt đều tạo nét độc đáo.',
        xPercent: 50,
        yPercent: 24
      },
      {
        id: 'vat-vat-che',
        name: 'Tà Áo Ngang Gối',
        historicalMeaning: 'Tỉ lệ cơ thể vàng trong mỹ học trang phục truyền thống Á Đông.',
        culturalDetail: 'Tà áo dài vừa quá đầu gối một chút, tạo bước đi dứt khoát, thanh thoát mà không vướng víu.',
        xPercent: 52,
        yPercent: 72
      }
    ]
  },
  {
    id: 'nhat-binh',
    name: 'Áo Nhật Bình',
    shortTag: 'Lễ Phục Hoàng Tộc',
    dynasty: 'Hoàng Triều Nhà Nguyễn',
    genderRecommendation: 'nu',
    description: 'Cổ áo hình chữ nhật viền hoa văn tinh xảo, dải dệt ngũ sắc ở cổ tay tượng trưng ngũ hành, trang phục công chúa và phi tần.',
    heritageStory: 'Khởi nguồn từ áo Phi Phong thời Minh nhưng được người Việt cải biên hoàn toàn. Tên gọi "Nhật Bình" bắt nguồn từ chiếc cổ áo khi mặc ghép lại thành hình chữ nhật ngay ngắn trước ngực.',
    baseRentalPrice: 200000,
    defaultColor: '#9F1239',
    availableColors: [
      { name: 'Đỏ Thẫm Hoa Mộc Qua', hex: '#9F1239', meaning: 'Phẩm hàm Nhất - Nhị Giai phi tần chốn hoàng cung' },
      { name: 'Tím Huế Mộng Mơ', hex: '#7E22CE', meaning: 'Màu của hoàng cung Huế, quý phái và lắng đọng' },
      { name: 'Xanh Lục Bảo', hex: '#047857', meaning: 'Màu của Tam - Tứ Giai tần ngự triều Nguyễn' },
      { name: 'Vàng Nghệ Hoàng Thất', hex: '#CA8A04', meaning: 'Dành riêng cho Hoàng Hậu và Công chúa triều đình' }
    ],
    typicalAccessories: ['Khăn Vành Dây Ngũ Sắc', 'Hài Thêu Chỉ Vàng', 'Ngọc Bội Song Hỷ'],
    xRayPoints: [
      {
        id: 'co-nhat-binh',
        name: 'Cổ Chữ Nhật (Nhật Bình)',
        historicalMeaning: 'Trung tâm thị giác của toàn bộ chiếc áo, định hình tên gọi kiêu hãnh.',
        culturalDetail: 'Cổ áo may to bản, thêu họa tiết phụng, mây ngũ sắc và hoa sen đối xứng tuyệt mỹ.',
        xPercent: 50,
        yPercent: 28
      },
      {
        id: 'day-ngu-sac',
        name: 'Dải Ngũ Sắc Tay Áo',
        historicalMeaning: 'Biểu trưng cho quy luật Ngũ Hành: Kim - Mộc - Thủy - Hỏa - Thổ sinh sôi.',
        culturalDetail: 'Năm dải vải màu xanh lục, vàng, xanh lam, trắng, đỏ được viền tinh tế ở cửa tay áo.',
        xPercent: 20,
        yPercent: 50
      },
      {
        id: 'dai-that-lung',
        name: 'Đai Dải Rủ (Tố Sa)',
        historicalMeaning: 'Điểm nhấn thắt đáy lưng ong và tạo sự nhịp nhàng trong từng bước đi.',
        culturalDetail: 'Hai dải vải rủ xuống trước bụng có thêu hoa văn chỉ vàng, bay nhẹ theo gió.',
        xPercent: 50,
        yPercent: 54
      }
    ]
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân Kinh Bắc',
    shortTag: 'Dân Gian Bắc Bộ',
    dynasty: 'Bắc Bộ Việt Nam (Thế kỷ XII - XX)',
    genderRecommendation: 'nu',
    description: 'Bốn vạt áo buông thướt tha, hai vạt trước buộc chéo trước bụng, phối cùng yếm thắm, lưng ong và nón quai thao.',
    heritageStory: 'Gắn liền với hình ảnh liền chị quan họ Kinh Bắc và người phụ nữ Việt tảo tần, dịu dàng. Áo không cài cúc phía trước mà mặc khoác ngoài yếm đào e ấp.',
    baseRentalPrice: 100000,
    defaultColor: '#854D0E',
    availableColors: [
      { name: 'Nâu Củ Nâu Mộc Mạc', hex: '#854D0E', meaning: 'Màu đất mẹ Kinh Bắc, chân phương và gần gũi' },
      { name: 'Hồng Đào Quan Họ', hex: '#F43F5E', meaning: 'Sắc xuân lễ hội Lim, duyên dáng hát câu giao duyên' },
      { name: 'Xanh Lá Mạ', hex: '#65A30D', meaning: 'Sức sống căng tràn của ruộng đồng châu thổ Bắc Bộ' }
    ],
    typicalAccessories: ['Nón Quai Thao Bản Rộng', 'Yếm Đào Cổ Yếm', 'Khăn Mỏ Quạ Đen'],
    xRayPoints: [
      {
        id: 'yem-dao',
        name: 'Yếm Thắm Lót Trong',
        historicalMeaning: 'Nét quyến rũ e ấp, kín đáo đặc trưng của phụ nữ truyền thống.',
        culturalDetail: 'Yếm hình thoi buộc dây qua cổ và lưng, lộ xương quai xanh mềm mại.',
        xPercent: 50,
        yPercent: 29
      },
      {
        id: 'nut-that-vat',
        name: 'Hai Vạt Trước Buộc Chéo',
        historicalMeaning: 'Biểu tượng cho sự gắn kết vợ chồng và tình thân khăng khít.',
        culturalDetail: 'Hai vạt phía trước buông dài được thắt nút duyên dáng dưới dải thắt lưng xanh.',
        xPercent: 50,
        yPercent: 58
      }
    ]
  }
];

export const ACCESSORIES_DATABASE: AccessoryItem[] = [
  // Heritage items
  {
    id: 'non-quai-thao',
    name: 'Nón Quai Thao / Nón Ba Tầm',
    category: 'heritage',
    iconName: 'Sparkles',
    estimatedPrice: 65000,
    description: 'Nón tròn dẹt quai thao tơ tằm buông rủ thanh lịch',
    searchKeyword: 'nón quai thao biểu diễn cổ phục'
  },
  {
    id: 'quat-phien-lua',
    name: 'Quạt Phiến Tơ Lụa Thêu Sen',
    category: 'heritage',
    iconName: 'Wind',
    estimatedPrice: 38000,
    description: 'Quạt cầm tay tròn khung gỗ phong cách tiểu thư đài các',
    searchKeyword: 'quạt phiến tròn thêu hoa cổ trang'
  },
  {
    id: 'vong-ngoc-boi',
    name: 'Vòng Ngọc Bội Đeo Thắt Lưng',
    category: 'heritage',
    iconName: 'Shield',
    estimatedPrice: 45000,
    description: 'Mặt ngọc chạm khắc hoa văn cát tường kèm tua rua',
    searchKeyword: 'mặt ngọc bội tua rua đeo hông cổ trang'
  },
  {
    id: 'khan-dong-truyen-thong',
    name: 'Khăn Đóng / Vấn Lụa',
    category: 'heritage',
    iconName: 'Crown',
    estimatedPrice: 50000,
    description: 'Khăn xếp đều nếp chuẩn phom dáng sĩ tử và quý cô',
    searchKeyword: 'khăn đóng nam nữ việt phục'
  },
  // Gen Z crossovers
  {
    id: 'sneaker-chunky-trang',
    name: 'Sneaker Chunky Trắng Retro',
    category: 'genz',
    iconName: 'Footprints',
    estimatedPrice: 180000,
    description: 'Đế bánh mì tôn dáng, tạo cú twist hiện đại phá cách',
    searchKeyword: 'giày sneaker chunky trắng học sinh sinh viên'
  },
  {
    id: 'kinh-ram-y2k',
    name: 'Kính Râm Gọng Oval Y2K',
    category: 'genz',
    iconName: 'Glasses',
    estimatedPrice: 42000,
    description: 'Kính mắt đen cool ngầu tạo thần thái high-fashion',
    searchKeyword: 'kính râm retro oval y2k đen'
  },
  {
    id: 'headphone-retro',
    name: 'Tai Nghe Headphone Retro Màu Kem',
    category: 'genz',
    iconName: 'Headphones',
    estimatedPrice: 95000,
    description: 'Đeo quanh cổ tăng chất Indie / Hipster phố cổ',
    searchKeyword: 'tai nghe chụp tai retro bluetooth kem sữa'
  },
  {
    id: 'tui-canvas-thu-phap',
    name: 'Túi Tote Canvas Thư Pháp',
    category: 'genz',
    iconName: 'ShoppingBag',
    estimatedPrice: 35000,
    description: 'Chất liệu thô mộc, in chữ Nôm cách điệu',
    searchKeyword: 'túi tote vải canvas in chữ thư pháp'
  }
];

export const PHOTOBOOTH_STICKERS = [
  { id: 'chim-hac', label: 'Chim Hạc Ngậm Sen', symbol: '🪶' },
  { id: 'may-ngu-sac', label: 'Mây Ngũ Sắc', symbol: '☁️' },
  { id: 'hoa-sen', label: 'Búp Sen Cố Đô', symbol: '🪷' },
  { id: 'tem-thu', label: 'Tem Di Sản V-Booth', symbol: '📜' },
  { id: 'trai-tim-y2k', label: 'Pixel Heart Y2K', symbol: '💖' },
  { id: 'ngoi-sao', label: 'Sao Lấp Lánh', symbol: '✨' }
];

export const PHOTOBOOTH_POSES = [
  { id: 'chao-kinh', name: 'Chắp Tay Bái Lễ (Cổ Điển)', subtitle: 'Phong thái nho nhã' },
  { id: 'quat-che-mat', name: 'Nửa Khép Quạt Lụa (E Ấp)', subtitle: 'Góc nghiêng 45 độ' },
  { id: 'pose-y2k-peace', name: 'Tay Chữ V Thần Thái (Y2K)', subtitle: 'Cười tươi phá cách' },
  { id: 'pose-cool-fashion', name: 'Đeo Kính Râm Soi Gương', subtitle: 'High-fashion model' }
];

export const PHOTOBOOTH_FRAME_STYLES = [
  { id: 'classic-pink', name: 'Hồng Kem V-Booth', bgColor: '#FFF4F6', borderColor: '#FECDD3', textColor: '#881337' },
  { id: 'warm-ivory', name: 'Giấy Dó Sữa Ấm', bgColor: '#FFFDF9', borderColor: '#FDE68A', textColor: '#78350F' },
  { id: 'deep-raspberry', name: 'Sen Đỏ Hoàng Gia', bgColor: '#881337', borderColor: '#F43F5E', textColor: '#FFF1F2' },
  { id: 'vintage-mint', name: 'Ngọc Bích Cổ Điển', bgColor: '#F0FDFA', borderColor: '#99F6E4', textColor: '#134E4A' }
];

export const ASSET_IMAGES = {
  heroStorefront: '/src/assets/images/vbooth_hero_storefront_1791343319020.jpg',
  nhatBinhPortrait: '/src/assets/images/vbooth_nhat_binh_portrait_1791343332565.jpg',
  nguThanPortrait: '/src/assets/images/vbooth_ngu_than_portrait_1791343346372.jpg',
  boothInterior: '/src/assets/images/vbooth_photobooth_interior_1791343359806.jpg'
};
