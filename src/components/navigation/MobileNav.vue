<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import Button from "~/components/base/Button.vue";
import type { NavLink } from "~/types/NavLink";

defineProps<{
  links: NavLink[];
  ctaLink: NavLink;
  currentPath: string;
}>();

const menuId = "mobile-menu";

const isOpen = ref(false);
const toggle = ref<HTMLButtonElement | null>(null);

watch(isOpen, (open) => {
  document.documentElement.classList.toggle("overflow-hidden", open);
});

function closeMenu() {
  isOpen.value = false;
  toggle.value?.focus();
}

let desktopMedia: MediaQueryList;
let navigation: HTMLElement | null = null;

function closeOnDesktop(event: MediaQueryListEvent) {
  if (event.matches) isOpen.value = false;
}

function closeOnFocusOut(event: FocusEvent) {
  if (
    isOpen.value &&
    !(
      event.relatedTarget instanceof Node &&
      navigation?.contains(event.relatedTarget)
    )
  ) {
    isOpen.value = false;
  }
}

onMounted(() => {
  desktopMedia = window.matchMedia("(min-width: 48rem)");
  desktopMedia.addEventListener("change", closeOnDesktop);
  navigation = toggle.value?.closest("nav") ?? null;
  navigation?.addEventListener("focusout", closeOnFocusOut);
});

onUnmounted(() => {
  desktopMedia?.removeEventListener("change", closeOnDesktop);
  navigation?.removeEventListener("focusout", closeOnFocusOut);
  document.documentElement.classList.remove("overflow-hidden");
});
</script>

<template>
  <div class="md:hidden pointer-events-auto" @keydown.esc="closeMenu">
    <button
      ref="toggle"
      type="button"
      :aria-label="isOpen ? 'Close menu' : 'Open menu'"
      :aria-controls="menuId"
      :aria-expanded="isOpen"
      class="relative z-30 flex size-11 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-3 border-theme-dark bg-background"
      @click="isOpen = !isOpen"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="19"
        fill="none"
        viewBox="0 -2 21 19"
        aria-hidden="true"
        :class="{ 'is-open': isOpen }"
      >
        <path class="hamburger-top" d="M2.5 2.5H18.5" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
        <path class="hamburger-bottom" d="M2.5 12.5H18.5" stroke="currentColor" stroke-width="5" stroke-linecap="round" />
      </svg>
    </button>
    <button
      type="button"
      tabindex="-1"
      aria-hidden="true"
      :inert="!isOpen"
      class="menu-overlay fixed inset-0 z-10 bg-theme-dark/60"
      :class="{ 'is-open': isOpen, 'pointer-events-none': !isOpen }"
      @click="closeMenu"
    ></button>
    <div
      :id="menuId"
      :aria-hidden="!isOpen"
      :inert="!isOpen"
      class="menu-panel fixed inset-x-inset top-inset z-20 mx-auto flex max-h-[calc(100dvh-2*var(--spacing-inset))] max-w-max-width flex-col items-center gap-5 overflow-y-auto rounded-xl bg-background px-6 pb-6 pt-23 shadow-lg min-[95rem]:inset-x-0"
      :class="{ 'is-open': isOpen, 'pointer-events-none': !isOpen }"
    >
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        :aria-current="currentPath === link.href ? 'page' : undefined"
        class="text-4xl transition-[rotate,scale,color] duration-default ease-snap no-underline font-bold text-foreground hover:nav-active hover:text-theme-dark aria-[current=page]:nav-active aria-[current=page]:underline"
      >
        {{ link.text }}
      </a>
      <Button
        :href="ctaLink.href"
        size="lg"
        :aria-current="currentPath === ctaLink.href ? 'page' : undefined"
        class="mt-5"
      >
        {{ ctaLink.text }}
      </Button>
    </div>
  </div>
</template>

<style scoped>
.hamburger-top,
.hamburger-bottom {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 350ms var(--ease-snap);
}

svg.is-open .hamburger-top {
  transform: translateY(5px) rotate(45deg);
}

svg.is-open .hamburger-bottom {
  transform: translateY(-5px) rotate(-45deg);
}

.menu-overlay {
  opacity: 0;
  transition: opacity 150ms ease-out;
}

.menu-panel {
  opacity: 0;
  transform: translateY(-20px);
  transition:
    opacity 350ms var(--ease-snap),
    transform 350ms var(--ease-snap);
}

.menu-overlay.is-open,
.menu-panel.is-open {
  opacity: 1;
}

.menu-panel.is-open {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .hamburger-top,
  .hamburger-bottom,
  .menu-overlay,
  .menu-panel {
    transition: none;
  }
}
</style>
