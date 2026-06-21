<template>
  <component :is="as" :class="variantClasses">
    <slot />
  </component>
</template>

<script setup lang="ts">
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
const { as, variant } = defineProps<{
  as: HeadingLevel | "p";
  variant?: HeadingLevel;
}>();

const variantClasses = computed(() => {
  const headingVariant = variant ?? as;
  switch (headingVariant) {
    case "h1":
      return "type-h1";
    case "h2":
      return "type-h2";
    case "h3":
      return "type-h3";
    case "h4":
    case "h5":
    case "h6":
      return "type-h4";
    case "p":
      return "type-body";
  }
  return undefined;
});
</script>
