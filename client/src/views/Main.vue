<template>
  <div class="temp-container">
    <div class="current">{{ current }} °C</div>
    <div class="min">{{ min }} °C</div>
    <div class="max">{{ max }} °C</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit, Ref } from "vue-property-decorator";
import SocketIO from "socket.io-client";

@Component
export default class MainView extends Vue {
  private client: SocketIOClient.Socket = SocketIO("97.84.122.179:6969", {
    autoConnect: false
  });

  private min = 0;
  private max = 0;
  private current = 0;

  async created() {
    this.client.on(
      "temp",
      (temp: { min: number; max: number; current: number }) => {
        this.min = temp.min;
        this.max = temp.max;
        this.current = temp.current;
      }
    );

    this.client.on("error", (err: unknown) => {
      console.log(err);
    });

    console.log("Connect client:");
    this.client.connect();
  }
}
</script>

<style lang="scss" scoped>

.temp-container {
  color: white;
  font-family: "provicaliregular", serif;
  margin-top: 100px;

  .current {
    font-size: 200px;
  }

  .min,
  .max {
    font-size: 80px;
    display: inline-block;
    margin: 20px;
  }
}
</style>
