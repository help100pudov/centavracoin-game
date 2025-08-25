<template>
  <transition name="modal-slide-up">
    <div v-if="type == 1" class="modal fade" :id="id" aria-modal="true" role="dialog" @click="this.$modal(id)">
      <div class="modal-dialog" role="document" :class="height">
        <div class="modal-content">
          <a v-show="close" @click="this.$modal(id)" class="close" aria-label="Close"><em class="bi bi-x-circle-fill"></em></a>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="modalb fade" role="dialog" @click="this.$modal(id)" :id="id">
      <div class="modalb-dialog" role="document" @click.stop :class="style">
        <div class="modalb-content" >
          <a v-show="close" @click="this.$modal(id)" class="close" data-bs-dismiss="modal"><em class="bi bi-x-circle-fill"></em></a>
          <div class="modalb-body modalb-body-md">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
    },
    type: {
      default: false,
    },
    close: {
      default: true,
    },
    style: {
      default: '',
    },
  },
};
</script>

<style scoped>
.modalb {
  visibility: hidden;
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.8);
  transition: opacity 0.3s ease, visibility 0s 0.3s;
  z-index: 99999;
}

.modalb.show {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.modalb-dialog {
  background: radial-gradient(circle, rgb(9 14 16) 0%, rgb(7 8 12) 100%);
  border-radius: 20px 20px 0 0;
  border-top: 3px solid #00e2ff7d;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
  width: 100%;
  max-width: 500px;
  min-height: 20%;
  max-height: 100%;
  transition: transform 0.2s ease-in-out;
  overflow: hidden;
}

.modalb.show .modalb-dialog {
  transform: translate(-50%, 0);
}

.modalb-content {
  height: 100%;
}

.modalb-content .close {
  position: absolute;
  right: 0px;
  padding: 2px 6px;
  font-size: 25px;
}

.full { height: 100vh;}
</style>
