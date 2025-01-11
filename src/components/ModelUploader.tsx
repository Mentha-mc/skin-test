import React, { useState } from 'react';
import { Upload, Check, FileJson, AlertTriangle, Box } from 'lucide-react';
import { loadModelFromFile } from '../utils/modelLoader';
import { CustomModel } from '../types/model';

interface ModelUploaderProps {
  onModelUpload: (model: CustomModel) => void;
  onError: (message: string) => void;
  hasModel: boolean;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({ onModelUpload, onError, hasModel }) => {
  const [uploadedModel, setUploadedModel] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const model = await loadModelFromFile(file);
      setUploadedModel(file.name);
      onModelUpload(model);
    } catch (error) {
      onError(error instanceof Error ? error.message : '处理模型文件失败');
      setUploadedModel(null);
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
    if (!file || !file.name.endsWith('.json')) {
      onError('请上传 JSON 格式的模型文件');
      return;
    }

    try {
      const model = await loadModelFromFile(file);
      setUploadedModel(file.name);
      onModelUpload(model);
    } catch (error) {
      onError(error instanceof Error ? error.message : '处理模型文件失败');
      setUploadedModel(null);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 shadow-lg hover-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Box className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
            4D/5D 模型上传
          </h3>
        </div>
        {!hasModel && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-lg text-yellow-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>需要上传模型</span>
          </div>
        )}
      </div>
      
      <label
        className={`
          relative flex flex-col items-center justify-center w-full h-40 px-4
          transition-all duration-300 bg-gray-900/50 backdrop-blur-sm
          border-2 border-dashed rounded-xl appearance-none cursor-pointer
          group overflow-hidden
          ${isDragging ? 'border-emerald-500 bg-emerald-500/5' : 
            hasModel ? 'border-emerald-500/30' : 
            'border-gray-700 hover:border-emerald-500/50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 背景动画效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex flex-col items-center space-y-3">
          {uploadedModel ? (
            <>
              <div className="p-3 rounded-full bg-emerald-500/20 animate-float">
                <Check className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center">
                <span className="font-medium text-emerald-400">
                  已上传: {uploadedModel}
                </span>
                <p className="text-sm text-emerald-400/70 mt-1">
                  点击或拖放新文件以替换
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-gray-800/80 group-hover:bg-gray-700/70 transition-colors">
                <FileJson className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="text-center">
                <span className="font-medium text-gray-200 group-hover:text-emerald-400 transition-colors">
                  拖放或点击上传模型文件
                </span>
                <p className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">
                  支持 Minecraft Bedrock Edition 自定义模型 JSON
                </p>
              </div>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
};

export default ModelUploader;