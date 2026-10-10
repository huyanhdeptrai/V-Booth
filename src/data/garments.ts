export type BodyZone = 'head' | 'torso' | 'legs' | 'feet';

export interface BodyZoneHeritageInfo {
  zone: BodyZone;
  label: string;
  subLabel: string;
  tooltipText: string;
  historicalMeaning: string;
  culturalDetail: string;
  quickActionText: string;
}

export const BODY_ZONE_KNOWLEDGE: Record<BodyZone, BodyZoneHeritageInfo> = {
  head: {
    zone: 'head',
    label: 'Đầu & Tóc Vấn',
    subLabel: 'Khăn đóng · Nón quai thao · Nón lá · Tóc vấn',
    tooltipText: 'Chỉnh nón, khăn & tóc (Click)',
    historicalMeaning: 'Quy thức vấn khăn đóng đều nếp, đội nón ba tầm quai thao dệt tơ tằm buông rủ hay nón lá bài thơ tôn vinh phong thái đoan trang, tôn kính bề trên.',
    culturalDetail: 'Khăn đóng tạo nét mặt đĩnh đạc cho nam sĩ tử; nón quai thao và tóc vấn trần tôn vẻ e ấp, dịu dàng cho người phụ nữ truyền thống.',
    quickActionText: 'Mở Bàn Phụ Kiện Nón & Khăn'
  },
  torso: {
    zone: 'torso',
    label: 'Thân Áo Cổ Truyền',
    subLabel: 'Cổ lập lĩnh · Khuy ngũ thường · Ngũ thân & Nhật bình',
    tooltipText: 'Sửa thân áo, cổ & chất liệu (Click)',
    historicalMeaning: 'Cổ Lập Lĩnh (cao 3-4cm) giữ tư thế ngay thẳng nghiêm cẩn; hàng 5 khuy ngũ thường tượng trưng cho Nhân - Lễ - Nghĩa - Trí - Tín; thân áo 5 vạt thể hiện đạo hiếu gia đình.',
    culturalDetail: 'Áo Nhật Bình viền cổ to bản thêu hoa văn chữ Thọ, cổ tay dệt ngũ sắc uốn lượn; Áo Tấc tay thụng đại lễ trang trọng; Áo Ngũ Thân tay chẽn năng động.',
    quickActionText: 'Mở Chọn Phom Áo & Chất Liệu Vải'
  },
  legs: {
    zone: 'legs',
    label: 'Phần Dưới (Quần / Váy)',
    subLabel: 'Quần lụa ống rộng · Jeans denim · Váy đũi · Xếp ly',
    tooltipText: 'Chỉnh quần lụa, jeans & chân váy (Click)',
    historicalMeaning: 'Quần lụa trắng ngà hoặc đen tuyền buông rủ thướt tha chuẩn quy thức; nay phối cùng quần jeans ống suông, quần tây hoặc chân váy midi xếp ly tôn dáng Gen Z.',
    culturalDetail: 'Chất liệu lụa hoặc denim, đũi mộc tạo nên những xúc cảm thời trang đa tầng, giao hòa giữa truyền thống đoan trang và streetwear phóng khoáng.',
    quickActionText: 'Mở Danh Mục Quần & Váy'
  },
  feet: {
    zone: 'feet',
    label: 'Giày Dép & Guốc Mộc',
    subLabel: 'Guốc mộc · Hài thêu mũi cong · Sneaker · Boots da',
    tooltipText: 'Đổi guốc mộc, hài thêu, sneaker & boots (Click)',
    historicalMeaning: 'Guốc mộc hoa sen và giày hài thêu mũi cong tái hiện phong thái quý phái xưa; sneaker chunky, Samba retro hay Chelsea boots đem lại năng lượng hiện đại.',
    culturalDetail: 'Sự phong phú từ guốc gỗ sơn mài, hài cung đình đến sneaker retro đường phố tạo dấu ấn bản phối độc bản.',
    quickActionText: 'Mở Danh Mục Giày Dép'
  }
};

export interface XRayPoint {
  id: string;
  name: string;
  historicalMeaning: string;
  culturalDetail: string;
  xPercent: number; // For positioning pin on avatar
  yPercent: number;
}

export interface HeritageColor {
  id: string;
  name: string;
  hex: string;
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ' | 'Giao Hòa';
  meaning: string;
}

export const HERITAGE_COLORS: HeritageColor[] = [
  {
    id: 'do-son',
    name: 'Đỏ Son',
    hex: '#B91C1C',
    element: 'Hỏa',
    meaning: 'Hỷ sự, may mắn, quyền quý và sức sống trường cửu'
  },
  {
    id: 'tim-hue',
    name: 'Tím Huế',
    hex: '#7E22CE',
    element: 'Giao Hòa',
    meaning: 'Hòa quyện Thủy - Hỏa, trầm mặc, bí ẩn và quý tộc hoàng thành'
  },
  {
    id: 'vang-hoa-hoe',
    name: 'Vàng Hoa Hòe',
    hex: '#CA8A04',
    element: 'Thổ',
    meaning: 'Trung tâm thái hòa, tôn nghiêm của đất trời và ấm áp ngày xuân'
  },
  {
    id: 'xanh-cham',
    name: 'Xanh Chàm',
    hex: '#1E3A8A',
    element: 'Thủy',
    meaning: 'Nho nhã, thâm trầm của tầng lớp trí thức sĩ tử kinh kỳ'
  },
  {
    id: 'xanh-ngoc-bich',
    name: 'Xanh Ngọc Bích',
    hex: '#0D9488',
    element: 'Mộc',
    meaning: 'Mộc khí sinh sôi, cốt cách thanh bạch và trường thọ'
  },
  {
    id: 'hong-canh-sen',
    name: 'Hồng Cánh Sen',
    hex: '#FF7597',
    element: 'Hỏa',
    meaning: 'Dịu dàng, thanh cao thoát tục như quốc hoa sen Việt'
  }
];

