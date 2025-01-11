<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
    <nav class="border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-emerald-500/10">
            <Pickaxe class="w-8 h-8 text-emerald-400" />
          </div>
          <h1 class="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
            Minecraft 皮肤包生成器
          </h1>
        </div>
        <div class="flex gap-4">
          <router-link 
            to="/" 
            class="px-4 py-2 rounded-lg transition-colors"
            :class="[
              $route.path === '/' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            ]"
          >
            Vue 版本
          </router-link>
          <router-link 
            to="/react" 
            class="px-4 py-2 rounded-lg transition-colors"
            :class="[
              $route.path === '/react' 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            ]"
          >
            React 版本
          </router-link>
        </div>
      </div>
    </nav>

    <router-view></router-view>

    <footer class="border-t border-gray-700/50 mt-auto">
      <div class="max-w-6xl mx-auto px-4 py-6 text-center text-gray-400">
        Made with ❤️ for Mnetha
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { Pickaxe } from 'lucide-vue-next';
</script>