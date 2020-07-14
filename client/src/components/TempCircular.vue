<template>
  <v-progress-circular
    :value="percent"
    :size="size"
    :width="width"
    :color="color"
    :rotate="90"
    :style="'font-size: ' + fontSize + 'px'"
    ><div class="value-container">
      {{ value }}
      <div class="celcius">°C</div>
    </div></v-progress-circular
  >
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

const min = 0;
const max = 100;

@Component
export default class TempCircular extends Vue {
  @Prop(Number) private value!: number;
  @Prop(Number) private width!: number;
  @Prop(Number) private size!: number;
  @Prop(Number) private fontSize!: number;

  private get percent() {
    return ((min + this.value) / (max - min)) * 100;
  }

  private get color() {
    if (this.percent > 90) {
      return "red";
    } else if (this.percent > 60) {
      return "yellow";
    } else {
      return "green";
    }
  }
}
</script>

<style lang="scss" scoped>
.value-container {
  position: relative;
  margin-left: -0.2em;
}

.celcius {
  top: 0px;
  position: absolute;
  font-size: 0.5em;
  top: 0px;
  right: -1.2em;
}
</style>
