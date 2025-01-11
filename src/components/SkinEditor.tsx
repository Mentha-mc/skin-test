import React, { useState } from 'react';
import { Download, Box, ArrowLeft, AlertCircle } from 'lucide-react';
import SkinUploader from './SkinUploader';
import ModelUploader from './ModelUploader';
import SkinPreview from './SkinPreview';
import SkinList from './SkinList';
import ModelSelector from './ModelSelector';
import PackTypeSelector, { PackType } from './PackTypeSelector';
import { generateSkinPack } from '../utils/skinPackGenerator';
import { Skin, SkinPack } from '../types/skin';
import { CustomModel } from '../types/model';

const SkinEditor: React.FC = () => {
  const [packType, setPackType] = useState<PackType | null>(null);
  const [skins, setSkins] = useState<Skin[]>([]);
  const [selectedSkinId, setSelectedSkinId] = useState<string | null>(null);
  const [packName, setPackName] = useState('我的皮肤包');
  const [packDescription, setPackDescription] = useState('自定义 Minecraft 皮肤包');
  const [error, setError] = useState<string | null>(null);
  const [customModel, setCustomModel] = useState<CustomModel | null>(null);

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
      name: `皮肤 ${skins.length + 1}`,
      customModel: packType === 'custom' ? customModel : undefined
    };
    setSkins(prev => [...prev, newSkin]);
    setSelectedSkinId(newSkin.id);
    setError(null);
  };

  const handleModelUpload = (model: CustomModel) => {
    setCustomModel(model);
    // 更新所有现有皮肤的模型
    setSkins(prev => prev.map(skin => ({
      ...skin,
      customModel: model
    })));
    setError(null);
  };

  const handleSkinDelete = (id: string) => {
    setSkins(prev => prev.filter(skin => skin.id !== id));
    if (selectedSkinId === id) {
      setSelectedSkinId(null);
    }
  };

  const handleSkinRename = (id: string, newName: string) => {
    setSkins(prev => prev.map(skin => 
      skin.id === id ? { ...skin, name: newName } : skin
    ));
  };

  const handleModelTypeChange = (modelType: 'classic' | 'slim') => {
    if (selectedSkinId) {
      setSkins(prev => prev.map(skin => 
        skin.id === selectedSkinId ? { ...skin, modelType } : skin
      ));
    }
  };

  const handleReset = () => {
    if (skins.length > 0) {
      if (!confirm('确定要返回选择界面吗？当前的所有更改都将丢失。')) {
        return;
      }
    }
    setPackType(null);
    setSkins([]);
    setSelectedSkinId(null);
    setPackName('我的皮肤包');
    setPackDescription('自定义 Minecraft 皮肤包');
    setError(null);
    setCustomModel(null);
  };

  const selectedSkin = selectedSkinId ? skins.find(skin => skin.id === selectedSkinId) : null;

  const handleDownload = async () => {
    if (skins.length === 0) {
      setError('请至少添加一个皮肤到皮肤包中');
      return;
    }

    if (!packName.trim()) {
      setError('请输入皮肤包名称');
      return;
    }

    if (packType === 'custom' && !customModel) {
      setError('请上传4D/5D模型文件');
      return;
    }

    const skinPack: SkinPack = {
      name: packName,
      description: packDescription,
      skins
    };

    try {
      const zipBlob = await generateSkinPack(skinPack);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${packName.toLowerCase().replace(/\s+/g, '_')}.mcpack`;
      link.click();
      URL.revokeObjectURL(url);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '生成皮肤包失败';
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  if (!packType) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">选择皮肤包类型</h2>
        <PackTypeSelector onSelect={setPackType} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>返回选择界面</span>
        </button>
        <div className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center gap-2">
          <Box className="w-4 h-4" />
          <span>{packType === 'normal' ? '普通皮肤包' : '4D/5D 皮肤包'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <SkinUploader onSkinUpload={handleSkinUpload} onError={setError} />
          
          {packType === 'custom' && (
            <ModelUploader 
              onModelUpload={handleModelUpload} 
              onError={setError}
              hasModel={!!customModel}
            />
          )}
          
          <div className="glass-card rounded-xl p-6 shadow-lg hover-card">
            <div className="flex items-center gap-2 mb-4">
              <Box className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold">皮肤包详情</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  皮肤包名称
                </label>
                <input
                  type="text"
                  value={packName}
                  onChange={(e) => setPackName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="输入皮肤包名称"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  描述
                </label>
                <textarea
                  value={packDescription}
                  onChange={(e) => setPackDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="描述这个皮肤包..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6 shadow-lg hover-card">
            <h3 className="text-lg font-semibold mb-4">皮肤列表</h3>
            <SkinList
              skins={skins}
              onDelete={handleSkinDelete}
              onSelect={setSelectedSkinId}
              selectedId={selectedSkinId}
              onRename={handleSkinRename}
            />
          </div>
        </div>

        <div className="space-y-6">
          {selectedSkin && (
            <>
              <div className="glass-card rounded-xl p-6 shadow-lg hover-card">
                <h3 className="text-lg font-semibold mb-4">模型类型</h3>
                <ModelSelector
                  modelType={selectedSkin.modelType}
                  onChange={handleModelTypeChange}
                />
              </div>

              <SkinPreview
                skinData={selectedSkin.pixels}
                width={selectedSkin.width}
                height={selectedSkin.height}
                customModel={selectedSkin.customModel}
              />
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        onClick={handleDownload}
        className="w-full p-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={skins.length === 0 || (packType === 'custom' && !customModel)}
      >
        <Download className="w-5 h-5" />
        生成皮肤包 ({skins.length} 个皮肤)
      </button>
    </div>
  );
};

export default SkinEditor;