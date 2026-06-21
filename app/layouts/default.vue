<template>
  <div class="min-h-screen flex flex-col">
    <MainNavigation class="isolate" />
    <main tabindex="-1" class="outline-none flex-1 isolate">
      <slot />
    </main>
    <Footer class="isolate" />
  </div>
</template>
