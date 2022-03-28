<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <div class="navbar-brand">後台</div>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link class="nav-link" to="/products">產品列表</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/orders">訂單列表</router-link>
        </li>
         <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="signOut">登出</a>
        </li>
      </ul>
    </div>
  </div>
  </nav>
  <router-view v-if="checkStatus"></router-view>
</template>

<script>
export default {
  data () {
    return {
      checkStatus: false
    }
  },
  methods: {
    checkLogin () {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexschoolToken\s*=\s*([^;]*).*$)|^.*$/, '$1' // Regex
      )

      if (token) {
        const apiPath = `${process.env.VUE_APP_API}/api/user/check`

        this.$http.defaults.headers.common.Authorization = token // 傳遞token
        this.$http.post(apiPath, { api_token: token }).then(
          () => {
            this.checkStatus = true // 通過 check api 驗證後改為 true
          }
        ).catch(
          (err) => {
            alert(err.data.message)
            this.$router.push('/login')
          }
        )
      } else {
        alert('您尚未登入，請登入！')
        this.$router.push('/login')
      }
    },
    signOut () {
      document.cookie = 'hexschoolToken=;expires=;'
      alert('您已成功登出')
      this.$router.push('/login')
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>
