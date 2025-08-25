<template>
  <div class="slider-block">
    <div class="slider" :class="style" ref="slider">
      <div
        ref="sliderTrack"
        class="slides m-auto"
        :style="{
          width: totalWidth + 'px',
          transform: `translateX(-${currentOffset}px)`,
          transition: isInitialized ? `transform ${time}s ease-in-out` : '',
          'pointer-events': isSwipe ? 'none' : 'auto',
        }"
      >
        <slot></slot>
      </div>
    </div>

    <div class="slickNavBottom mt-2" v-if="navBottom && slides > 0">
      <div v-for="key in slides" :key="key" class="line" :class="{ on: key - 1 == scrollCount }" @click="scroll(key - 1)"></div>
    </div>

    <button v-if="showNav" class="slick-prev" @click="scroll(scrollCount - 1)">
      <i class="bi bi-caret-left fs22px"></i>
    </button>
    <button v-if="showNav" class="slick-next" @click="scroll(scrollCount + 1)">
      <i class="bi bi-caret-right fs22px"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    minSlideWidth: {
      type: Number,
      default: 100,
    },
    maxSlideWidth: {
      type: Number,
      default: 500,
    },
    slidesToShow: {
      type: Number,
      default: 1,
    },
    showNav: {
      type: Boolean,
      default: false,
    },
    navBottom: {
      type: Boolean,
      default: false,
    },
    scrollAmount: {
      type: Number,
      default: 0,
    },
    timer: {
      type: Number,
      default: 0.3,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    autoPlayInterval: {
      type: Number,
      default: 5,
    },
    style: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      slides: 0,
      currentOffset: 0,
      slideWidth: this.minSlideWidth,
      slidesShow: this.slidesToShow,
      totalWidth: 0,
      containerWidth: 0,
      scrolls: 1,
      time: 0,
      slideIndex: 0,
      posInit: 0,
      posX1: 0,
      posX2: 0,
      posY1: 0,
      posY2: 0,
      isSwipe: false,
      isScroll: false,
      allowSwipe: true,
      transition: true,
      autoPlayIntervalId: null,
      scrollCount: 1,
      isInitialized: false,
    };
  },
  mounted() {
    this.start();
    if (this.autoPlay) {
      this.startAutoPlay();
    }
    window.addEventListener("resize", this.start);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.start);
    this.stopAutoPlay();
  },
  methods: {
    startAutoPlay() {
      this.autoPlayIntervalId = setInterval(() => {
        this.scroll(1);
      }, this.autoPlayInterval * 1000);
    },
    stopAutoPlay() {
      clearInterval(this.autoPlayIntervalId);
    },
    start() {
      if (this.$refs.slider) {
        this.slides = this.slidesCount;
        this.time = this.timer;
        this.containerWidth = this.$refs.slider.offsetWidth;
        this.slideWidth = Math.min(this.maxSlideWidth, Math.floor(this.containerWidth / this.slidesShow));
        this.totalWidth = this.slideWidth * this.slidesCount;

        this.scroll(this.scrollAmount);

        this.sliderTrack.addEventListener("transitionend", () => (this.allowSwipe = true));
        this.slider.addEventListener("touchstart", this.swipeStart);
        this.slider.addEventListener("mousedown", this.swipeStart);
        setTimeout(() => {
          this.isInitialized = true;
        }, 100);
      }
    },
    getEvent(event) {
      return event.type.search("touch") !== -1 ? event.touches[0] : event;
    },
    scroll(amount) {
      this.scrollCount = amount;

      // Рассчитываем смещение для центрирования текущего слайда
      const newOffset = amount * this.slideWidth - (this.containerWidth - this.slideWidth) / 2;

      // Если включен автоплей, возвращаемся к первому слайду после последнего
      if (this.autoPlay && this.scrollCount > this.slidesCount) {
        this.currentOffset = 0;
        this.scrollCount = 0;
      } else {
        // Ограничиваем смещение, чтобы не выходить за пределы слайдов
        this.currentOffset = Math.max(0, Math.min(newOffset, this.totalWidth - this.containerWidth));
      }

      // Обновляем scrollCount, чтобы оставаться в пределах количества слайдов
      this.scrollCount = Math.max(Math.min(amount, this.slidesCount - 1), 0);
      this.$emit("slide", this.scrollCount);
    },
    swipeStart(event) {
      let evt = this.getEvent(event);

      if (this.allowSwipe) {
        this.posInit = this.posX1 = evt.clientX;
        this.posY1 = evt.clientY;
        this.time = 0;

        document.addEventListener("touchmove", this.swipeAction);
        document.addEventListener("mousemove", this.swipeAction);
        document.addEventListener("touchend", this.swipeEnd);
        document.addEventListener("mouseup", this.swipeEnd);
      }
    },
    swipeAction(event) {
      let evt = this.getEvent(event);

      this.posX2 = this.posX1 - evt.clientX;
      this.posX1 = evt.clientX;
      this.posY2 = this.posY1 - evt.clientY;
      this.posY1 = evt.clientY;

      if (!this.isSwipe && !this.isScroll) {
        let posY = Math.abs(this.posY2);
        if (posY > 7 || this.posX2 === 0) {
          this.isScroll = true;
          this.allowSwipe = false;
        } else if (posY < 7) {
          this.isSwipe = true;
        }
      }

      if (this.isSwipe) {
        const w = (this.currentOffset += this.posX2);
        this.currentOffset = Math.max(0, Math.min(w, this.totalWidth - this.containerWidth));
      }
    },
    swipeEnd() {
      this.posFinal = this.posInit - this.posX1;
      this.isScroll = false;
      this.isSwipe = false;

      document.removeEventListener("touchmove", this.swipeAction);
      document.removeEventListener("mousemove", this.swipeAction);
      document.removeEventListener("touchend", this.swipeEnd);
      document.removeEventListener("mouseup", this.swipeEnd);

      this.allowSwipe = true;
      this.time = this.timer;

      // Определяем процент смещения относительно ширины одного слайда
      const shiftPercentage = Math.abs(this.posFinal) / this.slideWidth;

      // Если смещение больше 30% от ширины одного слайда
      if (shiftPercentage > 0.1) {
        // Определяем количество слайдов для прокрутки
        let slidesToMove = Math.max(Math.ceil(shiftPercentage), 1);

        // Если смещение больше нуля (сдвиг вправо), переходим вперед
        if (this.posFinal > 0) {
          this.scroll(this.scrollCount + slidesToMove);
        } else {
          // Иначе переходим назад
          this.scroll(this.scrollCount - slidesToMove);
        }
      } else {
        // Если смещение меньше 30%, возвращаемся к текущему слайду
        const closestSlideIndex = Math.round(this.currentOffset / this.slideWidth);
        this.scroll(closestSlideIndex);
      }
    },
  },
  computed: {
    slider() {
      return this.$refs.slider;
    },
    sliderTrack() {
      return this.$refs.sliderTrack;
    },
    slidesCount() {
      return this.sliderTrack.children.length;
    },
  },
  watch: {
    slideWidth(newWidth) {
      const slides = this.$refs.sliderTrack.children;
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.width = newWidth + "px";
      }
    },
  },
};
</script>
