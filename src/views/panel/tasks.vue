<template>
  <menuNav />

  <div class="pl-3 pr-3">
    <div class="navMenu">
      <a @click="mod = ''" class="link" :class="{ on: mod == '' }">{{ $t("Tasks") }}</a>
      <a @click="mod = 'media'" class="link" :class="{ on: mod == 'media' }">{{ $t("Media") }}</a>
    </div>

    <div class="d-flex pt-2">
      <button v-if="mod == 'media'" @click="$modal('newMediaModal')" class="btn text-up text-white">{{ $t("Create") }}</button>
      <button v-else @click="editItem()" class="btn text-up text-white">{{ $t("Create") }}</button>
    </div>
  </div>

  <div class="pr-3 pl-3 pb-2">
    <div v-show="mod == 'media'">
      <div class="card flexBetween p-3 mt-3" v-for="(val, key) in network" :key="key" @click="delMedia(key)">
        <div class="flexCenter">
          <div class="mr-4"><img :src="`/media/social/${val}`" class="icon x44" /></div>
          <h6 class="pl-2">{{ val }}</h6>
        </div>
      </div>
    </div>

    <div v-show="mod == ''">
      <div class="card flexBetween p-3 mt-3" v-for="(val, key) in data" :key="key">
        <div class="flexCenter" @click="editItem(key)">
          <div class=""><img :src="`/media/social/${val.net}.webp`" class="icon x44" /></div>
          <div class="pl-4">
            <h6>{{ val.type }}</h6>
            <div class="text fs-12px mt-1">{{ val.title }}</div>
          </div>
        </div>
        <div class="d-flex items-center">
          <a @click="movePoz(val.id, 'up')" class="p-1"><i class="bi bi-arrow-up fs-20px"></i></a>
          <a @click="movePoz(val.id, 'down')" class="p-1"><i class="bi bi-arrow-down fs-20px"></i></a>
        </div>
      </div>
    </div>
  </div>

  <Modal :id="'questEdit'">
    <form @submit.prevent="deleteItem" id="/panel/tasks" class="p-4 pb-1" v-show="edit?.id">
      <input type="hidden" name="act" value="delete" required />
      <input type="hidden" name="quest" :value="edit.id" required />
      <div class="w-50 m-auto">
        <button type="submit" class="btn delete p-2">{{ $t("Delete") }}</button>
      </div>
    </form>
    <form @submit.prevent="submitEdit" id="/panel/tasks" class="p-5 pt-3">
      <input type="hidden" name="act" value="edit" required />
      <input type="hidden" name="quest" :value="edit.id" required />

      <div>
        <label class="fw-600">{{ $t("Title") }}</label>
        <div class="mt-2">
          <input type="text" name="title" :value="edit.title" />
        </div>
      </div>
      <div class="mt-3">
        <label class="fw-600">{{ $t("Info") }}</label>
        <div class="mt-2">
          <textarea class="w-100" name="info" rows="4" :value="edit.info"></textarea>
        </div>
      </div>
      <div class="mt-3">
        <label class="fw-600">{{ $t("Network") }}</label>
        <div class="mt-2">
          <select class="" name="net">
            <option v-for="(val, key) in network" :key="key" :selected="val.split('.')[0] == edit.net" :value="val.split('.')[0]">{{ val.split('.')[0] }}</option>
          </select>
        </div>
      </div>
      <div class="mt-3">
        <label class="fw-600">{{ $t("Type") }}</label>
        <div class="mt-2">
          <select class="" name="type">
            <option v-for="(val, key) in type" :key="key" :selected="val == edit.type" :value="val">{{ val }}</option>
          </select>
        </div>
      </div>
      <div class="mt-3">
        <label class="fw-600">{{ $t("Url") }}</label>
        <div class="mt-2">
          <input type="text" class="" name="url" :value="edit.url" />
        </div>
      </div>
      <div class="mt-3">
        <label class="fw-600">{{ $t("Prize") }}</label>
        <div class="mt-2">
          <input type="number" class="" name="prize" :value="edit.prize" required />
        </div>
      </div>

      <div class="mt-4">
        <button type="submit" class="btn claim">{{ $t("Save") }}</button>
      </div>
    </form>
  </Modal>

  <Modal :id="'newMediaModal'">
    <form @submit.prevent="uploadFile" id="/upload" class="p-4 pt-5">
      <input type="hidden" name="dir" value="social" />
      <div class="p-2 fs-16px text-center">
        {{ $t("Upload an image in WEBP format with a maximum size of 200x200 pixels") }}
      </div>
      <div class="form-file text-center mt-3">
        <input class="form-file-input" type="file" name="file" ref="fileInput" @change="uploadFile($event)" />
        <label type="submit" class="form-file-label" for="customFile">Choose file</label>
      </div>
    </form>
  </Modal>

  <Modal :id="'delMediaModal'">
    <form @submit.prevent="deleteFile" id="/upload" class="p-4 pb-1">
      <input type="hidden" name="act" value="delete" required />
      <input type="hidden" name="dir" value="social" />
      <input type="hidden" name="file" :value="network[file]" />
      <div class="w-50 m-auto">
        <button type="submit" class="btn delete p-2">{{ $t("Delete file") }}</button>
      </div>
    </form>
  </Modal>
</template>

<script>
import menuNav from "./menuNav.vue";
export default {
  components: { menuNav },
  data() {
    return {
      mod: "",
      cat: null,
      editKey: null,
      edit: "",
      file: '',
      data: {},
      type: ["Join", "Share", "Follow", "Send", "Like", "Visit", "Connect wallet"],
      network: {},
    };
  },
  created() {
    this.loadContent();
  },
  methods: {
    async loadContent() {
      const response = await this.$post("/panel/tasks");
      if (response?.quests) {
        this.data = response.quests;
        this.network = response.network;
      }
    },
    async uploadFile(event) {
      const response = await this.$post(event, "file");
      if (response && response.file) {
        this.network.push(response.file);
        this.$modal("newMediaModal");
      }
      const input = this.$refs.fileInput;
      input.value = "";
    },
    editItem(key = null) {
      this.edit = this.data[key] || {};
      this.$modal("questEdit");
    },
    delMedia(key) {
      this.file = key;
      this.$modal("delMediaModal");
    },
    async submitEdit(e) {
      const response = await this.$post(e, "submit");
      if (response?.quests) {
        this.data = response.quests;
        this.edit = {};
        this.$modal("questEdit");
      }
    },
    async movePoz(key, type) {
      const response = await this.$post("/panel/tasks", {act: "move", quest: key, type: type});
      if (response?.quests) {
        this.data = response.quests;
      }
    },
    async deleteItem(e) {
      const response = await this.$post(e, "submit");
      if (response?.quests) {
        this.data = response.quests;
        this.$modal("questEdit");
      }
    },
    async deleteFile(e) {
      const response = await this.$post(e, "submit");
      this.network.splice(this.file, 1);
      this.$modal("delMediaModal");
    },
  },
};
</script>
