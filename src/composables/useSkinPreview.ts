import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Ref } from 'vue';

interface UseSkinPreviewOptions {
  skinData: string[][];
  width: number;
  height: number;
}

export function useSkinPreview({ skinData, width, height }: UseSkinPreviewOptions) {
  const canvas = ref<HTMLCanvasElement | null>(null);

  const updateCanvas = () => {
    if (!canvas.value) return;
    
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    skinData.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      });
    });
  };

  onMounted(updateCanvas);
  watch(() => [skinData, width, height], updateCanvas);

  return {
    canvas
  };
}