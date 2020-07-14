<template>
  <div class="clock" :style="'font-size:' + fontSize + ';'">
    {{ timeString }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Clock extends Vue {
  @Prop(String) fontSize!: string;

  private interval = -1;
  private timeString = "00:00AM";

  private created() {
    const tick = () => {
      const currentdate = new Date();
      let hour: number | string = currentdate.getHours();
      let minutes: number | string = currentdate.getMinutes();

      const ampm = hour >= 12 ? "PM" : "PM";
      if (hour > 12) {
        hour -= 12;
      }

      if (hour < 10) {
        hour = "0" + hour;
      }

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      this.timeString = `${hour}:${minutes} ${ampm}`;
    };

    this.interval = setInterval(tick, 1000 * 60);
    tick();
  }

  private beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = -1;
    }
  }
}
</script>

<style lang="scss" scoped>
.clock {
  color: #eeeeee;
  font-family: "provicaliregular", serif;
  text-align: center;
  margin-top: 30px;
  font-size: 100px;
}
</style>
