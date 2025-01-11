import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Skin, SkinPack } from '../types/skin';
import type { CustomModel } from '../types/model';

export const useSkinStore = defineStore('skin', () => {
  const skins = ref<Skin[]>([]);
  const selectedSkinId = ref<string | null>(null);
  const packName = ref('我的皮肤包');
  const packDescription = ref('自定义 Minecraft 皮肤包');
  const customModel = ref<CustomModel | null>(null);
  const selectedType = ref<'normal' | 'custom' | null>(null);

  const selectedSkin = computed(() => 
    selectedSkinId.value ? skins.value.find(skin => skin.id === selectedSkinId.value) : null
  );

  const addSkin = (
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
  };

  const deleteSkin = (id: string) => {
    skins.value = skins.value.filter(skin => skin.id !== id);
    if (selectedSkinId.value === id) {
      selectedSkinId.value = null;
    }
  };

  const renameSkin = (id: string, newName: string) => {
    const skin = skins.value.find(s => s.id === id);
    if (skin) {
      skin.name = newName;
    }
  };

  const setModelType = (id: string, modelType: 'classic' | 'slim') => {
    skins.value = skins.value.map(skin => 
      skin.id === id ? { ...skin, modelType } : skin
    );
  };

  const setCustomModel = (model: CustomModel) => {
    customModel.value = model;
    skins.value = skins.value.map(skin => ({
      ...skin,
      customModel: model
    }));
  };

  const reset = () => {
    skins.value = [];
    selectedSkinId.value = null;
    packName.value = '我的皮肤包';
    packDescription.value = '自定义 Minecraft 皮肤包';
    customModel.value = null;
    selectedType.value = null;
  };

  const getSkinPack = (): SkinPack => ({
    name: packName.value,
    description: packDescription.value,
    skins: skins.value
  });

  return {
    skins,
    selectedSkinId,
    packName,
    packDescription,
    customModel,
    selectedType,
    selectedSkin,
    addSkin,
    deleteSkin,
    renameSkin,
    setModelType,
    setCustomModel,
    reset,
    getSkinPack
  };
});