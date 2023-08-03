<template>
  <div>
    <h1>Settings Page</h1>
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