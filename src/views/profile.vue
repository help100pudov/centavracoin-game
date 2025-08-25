<template>
    <div class="">
        <div class="flexBetween pl-5 pr-5">
            <div class="">
                
            </div>
            <div class="flexCenter g-5">
                <div class=""><button @click="$modal('editModal')" class="card p-3">{{ $t("Change") }}</button></div>
                <div class=""><a class="card p-3" @click="$modal('langModal')"><i class="bi bi-globe2 fs-16px"></i></a></div>
            </div>
        </div>
        <div class="flexCenter pt-5">
            <div class="">
                <div class="br-50"><img src="/media/profile/1.webp" class="br-50" /></div>
                <div class="">
                    <h5 class="text-center p-1">{{ user.first }} {{ user.last.charAt(0, 8) }}</h5>
                </div>
            </div>
        </div>

        <div class="p-5">
            <h5>{{ $t("More about you") }}</h5>
            <div class="card flexBetween p-4 mt-2">
                <div class="flexCenter g-3">
                    <div class=""><i class="bi bi-trophy fs-22px"></i></div>
                    <div class="">{{ $t("Rank") }}:</div>
                </div>
                <div class="">{{ $num(app.top?.centaYou) }}</div>
            </div>
            <div class="card flexBetween p-4 mt-3">
                <div class="flexCenter g-3">
                    <div class=""><i class="bi bi-people fs-22px text-white"></i></div>
                    <div class="">{{ $t("Invited friends") }}:</div>
                </div>
                <div class="">{{ $num(user.refAll) }}</div>
            </div>
        </div>

        <Modal :id="'editModal'">
            <form @submit.prevent="submitEdit" id="/profile" class="p-5 pt-3">
                <input type="hidden" name="act" value="edit" />
                <div class="mt-3">
                    <label class="fw-600">{{ $t("First name") }}</label>
                    <div class="mt-2">
                        <input type="text" class="" name="first" v-model="user.first" />
                    </div>
                </div>
                <div class="mt-3">
                    <label class="fw-600">{{ $t("Last name") }}</label>
                    <div class="mt-2">
                        <input type="text" class="" name="last" v-model="user.last" />
                    </div>
                </div>
                <div class="mt-4">
                    <button type="submit" class="btn claim">{{ $t("Save") }}</button>
                </div>
            </form>
        </Modal>
    </div>
</template>

<script>
export default {
    name: "profile",
    data() {
        return {};
    },
    computed: {},
    mounted() {
        this.$store.dispatch('fetchUserData');
    },
    methods: {
        async submitEdit(e) {
            const response = await this.$post(e, "submit");
            this.$modal("editModal");
        },
    },
};
</script>
s
