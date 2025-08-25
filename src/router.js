import { createRouter, createWebHistory } from "vue-router";
import store from "./store";
import { GlobalMethods } from "./global/main.js";


const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("./views/home.vue"),
        meta: {},
    },
    {
        path: "/card",
        name: "card",
        component: () => import("./views/card.vue"),
        meta: {},
    },
    {
        path: "/base",
        name: "base",
        component: () => import("./views/base.vue"),
        meta: {},
    },
    {
        path: "/friends",
        name: "friends",
        component: () => import("./views/friends.vue"),
        meta: {},
    },
    {
        path: "/game",
        name: "game",
        component: () => import("./views/game.vue"),
        meta: {},
    },
    {
        path: "/tasks",
        name: "tasks",
        component: () => import("./views/tasks.vue"),
        meta: {},
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("./views/profile.vue"),
        meta: {},
    },
    {
        path: "/top",
        name: "top",
        component: () => import("./views/top.vue"),
        meta: {},
    },
    {
        path: "/panel",
        name: "panel",
        component: () => import("./views/panel/main.vue"),
        meta: { auth: true, panel: true },
    },
    {
        path: "/panel/users",
        name: "panel/users",
        component: () => import("./views/panel/users.vue"),
        meta: { auth: true, panel: true },
    },
    {
        path: "/panel/tasks",
        name: "panel/tasks",
        component: () => import("./views/panel/tasks.vue"),
        meta: { auth: true, panel: true },
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // Используем import.meta.env.BASE_URL
    routes,
});

// Глобальная проверка версии приложения
let versionChecked = false;
async function checkAppVersionOnRoute() {
    try {
        const res = await fetch('/version.json', { cache: 'no-store' });
        const data = await res.json();
        const currentVersion = data.version;
        const localVersion = localStorage.getItem('app_version');
        if (localVersion && localVersion !== currentVersion) {
            localStorage.setItem('app_version', currentVersion);
            location.reload(true);
            return false;
        } else if (!localVersion) {
            localStorage.setItem('app_version', currentVersion);
        }
        return true;
    } catch (e) {
        return true;
    }
}

router.beforeEach(async (to, from, next) => {
    // Проверка версии приложения (только один раз за сессию)
    if (!versionChecked) {
        versionChecked = true;
        const ok = await checkAppVersionOnRoute();
        if (!ok) return; // reload уже вызван
    }

    const waitForDataLoaded = () => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.error('Authentication timeout');
                reject(new Error('Authentication timeout'));
            }, 10000); // 10 second timeout

            const unwatch = store.watch(
                (state, getters) => getters.app.auth,
                (newValue) => {
                    if (newValue === true) {
                        clearTimeout(timeout);
                        unwatch();
                        resolve();
                    }
                },
            );
        });
    };

    // Если данные пользователя уже загружены, продолжаем навигацию
    if (store.getters.app.auth) {
        return next();
    }

    // В противном случае ждем загрузку данных пользователя
    try {
        await waitForDataLoaded();
        next(); // Продолжаем навигацию после успешной загрузки данных
    } catch (error) {
        console.error('Authentication error:', error);
        // Force load to true to prevent app from hanging
        if (store.state.app) {
            store.state.app.auth = true;
        }
        next(); // Continue navigation even on error
    }
});

router.beforeResolve((to, from, next) => {
    const requireAuth = to.meta.auth || false;
    const admin = to.meta.panel || false;

    window.scrollTo(0, 0);
    GlobalMethods.$modal();

    if ((requireAuth && !store.getters.app.auth) || (admin && !store.getters.user?.prava)) {
        next(false);
    } else {
        next();
    }
});

export default router;
