<template>
  <div class="navbar-brand">
    <h1 class="h3 mb-3 font-weight-normal text-center">請先登入</h1>
  </div>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-8">
        <!--submit bind login() -->
        <form id="form" class="form-signin" @submit.prevent="login">
          <div class="form-floating mb-3">
            <!--input model bind username -->
            <input type="email" v-model="user.username" class="form-control" id="username" placeholder="name@example.com" required autofocus>
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <!--input model bind password -->
            <input type="password" v-model="user.password" class="form-control" id="password" placeholder="Password" required>
            <label for="password">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted">&copy; 2021~∞ - 六角學院</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {}
    }
  },
  methods: {
    login () {
      const apiPath = `${process.env.VUE_APP_API}/admin/signin`

      this.$http.post(apiPath, this.user).then(
        (response) => {
          const { token, expired } = response.data // 解構賦值
          document.cookie = `hexschoolToken=${token};expires=${new Date(expired)}; path=/`
          this.$router.push('/')
        }
      ).catch(
        (error) => {
          alert(error.data.message)
          this.$router.push('/login')
        }
      )
    }
  },
  mounted () {}
}
</script>
