<template>
    <div class="sidebar">
        <router-link to="/" class="link" :class="{active: this.$route.name == 'home'}">
            <i class="bi bi-house-door fs-24px"></i>
            <div class="mt-1">{{ $t("Home") }}</div>
        </router-link>
        <router-link to="/tasks" class="link" :class="{active: this.$route.name == 'tasks'}">
            <i class="bi bi-list-task fs-24px"></i>
            <div class="mt-1">{{ $t("Tasks") }}</div>
        </router-link>
        <router-link to="/friends" class="link" :class="{active: this.$route.name == 'friends'}">
            <i class="bi bi-people fs-24px"></i>
            <div class="mt-1">{{ $t("Friends") }}</div>
        </router-link>
        <router-link to="/top" class="link" :class="{active: this.$route.name == 'friends'}">
            <i class="bi bi-trophy fs-22px"></i>
            <div class="mt-1">{{ $t('Top') }}</div>
        </router-link>
        <router-link to="/profile" class="link" :class="{active: this.$route.name == 'friends'}">
            <i class="bi bi-person-circle fs-22px"></i>
            <div class="mt-1">{{ $t('Profile') }}</div>
        </router-link>
    </div>
</template>

<script>
export default {
    data() {
        return {
            date: new Date(),
        };
    },
    methods: {
        lang(lang) {
            this.$cookies.set("lang", lang, {
                path: "/",
                secure: true,
                sameSite: "strict",
            });

            if (Object.keys(this.$i18n.messages[lang]).length > 0) {
                this.$i18n.locale = lang;
            } else {
                this.$i18n.locale = "en";
                this.$i18n.silentFallbackWarn = true;
            }
            this.$modal("langModal");
        },
    },
};
</script>
