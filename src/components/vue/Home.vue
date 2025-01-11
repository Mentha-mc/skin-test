<template>
  <main class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="!selectedType" class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold text-gray-200 mb-6">选择皮肤包类型</h2>
      <PackTypeSelector @select="handleTypeSelect" />
    </div>
    <div v-else class="space-y-8">
      <div class="flex items-center justify-between">
        <button
          @click="handleReset"
          class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-all"
        >
          <ArrowLeft class="w-5 h-5" />
          <span>返回选择界面</span>
        </button>
        <div class="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center gap-2">
          <Box class="w-4 h-4" />
          <span>{{ selectedType === 'normal' ? '普通皮肤包' : '4D/5D 皮肤包' }}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-6">
          <SkinUploader @skin-upload="handleSkinUpload" @error="setError" />
          
          <ModelUploader 
            v-if="selectedType === 'custom'"
            :has-model="!!customModel"
            @model-upload="handleModelUpload" 
            @error="setError"
          />
          
          <PackDetails 
            v-model:name="packName"
            v-model:description="packDescription"
          />

          <SkinList
            :skins="skins"
            :selected-id="selectedSkinId"
            @delete="handleSkinDelete"
            @select="setSelectedSkinId"
            @rename="handleSkinRename"
          />
        </div>

        <div class="space-y-6">
          <template v-if="selectedSkin">
            <ModelSelector
              :model-type="selectedSkin.modelType"
              @change="handleModelTypeChange"
            />

            <SkinPreview
              :skin-data="selectedSkin.pixels"
              :width="selectedSkin.width"
              :height="selectedSkin.height"
              :custom-model="selectedSkin.customModel"
            />
          </template>
        </div>
      </div>

      <div v-if="error" class="p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-3">
        <AlertCircle class="w-5 h-5 flex-shrink-0" />
        <p>{{ error }}</p>
      </div>

      <button
        @click="handleDownload"
        class="w-full p-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="skins.length === 0 || (selectedType === 'custom' && !customModel)"
      >
        <Download class="w-5 h-5" />
        生成皮肤包 ({{ skins.length }} 个皮肤)
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowLeft, Box, Download, AlertCircle } from 'lucide-vue-next';
import { generateSkinPack } from '../../utils/skinPackGenerator';
import type { Skin, SkinPack } from '../../types/skin';
import type { CustomModel } from '../../types/model';
import PackTypeSelector from './PackTypeSelector.vue';
import SkinUploader from './SkinUploader.vue';
import ModelUploader from './ModelUploader.vue';
import PackDetails from './PackDetails.vue';
import SkinList from './SkinList.vue';
import ModelSelector from './ModelSelector.vue';
import SkinPreview from './SkinPreview.vue';

const selectedType = ref<'normal' | 'custom' | null>(null);
const skins = ref<Skin[]>([]);
const selectedSkinId = ref<string | null>(null);
const packName = ref('我的皮肤包');
const packDescription = ref('自定义 Minecraft 皮肤包');
const error = ref<string | null>(null);
const customModel = ref<CustomModel | null>(null);

const selectedSkin = computed(() => 
  selectedSkinId.value ? skins.value.find(skin => skin.id === selectedSkinId.value) : null
);

const handleTypeSelect = (type: 'normal' | 'custom') => {
  selectedType.value = type;
};

const handleSkinUpload = (
  pixels: string[][],
  width: number,
  height: number,
  modelType: 'classic' | 'slim'
) => {
  const newSkin: Skin = {
    id: crypto.randomUUID(),
    pixels,
    width,
    height,
    modelType,
    name: `皮肤 ${skins.value.length + 1}`,
    customModel: selectedType.value === 'custom' ? customModel.value : undefined
  };
  skins.value.push(newSkin);
  selectedSkinId.value = newSkin.id;
  error.value = null;
};

const handleModelUpload = (model: CustomModel) => {
  customModel.value = model;
  skins.value = skins.value.map(skin => ({
    ...skin,
    customModel: model
  }));
  error.value = null;
};

const handleSkinDelete = (id: string) => {
  skins.value = skins.value.filter(skin => skin.id !== id);
  if (selectedSkinId.value === id) {
    selectedSkinId.value = null;
  }
};

const handleSkinRename = (id: string, newName: string) => {
  const skin = skins.value.find(s => s.id === id);
  if (skin) {
    skin.name = newName;
  }
};

const handleModelTypeChange = (modelType: 'classic' | 'slim') => {
  if (selectedSkinId.value) {
    skins.value = skins.value.map(skin => 
      skin.id === selectedSkinId.value ? { ...skin, modelType } : skin
    );
  }
};

const handleReset = () => {
  if (skins.value.length > 0) {
    if (!confirm('确定要返回选择界面吗？当前的所有更改都将丢失。')) {
      return;
    }
  }
  selectedType.value = null;
  skins.value = [];
  selectedSkinId.value = null;
  packName.value = '我的皮肤包';
  packDescription.value = '自定义 Minecraft 皮肤包';
  error.value = null;
  customModel.value = null;
};

const setError = (message: string) => {
  error.value = message;
};

const setSelectedSkinId = (id: string) => {
  selectedSkinId.value = id;
};

const handleDownload = async () => {
  if (skins.value.length === 0) {
    error.value = '请至少添加一个皮肤到皮肤包中';
    return;
  }

  if (!packName.value.trim()) {
    error.value = '请输入皮肤包名称';
    return;
  }

  if (selectedType.value === 'custom' && !customModel.value) {
    error.value = '请上传4D/5D模型文件';
    return;
  }

  const skinPack: SkinPack = {
    name: packName.value,
    description: packDescription.value,
    skins: skins.value
  };

  try {
    const zipBlob = await generateSkinPack(skinPack);
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${packName.value.toLowerCase().replace(/\s+/g, '_')}.mcpack`;
    link.click();
    URL.revokeObjectURL(url);
    error.value = null;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '生成皮肤包失败';
    error.value = errorMessage;
    console.error(errorMessage);
  }
};
</script>