<template>
  <transition name="dropdown">
    <div class="dropdown" :class="{'show': show}" ref="dropdown">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Dropdown',
  data() {
    return {
      show: false
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClick);
  },
  methods: {
    handleClick(event) {
      if(this.$refs.dropdown){
        const dropdownToggle = this.$refs.dropdown.querySelector('.dropdown-toggle');
        if (dropdownToggle && dropdownToggle.contains(event.target)) {
          // Если клик произошел на dropdown-toggle внутри dropdown
          this.toggleDrop();
        } else if (this.show && !this.$refs.dropdown.contains(event.target)) {
          // Если выпадающее окно открыто и клик произошел вне компонента
          this.closeDrop();
        }
      }
    },
    toggleDrop() {
      this.show = !this.show;
    },
    closeDrop() {
      this.show = false;
    }
  }
};
</script>