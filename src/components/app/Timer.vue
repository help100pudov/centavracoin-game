<template>
  <div v-if="timer > 0" class="timer-container">
    <div v-show="days">{{ days.toString().padStart(2, "0") }}:</div>
    <div>{{ hours.toString().padStart(2, "0") }}:</div>
    <div>{{ minutes.toString().padStart(2, "0") }}:</div>
    <div>{{ seconds.toString().padStart(2, "0") }}</div>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timer: 0,
    };
  },
  created() {
    this.timer = this.time - this.app.time - 1;
    this.countdown();
  },
  methods: {
    countdown() {
      let timer = this.timer;

      this.days = Math.floor(timer / (24 * 60 * 60));
      timer -= this.days * 24 * 60 * 60;

      this.hours = Math.floor(timer / (60 * 60));
      timer -= this.hours * 60 * 60;

      this.minutes = Math.floor(timer / 60);
      timer -= this.minutes * 60;

      this.seconds = timer;

      setTimeout(() => {
        this.timer -= 1;
        this.countdown();
      }, 1000);
    },
  },
};
</script>

<style scoped>
.timer-container {
  display: flex;
  justify-content: center;
}

.time-element {
  margin: 0 2px;
  background: #1414147d;
  padding: 5px;
  border-radius: 15px;
  text-align: center;
}

.time-number {
  font-weight: bold;
  padding: 5px;
  color: chartreuse;
}

.time-label {
  font-size: 12px;
  margin-left: 5px;
  border-top: 1px solid #ffffff78;
  margin-top: 5px;
  padding: 5px;
  color: aliceblue;
}

.time-up {
  font-size: 24px;
  font-weight: bold;
  color: red;
}
</style>
