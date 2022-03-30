<template>
  <h2>產品列表</h2>
  <div class="container">
    <img :src="product.imageUrl" alt="">
  </div>
</template>

<script>
export default {
  data () {
    return {
      product: {}
    }
  },
  methods: {
    getProduct () {
      // $router => 方法
      // $route => 物件 :可以用來取值
      const { id } = this.$route.params
      this.$http(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/product/${id}`).then(
        (res) => {
          this.product = res.data.product
        }
      ).catch(
        (err) => {
          console.log(err.message)
        }
      )
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>
