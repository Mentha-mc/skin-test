import React, { useState } from 'react';
import { Upload, User } from 'lucide-react';
import { validateSkinDimensions } from '../utils/skinDimensions';
import { processImageData } from '../utils/imageProcessor';

interface SkinUploaderProps {
  onSkinUpload: (imageData: string[][], width: number, height: number, modelType: 'classic' | 'slim') => void;
  onError: (message: string) => void;
}

const SkinUploader: React.FC<SkinUploaderProps> = ({ onSkinUpload, onError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageData = await processImageData(file, validateSkinDimensions);
      if (imageData) {
        onSkinUpload(imageData.pixels, imageData.width, imageData.height, 'classic');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : '处理皮肤文件失败');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.png')) {
      onError('请上传 PNG 格式的皮肤文件');
      return;
    }

    try {
      const imageData = await processImageData(file, validateSkinDimensions);
      if (imageData) {
        onSkinUpload(imageData.pixels, imageData.width, imageData.height, 'classic');
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : '处理皮肤文件失败');
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 shadow-lg hover-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <User className="w-5 h-5 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
          上传皮肤
        </h3>
      </div>

      <label
        className={`
          relative flex flex-col items-center justify-center w-full h-40 px-4
          transition-all duration-300 bg-gray-900/50 backdrop-blur-sm
          border-2 border-dashed rounded-xl appearance-none cursor-pointer
          group overflow-hidden
          ${isDragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-gray-700 hover:border-emerald-500/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 背景动画效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex flex-col items-center space-y-3">
          <div className="p-3 rounded-full bg-gray-800/80 group-hover:bg-gray-700/70 transition-colors">
            <Upload className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="text-center">
            <span className="font-medium text-gray-200 group-hover:text-emerald-400 transition-colors">
              将 Minecraft 皮肤拖放到此处或点击上传
            </span>
            <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
              支持 64x32、64x64 和 128x128 的皮肤
            </p>
          </div>
        </div>
        <input
          type="file"
          accept=".png"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

export default SkinUploader;