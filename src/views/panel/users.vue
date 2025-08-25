<template>
  <menuNav />
  <div class="">
    <form @submit.prevent="submitLoad" id="/panel/users" class="flexBetween p-2">
      <div class="w-100">
        <input type="hidden" name="act" value="search" />
        <input type="text" class="" name="val" />
      </div>
      <div class="pl-3">
        <button type="submit" class="btn p-3 pl-5 pr-5"><i class="bi bi-search fs-20px"></i></button>
      </div>
    </form>

    <div class="card p-1" style="overflow: auto">
      <table class="table1">
        <thead class="thead">
          <tr class="">
            <th class="p-2 text-left">{{ $t("User") }}</th>
            <th class="p-2 ">{{ $t("Balance") }}</th>
            <th class="p-2 ">{{ $t("Referral") }}</th>
          </tr>
        </thead>
        <tbody class="tbody">
          <tr v-for="(usr, key) in users" :key="key" :id="'card' + key" @click="editModal(key)">
            <td class="p-2">{{ usr.first.slice(0, 8) }} {{ usr.last.charAt(0) }}</td>
            <td class="p-2">{{ $num(usr.centa) }}</td>
            <td class="p-2">{{ $num(usr.refAll) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination :totalItems="totalItems" :currentPage="currentPage" :itemsPage="itemsPage" @page-change="loadData($event)"></Pagination>
  </div>

  <Modal :id="'userEdit'">
    <form @submit.prevent="submitEdit" id="/panel/users" class="p-5 pt-3" v-if="users[edit]">
      <div class="text-center fs-20px fw-700">{{ users[edit].login || "---" }}</div>
      <div class="text-center mt-2">{{ users[edit].first }} {{ users[edit].last }}</div>
      <div class="mt-1">id: {{ users[edit].id }}</div>
      <div class="mt-1">Tg id{{ users[edit].user }}</div>
      <div class="mt-1">Reg: {{ $dateTime.date(users[edit].reg) }}</div>
      <div class="mt-1">Online: {{ $dateTime.date(users[edit].who) }}</div>

      <input type="hidden" name="act" value="edit" />
      <input type="hidden" name="userId" :value="users[edit].id" />
      <div class="mt-3">
        <label class="fw-600">{{ $t("Centa") }}</label>
        <div class="mt-2">
          <input type="text" class="" name="centa" v-model="users[edit].centa" />
        </div>
      </div>
      <div class="mt-4">
        <button type="submit" class="btn claim">{{ $t("Save") }}</button>
      </div>
    </form>
  </Modal>
</template>

<script>
import Pagination from "../../components/app/Pagination.vue";
import menuNav from "./menuNav.vue";
import { useToast } from 'vue-toastification';

export default {
  components: {
    Pagination,
    menuNav,
  },
  name: "Home",
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      users: {},
      totalItems: 0,
      currentPage: 1,
      itemsPage: 50,
      edit: 0,
    };
  },
  created() {
    this.loadContent();
  },
  methods: {
    loadData(page) {
      this.currentPage = page;
      this.loadContent();
    },
    async loadContent() {
      const response = await this.$post("/panel/users", { page: this.currentPage, count: this.itemsPage });
      if (response && response.users) {
        this.totalItems = response.count.cnt;
        this.users = response.users;
      }
    },
    async submitLoad(e) {
      const response = await this.$post(e, "submit");
      if (response && response.users) {
        this.totalItems = response.count.cnt;
        this.users = response.users;
      }
    },
    editModal(key) {
      this.edit = key;
      this.$modal("userEdit");
    },
    async submitEdit(e) {
      const response = await this.$post(e, "submit");
      if (response && response == "Saved") {
        this.toast.success(this.$t("Saved"));
        this.$modal("userEdit");
      }
    },
  },
};
</script>
