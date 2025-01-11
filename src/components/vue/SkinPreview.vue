<template>
  <div class="space-y-6">
    <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-200">皮肤预览</h3>
        <div v-if="customModel" class="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-lg">
          <Box class="w-4 h-4 text-emerald-400" />
          <span class="text-sm text-emerald-400">4D模型</span>
        </div>
      </div>

      <SkinPreview3D
        :skin-data="skinData"
        :width="width"
        :height="height"
        :model-type="modelType"
      />

      <div class="mt-4 space-y-2">
        <div class="text-sm text-gray-400 space-y-1">
          <div>尺寸: {{ width }}x{{ height }}</div>
          <template v-if="modelInfo">
            <div>
              模型: {{ modelInfo[0] }}
              <div class="mt-1 text-xs space-y-1">
                <div>• 贴图尺寸: {{ modelInfo[1].texturewidth }}x{{ modelInfo[1].textureheight }}</div>
                <div>• 骨骼数量: {{ modelInfo[1].bones.length }}</div>
              </div>
            </div>
          </template>
        </div>

        <div v-if="customModel" class="text-sm text-gray-400">
          <p>注意：4D模型效果需要在游戏中查看</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Box } from 'lucide-vue-next';
import type { CustomModel } from '../../types/model';
import SkinPreview3D from './SkinPreview3D.vue';

const props = defineProps<{
  skinData: string[][];
  width: number;
  height: number;
  customModel?: CustomModel;
  modelType?: 'classic' | 'slim';
}>();

const modelInfo = computed(() => 
  props.customModel ? Object.entries(props.customModel)[0] : null
);
</script>