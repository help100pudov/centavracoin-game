<template>
  <div class="flexCenter">
    <div class="lobby-home"></div>
    <div class="lobby-heros"></div>
    <div class="p-abs" style="top: 15%">
      <div class="flexCenter">
        <div class=""><i class="icon i-centa x40"></i></div>
        <div class="pl-2 fs-40px">{{ user.centa }}</div>
      </div>
      <div class="flexCenter g-2 mt-2">
        <div class="btn-info fon">
          <div class="btn-info main">
            <div class="flexCenter g-1">
              <div class="">35.000.000</div>
              <div class=""><i class="icon i-centa x16" style="vertical-align: text-top;"></i></div>
            </div>
            <div class="line 1px w-80 mt-1 mb-1 m-auto"></div>
            <div class="fs-12px text-light nowrap">{{ $t("Everything can be found") }}</div>
          </div>
        </div>
        <div class="btn">{{ $t("Search") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      data: "",
    };
  },
  created() {},
  computed: {},
  methods: {
    async bustSubmit(e) {
      const data = await this.$post(e, "submit");
      if (data) {
        let x = data.name.split("x");
        this.user.per = this.user.per * x[0];
        this.app.bustCount[`c` + data.name] = Number(this.app.bustCount[`c` + data.name]) - 1;

        this.$store.dispatch("updateUser", { pr: this.user.per });
        this.$store.dispatch("update", { bust: data, bustCount: this.app.bustCount });
      }
    },
  },
};
</script>
