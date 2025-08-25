<template>
  <div class="p-3 flexCenter" v-if="totalPages > 1">
    <div class="d-flex">
      <a v-if="displayedPages[0] > 1" class="card flexCenter p-1 mr-1" style="min-height: 34px; min-width: 38px;" @click.prevent="goToPage(1)">1</a>
      <a v-for="pageNumber in displayedPages" :key="pageNumber" class="card flexCenter p-1 mr-1" style="min-height: 34px; min-width: 38px;" :class="{ 'text-yellow': pageNumber === currentPage }" @click.prevent="goToPage(pageNumber)">
        {{ pageNumber }}
      </a>
      <a v-if="displayedPages[displayedPages.length - 1] < totalPages" class="card flexCenter p-1 mr-1" style="min-height: 34px; min-width: 38px;" @click.prevent="goToPage(totalPages)">{{ totalPages }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPage: {
      type: Number,
      default: 20,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPage);
    },
    displayedPages() {
      const pages = [];
      let start = Math.max(1, this.currentPage - 2);
      let end = Math.min(this.totalPages, start + 4);

      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },
  },
  methods: {
    goToPage(pageNumber) {
      if (pageNumber >= 1 && pageNumber <= this.totalPages) {
        this.$emit("page-change", pageNumber);
      }
    },
    prevPage() {
      this.goToPage(this.currentPage - 1);
    },
    nextPage() {
      this.goToPage(this.currentPage + 1);
    },
  },
};
</script>
