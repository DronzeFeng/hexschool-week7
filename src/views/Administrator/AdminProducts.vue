<template>
  <div id="app">
    <div class="container">
      <AdminLoading :active="isLoading" :z-index="1060"></AdminLoading>
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
            <td class="text-end">{{ $filters.currency(item.origin_price) }}</td>
            <td class="text-end">{{ $filters.currency(item.price) }}</td>
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
      <AdminPagination :pages="pagination" @emit-pages="getData"></AdminPagination>
      <!-- ProductModal -->
      <ProductModal
        @update-product="updateProduct"
        :product="productDetail"
        :isNew="isNew"
        ref="productModal"
      ></ProductModal>
      <!-- DelModal -->
      <DelModal :item="productDetail" ref="delProductModal" @del-item="delProduct"></DelModal>
    </div>
  </div>
</template>

<script>
import AdminPagination from '@/components/Administrator/AdminPagination.vue'
import ProductModal from '@/components/Administrator/ProductModal.vue'
import DelModal from '@/components/Administrator/DelModal.vue'

export default {
  data () {
    return {
      isNew: false,
      isLoading: false,
      products: [],
      productDetail: {},
      pagination: {},
      currentPage: 1
    }
  },
  components: {
    ProductModal,
    DelModal,
    AdminPagination
  },
  methods: {
    // 取得產品資料
    getData (page = 1) {
      this.currentPage = page
      this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`).then(
        (res) => {
          this.products = res.data.products
          this.pagination = res.data.pagination
          this.isLoading = false
        }
      ).catch(
        (err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '錯誤訊息')
        }
      )
    },
    // 觸發Modal的情境
    openModal (status, item) {
      const productModal = this.$refs.productModal
      if (status === 'new') {
        this.productDetail = {}
        this.isNew = true
        productModal.openModal()
      } else if (status === 'edit') {
        this.productDetail = { ...item } // 深拷貝
        this.isNew = false
        productModal.openModal()
      } else if (status === 'delete') {
        this.productDetail = { ...item } // 深拷貝
        const delProductModal = this.$refs.delProductModal
        delProductModal.openModal()
      }
    },
    // 更新產品資訊
    updateProduct (item) {
      let url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product`
      let method = 'post'
      let status = '新增產品'
      this.productDetail = item
      this.isLoading = true
      // 判斷是否為新增產品
      if (!this.isNew) {
        // 修改產品資訊
        url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.productDetail.id}`
        method = 'put'
        status = '更新產品'
      }
      const productModal = this.$refs.productModal
      this.$http[method](url, { data: this.productDetail }).then(
        (res) => {
          this.isLoading = false
          this.$httpMessageState(res, status)
          productModal.hideModal()
          this.getData(this.currentPage)
        }
      ).catch(
        (err) => {
          this.isLoading = false
          this.$httpMessageState(err.res, status)
        }
      )
    },
    // 刪除產品
    delProduct () {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/product/${this.productDetail.id}`
      this.isLoading = true
      this.$http.delete(url).then(
        (res) => {
          this.isLoading = false
          this.$httpMessageState(res, '刪除產品')
          const delProductModal = this.$refs.delProductModal
          delProductModal.hideModal()
          this.getData(this.currentPage)
        }
      ).catch(
        (err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '刪除產品')
        }
      )
    }
  },
  created () {
    this.getData()
  }
}
</script>
