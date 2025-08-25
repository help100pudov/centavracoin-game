import { mapGetters } from "vuex";

let checkUserCalled = false;

export const appMixin = {
  computed: {
    ...mapGetters(["user"]),
    ...mapGetters(["app"]),
  },
  created() {
    if (!checkUserCalled && window.Telegram) {
    // if (!checkUserCalled) {
      this.checkUser();
      checkUserCalled = true;
    }
  },
  methods: {
    async checkUser() {
      const initData = window.Telegram.WebApp.initData;
      const data = await this.$post(
        "/auth"
        , { initData }
      );
      console.log('[AUTH] Ответ от backend:', data);
      if (data) {
        if (data.error) {
          this.$toast.show(data.error, { type: "error" });
        } else if (data.user && data.user.chat) {
          this.$store.dispatch("run", data);
          this.$i18n.locale = data.user.lang;
        } else {
          this.$toast.show('Ошибка авторизации: не найден Telegram ID (chat)', { type: "error" });
        }
      }
    },
  },
};
