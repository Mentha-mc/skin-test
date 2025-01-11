<template>
  <div id="react-root"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { createRoot } from 'react-dom/client';
import App from '../../App';

let root: ReturnType<typeof createRoot> | null = null;

onMounted(() => {
  const container = document.getElementById('react-root');
  if (container) {
    root = createRoot(container);
    root.render(<App />);
  }
});

onUnmounted(() => {
  if (root) {
    root.unmount();
  }
});
</script>