<template>
  <component
    :is="as"
    data-name="container"
    class="px-side-mobile md:px-side mx-auto w-full max-w-max-width"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const { as = "div" } = defineProps<{
  as?: "div" | "section";
}>();
</script>
