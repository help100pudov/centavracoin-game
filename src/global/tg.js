export function initTelegramWebApp() {
  let tg = '';
  if (window.Telegram) {
    tg = window.Telegram.WebApp;
    tg.ready();
  }
  return tg;
}
