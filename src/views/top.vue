<template>
  <div class="p-1 pl-4 pr-4">
    <!-- 💰 BUY CENTA блок -->
    <div class="text-center bg-gradient-to-b from-yellow-500 to-yellow-700 py-6 rounded-xl shadow-xl mb-6">
      <img src="@/assets/walletcenta.png" alt="Wallet CENTA" class="w-20 mx-auto mb-2" />
      <h2 class="text-2xl font-bold text-white">{{$t('BUY CENTA')}}</h2>
      <p class="text-blue-200 text-md mt-1">{{$t('Unlock your name & move up in the ranking')}}</p>

      <div class="mt-4 max-w-sm mx-auto">
        <!-- Прогресс оплаты: 2 строки по 2 столбца -->
        <div class="payment-steps-grid mb-3">
          <div class="step" :class="{ active: paymentStep >= 1 }">{{$t('Enter amount')}}</div>
          <div class="step" :class="{ active: paymentStep >= 2 }">{{$t('Payment sent')}}</div>
          <div class="step" :class="{ active: paymentStep >= 3 }">{{$t('Payment confirmed')}}</div>
          <div class="step" :class="{ error: statusType === 'error' }">{{$t('Error')}}</div>
        </div>
        <!-- Статус и txHash -->
        <div v-if="status" :class="['status-message', statusType]">{{$t(status)}}</div>
        <div v-if="txHash && statusType !== 'pending'" class="tx-block mt-2">
          <div class="tx-label">txHash:</div>
          <div class="tx-value">
            <span class="tx-short">{{ txHash.slice(0, 6) + '...' + txHash.slice(-6) }}</span>
            <button class="copy-btn ml-2" @click="copyTxHash">{{$t('Copy')}}</button>
          </div>
          <div class="tx-link mt-1">
            <a :href="`https://tonviewer.com/transaction/${txHash}`" target="_blank" rel="noopener">{{$t('Open in TonViewer')}}</a>
          </div>
        </div>
        <!-- Кнопка для подключения кошелька -->
        <button v-if="!isConnected" @click="connectWallet"
                class="top-connect-wallet-btn w-full text-white font-bold py-3 px-6 rounded-lg shadow-xl transition-all duration-300">
          {{$t('Connect TON wallet')}}
        </button>
        <!-- Кнопка для оплаты -->
        <button v-else @click="sendPayment"
                class="top-payment-btn w-full text-white font-bold py-3 px-6 rounded-lg shadow-xl transition-all duration-300">
          🚀 {{$t('Buy 1 CENTA for')}} {{ tonAmount }} TON
        </button>
        <button v-if="isChecking" @click="checkPayment" class="top-payment-btn mt-2">
          {{$t('Check payment')}}
        </button>
      </div>
    </div>

    <!-- 👤 Текущее место -->
    <div class="text-center"><i class="icon i-top x50"></i></div>
    <h4 class="text-center text-up mt-3">{{ $t("Top participants") }}</h4>

    <div class="card p-3 mt-2">
      <h5>{{ $t("Your place") }}</h5>
      <div class="card flexBetween mt-2 p-1 pl-4 pr-4">
        <div class="flexCenter">
          <div><i class="icon x40 br-50" :class="`i-ava${user.ava}`"></i></div>
          <div class="ml-3">
            <h6 class="fs-14px">{{ user.first.slice(0, 8) }} {{ user.last.charAt(0) }}</h6>
            <div class="fs-14px">
              <i class="icon x14 i-centa"></i>
              {{ $num(user.centa) }}
            </div>
          </div>
        </div>
        <h6 class="">{{ app.top?.centaYou }}</h6>
      </div>
    </div>

    <!-- 🏆 Топ 100 -->
    <div v-if="app.top?.centa" class="card p-3 mt-5">
      <h4 class="">{{ $t("Top 100 players") }}</h4>
      <div class="card p-1 pl-4 pr-4 mt-1 flexBetween" v-for="(val, key) in app.top.centa" :key="key">
        <div class="d-flex items-center w-80">
          <div class="flexCenter">
            <div><i class="icon x40 br-50" :class="`i-ava${val.ava}`"></i></div>
            <div class="ml-3">
              <div class="fs-16px fw-700">{{ val?.first.slice(0, 8) }} {{ val.last.charAt(0) }}</div>
              <div class="d-flex items-center fs-14px">
                <i class="icon i-centa x16 mr-1"></i>
                <div>{{ $num(val.centa) }}</div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h6 class="">#{{ key + 1 }}</h6>
        </div>
      </div>
    </div>

    <div v-else class="card text-center p-4 mt-4">{{ $t("Not found") }}</div>
  </div>
