<template>
    <div>
        <div class="card p-4">
            <div class="flexBetween g-2">
                <div class="card d-flex items-center p-2 w-100">
                    <div style="width: 20px">
                        <img src="../assets/images/game/resources/copper.png" />
                    </div>
                    <div class="ml-2">{{ $num(user.copper) }}</div>
                </div>
                <div class="card d-flex items-center p-2 w-100">
                    <div style="width: 20px">
                        <img src="../assets/images/game/resources/gold.png" />
                    </div>
                    <div class="ml-2">{{ $num(user.gold) }}</div>
                </div>
                <div class="card d-flex items-center p-2 w-100">
                    <div style="width: 20px">
                        <img src="../assets/images/game/resources/silver.png" />
                    </div>
                    <div class="ml-2">{{ $num(user.silver) }}</div>
                </div>
                <div class="card d-flex items-center p-2 w-100">
                    <div style="width: 20px">
                        <img src="../assets/images/game/resources/iron.png" />
                    </div>
                    <div class="ml-2">{{ $num(user.iron) }}</div>
                </div>
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
    name: "base",
    data() {
        return {};
    },
    computed: {},
    methods: {
        async submitEdit(e) {
            const response = await this.$post(e, "submit");
            this.$modal("editModal");
        },
    },
};
</script>
