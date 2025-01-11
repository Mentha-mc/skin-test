<template>
  <div class="glass-card rounded-xl p-6 shadow-lg hover-card">
    <div class="flex items-center gap-2 mb-4">
      <Box class="w-5 h-5 text-emerald-400" />
      <h3 class="text-lg font-semibold">皮肤包详情</h3>
    </div>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          皮肤包名称
        </label>
        <input
          type="text"
          :value="name"
          @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
          class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          placeholder="输入皮肤包名称"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-1">
          描述
        </label>
        <textarea
          :value="description"
          @input="$emit('update:description', ($event.target as HTMLTextAreaElement).value)"
          class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          placeholder="描述这个皮肤包..."
          rows="3"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Box } from 'lucide-vue-next';

defineProps<{
  name: string;
  description: string;
}>();

defineEmits<{
  'update:name': [value: string];
  'update:description': [value: string];
}>();
</script>