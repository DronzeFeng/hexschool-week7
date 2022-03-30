<template>
  <FrontNavbar></FrontNavbar>
  <router-view></router-view>
</template>

<script>
import FrontNavbar from '@/components/Frontpages/FrontNavbar.vue'
export default {
  components: {
    FrontNavbar
  }
}
</script>