</template>

<script>
import { getTonConnectUI } from '@/tonconnect.js';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import tgMixin from '@/mixins/tg.js';
import PaymentProgress from './PaymentProgress.vue';

export default {
  name: 'Top',
  mixins: [tgMixin],
  components: { PaymentProgress },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      tonConnectUI: null,
      isConnected: false,
      walletAddress: '',
      tonAmount: 1,
      status: '',
      statusType: 'pending',
      paymentStep: 0,
      txHash: '',
      lastTxPayload: null,
      isChecking: false,
      paymentPolling: false,
      pollingTries: 0,
      pollingMax: 6,
      pollingInterval: null,
      pollingTimer: 60,
      pollingCountdown: null,
      paymentStatus: '',
      paymentSuccess: false,
      paymentError: '',
    };
  },
  created() {
    try {
      this.tonConnectUI = getTonConnectUI();
      this.tonConnectUI.onStatusChange((wallet) => {
        this.isConnected = !!wallet;
        this.walletAddress = wallet?.account?.address || '';
        console.log('Wallet status changed:', wallet);
      });
    } catch (error) {
      console.error('Ошибка инициализации TonConnectUI:', error);
      this.status = this.$t('TonConnectUI initialization error:') + error.message;
      this.toast.error(this.$t('TonConnectUI initialization error'), { timeout: 3000 });
    }
  },
  mounted() {
    this.$store.dispatch('fetchUserData');
  },
  methods: {
    onHashCopied(hash) {
      this.toast.success(this.$t('txHash copied!'), { timeout: 2000 });
    },
    copyTxHash() {
      if (this.txHash) {
        navigator.clipboard.writeText(this.txHash);
        this.toast.success(this.$t('txHash copied!'), { timeout: 2000 });
      }
    },
    async connectWallet() {
      if (!this.tonConnectUI) {
        this.status = this.$t('Connection not initialized error');
        this.toast.error(this.$t('Connection not initialized error'), { timeout: 3000 });
        return;
      }
      try {
        await this.tonConnectUI.connectWallet();
        this.status = this.$t('Wallet connected!');
        this.toast.success(this.$t('Wallet connected!'), { timeout: 3000 });
        await this.$store.dispatch('fetchUserData');
      } catch (error) {
        console.error('Ошибка подключения:', error);
        this.status = this.$t('Connection error:') + error.message;
        this.toast.error(this.$t('Connection error'), { timeout: 3000 });
      }
    },
    startPollingUserData() {
      if (this.pollingInterval) clearInterval(this.pollingInterval);
      this.pollingInterval = setInterval(() => {
        this.$store.dispatch('fetchUserData');
      }, 3000);
    },
    stopPollingUserData() {
      if (this.pollingInterval) clearInterval(this.pollingInterval);
    },
    async sendPayment() {
      console.log('sendPayment called');
      if (!this.tonConnectUI) {
        this.status = this.$t('Connection not initialized error');
        this.toast.error(this.$t('Connection not initialized error'), { timeout: 3000 });
        return;
      }
      // Получаем chat из store или напрямую из Telegram WebApp
      let chat = this.$store.state.user?.chat;
      if (!chat && typeof this.getTelegramUser === 'function') {
        const tgUser = this.getTelegramUser();
        chat = tgUser?.id;
      }
      console.log('chat:', chat);
      if (!chat) {
        this.status = this.$t('Telegram ID not found error');
        this.toast.error(this.$t('Telegram ID not found error'), { timeout: 5000 });
        return;
      }
      // Новая сумма оплаты: 1 TON за 1 CENTA
      const amountTon = 1;
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: 'UQA_2riTM3_ZP6LwrUld_XgEw4Q389-Sr1kuB6OE1JVfOcMo',
            amount: (amountTon * 1e9).toString(),
          },
        ],
      };
      this.paymentStep = 1;
      this.statusType = 'pending';
      this.txHash = '';
      try {
        const result = await this.tonConnectUI.sendTransaction(transaction);
        console.log('sendTransaction result:', result);
        this.status = this.$t('Payment sent! Hash:') + (result.boc || result.hash || result.txid || result.transaction?.id);
        this.statusType = 'pending';
        this.paymentStep = 2;
        let txHash = result.transaction?.id || result.txid || result.hash || result.boc;
        this.txHash = txHash;
        console.log('txHash to send:', txHash);
        if (!txHash) {
          this.toast.error(this.$t('Error: could not get txid or boc from TonConnect result!'), { timeout: 5000 });
          return;
        }
        // Отправляем на backend
        const backendResp = await axios.post('/api/verify-ton-payment', {
          txHash,
          userAddress: this.walletAddress,
          amount: amountTon,
          chat,
          product: 'top_unlock_name',
          centaAmount: 1
        });
        console.log('Backend response:', backendResp.data);
        // --- Получаем hex txHash из backend ---
        if (backendResp.data && backendResp.data.txHash) {
          this.txHash = backendResp.data.txHash;
        }
        if (backendResp.data && backendResp.data.txUrl) {
          this.txUrl = backendResp.data.txUrl;
        }
        this.status = backendResp.data.message || this.$t('Payment sent and awaiting confirmation!');
        this.statusType = backendResp.data.success ? 'success' : 'pending';
        this.paymentStep = backendResp.data.success ? 3 : 2;
        // --- запускаем polling для обновления данных пользователя ---
        this.startPollingUserData();
        // Если платеж подтвержден, сразу обновляем данные и останавливаем polling
        if (backendResp.data.success) {
          this.stopPollingUserData();
          await this.$store.dispatch('fetchUserData');
        }
      } catch (error) {
        console.error('Ошибка платежа:', error);
        this.status = this.$t('Payment error:') + error.message;
        this.statusType = 'error';
        this.paymentStep = 3;
        this.toast.error(this.$t('Payment error'), { timeout: 3000 });
      }
    },
    async checkPayment() {
      if (!this.lastTxPayload) return;
      this.status = this.$t('Checking payment...');
      try {
        const response = await axios.post('/api/verify-ton-payment', this.lastTxPayload, { timeout: 90000 });
        if (response.data.code === 'TX_PENDING' && response.data.userMessage) {
          this.status = response.data.userMessage;
          this.statusType = 'pending';
          this.paymentStep = 2;
          this.toast.info(response.data.userMessage, { timeout: 10000 });
          return;
        }
        this.status = response.data.message || this.$t('Payment successfully verified');
        this.statusType = 'success';
        this.paymentStep = 2;
        this.toast.success(this.$t('Payment verified!'), { timeout: 3000 });
        this.isChecking = false;
      } catch (err) {
        this.status = this.$t('Payment check error');
        this.statusType = 'error';
        this.paymentStep = 3;
        this.toast.error(this.$t('Payment check error'), { timeout: 3000 });
      }
    },
  },
  beforeUnmount() {
    this.stopPollingUserData();
  },
};
</script>

