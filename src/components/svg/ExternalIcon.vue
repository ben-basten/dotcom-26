<script setup lang="ts">
const { size = 12 } = defineProps<{ size?: number }>();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    fill="none"
    viewBox="0 0 6 6"
    aria-hidden="true"
    focusable="false"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M.5.5v5h5M2.5 3.5l3-3m-2 0h2v2M5.5 5.5V4M.5.5H2"
    />
  </svg>
</template>
