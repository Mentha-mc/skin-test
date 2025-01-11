import React, { useState } from 'react';
import { Trash2, User, Box, Pencil, Check, X } from 'lucide-react';
import { Skin } from '../types/skin';

interface SkinListProps {
  skins: Skin[];
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
  selectedId: string | null;
  onRename?: (id: string, newName: string) => void;
}

interface EditableNameProps {
  initialName: string;
  isEditing: boolean;
  onSave: (newName: string) => void;
  onCancel: () => void;
  onStartEdit: () => void;
}

const EditableName: React.FC<EditableNameProps> = ({
  initialName,
  isEditing,
  onSave,
  onCancel,
  onStartEdit,
}) => {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onSave(trimmedName);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-900/50 border border-gray-700 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent outline-none"
          autoFocus
        />
        <button
          type="submit"
          className="p-1 hover:bg-emerald-500/20 rounded text-emerald-400 transition-colors"
        >
          <Check size={16} />
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-colors"
        >
          <X size={16} />
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium text-gray-200">{initialName}</span>
      <button
        onClick={onStartEdit}
        className="p-1 hover:bg-gray-700/50 rounded text-gray-400 hover:text-gray-200 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
};

const SkinList: React.FC<SkinListProps> = ({
  skins,
  onDelete,
  onSelect,
  selectedId,
  onRename,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (skins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <User className="w-12 h-12 mb-2 opacity-50" />
        <p>还没有添加皮肤。上传一些皮肤开始使用吧！</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {skins.map((skin) => (
        <div
          key={skin.id}
          className={`group flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
            selectedId === skin.id
              ? 'bg-emerald-500/20 border border-emerald-500/30'
              : 'bg-gray-900/50 border border-gray-700 hover:border-gray-600'
          }`}
          onClick={() => onSelect(skin.id)}
        >
          <div className="flex items-center space-x-3">
            <canvas
              width={32}
              height={32}
              className="border border-gray-700 rounded bg-gray-900"
              style={{ imageRendering: 'pixelated' }}
              ref={(canvas) => {
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    skin.pixels.forEach((row, y) => {
                      row.forEach((color, x) => {
                        ctx.fillStyle = color;
                        ctx.fillRect(x / 2, y / 2, 1, 1);
                      });
                    });
                  }
                }
              }}
            />
            <div>
              <EditableName
                initialName={skin.name}
                isEditing={editingId === skin.id}
                onSave={(newName) => {
                  onRename?.(skin.id, newName);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
                onStartEdit={(e) => {
                  e?.stopPropagation();
                  setEditingId(skin.id);
                }}
              />
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span>
                  {skin.width}x{skin.height}
                </span>
                <span>•</span>
                <span>{skin.modelType === 'classic' ? '经典版' : '纤细版'}</span>
                {skin.customModel && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Box size={14} className="text-emerald-400" />
                      4D模型
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(skin.id);
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SkinList;