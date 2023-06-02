<template>
  <router-view />
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useHead } from '@vueuse/head'

// env 설정 적용 테스트용 → 프로젝트 시작시, 콘솔 확인 후 제거 필요
console.log(import.meta.env, 'test here ')
console.log(process.env, 'test here 22 ')

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
<script>
// import axios from 'axios'

export default {
  created() {
    this.testMethod()
  },
  methods: {
    async testMethod() {
      // await this.$store
      //   .dispatch('testQuery')
      //   .then((res) => console.log('graphql strapi_v4 test success !', res))
      // await this.$store
      //   .dispatch('terms')
      //   .then((res) => console.log('graphql strapi_v3 test success !', res))
      // await axios({
      //   url: process.env.VUE_APP_BACKEND_URL + '/api/test-contents/1',
      //   method: 'GET'
      // }).then((res) => console.log('axios test success !!', res))
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/global.scss';
</style>
