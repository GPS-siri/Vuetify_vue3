<template>
  <router-view />
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useHead } from '@vueuse/head'

const siteData = reactive({
  title: `Vue3_project_test`,
  description: `PROTECT Pick-here-project / Reserve-lite-project with Vue3`
})
useHead({
  // Can be static or computed
  title: computed(() => siteData.title),
  meta: [
    {
      name: `description`,
      content: computed(() => siteData.description)
    }
  ]
})
</script>

<style lang="scss">
@import '@/assets/css/global.scss';
</style>
