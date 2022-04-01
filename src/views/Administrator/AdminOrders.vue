<template>
  <div id="app">
    <div class="container">
      <AdminLoading :active="isLoading" :z-index="1060"></AdminLoading>
      <table class="table mt-4">
        <thead>
          <tr>
            <th width="120">購買時間</th>
            <th width="120">Email</th>
            <th>購買款項</th>
            <th width="120">應付金額</th>
            <th width="100">是否付款</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in orders" :key="item.id">
            <tr v-if="orders.length" :class="{ 'text-secondary': !item.is_paid }">
              <td>{{ $filters.date(item.create_at) }}</td>
              <td><span v-text="item.user.email" v-if="item.user"></span></td>
              <td>
                <ul class="list-unstyled">
                  <li v-for="product in item.products" :key="product.id">
                    {{ product.product.title }} 數量：{{ product.qty }}
                    {{ product.product.unit }}
                  </li>
                </ul>
              </td>
              <td class="text-right">{{ item.total }}</td>
              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :id="`paidSwitch${item.id}`"
                    v-model="item.is_paid"
                    @change="updatePaid(item)"
                  />
                  <label class="form-check-label" :for="`paidSwitch${item.id}`">
                    <span v-if="item.is_paid">已付款</span>
                    <span v-else>未付款</span>
                  </label>
                </div>
              </td>
              <td>
                <div class="btn-group">
                  <button class="btn btn-outline-primary btn-sm" type="button" @click="openModal('edit',item)">檢視</button>
                  <button class="btn btn-outline-danger btn-sm" type="button" @click="openModal('delete',item)">刪除</button>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <!-- 分頁元件 -->
      <AdminPagination :pages="pagination" @emit-pages="getOrders"></AdminPagination>
      <!-- OrdertModal -->
      <OrderModal
        :order="orderDetail"
        ref="orderModal"
        @update-paid="updatePaid"
      ></OrderModal>
      <!-- DelModal -->
      <DelModal :item="orderDetail" ref="delOrderModal" @del-item="delOrder"></DelModal>
    </div>
  </div>
</template>

<script>
import AdminPagination from '@/components/Administrator/AdminPagination.vue'
import OrderModal from '@/components/Administrator/OrderModal.vue'
import DelModal from '@/components/Administrator/DelModal.vue'

export default {
  data () {
    return {
      isNew: false,
      isLoading: false,
      orders: {},
      orderDetail: {},
      pagination: {},
      currentPage: 1
    }
  },
  components: {
    OrderModal,
    DelModal,
    AdminPagination
  },
  methods: {
    // 取得訂單資料
    getOrders (page = 1) {
      this.currentPage = page
      this.isLoading = true
      this.$http.get(`${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`).then(
        (res) => {
          this.orders = res.data.orders
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
      const orderModal = this.$refs.orderModal
      if (status === 'edit') {
        this.orderDetail = { ...item } // 深拷貝
        this.isNew = false
        orderModal.openModal()
      } else if (status === 'delete') {
        this.orderDetail = { ...item } // 深拷貝
        const delOrderModal = this.$refs.delOrderModal
        delOrderModal.openModal()
      }
    },
    // 更新訂單資訊
    updatePaid (item) {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`
      const paidInfo = { is_paid: item.is_paid }
      this.isLoading = true
      this.$http.put(url, { data: paidInfo }).then(
        (res) => {
          this.isLoading = false
          const orderModal = this.$refs.orderModal
          orderModal.hideModal()
          this.getOrders(this.currentPage)
          this.$httpMessageState(res, '更新付款狀態')
        }
      ).catch(
        (err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '錯誤訊息')
        }
      )
    },
    // 刪除訂單
    delOrder () {
      const url = `${process.env.VUE_APP_API}/api/${process.env.VUE_APP_PATH}/admin/order/${this.orderDetail.id}`
      this.isLoading = true
      this.$http.delete(url).then(
        (res) => {
          this.isLoading = false
          const delOrderModal = this.$refs.delOrderModal
          delOrderModal.hideModal()
          this.getOrders(this.currentPage)
          this.$httpMessageState(res, '刪除訂單')
        }
      ).catch(
        (err) => {
          this.isLoading = false
          this.$httpMessageState(err.response, '刪除訂單')
        }
      )
    }
  },
  created () {
    this.getOrders()
  }
}
</script>
