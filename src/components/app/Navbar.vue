<template>
    <div>
        <div class="navbar">
            <div class="w-100">
                <div class="flexBetween g-3">
                    <div class="card resource d-flex items-center pl-1 pr-1 w-100 fs-12px">
                        <div style="width: 16px">
                            <img src="@/assets/images/game/resources/copper.png" />
                        </div>
                        <div class="ml-2">{{ $num(user.copper, 1) }}</div>
                    </div>
                    <div class="card resource d-flex items-center pl-1 pr-1 w-100 fs-12px">
                        <div style="width: 16px">
                            <img src="@/assets/images/game/resources/gold.png" />
                        </div>
                        <div class="ml-2">{{ $num(user.gold, 1) }}</div>
                    </div>
                    <div class="card resource d-flex items-center pl-1 pr-1 w-100 fs-12px">
                        <div style="width: 16px">
                            <img src="@/assets/images/game/resources/silver.png" />
                        </div>
                        <div class="ml-2">{{ $num(user.silver, 1) }}</div>
                    </div>
                    <div class="card resource d-flex items-center pl-1 pr-1 w-100 fs-12px">
                        <div style="width: 16px">
                            <img src="@/assets/images/game/resources/iron.png" />
                        </div>
                        <div class="ml-2">{{ $num(user.iron, 1) }}</div>
                    </div>
                </div>
            </div>
        </div>

        <Modal :id="'langModal'">
            <div class="p-6 pb-3" style="max-height: 400px; overflow-y: auto;">
                <button class="card w-100 br-9 p-3 pl-6 pr-6 mt-1 mb-1" v-for="(val, key) in lang" :key="key" @click="sendLang(key)">
                    <div class="flexBetween w-100">
                        <div class="fs-18px fw-800">{{ $t(val) }}</div>
                        <div class=""><i v-show="user.lang == key" class="bi bi-check-lg fs-24px text-green"></i></div>
                    </div>
                </button>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    data() {
        return {
            gaid: 1,
            lang: {
                en: "English",
                uk: "Українська",
                ru: "Русский",
                ar: "العربية",
                de: "Deutsch",
                es: "Español",
                fr: "Français",
                hi: "हिन्दी",
                ja: "日本語",
                ko: "한국어",
                zh: "中文",
                bg: "Български",
                bn: "বাংলা",
                cs: "Čeština",
                el: "Ελληνικά",
                fa: "فارسی",
                fi: "Suomi",
                he: "עברית",
                hr: "Hrvatski",
                hu: "Magyar",
                hy: "Հայերեն",
                it: "Italiano",
                ka: "ქართული",
                ms: "Bahasa Melayu",
                nl: "Nederlands",
                no: "Norsk",
                pl: "Polski",
                pt: "Português",
                ro: "Română",
                sk: "Slovenčina",
                sl: "Slovenščina",
                sr: "Српски",
                sv: "Svenska",
                sw: "Kiswahili",
                th: "ไทย",
                tl: "Tagalog",
                tr: "Türkçe",
                ur: "اردو",
                vi: "Tiếng Việt",
                am: "አማርኛ"
            },
        };
    },
    mounted() {
        window.addEventListener("mousedown", this.handleMouseDown);
        if (Math.floor(Math.random() * 100) + 1 > 75 && this.user.gaid == 0) {
            this.$modal("joinModal");
        }
    },
    methods: {
        async gaidShow(key) {
            this.gaid = 1;
            this.$modal("gaidModal");
            if (this.user.gaid == 0) {
                const response = await this.$post("/main", {act: "gaid"});
                this.$store.dispatch("updateUser", {gaid: 1});
            }
        },
        sendLang(lang) {
            if (lang == "en" || (this.$i18n.messages[lang] && Object.keys(this.$i18n.messages[lang]).length > 0)) {
                const response = this.$post("/main", {act: "lang", lang: lang});
                this.$i18n.locale = lang;
                this.$store.dispatch("updateUser", {lang: lang});
            } else {
                this.$i18n.locale = "en";
                this.$i18n.silentFallbackWarn = true;
            }
            this.$modal("langModal");
        },
        async logOut() {
            this.$router.push("/");
            this.$cookies.set("token", "");
            this.$store.dispatch("userOut");
        },
    },
};
</script>

<style scoped>
.resource {
    height: 35px;
}
</style>
