<template>
  <div class="p-4 text-center">
    <h2>Произошла ошибка</h2>
    <p>{{ $route.query.message || 'Неизвестная ошибка' }}</p>
    <button @click="$router.push('/')" class="btn">Вернуться на главную</button>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
};
</script>