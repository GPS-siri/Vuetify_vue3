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
<!-- <script>
export default {
  created() {
    console.log(
      process.env.VUE_APP_I18N_LOCALE,
      process.env.VUE_APP_I18N_FALLBACK_LOCALE,
      import.meta.env,
      'test here '
    )
  },
  methods: {}
}
</script> -->

<style lang="scss">
@import '@/assets/css/global.scss';
</style>
