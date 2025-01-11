import { CustomModel, ModelGeometry } from '../types/model';

const validateGeometry = (geometry: any): boolean => {
  if (!geometry.texturewidth || !geometry.textureheight || !Array.isArray(geometry.bones)) {
    return false;
  }

  return geometry.bones.every((bone: any) => 
    bone.name && 
    Array.isArray(bone.pivot) && 
    bone.pivot.length === 3 &&
    (!bone.cubes || Array.isArray(bone.cubes))
  );
};

export const validateModel = (json: any): CustomModel | null => {
  try {
    // Check if at least one geometry definition exists
    const geometryKeys = Object.keys(json).filter(key => key.startsWith('geometry.'));
    if (geometryKeys.length === 0) {
      return null;
    }

    // Validate each geometry definition
    const isValid = geometryKeys.every(key => validateGeometry(json[key]));
    if (!isValid) {
      return null;
    }

    return json as CustomModel;
  } catch {
    return null;
  }
};

export const loadModelFromFile = (file: File): Promise<CustomModel> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const model = validateModel(json);
        
        if (!model) {
          reject(new Error('无效的模型文件格式。请确保是正确的 Minecraft 自定义模型 JSON 文件。'));
          return;
        }
        
        resolve(model);
      } catch {
        reject(new Error('无法解析模型文件。请确保是有效的 JSON 格式。'));
      }
    };
    
    reader.onerror = () => reject(new Error('读取文件失败'));
    reader.readAsText(file);
  });
};