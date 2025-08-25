<template>
    <a tabindex="-1" class="form-icon form-icon-right passcode-switch lg" @click="switchToggle">
      <i v-show="!swith" class="bi bi-eye fs-16px"></i>
      <i v-show="swith" class="bi bi-eye-slash fs-16px"></i>
    </a>
</template>

<script>
export default {
  name: 'Swinput',
  props: {
    placeholder: String,
    autocomplete: String,
    name: String,
    input: String,
    style: Object
  },
  data() {
    return {
      swith: true
    };
  },
  computed: {
    inputType() {
      return this.swith ? 'text' : 'password';
    }
  },
  methods: {
    switchToggle() {
      this.swith = !this.swith;
    }
  }
};
</script>