export interface FabricOption {
  id: 'lanh-my-a' | 'lua-van-phuc' | 'dui-nam-cao' | 'gam-cung-dinh' | 'sa-xuyen-lua';
  name: string;
  shortTag: string;
  villageOrigin: string; // Artisan craft village origin
  description: string;
  sheenOpacity: number;
}

export const ARTISAN_FABRICS: FabricOption[] = [
  {
    id: 'lanh-my-a',
    name: 'Lãnh Mỹ A',
    shortTag: 'Đen bóng mặc nưa',
    villageOrigin: 'Làng nghề dệt lụa Tân Châu (An Giang) - Nhuộm kỳ công từ trái mặc nưa',
    description: 'Được mệnh danh là "nữ hoàng tơ tằm" Nam Bộ, bề mặt đen tuyền óng ả huyền bí, càng giặt càng mềm bóng.',
    sheenOpacity: 0.55
  },
  {
    id: 'lua-van-phuc',
    name: 'Lụa Vạn Phúc',
    shortTag: 'Hoa văn song hạc',
    villageOrigin: 'Làng lụa Vạn Phúc hơn 1.000 năm tuổi (Hà Đông, Hà Nội)',
    description: 'Chất lụa mềm mượt như mây, dệt hoa văn chìm tinh xảo, từng được tiến cử may quốc phục triều Nguyễn.',
    sheenOpacity: 0.35
  },
  {
    id: 'dui-nam-cao',
    name: 'Vải Đũi Nam Cao',
    shortTag: 'Thô mộc thoáng mát',
    villageOrigin: 'Xã Nam Cao, Kiến Xương (Thái Bình) - Dệt từ kén tơ tằm thủ công',
    description: 'Sợi đũi tự nhiên mộc mạc, thấm hút tốt, đem lại phong thái khoan thai, gần gũi với thiên nhiên.',
    sheenOpacity: 0.1
  },
  {
    id: 'gam-cung-dinh',
    name: 'Gấm Cung Đình',
    shortTag: 'Chỉ kim tuyến quý tộc',
    villageOrigin: 'Phục dựng theo quy chuẩn xưởng dệt hoàng gia Cố Đô Huế',
    description: 'Dày dặn, bề mặt dệt chỉ kim tuyến ngũ sắc lộng lẫy, chuyên dùng cho đại triều phục và lễ cưới quý tộc.',
    sheenOpacity: 0.5
  },
  {
    id: 'sa-xuyen-lua',
    name: 'Sa/Xuyến Lụa',
    shortTag: 'Mỏng nhẹ thấu thị',
    villageOrigin: 'Kỹ thuật dệt tơ then cổ truyền đồng bằng Bắc Bộ',
    description: 'Mỏng nhẹ như sương, thấu thị tinh tế, thường được may làm lớp áo thụng ngoài tạo hiệu ứng tầng lớp mộng ảo.',
    sheenOpacity: 0.25
  }
];

export const STANDARD_XRAY_POINTS: XRayPoint[] = [
  {
    id: 'co-lap-linh',
    name: 'Cổ Lập Lĩnh (Cổ Đứng Nghiêm Cẩn)',
    historicalMeaning: 'Quy thức cổ đứng ôm khít quanh cổ, cao 3-4cm, biểu trưng cho sự ngay thẳng, chính trực của người quân tử và đoan trang của thục nữ.',
    culturalDetail: 'Cổ áo giữ cho tư thế người mặc luôn ngay ngắn, đĩnh đạc, là dấu ấn khu biệt rõ nét giữa Việt phục và trang phục các nước đồng văn.',
    xPercent: 50,
    yPercent: 25
  },
  {
    id: 'khuy-ngu-thuong',
    name: 'Khuy Ngũ Thường (5 Hạt Cúc)',
    historicalMeaning: 'Hàng 5 chiếc khuy cài sang bên phải tượng trưng cho 5 đức hạnh cốt lõi: Nhân - Lễ - Nghĩa - Trí - Tín.',
    culturalDetail: 'Khuy cài bằng đồng, ngọc hoặc bọc vải, luôn được cài sang bên vạt phải (hữu nhậm) theo chuẩn mực văn hiến người Việt.',
    xPercent: 54,
    yPercent: 35
  },
  {
    id: 'vat-con',
    name: 'Vạt Con Giấu Trong (Thân Thứ 5)',
    historicalMeaning: 'Thân áo thứ 5 được may ẩn kín đáo bên trong 4 thân ngoài, mang triết lý cha mẹ nội ngoại che chở đứa con trong lòng gia đình.',
    culturalDetail: 'Thể hiện mỹ đức hiếu đạo và nếp sống khiêm nhường, kín đáo, trọng sự hòa hợp của gia đình truyền thống.',
    xPercent: 58,
    yPercent: 58
  },
  {
    id: 'tay-thung-chen',
    name: 'Tay Thụng vs Tay Chẽn (Lễ & Thường Phục)',
    historicalMeaning: 'Áo Tấc tay thụng rộng rãi trang nghiêm dùng trong đại lễ bái kiến; Áo Ngũ Thân tay chẽn bó gọn tiện dụng cho sinh hoạt năng động.',
    culturalDetail: 'Khi chắp tay hành lễ, tay thụng buông dài che khuất bàn tay tạo phong thái cung kính; tay chẽn lại giúp người mặc dễ dàng làm việc.',
    xPercent: 22,
    yPercent: 46
  }
];