<style scoped>
/* Уникальные классы для кнопок с префиксом top- */
.top-connect-wallet-btn {
  background-color: #1f2937; /* bg-gray-800 */
  color: #ffffff;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.top-connect-wallet-btn:hover {
  background-color: #374151; /* hover:bg-gray-700 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.top-payment-btn {
  background-color: #2563eb; /* bg-blue-600 */
  color: #ffffff;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.top-payment-btn:hover {
  background-color: #1d4ed8; /* hover:bg-blue-700 */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

/* Убедимся, что общие стили не перекрывают наши кнопки */
button {
  border: none;
  cursor: pointer;
  width: 100%;
}

button:hover {
  opacity: 0.95;
}

.payment-steps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}
.step {
  background: #222;
  color: #fff;
  border-radius: 8px;
  padding: 8px 0;
  font-size: 14px;
  text-align: center;
  font-weight: 600;
  opacity: 0.7;
}
.step.active {
  background: #2563eb;
  color: #fff;
  opacity: 1;
}
.step.error {
  background: #dc2626;
  color: #fff;
  opacity: 1;
}
.status-message {
  margin: 8px 0 0 0;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 15px;
  word-break: break-word;
}
.status-message.error {
  background: #fee2e2;
  color: #b91c1c;
}
.status-message.success {
  background: #d1fae5;
  color: #065f46;
}
.status-message.pending {
  background: #e0e7ff;
  color: #3730a3;
}
.tx-block {
  background: #18181b;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;
  word-break: break-all;
}
.tx-label {
  font-size: 13px;
  color: #a1a1aa;
}
.tx-value {
  display: flex;
  align-items: center;
  font-size: 15px;
  word-break: break-all;
}
.tx-short {
  font-family: monospace;
  font-size: 15px;
  color: #fff;
  background: #27272a;
  border-radius: 6px;
  padding: 2px 8px;
}
.copy-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  margin-left: 6px;
  cursor: pointer;
}
.copy-btn:hover {
  background: #1d4ed8;
}
.tx-link {
  margin-top: 4px;
  font-size: 14px;
}
.tx-link a {
  color: #2563eb;
  text-decoration: underline;
  word-break: break-all;
}
</style>