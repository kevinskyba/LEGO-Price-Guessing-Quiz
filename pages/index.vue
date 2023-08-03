<template>
  <div class="w-1/2 mx-auto max-w-4xl">
    <div class="flex flex-col items-center justify-center h-screen space-y-8">
      <h1 class="text-4xl">Welcome to the Quiz Game!</h1>
      <nuxt-link to="/quiz">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Start the Quiz
        </button>
      </nuxt-link>
      <nuxt-link to="/settings">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Settings
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    router.push('/quiz');
    return {}
  },
};
</script>