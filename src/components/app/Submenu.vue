<template>
  <transition name="dropdown">
    <div class="nk-header-menu mobile-menu">
      <ul class="nk-menu nk-menu-main">
        <li class="nk-menu-item has-sub">
          <a class="nk-menu-link nk-menu-toggle">{{ $t('Marketplace') }}</a>
          <ul class="nk-menu-sub">
            <li class="nk-menu-item"><router-link to="/store/" class="nk-menu-link">{{ $t('Category') }}</router-link></li>
            <li class="nk-menu-item"><router-link to="/store/collection" class="nk-menu-link">{{ $t('Collections') }}</router-link></li>
            <li class="nk-menu-item"><router-link to="/store/item" class="nk-menu-link">{{ $t('Items') }}</router-link></li>
          </ul>
        </li>
        <li class="nk-menu-item"><router-link to="/nft/" class="nk-menu-link">{{ $t('News') }} </router-link></li>
      </ul>
    </div>
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
      const dropdownToggle = this.$refs.dropdown.querySelector('.dropdown-toggle');
      if (dropdownToggle && dropdownToggle.contains(event.target)) {
        // Если клик произошел на dropdown-toggle внутри dropdown
        this.toggleDrop();
      } else if (this.show && !this.$refs.dropdown.contains(event.target)) {
        // Если выпадающее окно открыто и клик произошел вне компонента
        this.closeDrop();
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