export interface GarmentItem {
  id: string;
  name: string;
  shortTag: string;
  dynasty: string;
  region: 'BacBo' | 'TrungBo' | 'NamBo' | 'ToanQuoc';
  genderRecommendation: 'all' | 'nu' | 'nam';
  description: string;
  heritageStory: string;
  baseRentalPrice: number; // in VND
  defaultColor: string;
  availableColors: HeritageColor[];
  xRayPoints: XRayPoint[];
  typicalAccessories: string[];
}

export interface PresetStyle {
  id: string;
  name: string;
  tagline: string;
  garmentId: string;
  colorHex: string;
  fabricId: 'lanh-my-a' | 'lua-van-phuc' | 'dui-nam-cao' | 'gam-cung-dinh' | 'sa-xuyen-lua';
  accessories: string[];
  context: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  region?: 'BacBo' | 'TrungBo' | 'NamBo' | 'ToanQuoc' | 'all';
  category: 'heritage' | 'genz';
  iconName: string;
  estimatedPrice: number;
  description: string;
  searchKeyword: string;
}

export const CONTEXT_PRESETS = [
  { id: 'ky-yeu', label: 'Kỷ Yếu Học Đường Y2K', code: '01', desc: 'Thanh xuân phố thị năng động' },
  { id: 'hoi-lim', label: 'Hội Lim Quan Họ', code: '02', desc: 'Duyên dáng câu ca giao duyên' },
  { id: 'pho-co', label: 'Phố Cổ Chiều Thu', code: '03', desc: 'Nét hoài niệm Tràng Tiền - Hàng Buồm' },
  { id: 'tet-co-do', label: 'Tết Cố Đô Hoàng Cung', code: '04', desc: 'Trang nghiêm, quyền quý triều đình' },
  { id: 'bar-night', label: 'Tiệc Đêm Club (Test Lỗi)', code: '05', desc: 'Thử nghiệm bối cảnh để test AI' }
];

