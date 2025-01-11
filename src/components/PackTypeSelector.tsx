import React from 'react';
import { User, Box, Sparkles } from 'lucide-react';

export type PackType = 'normal' | 'custom';

interface PackTypeSelectorProps {
  onSelect: (type: PackType) => void;
}

const PackTypeSelector: React.FC<PackTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <button
        onClick={() => onSelect('normal')}
        className="group relative overflow-hidden gradient-border p-8 transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 rounded-full bg-gray-700/50 mb-6 group-hover:bg-gray-700/70 transition-colors">
            <User className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500 mb-4">
            普通皮肤包
          </h3>
          <p className="text-gray-400 text-center leading-relaxed">
            创建标准的 Minecraft 皮肤包
            <br />
            支持经典版和纤细版角色模型
          </p>
        </div>
      </button>

      <button
        onClick={() => onSelect('custom')}
        className="group relative overflow-hidden gradient-border p-8 transition-all duration-300 hover:scale-[1.02]"
      >
        <Sparkles className="absolute top-4 right-4 w-6 h-6 text-emerald-400/30" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 rounded-full bg-gray-700/50 mb-6 group-hover:bg-gray-700/70 transition-colors">
            <Box className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-500 mb-4">
            4D/5D 皮肤包（开发中)
          </h3>
          <p className="text-gray-400 text-center leading-relaxed">
            创建带有自定义模型的高级皮肤包
            <br />
            支持4D/5D模型特效
          </p>
        </div>
      </button>
    </div>
  );
};

export default PackTypeSelector;