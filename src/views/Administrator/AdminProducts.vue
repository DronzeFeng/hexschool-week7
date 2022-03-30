<template>
  <div id="app">
    <div class="container">
      <div class="text-end mt-4">
        <button class="btn btn-primary" @click="openModal('new')">建立新的產品</button>
      </div>
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in products" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-end">{{ item.origin_price }}</td>
            <td class="text-end">{{ item.price }}</td>
            <td>
              <span class="text-success" v-if="item.is_enabled">啟用</span>
              <span v-else>未啟用</span>
            </td>
            <td>
              <div class="btn-group">
                <button type="button" class="btn btn-outline-primary btn-sm" @click="openModal('edit', item)">編輯</button>
                <button type="button" class="btn btn-outline-danger btn-sm" @click="openModal('delete', item)">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 分頁元件 -->
      <ProductsPagination :pages="pagination" @emit-pages="getData"></ProductsPagination>
      <ProductModal
        @update-product="updateProduct"
        :product="tempProduct"
        :isNew="isNew"
        ref="productModal"
      ></ProductModal>
      <!-- DelModal -->
      <DelModal :item="tempProductDetail" ref="delModal" @del-item="delProduct"></DelModal>
    </div>
  </div>
</template>

<script>
import ProductsPagination from '@/components/Administrator/ProductsPagination.vue'
import ProductModal from '@/components/Administrator/ProductModal.vue'
import DelModal from '@/components/Administrator/DelModal.vue'

export default {
  data () {
    return {
      products: [],
      productDetail: {},
      isNew: false,
      idLoading: false,
      pagination: {}
    }
  },
  components: {
    ProductsPagination,
    ProductModal,
    DelModal
  },
  methods: {
    // 取得產品資料
    getData (page = 1) {
      this.$http(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`).then(
        (res) => {
          this.products = res.data.products
          this.pagination = res.data.pagination
        }
      ).catch(
        (err) => {
          console.log(err.data.message)
        }
      )
    },
    // 觸發Modal的情境
    openModal (status, item) {
      const productModal = this.$refs.productModal
      const delModal = this.$refs.delModal
      if (status === 'new') {
        this.productDetail = {
          imagesUrl: []
        }
        productModal.show()
        this.isNew = true
      } else if (status === 'edit') {
        // this.productDetail = { ..item }; // 淺拷貝
        const tempProductDetail = JSON.parse(JSON.stringify({ ...item })) // 深拷貝
        this.productDetail = tempProductDetail
        productModal.show()
        this.isNew = false
      } else if (status === 'delete') {
        const tempProductDetail = JSON.parse(JSON.stringify({ ...item })) // 深拷貝
        this.productDetail = tempProductDetail
        delModal.show()
      }
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