export const GARMENTS: GarmentItem[] = [
  {
    id: 'ao-tac',
    name: 'Áo Tấc (Áo Thụng Ngũ Thân)',
    shortTag: 'Lễ Phục Trang Trọng',
    dynasty: 'Triều Nguyễn (Thế kỷ XIX - XX)',
    region: 'ToanQuoc',
    genderRecommendation: 'all',
    description: 'Áo thụng cổ đứng lập lĩnh, tay thụng dài quá đầu ngón tay, cài 5 khuy ngũ thường tượng trưng cho Nhân - Lễ - Nghĩa - Trí - Tín.',
    heritageStory: 'Là lễ phục bình dân đến quý tộc dùng trong các dịp đại lễ, hôn lễ, tế tự. Tay thụng rộng rãi khi chắp tay hành lễ tạo nên phong thái tôn nghiêm, cung kính.',
    baseRentalPrice: 150000,
    defaultColor: '#FF7597',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Khăn Đóng / Vấn', 'Quạt Phiến Trầm Hương', 'Chuỗi Hạt Ngọc Bội'],
    xRayPoints: STANDARD_XRAY_POINTS
  },
  {
    id: 'ngu-than-tay-chen',
    name: 'Áo Ngũ Thân Tay Chẽn',
    shortTag: 'Tiện Dụng Sinh Hoạt',
    dynasty: 'Thời Chúa Nguyễn & Vua Minh Mạng',
    region: 'ToanQuoc',
    genderRecommendation: 'all',
    description: 'Form áo 5 thân với tay áo bó gọn gàng quanh cổ tay, thích hợp di chuyển năng động và mix đồ thời trang đương đại.',
    heritageStory: 'Vua Minh Mạng ban hành quy định trang phục toàn quốc vào thế kỷ 19. Tay chẽn gọn gàng trở thành trang phục công sở, dạo phố và sinh hoạt hàng ngày thanh lịch bậc nhất.',
    baseRentalPrice: 120000,
    defaultColor: '#1E3A8A',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Sneaker Chunky Trắng', 'Kính Mát Y2K', 'Đồng Hồ Dây Da', 'Quạt Gấp'],
    xRayPoints: STANDARD_XRAY_POINTS
  },
  {
    id: 'nhat-binh',
    name: 'Áo Nhật Bình',
    shortTag: 'Lễ Phục Hoàng Tộc',
    dynasty: 'Hoàng Triều Nhà Nguyễn',
    region: 'TrungBo',
    genderRecommendation: 'nu',
    description: 'Cổ áo hình chữ nhật viền hoa văn tinh xảo, dải dệt ngũ sắc ở cổ tay tượng trưng ngũ hành, trang phục công chúa và phi tần.',
    heritageStory: 'Khởi nguồn từ áo Phi Phong thời Minh nhưng được người Việt cải biên hoàn toàn. Tên gọi "Nhật Bình" bắt nguồn từ chiếc cổ áo khi mặc ghép lại thành hình chữ nhật ngay ngắn trước ngực.',
    baseRentalPrice: 200000,
    defaultColor: '#9F1239',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Khăn Vành Dây Ngũ Sắc', 'Hài Thêu Chỉ Vàng', 'Ngọc Bội Song Hỷ'],
    xRayPoints: STANDARD_XRAY_POINTS
  },
  {
    id: 'ao-tu-than',
    name: 'Áo Tứ Thân Kinh Bắc',
    shortTag: 'Dân Gian Bắc Bộ',
    dynasty: 'Bắc Bộ Việt Nam (Thế kỷ XII - XX)',
    region: 'BacBo',
    genderRecommendation: 'nu',
    description: 'Bốn vạt áo buông thướt tha, hai vạt trước buộc chéo trước bụng, phối cùng yếm thắm, lưng ong và nón quai thao.',
    heritageStory: 'Gắn liền với hình ảnh liền chị quan họ Kinh Bắc và người phụ nữ Việt tảo tần, dịu dàng. Áo không cài cúc phía trước mà mặc khoác ngoài yếm đào e ấp.',
    baseRentalPrice: 100000,
    defaultColor: '#B91C1C',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Nón Quai Thao Bản Rộng', 'Yếm Đào Cổ Yếm', 'Khăn Mỏ Quạ Đen'],
    xRayPoints: STANDARD_XRAY_POINTS
  },
  {
    id: 'ao-ba-ba',
    name: 'Áo Bà Ba Nam Bộ',
    shortTag: 'Dân Dã Nam Bộ',
    dynasty: 'Nam Bộ Việt Nam (Thế kỷ XIX - Hiện đại)',
    region: 'NamBo',
    genderRecommendation: 'all',
    description: 'Thân áo không có cổ, cổ giữa xẻ chữ V hoặc tròn nhẹ, vạt áo xẻ hai bên hông tạo sự phóng khoáng, kèm hai túi to phía trước.',
    heritageStory: 'Biểu trưng của người dân Nam Bộ chân chất, hào sảng bên bờ kênh rạch miệt vườn. Áo bà ba vừa ôm dáng duyên dáng vừa tạo sự linh hoạt khi chèo ghe, làm việc.',
    baseRentalPrice: 90000,
    defaultColor: '#0D9488',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Khăn Rằn Nam Bộ', 'Nón Lá Chóp Nhọn', 'Guốc Gỗ Mộc'],
    xRayPoints: STANDARD_XRAY_POINTS
  },
  {
    id: 'ao-giao-linh',
    name: 'Áo Giao Lĩnh (Tràng Vạt)',
    shortTag: 'Cổ Điển Thời Lê - Lý',
    dynasty: 'Triều Lý - Trần - Hậu Lê',
    region: 'BacBo',
    genderRecommendation: 'all',
    description: 'Thân áo rộng rãi với cổ vạt chéo cài sang bên phải (hữu nhậm), kết hợp đai thắt lưng vải buông dài thanh thoát.',
    heritageStory: 'Một trong những phom áo cổ xưa nhất của người Việt, xuất hiện từ thời Lý - Trần và thịnh hành suốt thời Lê sơ. Tà áo giao nhau trước ngực thể hiện sự quy củ, nho nhã bậc nhất.',
    baseRentalPrice: 180000,
    defaultColor: '#1E3A8A',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Khăn Đóng / Vấn', 'Quạt Phiến Trầm Hương', 'Chuỗi Hạt Ngọc Bội'],
    xRayPoints: STANDARD_XRAY_POINTS
  },
  {
    id: 'ao-vien-linh',
    name: 'Áo Viên Lĩnh (Cổ Tròn Cung Đình)',
    shortTag: 'Quan Lại & Quý Tộc',
    dynasty: 'Triều Lý - Trần - Lê',
    region: 'BacBo',
    genderRecommendation: 'nam',
    description: 'Cổ tròn ôm khít quanh cổ áo, thân áo rộng thêu Bổ Tử trước ngực thể hiện phẩm cấp quan lại và văn nhân quý tộc.',
    heritageStory: 'Quy thức thường phục và triều phục của quan lại triều đình qua nhiều thế kỷ. Chiếc cổ tròn khép kín tượng trưng cho sự trọn vẹn, công minh và phẩm hạnh thanh liêm.',
    baseRentalPrice: 220000,
    defaultColor: '#B91C1C',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Khăn Đóng / Vấn', 'Chuỗi Hạt Ngọc Bội', 'Hài Thêu Chỉ Vàng'],
    xRayPoints: STANDARD_XRAY_POINTS
  },
  {
    id: 'ao-doi-kham',
    name: 'Áo Đối Khâm (Song Vạt)',
    shortTag: 'Khoác Ngoài Quý Phái',
    dynasty: 'Triều Lý - Trần - Lê',
    region: 'ToanQuoc',
    genderRecommendation: 'nu',
    description: 'Áo khoác ngoài có hai vạt song song thẳng đứng buông rủ cân đối, để lộ yếm thắm hoặc lớp áo trong tinh xảo bên dưới.',
    heritageStory: 'Phom áo khoác thượng lưu tạo chiều sâu thị giác đa tầng (layering) sang trọng. Thường được các mệnh phụ phu nhân mặc vào tiết trời thu đông hoặc lễ hội.',
    baseRentalPrice: 160000,
    defaultColor: '#7E22CE',
    availableColors: HERITAGE_COLORS,
    typicalAccessories: ['Quạt Phiến Tơ Lụa Thêu Sen', 'Vòng Ngọc Bội Tua Rua', 'Hài Thêu Chỉ Vàng'],
    xRayPoints: STANDARD_XRAY_POINTS
  }
];

