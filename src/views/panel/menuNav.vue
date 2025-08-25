<template>
  <div class="p-3">
    <div class="d-flex">
      <router-link to="/panel" class="text-center p-2 mr-2">
        <div><i class="bi bi-gear text-white fs-20px"></i></div>
        <div class="fs-14px">{{ $t("Home") }}</div>
      </router-link>
      <router-link to="/panel/users" class="text-center p-2 mr-2">
        <div><i class="bi bi-people text-white fs-20px"></i></div>
        <div class="fs-14px">{{ $t("Users") }}</div>
      </router-link>
      <router-link to="/panel/tasks" class="text-center p-2 mr-2">
        <div><i class="bi bi-card-checklist text-white fs-20px"></i></div>
        <div class="fs-14px">{{ $t("Tasks") }}</div>
      </router-link>
    </div>
    <hr />
  </div>
</template>
