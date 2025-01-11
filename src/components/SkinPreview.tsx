import React from 'react';
import { CustomModel } from '../types/model';
import { Box } from 'lucide-react';

interface SkinPreviewProps {
  skinData: string[][];
  width: number;
  height: number;
  customModel?: CustomModel;
}

const SkinPreview: React.FC<SkinPreviewProps> = ({ skinData, width, height, customModel }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    skinData.forEach((row, y) => {
      row.forEach((color, x) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      });
    });
  }, [skinData, width, height]);

  const modelInfo = customModel ? Object.entries(customModel)[0] : null;

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">皮肤预览</h3>
        {customModel && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-lg">
            <Box className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">4D模型</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-gray-400 space-y-1">
          <div>尺寸: {width}x{height}</div>
          {modelInfo && (
            <div>
              模型: {modelInfo[0]}
              <div className="mt-1 text-xs space-y-1">
                <div>• 贴图尺寸: {modelInfo[1].texturewidth}x{modelInfo[1].textureheight}</div>
                <div>• 骨骼数量: {modelInfo[1].bones.length}</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full border border-gray-700 rounded"
            style={{ 
              imageRendering: 'pixelated',
              background: 'repeating-casing-pattern(8px 8px, rgba(255,255,255,0.03), rgba(0,0,0,0.03) 100%)'
            }}
          />
        </div>

        {customModel && (
          <div className="text-sm text-gray-400">
            <p>注意：4D模型效果需要在游戏中查看</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinPreview;