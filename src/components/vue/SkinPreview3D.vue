<template>
  <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-200">3D 预览</h3>
      <div class="flex gap-2">
        <button 
          @click="toggleRotation"
          class="p-2 rounded-lg transition-colors"
          :class="isRotating ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400 hover:text-gray-200'"
        >
          <RotateCw class="w-5 h-5" />
        </button>
        <button 
          @click="toggleWalk"
          class="p-2 rounded-lg transition-colors"
          :class="isWalking ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400 hover:text-gray-200'"
        >
          <Walking class="w-5 h-5" />
        </button>
        <button 
          @click="toggleRun"
          class="p-2 rounded-lg transition-colors"
          :class="isRunning ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400 hover:text-gray-200'"
        >
          <Running class="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <canvas 
      ref="canvas"
      class="w-full aspect-[3/4] bg-gray-900 rounded-lg border border-gray-700"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { SkinViewer, createOrbitControls, WalkingAnimation, RunningAnimation } from 'skinview3d';
import { RotateCw, Walking, Running } from 'lucide-vue-next';
import { useElementSize } from '@vueuse/core';

const props = defineProps<{
  skinData?: string[][];
  width?: number;
  height?: number;
  modelType?: 'classic' | 'slim';
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
const { width: containerWidth } = useElementSize(canvas);

const viewer = ref<SkinViewer | null>(null);
const isRotating = ref(false);
const isWalking = ref(false);
const isRunning = ref(false);

let walkAnimation: WalkingAnimation | null = null;
let runAnimation: RunningAnimation | null = null;

onMounted(() => {
  if (!canvas.value) return;

  const width = Math.min(containerWidth.value, 400);
  viewer.value = new SkinViewer({
    canvas: canvas.value,
    width,
    height: width * 1.33,
    model: props.modelType === 'slim' ? 'slim' : 'default'
  });

  createOrbitControls(viewer.value);
  updateSkin();
});

onUnmounted(() => {
  viewer.value?.dispose();
});

watch(() => [props.skinData, props.width, props.height, props.modelType], updateSkin);
watch(containerWidth, (newWidth) => {
  if (!viewer.value || !newWidth) return;
  const width = Math.min(newWidth, 400);
  viewer.value.setSize(width, width * 1.33);
});

function updateSkin() {
  if (!viewer.value || !props.skinData || !props.width || !props.height) return;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = props.width;
  tempCanvas.height = props.height;
  const ctx = tempCanvas.getContext('2d');
  
  if (!ctx) return;

  props.skinData.forEach((row, y) => {
    row.forEach((color, x) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  });

  viewer.value.loadSkin(tempCanvas.toDataURL(), {
    model: props.modelType === 'slim' ? 'slim' : 'default'
  });
}

function toggleRotation() {
  if (!viewer.value) return;
  isRotating.value = !isRotating.value;
  viewer.value.autoRotate = isRotating.value;
}

function toggleWalk() {
  if (!viewer.value) return;
  isWalking.value = !isWalking.value;
  isRunning.value = false;

  if (runAnimation) {
    viewer.value.animator.remove(runAnimation);
    runAnimation = null;
  }

  if (isWalking.value) {
    walkAnimation = viewer.value.animator.add(WalkingAnimation);
  } else if (walkAnimation) {
    viewer.value.animator.remove(walkAnimation);
    walkAnimation = null;
  }
}

function toggleRun() {
  if (!viewer.value) return;
  isRunning.value = !isRunning.value;
  isWalking.value = false;

  if (walkAnimation) {
    viewer.value.animator.remove(walkAnimation);
    walkAnimation = null;
  }

  if (isRunning.value) {
    runAnimation = viewer.value.animator.add(RunningAnimation);
  } else if (runAnimation) {
    viewer.value.animator.remove(runAnimation);
    runAnimation = null;
  }
}
</script>