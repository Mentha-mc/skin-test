export interface SkinMetadata {
  modelType: 'classic' | 'slim';
  name: string;
  description: string;
}

export interface Skin {
  id: string;
  pixels: string[][];
  width: number;
  height: number;
  modelType: 'classic' | 'slim';
  name: string;
  customModel?: CustomModel; // 添加自定义模型字段
}

export interface SkinPack {
  name: string;
  description: string;
  skins: Skin[];
}