<template>
  <div class="max-w-xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded-2xl shadow-xl">
    <h2 class="text-2xl font-bold mb-6 text-center">💸 Пополнить баланс CENTA</h2>
    <form action="https://21mln.xyz/pay/123pay.php" method="post" class="space-y-6">
      <div>
        <label class="block mb-1 text-sm">Ваш TON-адрес</label>
        <input type="text" name="wallet" placeholder="UQA..." required
               class="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600">
      </div>
      <div>
        <label class="block mb-1 text-sm">Сумма (в CENTA)</label>
        <input type="number" name="amount" value="1" min="0.1" step="0.01" required
               class="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600">
      </div>
      <button type="submit"
              class="w-full py-3 text-center bg-green-500 hover:bg-green-600 text-white rounded font-semibold text-lg">
        🚀 Оплатить через TON
      </button>
    </form>
    <p class="mt-6 text-center text-sm text-gray-400">После оплаты токены будут отправлены на ваш адрес.</p>
  </div>
</template>

<script>
export default {
  name: "Pay"
};
</script>