<script setup lang="ts">
import { computed, defineProps } from "vue";

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
    class="no-underline inline-flex self-center items-center rounded-lg bg-primary text-white font-semibold shadow-[0.25rem_0.25rem_0_var(--color-foreground)] outline-offset-6 motion-safe:transition-[translate,box-shadow] motion-safe:duration-default motion-safe:ease-out motion-safe:hover:translate-x-1 motion-safe:hover:translate-y-1 motion-safe:hover:shadow-none motion-safe:active:translate-x-1 motion-safe:active:translate-y-1 motion-safe:active:shadow-none"
    :class="sizeClass"
  >
    <slot />
  </a>
</template>
