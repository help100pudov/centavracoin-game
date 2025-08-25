<template>
  <div class="payment-progress">
    <div class="steps">
      <div v-for="(step, idx) in steps" :key="idx" class="step">
        <div :class="['circle', { active: idx <= currentStep, error: step.type === 'error' && currentStep === idx }]">
          <span v-if="step.type === 'error' && currentStep === idx">!</span>
          <span v-else>{{ idx + 1 }}</span>
        </div>
        <div class="label">{{ step.label }}</div>
        <div v-if="idx < steps.length - 1" class="line"></div>
      </div>
    </div>
    <div v-if="statusMessage" class="status-message" :class="statusClass">{{ statusMessage }}</div>
    <div v-if="txHash" class="tx-hash">
      <span>txHash:</span>
      <span class="hash">{{ shortHash }}</span>
      <button @click="copyHash">Копировать</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentProgress',
  props: {
    currentStep: { type: Number, default: 0 },
    statusMessage: { type: String, default: '' },
    statusType: { type: String, default: 'pending' }, // 'pending', 'success', 'error'
    txHash: { type: String, default: '' }
  },
  computed: {
    steps() {
      return [
        { label: 'Ожидание оплаты', type: 'pending' },
        { label: 'Платёж отправлен', type: 'pending' },
        { label: 'Платёж подтверждён', type: 'success' },
        { label: 'Ошибка', type: 'error' }
      ];
    },
    statusClass() {
      return {
        'alert-success': this.statusType === 'success',
        'alert-pending': this.statusType === 'pending',
        'alert-error': this.statusType === 'error',
      };
    },
    shortHash() {
      if (!this.txHash) return '';
      return this.txHash.slice(0, 8) + '...' + this.txHash.slice(-8);
    }
  },
  methods: {
    copyHash() {
      if (!this.txHash) return;
      navigator.clipboard.writeText(this.txHash);
      this.$emit('copied', this.txHash);
    }
  }
};
</script>

<style scoped>
.payment-progress {
  margin-bottom: 1.5rem;
}
.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}
.step {
  display: flex;
  align-items: center;
}
.circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  border: 2px solid #e5e7eb;
  transition: background 0.3s, border 0.3s, color 0.3s;
}
.circle.active {
  background: #2563eb;
  color: #fff;
  border-color: #2563eb;
}
.circle.error {
  background: #dc2626;
  color: #fff;
  border-color: #dc2626;
}
.label {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  font-size: 0.95rem;
}
.line {
  width: 32px;
  height: 2px;
  background: #e5e7eb;
}
.status-message {
  text-align: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
}
.alert-success {
  background: #bbf7d0;
  color: #166534;
}
.alert-pending {
  background: #fef9c3;
  color: #92400e;
}
.alert-error {
  background: #fee2e2;
  color: #991b1b;
}
.tx-hash {
  text-align: center;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}
.hash {
  font-family: monospace;
  margin: 0 0.5rem;
}
button {
  background: #f3f4f6;
  border: none;
  border-radius: 4px;
  padding: 2px 8px;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 0.9em;
}
button:hover {
  background: #e5e7eb;
}
</style> 