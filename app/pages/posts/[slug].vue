<script setup lang="ts">
const route = useRoute();

const slug = computed(() => route.params.slug as string);

const { data: post } = await useAsyncData(
  () => `post:${slug.value}`,
  () => queryCollection("posts").path(`/posts/${slug.value}`).first(),
);

if (!post.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
  });
}

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
});
</script>

<template>
  <ContentRenderer v-if="post" :value="post" />
</template>
