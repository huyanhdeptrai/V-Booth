import { FittingConfig } from '../components/FittingRoom';
import { BOTTOMS_DATABASE, FOOTWEAR_DATABASE, ACCESSORIES_DATABASE, HERITAGE_COLORS } from '../data/garments';

export type ShotType = 'half-body' | 'full-body';

export interface BuildPromptParams {
  garmentName: string;
  dynasty?: string;
  fabricName: string;
  fabricColorHex: string;
  selectedBottomId: string;
  selectedFootwearId: string;
  selectedAccessories: string[];
  shotType: ShotType;
}

/**
 * Helper to build prompt for OpenAI Image Edits (/v1/images/edits) standard
 */
export function buildOutfitPrompt(params: BuildPromptParams): string {
  const {
    garmentName,
    fabricName,
    fabricColorHex,
    selectedBottomId,
    selectedFootwearId,
    selectedAccessories,
    shotType
  } = params;

  const colorObj = HERITAGE_COLORS.find((c) => c.hex.toLowerCase() === fabricColorHex.toLowerCase());
  const colorName = colorObj ? colorObj.name : 'lụa truyền thống';

  const bottomObj = BOTTOMS_DATABASE.find((b) => b.id === selectedBottomId);
  const bottomDesc = bottomObj ? bottomObj.name : 'quần lụa trắng ống rộng';

  const footwearObj = FOOTWEAR_DATABASE.find((f) => f.id === selectedFootwearId);
  const footwearDesc = footwearObj ? footwearObj.name : 'guốc mộc truyền thống';

  const accItems = selectedAccessories.map((id) => {
    const acc = ACCESSORIES_DATABASE.find((a) => a.id === id);
    return acc ? acc.name : id;
  });

  const upperAccs = accItems.filter((name) =>
    name.includes('Khăn') || name.includes('Mấn') || name.includes('Nón') || name.includes('Vòng') || name.includes('Chuỗi')
  );

  if (shotType === 'half-body') {
    const accessoriesText = upperAccs.length > 0 ? upperAccs.join(', ') : 'minimalist traditional accessories';
    return `A realistic candid photo of the person in the input photo, wearing the upper part of ${garmentName} with ${colorName} (${fabricName}) silk fabric, accessorized with ${accessoriesText}. Seamlessly blend the traditional collar, neckline, and sleeves into the user's upper body pose, preserving original framing, pose, and background. No full-body distortion, 8k resolution, photorealistic.`;
  }

  const allAccsText = accItems.length > 0 ? accItems.join(', ') : 'authentic minimalist accents';
  return `A realistic full-body candid photo of the person in the input photo, wearing ${garmentName} in ${colorName} (${fabricName}) silk, paired with ${bottomDesc} and ${footwearDesc}, accessorized with ${allAccsText}. Maintain natural drape, folds, and footwear visibility in a photobooth studio environment, 8k resolution, photorealistic.`;
}

/**
 * Convert base64 data URL to Blob
 */
export function dataURLtoBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Convert Blob to Data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * 2. GỬI ẢNH GỐC CHO AI XỬ LÝ (API /v1/images/edits chuẩn ChatGPT2API / OpenAI)
 * TUYỆT ĐỐI KHÔNG cắt dán đầu lên khối áo SVG 2D.
 * Chỉ nhận ảnh hoàn chỉnh từ AI hoặc giữ nguyên ảnh raw của người dùng.
 */
export async function generateVBoothTryOn(
  capturedImage: Blob | string,
  outfitPrompt: string,
  shotType: ShotType,
  _outfitConfig?: FittingConfig
): Promise<{ imageUrl: string; mode: 'ai-gen' | 'raw-capture' }> {
  let imageBlob: Blob;
  let rawBase64 = '';

  if (typeof capturedImage === 'string') {
    rawBase64 = capturedImage;
    imageBlob = dataURLtoBlob(capturedImage);
  } else {
    imageBlob = capturedImage;
    rawBase64 = await blobToDataUrl(capturedImage);
  }

  // Chuẩn bị FormData theo chuẩn OpenAI Image Edits API
  const formData = new FormData();
  formData.append('image', imageBlob, 'user_selfie.jpg');
  formData.append('model', 'gpt-image-2');
  formData.append('prompt', outfitPrompt);
  formData.append('size', shotType === 'half-body' ? '1:1' : '9:16');
  formData.append('response_format', 'b64_json');

  // Thử gọi các endpoint AI Image Edits:
  // 1. /v1/images/edits
  // 2. /api/try-on (proxy backend)
  const endpoints = ['/v1/images/edits', '/api/try-on'];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        // Định dạng OpenAI chuẩn { data: [{ b64_json: '...' }] } hoặc url
        if (data.data && Array.isArray(data.data) && data.data[0]) {
          const item = data.data[0];
          if (item.b64_json) {
            return {
              imageUrl: `data:image/png;base64,${item.b64_json}`,
              mode: 'ai-gen'
            };
          }
          if (item.url) {
            return {
              imageUrl: item.url,
              mode: 'ai-gen'
            };
          }
        }
        if (data.imageUrl && !data.fallback) {
          return {
            imageUrl: data.imageUrl,
            mode: 'ai-gen'
          };
        }
      }
    } catch (err) {
      console.warn(`Attempt calling ${endpoint} error:`, err);
    }
  }

  // Khi chưa kết nối được backend AI hoặc AI đang offline:
  // Giữ nguyên 100% ẢNH GỐC THUẦN TÚY của người dùng, TUYỆT ĐỐI KHÔNG GHÉP LÊN VECTOR 2D
  return {
    imageUrl: rawBase64,
    mode: 'raw-capture'
  };
}
