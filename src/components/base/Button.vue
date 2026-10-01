<script setup lang="ts">
import { computed } from "vue";

const { href, size = "md" } = defineProps<{
  href: string;
  size?: "md" | "lg";
}>();

const sizeClass = computed(() =>
  size === "lg" ? "text-2xl px-7 py-3" : "text-xl px-5 py-2",
);
</script>

<template>
  <a
    :href="href"
    class="group no-underline inline-flex self-center rounded-lg text-white font-semibold shadow-[0.25rem_0.25rem_0_var(--color-foreground)] outline-offset-6"
  >
    <span
      class="flex items-center rounded-lg bg-primary motion-safe:transition-transform group-active:translate-x-1 group-hover:translate-x-1 group-active:translate-y-1 group-hover:translate-y-1 ease-out"
      :class="sizeClass"
    >
      <slot />
    </span>
  </a>
</template>
