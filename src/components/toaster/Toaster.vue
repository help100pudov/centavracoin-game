<template>
  <transition
    :enter-active-class="transition.enter"
    :leave-active-class="transition.leave"
  >
    <div
      v-show="isActive"
      :class="['toaster', `${type}`, `${position}`]"
      @mouseover="toggleTimer(true)"
      @mouseleave="toggleTimer(false)"
      @click="click"
      role="alert"
      v-html="message"
    />
  </transition>
</template>

<script>
import { removeElement } from './helpers/remove-element'
import Timer from './helpers/timer'
import eventBus from './helpers/event-bus'
import Positions, { definePosition } from './defaults/positions'

export default {
  name: 'toast',
  props: {
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'default'
    },
    position: {
      type: String,
      default: 'top'
    },
    maxToasts: {
      type: [Number, Boolean],
      default: false
    },
    duration: {
      type: [Number, Boolean],
      default: 5000
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    queue: {
      type: Boolean,
      default: false
    },
    pauseOnHover: {
      type: Boolean,
      default: true
    },
    useDefaultCss: {
      type: Boolean,
      default: true
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    onClick: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isActive: false,
      parentTop: null,
      parentBottom: null,
      isHovered: false,
      timer: null
    }
  },
  beforeMount() {
    this.createParents()
    this.setDefaultCss()
    this.setupContainer()
  },
  mounted() {
    this.showNotice()
    eventBus.$on('toast-clear', this.close)
    eventBus.$on('toast', this.showToast)
  },
  methods: {
    createParents() {
      this.parentTop = document.querySelector('.toaster-container.top');
      this.parentBottom = document.querySelector('.toaster-container.bottom');

      if (this.parentTop && this.parentBottom) return

      if (!this.parentTop) {
        this.parentTop = document.createElement('div')
        this.parentTop.className = 'toaster-container top'
      }

      if (!this.parentBottom) {
        this.parentBottom = document.createElement('div')
        this.parentBottom.className =
          'toaster-container bottom'
      }
    },
    setDefaultCss() {
      const type = this.useDefaultCss ? 'add' : 'remove'
    },
    setupContainer() {
      const container = document.body;
      container.appendChild(this.parentTop);
      container.appendChild(this.parentBottom);

      // Добавляем стили к созданным контейнерам
      this.parentTop.classList.add('toaster-container', 'top');
      this.parentBottom.classList.add('toaster-container', 'bottom');
    },
    shouldQueue() {
      if (!this.queue && this.maxToasts === false) {
        return false
      }

      if (this.maxToasts !== false) {
        return (
          this.maxToasts <=
          this.parentTop.childElementCount + this.parentBottom.childElementCount
        )
      }

      return (
        this.parentTop.childElementCount > 0 ||
        this.parentBottom.childElementCount > 0
      )
    },
    showNotice() {
      if (this.shouldQueue()) {
        this.queueTimer = setTimeout(this.showNotice, 250)
        return
      }

      this.correctParent.insertAdjacentElement('afterbegin', this.$el)
      this.isActive = true

      this.timer =
        this.duration !== false ? new Timer(this.close, this.duration) : null
    },
    click() {
      this.onClick.apply(null, arguments)

      if (this.dismissible) {
        this.close()
      }
    },
    toggleTimer(newVal) {
      if (this.timer && this.pauseOnHover) {
        newVal ? this.timer.pause() : this.timer.resume()
      }
    },
    stopTimer() {
      this.timer && this.timer.stop()
      clearTimeout(this.queueTimer)
    },
    close() {
      this.stopTimer()
      this.isActive = false
      setTimeout(() => {
        this.onClose.apply(null, arguments)
        removeElement(this.$el)
      }, 150)
    },
    showToast({ message, type = 'default', duration = 5000, position = 'top' }) {
      this.message = message;
      this.type = type;
      this.duration = duration;
      this.position = position;
      this.isActive = false; // сброс, если уже показывается
      this.$nextTick(() => {
        this.showNotice();
      });
    }
  },
  computed: {
    correctParent() {
      return definePosition(this.position, this.parentTop, this.parentBottom)
    },
    transition() {
      return definePosition(
        this.position,
        {
          enter: 'toaster-fade-in-down',
          leave: 'toaster-fade-out'
        },
        {
          enter: 'toaster-fade-in-up',
          leave: 'toaster-fade-out'
        }
      )
    }
  },
  beforeUnmount() {
    eventBus.$off('toast-clear', this.close)
  }
}
</script>

<style>
.toaster {
  display: grid;
  border: 1px solid #393b3f;
  align-items: center;
  animation-duration: 150ms;
  margin: 0.5em 0;
  border-radius: 0.5em;
  pointer-events: auto;
  color: #fff;
  cursor: pointer;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  padding: 0.7em 2.2em;
  word-break: break-word;
  font-weight: bold;
}

.toaster-container {
  position: fixed;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5em;
  overflow: hidden;
  z-index: 99999999;
  pointer-events: none;
}

.toaster-container.top {
  flex-direction: column;
}

.toaster-container.bottom {
  flex-direction: column-reverse;
}

@media screen and (max-width: 768px) {
  .toaster-container {
    padding: 0;
    position: fixed !important;
  }
}

@keyframes toaster-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.toaster-fade-out {
  animation-name: toaster-fade-out;
}

@keyframes toaster-fade-in-down {
  from {
    opacity: 0.5;
    transform: translate3d(0, -100%, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.toaster-fade-in-down {
  animation-name: toaster-fade-in-down;
}

@keyframes toaster-fade-in-up {
  from {
    opacity: 0.5;
    transform: translate3d(0, 100%, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.toaster-fade-in-up {
  animation-name: toaster-fade-in-up;
}

/* VUE */

.toaster-fade-enter-active {
  transition: opacity 300ms ease-in;
}

.toaster-fade-leave-active {
  transition: opacity 150ms ease-out;
}

.toaster-fade-enter,
.toaster-fade-leave-to {
  opacity: 0;
}

.toaster.default { background-color: #2c2d2fb9; border: 1px solid #393b3f;}
.toaster.success { background-color: #28a745ab; border: 1px solid #1d893d;}
.toaster.info { background-color: #2c2d2fb9; border: 1px solid #393b3f;}
.toaster.warning { background-color: #ffc107; border: 1px solid #393b3f;}
.toaster.error { background-color: #dc3546b2; border: 1px solid #a11d2a;}

.toaster.top, .toaster.bottom { align-self: center; }
.toaster.top-start { align-self: start; }
.toaster.top-end { align-self: end; }



</style>

