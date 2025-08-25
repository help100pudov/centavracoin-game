<template>
  <menuNav />

  <div class="p-3 pt-0">
    <div class="p-4">
      <h6 class="">{{ $t("Users") }}</h6>
      <div class="d-flex mt-2" style="border-bottom: 1px solid #131313">
        <div class="w-50 p-1">24 {{ $t("hours") }}</div>
        <div class="w-50 p-1">{{ users.h24 }}</div>
      </div>
      <div class="d-flex mt-2" style="border-bottom: 1px solid #131313">
        <div class="w-50 p-1">7 {{ $t("deys") }}</div>
        <div class="w-50 p-1">{{ users.d7 }}</div>
      </div>
      <div class="d-flex mt-2" style="border-bottom: 1px solid #131313">
        <div class="w-50 p-1">30 {{ $t("deys") }}</div>
        <div class="w-50 p-1">{{ users.d30 }}</div>
      </div>
      <div class="d-flex mt-2" style="border-bottom: 1px solid #131313">
        <div class="w-50 p-1">{{ $t("Total") }}</div>
        <div class="w-50 p-1">{{ users.total }}</div>
      </div>
      <div class="d-flex mt-2" style="border-bottom: 1px solid #131313">
        <div class="w-50 p-1">{{ $t("Online today") }}</div>
        <div class="w-50 p-1">{{ users.on24 }}</div>
      </div>
      <div class="d-flex mt-2" style="border-bottom: 1px solid #131313">
        <div class="w-50 p-1">{{ $t("Online") }}</div>
        <div class="w-50 p-1">{{ users.online }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import menuNav from "./menuNav.vue";
export default {
  components: { menuNav },
  name: "Home",
  data() {
    return {
      users: "",
    };
  },
  created() {
    this.loadContent();
  },
  methods: {
    async loadContent() {
      const response = await this.$post("/panel/main");
      if (response && response.users) {
        this.users = response.users;
      }
    },
  },
};
</script>