export const ACCESSORIES_DATABASE: AccessoryItem[] = [
  // Heritage items
  {
    id: 'non-quai-thao',
    name: 'Nón Quai Thao / Ba Tầm',
    region: 'BacBo',
    category: 'heritage',
    iconName: 'Crown',
    estimatedPrice: 65000,
    description: 'Nón tròn dẹt quai thao tơ tằm buông rủ thanh lịch Kinh Bắc',
    searchKeyword: 'nón quai thao biểu diễn cổ phục'
  },
  {
    id: 'khan-ran-nam-bo',
    name: 'Khăn Rằn Nam Bộ',
    region: 'NamBo',
    category: 'heritage',
    iconName: 'Wind',
    estimatedPrice: 25000,
    description: 'Khăn rằn sọc caro đen trắng truyền thống miền Tây sông nước',
    searchKeyword: 'khăn rằn nam bộ truyền thống'
  },
  {
    id: 'non-la-truyen-thong',
    name: 'Nón Lá Bài Thơ',
    region: 'ToanQuoc',
    category: 'heritage',
    iconName: 'Crown',
    estimatedPrice: 35000,
    description: 'Nón lá nón chóp chằm cọ thanh tao đậm đà bản sắc Việt',
    searchKeyword: 'nón lá bài thơ huế'
  },
  {
    id: 'quat-phien-lua',
    name: 'Quạt Phiến Tơ Lụa Thêu Sen',
    region: 'ToanQuoc',
    category: 'heritage',
    iconName: 'Wind',
    estimatedPrice: 38000,
    description: 'Quạt cầm tay tròn khung gỗ phong cách tiểu thư đài các',
    searchKeyword: 'quạt phiến tròn thêu hoa cổ trang'
  },
  {
    id: 'vong-ngoc-boi',
    name: 'Vòng Ngọc Bội Tua Rua',
    region: 'TrungBo',
    category: 'heritage',
    iconName: 'Shield',
    estimatedPrice: 45000,
    description: 'Mặt ngọc chạm khắc hoa văn cát tường đeo thắt lưng',
    searchKeyword: 'mặt ngọc bội tua rua đeo hông cổ trang'
  },
  {
    id: 'khan-dong-truyen-thong',
    name: 'Khăn Đóng / Vấn Lụa',
    region: 'ToanQuoc',
    category: 'heritage',
    iconName: 'Crown',
    estimatedPrice: 50000,
    description: 'Khăn xếp đều nếp chuẩn phom dáng sĩ tử và quý cô',
    searchKeyword: 'khăn đóng nam nữ việt phục'
  },
  {
    id: 'guoc-moc-truyen-thong',
    name: 'Guốc Mộc Hoa Sen Quai Nhung',
    region: 'ToanQuoc',
    category: 'heritage',
    iconName: 'Footprints',
    estimatedPrice: 45000,
    description: 'Guốc gỗ xoan mộc mạc đẽo thủ công, quai nhung đỏ thanh tao',
    searchKeyword: 'guốc mộc truyền thống quai nhung việt phục'
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
    name: 'Tai Nghe Retro Màu Kem',
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

export type BottomId =
  | 'bottom-silk-white'
  | 'bottom-silk-black'
  | 'bottom-linen-skirt'
  | 'bottom-jeans-denim'
  | 'bottom-tailored-trousers'
  | 'bottom-pleated-midi'
  | 'bottom-flared-y2k';

export interface BottomItem {
  id: BottomId;
  name: string;
  shortTag: string;
  category: 'heritage' | 'genz';
  tag: 'Cổ truyền' | 'Gen Z Remix';
  colorHex: string;
  estimatedPrice: number;
  description: string;
  searchKeyword: string;
}

export const BOTTOMS_DATABASE: BottomItem[] = [
  {
    id: 'bottom-silk-white',
    name: 'Quần Lụa Trắng Ngà Ống Rộng',
    shortTag: 'Chuẩn Quy Thức',
    category: 'heritage',
    tag: 'Cổ truyền',
    colorHex: '#FBF9F4',
    estimatedPrice: 70000,
    description: 'Lụa tơ tằm buông rủ thướt tha, sắc trắng ngà tôn dáng chuẩn mực trang phục truyền thống.',
    searchKeyword: 'quần lụa trắng ống rộng việt phục'
  },
  {
    id: 'bottom-silk-black',
    name: 'Quần Lụa Đen Tuyền / Lãnh Mỹ A',
    shortTag: 'Đen Tuyền Quý Phái',
    category: 'heritage',
    tag: 'Cổ truyền',
    colorHex: '#1E293B',
    estimatedPrice: 85000,
    description: 'Lụa đen tuyền dệt thủ công óng ả, đặc trưng quý phái Cố Đô Huế và Nam Bộ hào sảng.',
    searchKeyword: 'quần lụa đen lãnh mỹ a ống suông'
  },
  {
    id: 'bottom-linen-skirt',
    name: 'Váy Đũi Mộc Dáng Suông',
    shortTag: 'Mộc Mạc Dân Dã',
    category: 'heritage',
    tag: 'Cổ truyền',
    colorHex: '#E5DDCF',
    estimatedPrice: 65000,
    description: 'Chất vải đũi tự nhiên thô mộc, phom váy suông dài buông rủ kín đáo và khoan thai.',
    searchKeyword: 'váy đũi suông mộc dài cổ truyền'
  },
  {
    id: 'bottom-jeans-denim',
    name: 'Quần Jeans Ống Suông Xanh Denim',
    shortTag: 'Wide-leg Denim',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#2563EB',
    estimatedPrice: 150000,
    description: 'Denim xanh phóng khoáng có đường chỉ vàng nổi bật, tạo cú hích streetwear cá tính.',
    searchKeyword: 'quần jean ống suông wide leg xanh denim'
  },
  {
    id: 'bottom-tailored-trousers',
    name: 'Quần Tây Xếp Ly Be / Đen',
    shortTag: 'Tailored Trousers',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#78716C',
    estimatedPrice: 130000,
    description: 'Quần âu xếp ly đứng phom sắc sảo, mang tinh thần Quiet Luxury thanh lịch hiện đại.',
    searchKeyword: 'quần tây ống suông xếp ly vintage unisex'
  },
  {
    id: 'bottom-pleated-midi',
    name: 'Chân Váy Xếp Ly Midi Vintage',
    shortTag: 'Pleated Midi Skirt',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#E2E8F0',
    estimatedPrice: 110000,
    description: 'Dập ly nhỏ bồng bềnh dài qua gối, tôn nét nữ tính ngọt ngào lãng mạn.',
    searchKeyword: 'chân váy xếp ly midi vintage hàn quốc'
  },
  {
    id: 'bottom-flared-y2k',
    name: 'Quần Ống Loe Y2K',
    shortTag: 'Flared Pants',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#0F172A',
    estimatedPrice: 140000,
    description: 'Ôm nhẹ đùi và mở rộng từ gối xuống gấu, hack chiều cao ấn tượng chuẩn tinh thần Y2K.',
    searchKeyword: 'quần ống loe cạp cao y2k'
  }
];

export type FootwearId =
  | 'shoes-guoc-moc'
  | 'shoes-hai-theu'
  | 'shoes-guoc-son-mai'
  | 'shoes-sneaker-chunky'
  | 'shoes-sneaker-samba'
  | 'shoes-boots-chelsea'
  | 'shoes-loafer-mary-jane'
  | 'shoes-sandal-minimal';

export interface FootwearItem {
  id: FootwearId;
  name: string;
  shortTag: string;
  category: 'heritage' | 'genz';
  tag: 'Cổ truyền' | 'Gen Z Remix';
  colorHex: string;
  estimatedPrice: number;
  description: string;
  searchKeyword: string;
}

export const FOOTWEAR_DATABASE: FootwearItem[] = [
  {
    id: 'shoes-guoc-moc',
    name: 'Guốc Mộc Quai Nhung Đỏ / Đen',
    shortTag: 'Gỗ Xoan Mộc',
    category: 'heritage',
    tag: 'Cổ truyền',
    colorHex: '#78350F',
    estimatedPrice: 45000,
    description: 'Guốc gỗ xoan đẽo thủ công, quai nhung đỏ thanh tao tạo tiếng gõ giòn giã phố xưa.',
    searchKeyword: 'guốc mộc truyền thống quai nhung việt phục'
  },
  {
    id: 'shoes-hai-theu',
    name: 'Giày Hài Thêu Mũi Cong Cung Đình',
    shortTag: 'Hài Cung Đình',
    category: 'heritage',
    tag: 'Cổ truyền',
    colorHex: '#991B1B',
    estimatedPrice: 95000,
    description: 'Mũi hài uốn cong vút quý tộc, thêu hoa sen và mây ngũ sắc chỉ tơ vàng tinh xảo.',
    searchKeyword: 'giày hài thêu mũi cong cổ trang triều nguyễn'
  },
  {
    id: 'shoes-guoc-son-mai',
    name: 'Guốc Gỗ Sơn Mài Hoàng Gia',
    shortTag: 'Sơn Mài Thếp Vàng',
    category: 'heritage',
    tag: 'Cổ truyền',
    colorHex: '#831843',
    estimatedPrice: 85000,
    description: 'Gỗ phủ lớp sơn mài bóng bẩy thếp vàng son, đài các quyền quý chốn cung đình.',
    searchKeyword: 'guốc gỗ sơn mài truyền thống'
  },
  {
    id: 'shoes-sneaker-chunky',
    name: 'Sneaker Chunky Trắng Retro',
    shortTag: 'Chunky Dad Shoes',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#FFFFFF',
    estimatedPrice: 180000,
    description: 'Đế bánh mì tôn dáng, tạo cú twist hiện đại phá cách đầy năng lượng học đường.',
    searchKeyword: 'giày sneaker chunky trắng học sinh sinh viên'
  },
  {
    id: 'shoes-sneaker-samba',
    name: 'Sneaker Đế Bằng Vintage (Samba/Canvas)',
    shortTag: 'Retro Gum Sole',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#B45309',
    estimatedPrice: 160000,
    description: 'Đế cao su nâu gum vintage, phom dáng thon gọn cổ điển phong cách indie đường phố.',
    searchKeyword: 'giày sneaker đế bằng retro samba canvas'
  },
  {
    id: 'shoes-boots-chelsea',
    name: 'Chelsea Boots / Ankle Boots Da Đen',
    shortTag: 'Leather Boots',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#18181B',
    estimatedPrice: 210000,
    description: 'Chất da đen bóng cổ lửng, tạo độ sắc lạnh và cấu trúc high-fashion tương phản tuyệt mỹ.',
    searchKeyword: 'chelsea boots da đen nam nữ cổ thấp'
  },
  {
    id: 'shoes-loafer-mary-jane',
    name: 'Giày Loafer / Mary Jane Đế Bánh Mì',
    shortTag: 'Chunky Mary Jane',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#09090B',
    estimatedPrice: 175000,
    description: 'Quai cài nữ tính da bóng phối đế bánh mì, mang âm hưởng dark academia cổ điển.',
    searchKeyword: 'giày loafer mary jane đế bánh mì da bóng'
  },
  {
    id: 'shoes-sandal-minimal',
    name: 'Sandal Quai Thô Tối Giản',
    shortTag: 'Minimalist Slides',
    category: 'genz',
    tag: 'Gen Z Remix',
    colorHex: '#27272A',
    estimatedPrice: 90000,
    description: 'Quai bản to phong cách normcore phóng khoáng, dạo phố hè mát mẻ năng động.',
    searchKeyword: 'sandal quai ngang thô tối giản unisex'
  }
];

export const PRESET_STYLES: PresetStyle[] = [
  {
    id: 'preset-quan-ho',
    name: 'Nàng Thơ Quan Họ',
    tagline: 'Áo Tứ Thân x Nón Quai Thao Đũi Nam Cao',
    garmentId: 'ao-tu-than',
    colorHex: '#B91C1C',
    fabricId: 'dui-nam-cao',
    accessories: ['non-quai-thao', 'quat-phien-lua'],
    context: 'Lễ Hội Lim Quan Họ'
  },
  {
    id: 'preset-tieu-thu',
    name: 'Tiểu Thư Tràng Tiền',
    tagline: 'Áo Tấc Hồng Sen x Lụa Vạn Phúc Song Hạc',
    garmentId: 'ao-tac',
    colorHex: '#FF7597',
    fabricId: 'lua-van-phuc',
    accessories: ['quat-phien-lua', 'vong-ngoc-boi'],
    context: 'Dạo Phố Cổ Hà Nội Chiều Thu'
  },
  {
    id: 'preset-ba-kien',
    name: 'Công Tử Phố Cổ',
    tagline: 'Ngũ Thân Xanh Chàm x Gấm Cung Đình x Sneaker',
    garmentId: 'ngu-than-tay-chen',
    colorHex: '#1E3A8A',
    fabricId: 'gam-cung-dinh',
    accessories: ['sneaker-chunky-trang', 'kinh-ram-y2k'],
    context: 'Chụp Ảnh Kỷ Yếu & Photobooth Học Đường'
  },
  {
    id: 'preset-co-ba',
    name: 'Cô Ba Tân Châu',
    tagline: 'Áo Bà Ba x Lãnh Mỹ A Đen Bóng Mặc Nưa',
    garmentId: 'ao-ba-ba',
    colorHex: '#1E3A8A',
    fabricId: 'lanh-my-a',
    accessories: ['khan-ran-nam-bo'],
    context: 'Dạo Phố Cổ Hà Nội Chiều Thu'
  },
  {
    id: 'preset-hoang-cung',
    name: 'Hoàng Gia Cố Đô',
    tagline: 'Nhật Bình Tím Huế x Gấm Kim Tuyến Quyền Quý',
    garmentId: 'nhat-binh',
    colorHex: '#7E22CE',
    fabricId: 'gam-cung-dinh',
    accessories: ['vong-ngoc-boi', 'khan-dong-truyen-thong'],
    context: 'Tết Cố Đô Huế & Cung Đình'
  }
];

// Cultural Guardrail Rule Checker
export interface CulturalGuardrailReport {
  score: number;
  status: 'APPROVED' | 'WARNING' | 'ALERT';
  sealTitle: string;
  warnings: Array<{
    id: string;
    level: 'warning' | 'alert';
    title: string;
    reason: string;
    fixSuggestion: string;
    autoFixAction?: {
      removeAccessory?: string;
      addAccessory?: string;
      changeContext?: string;
      resetAlteration?: boolean;
    };
  }>;
  compliments: string[];
}

export function evaluateCulturalHarmonization(
  garment: GarmentItem,
  selectedAccessories: string[],
  context: string,
  isAltered: boolean,
  alterationType: string,
  bottomId?: BottomId,
  footwearId?: FootwearId
): CulturalGuardrailReport {
  let score = 96;
  const warnings: CulturalGuardrailReport['warnings'] = [];
  const compliments: string[] = [];

  // Check 1: Cross-regional conflict: Nón quai thao (Bắc Bộ) + Áo bà ba (Nam Bộ)
  if (garment.id === 'ao-ba-ba' && selectedAccessories.includes('non-quai-thao')) {
    score -= 28;
    warnings.push({
      id: 'cross-region-baba-quaithao',
      level: 'warning',
      title: 'Lệch Chuẩn Vùng Miền: Nón Quai Thao x Áo Bà Ba',
      reason: 'Nón quai thao là linh hồn quan họ Kinh Bắc, trong khi Áo bà ba mang đậm phong vị miệt vườn Nam Bộ. Người xưa không phối chéo hai biểu trưng văn hóa này.',
      fixSuggestion: 'Thay nón quai thao bằng Khăn rằn Nam Bộ hoặc Nón lá để đậm chất phương Nam.',
      autoFixAction: {
        removeAccessory: 'non-quai-thao',
        addAccessory: 'khan-ran-nam-bo'
      }
    });
  }

  // Check 2: Áo Nhật Bình hoàng gia mang đi bar/nightclub
  if (garment.id === 'nhat-binh' && context.toLowerCase().includes('bar')) {
    score -= 32;
    warnings.push({
      id: 'nhat-binh-bar',
      level: 'warning',
      title: 'Hoàn Cảnh Chưa Phù Hợp: Lễ Phục Nhật Bình Đi Bar',
      reason: 'Áo Nhật Bình là đại lễ phục cung đình trang trọng bậc nhất của hoàng thất triều Nguyễn, không tương thích với không gian tiệc đêm ồn ào.',
      fixSuggestion: 'Chuyển bối cảnh sang "Tết Cố Đô" hoặc chọn Áo Ngũ Thân tay chẽn năng động hơn.',
      autoFixAction: {
        changeContext: 'Tết Cố Đô Huế & Cung Đình'
      }
    });
  }

  // Check 3: Alteration: Cắt xẻ tà ngắn hở eo
  if (isAltered || alterationType === 'cropped_short') {
    score -= 38;
    warnings.push({
      id: 'altered-short-hem',
      level: 'alert',
      title: 'Biến Tướng Tà Áo: Cắt Xẻ Tà Hở Eo',
      reason: 'Cổ phục Việt đề cao vẻ kín đáo, thanh lịch với tà áo buông quá gối. Việc cắt xẻ ngắn hở eo làm phá vỡ tỉ lệ và cấu trúc lịch sử của trang phục.',
      fixSuggestion: 'Khôi phục độ dài tà áo nguyên bản để giữ trọn vẹn nét trang nhã.',
      autoFixAction: {
        resetAlteration: true
      }
    });
  }

  // Check 4: Alteration: Cài ngược vạt khuy
  if (alterationType === 'reverse_lapel') {
    score -= 45;
    warnings.push({
      id: 'reverse-lapel',
      level: 'alert',
      title: 'Vi Phạm Nghi Lễ: Cài Ngược Vạt Áo',
      reason: 'Người Việt cổ luôn cài khuy áo sang bên phải (hữu nhậm). Cài ngược sang trái (tả nhậm) là điều kiêng kỵ trong phong tục truyền thống.',
      fixSuggestion: 'Cài lại vạt áo sang bên phải theo đúng quy thức nghi lễ.',
      autoFixAction: {
        resetAlteration: true
      }
    });
  }

  // Check 5: Compliments if harmonic
  if (garment.id === 'ao-tu-than' && selectedAccessories.includes('non-quai-thao')) {
    compliments.push('Bản phối tuyệt mỹ: Áo Tứ Thân kết hợp Nón Quai Thao tái hiện trọn vẹn nét duyên liền chị Kinh Bắc.');
  }
  if (garment.id === 'ao-ba-ba' && selectedAccessories.includes('khan-ran-nam-bo')) {
    compliments.push('Chuẩn phong vị Nam Bộ: Áo Bà Ba kết hợp Khăn Rằn tạo vẻ hào sảng, phóng khoáng đậm chất sông nước.');
  }
  if (garment.id === 'ngu-than-tay-chen' && (selectedAccessories.includes('sneaker-chunky-trang') || footwearId === 'shoes-sneaker-chunky')) {
    compliments.push('Sáng tạo Y2K chuẩn mực: Ngũ thân tay chẽn đi cùng sneaker trắng giữ nguyên phom dáng nhưng bừng sáng năng lượng Gen Z.');
  }
  if (bottomId === 'bottom-silk-white' && (garment.id === 'ao-tac' || garment.id === 'nhat-binh')) {
    compliments.push('Chuẩn mực cung đình: Quần lụa trắng ngà buông rủ kết hợp phom áo hoàng gia đạt chuẩn quy thức triều Nguyễn.');
  }
  if (bottomId === 'bottom-jeans-denim') {
    compliments.push('Remix Streetwear phá cách: Quần Jeans xanh denim ống suông tạo nét đối lập phóng khoáng cho tà áo truyền thống.');
  }
  if (footwearId === 'shoes-hai-theu' && garment.id === 'nhat-binh') {
    compliments.push('Quy thức cung đình mẫu mực: Áo Nhật Bình kết hợp giày hài thêu mũi cong cung đình tái hiện trọn vẹn thần thái đài các hoàng thất.');
  }
  if (footwearId === 'shoes-guoc-moc') {
    compliments.push('Âm vang phố cổ: Guốc mộc mạc giòn giã điểm xuyết nét thanh tao, duyên dáng.');
  }

  score = Math.max(25, Math.min(100, score));

  let status: 'APPROVED' | 'WARNING' | 'ALERT' = 'APPROVED';
  let sealTitle = 'BẢO CHỨNG DI SẢN';

  if (warnings.some((w) => w.level === 'alert')) {
    status = 'ALERT';
    sealTitle = 'CẦN ĐIỀU CHỈNH';
  } else if (warnings.length > 0) {
    status = 'WARNING';
    sealTitle = 'LƯU Ý DI SẢN';
  } else if (score >= 95) {
    sealTitle = 'HOÀN MỸ DI SẢN';
  }

  return {
    score,
    status,
    sealTitle,
    warnings,
    compliments
  };
}

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
