import { ref } from 'vue';

export function useErrorHandler() {
  const error = ref<string | null>(null);

  const setError = (message: string) => {
    error.value = message;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    error,
    setError,
    clearError
  };
}