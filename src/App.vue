<script setup lang="ts">
  import { computed } from 'vue'
  import AppComment from '@/components/AppComment.vue'
  import data from '../data.json'
  
  const comments = computed(() => {
    const comments = []
    for (let index = 0; index < data.comments.length; index++) {
      const element = data.comments[index];
      const png = new URL(element.user.image.png, import.meta.url)
      const webp = new URL(element.user.image.webp, import.meta.url)
      comments.push({
        ...element,
        user: {
          ...element.user,
          image: {
            png: png.toString(),
            webp: webp.toString()
          }
        }
      })
    }
    return comments
  })
</script>

<template>
  <main>
    <app-comment
      v-for="(item, index) in comments" :key="index"
      v-bind="item"
    ></app-comment>
  </main>
</template>

<style scoped>
</style>
