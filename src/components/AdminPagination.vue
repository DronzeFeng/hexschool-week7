<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled': pages.current_page === 1}">
        <a class="page-link" href="javascript:void()" aria-label="Previous" @click.prevent="updatePage(pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{'active': item === pages.current_page}" v-for="(item, index) in pages.total_pages" :key="index + 'itemIndex'">
        <span class="page-link" v-if="item === pages.current_page">
          {{ item }}
        </span>
        <a class="page-link" href="javascript:void()" v-else @click.prevent="updatePage(item)">
          {{ item }}
        </a>
      </li>
      <li class="page-item" :class="{'disabled': pages.current_page === pages.total_pages}">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="updatePage(pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
// :pages="{ 頁碼資訊 }"
// @emitPages="更新頁面事件"
export default {
  props: ['pages'],
  methods: {
    updatePage (page) {
      this.$emit('emitPages', page)
    }
  }
}
</script>
