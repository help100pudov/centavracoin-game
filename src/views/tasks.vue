<template>
    <div class="p-1 pl-4 pr-4">
        <div class="card p-3">
            <h2 class="text-center mt-1">{{ $t("Complete tasks") }}</h2>
            <div class="text-center fs-12px text-light p-1">{{ $t("Earn Centa coins, which can be used to purchase in-game bonuses, exclusive cards, or exchange for real money") }}</div>
        </div>
        <div class="card p-5 mt-4 d-none">
            <h5>{{ $t("Daily") }} <span class="text-light">0</span></h5>
            <div class="fs-12px text-light mt-2 mb-2">{{ $t("Play the mini-game and search for the Centa coin to get extra rewards") }}</div>
            <div v-if="app.quests.daily.length" class="mt-4"></div>
            <div v-else class="card text-center p-4 mt-4">{{ $t("Not found") }}</div>
        </div>

        <div class="card p-5 mt-4">
            <h4>{{ $t("List of tasks") }} <span class="text-light">{{ $num(app.quests.tasks.length) }}</span></h4>
            <div class="fs-12px text-light mt-2 mb-2">{{ $t("Complete tasks and additionally earn Centa coins, which can be used to purchase in-game bonuses, exclusive cards, or exchange for real money. Each completed quest brings you closer to your goal") }}</div>
            <div v-if="app.quests.tasks" class="mt-4">
                <div class="flexBetween p-3 mt-1" v-for="(val, key) in app.quests.tasks" :key="key" @click="taskModal(key)">
                    <div class="flexCenter">
                        <div><img :src="`/media/social/${val.net}.webp`" class="icon x38" /></div>
                        <div class="ml-3">
                            <h6>{{ $t(val.title) }}</h6>
                            <div class="fs-14px text-light">+{{ val.prize }} <i class="icon i-centa x16"></i></div>
                        </div>
                    </div>
                    <div class="">
                        <div v-if="val.status != 2" class="btn p-2 pl-4 pr-4">{{ $t("Start") }}</div>
                        <div v-else class=""><i class="bi bi-check-lg fs-22px"></i></div>
                    </div>
                </div>
            </div>
            <div v-else class="card text-center p-4 mt-4">{{ $t("Not found") }}</div>
        </div>

        <Modal :id="'taskModal'">
            <div class="text-center fs-16px p-4 pt-6" v-if="task?.id">
                <div class="mb-3"><img :src="`/media/social/${task.net}.webp`" class="icon x54" /></div>
                <h5>{{ $t(task.title) }}</h5>
                <div class="mt-2">{{ $t(task.info) }}</div>
                <div class="flexCenter text-write mt-4 mb-3">
                    <i class="icon x26 i-centa ml-2 mr-1"></i>
                    <h5>+{{ $num(task.prize) }}</h5>
                </div>
                <div class="col1 text-center mt-5 mb-2" v-if="task.status != 2">
                    <a :href="task.url" @click="goQuest()" target="_blank" class="btn claim text-up text-white p-3">{{ $t("Go") }}</a>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script>
export default {
    name: "Tasks",
    data() {
        return {
            task: {},
        };
    },
    created() {},
    computed: {},
    mounted() {
        this.$store.dispatch('fetchUserData');
    },
    methods: {
        taskModal(key) {
            this.task = this.app.quests.tasks[key];
            // if (this.task.status != 2)
            this.$modal("taskModal");
        },
        async goQuest() {
            let key = this.app.quests.tasks.findIndex((item) => item.id == this.task.id);

            const response = await this.$post("/quests", {act: "go", id: this.task.id});
            if (response == "go") {
                this.app.quests.tasks[key].status = 2;
                this.user.centa += Number(this.task.prize);
                this.$store.dispatch("updateUser", {centa: this.user.centa});
                this.$modal("taskModal");
            }
        },
    },
};
</script>
