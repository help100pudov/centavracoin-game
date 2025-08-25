export default {
  mounted() {
    if (window.Telegram.WebApp) {
      this.$telegram = window.Telegram.WebApp;
    }
  },
  methods: {
    getTelegramUser() {
      return this.$telegram?.initDataUnsafe.user;
    },
  },
};
