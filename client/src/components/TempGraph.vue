<template>
  <v-sparkline
    :value="value"
    :gradient="gradient"
    :smooth="radius || false"
    :padding="padding"
    :line-width="width"
    :stroke-linecap="lineCap"
    :gradient-direction="gradientDirection"
    :fill="fill"
    :type="type"
    :auto-line-width="autoLineWidth"
  >
    <template v-slot:label="item"> {{ item.value }}°C</template>
  </v-sparkline>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TempGraph extends Vue {
  @Prop(Array) value!: number[];
  width = 2;
  radius = 0;
  padding = 8;
  lineCap = "round";

  gradientDirection = "top";
  gradients = [
    ["#B26EF3"],
    ["#222"],
    ["#42b3f4"],
    ["red", "orange", "yellow"],
    ["purple", "violet"],
    ["#00c6ff", "#F0F", "#FF0"],
    ["#f72047", "#ffd200", "#1feaea"]
  ];

  gradient = this.gradients[0];
  fill = false;
  type = "trend";
  autoLineWidth = false;
}
</script>

<style lang="scss" scoped>
.graph-container {
  .primary--text {
    padding-top: 20px !important;
    color: #eeeeee !important;
  }
}
</style>
