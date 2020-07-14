<template>
  <v-main>
    <div class="temp-container" v-if="connected">
      <temp-circular
        class="current"
        :size="320"
        :width="25"
        :font-size="80"
        :value="current"
      />
      <div class="mb-6" />
      <temp-circular
        class="mr-6 mb-12"
        :size="150"
        :width="15"
        :font-size="40"
        :value="min"
      />
      <temp-circular
        class="max mb-12"
        :size="150"
        :width="15"
        :font-size="40"
        :value="max"
      />

      <clock class="mt-12" font-size="80px" />

      <div class="graph-container">
        <temp-graph :value="currentBuffer" />
      </div>
    </div>
    <div v-else class="pa-4">
      <v-img
        class="mt-5 kitty"
        src="https://cdn130.picsart.com/234469887090212.png?type=webp&to=min&r=640"
      />
      <clock font-size="100px" />
    </div>
  </v-main>
</template>

<script lang="ts">
import TempCircular from "@/components/TempCircular.vue";
import TempGraph from "@/components/TempGraph.vue";
import Clock from "@/components/Clock.vue";
import { Vue, Component } from "vue-property-decorator";
import SocketIO from "socket.io-client";

@Component({
  components: { TempCircular, TempGraph, Clock }
})
export default class MainView extends Vue {
  private client: SocketIOClient.Socket = SocketIO("97.84.122.179:6969", {
    autoConnect: false
  });

  private min = 0;
  private max = 0;
  private current = 0;
  private connected = false;
  private currentBuffer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  private interval = -1;
  private timeString = "00:00AM";

  async created() {
    const tick = () => {
      this.currentBuffer.pop();
      this.currentBuffer = [this.current, ...this.currentBuffer];
    };

    this.client.on(
      "temp",
      (temp: { min: number; max: number; current: number }) => {
        this.min = temp.min;
        this.max = temp.max;
        this.current = temp.current;

        if (!this.connected) {
          for (let i = 0; i < this.currentBuffer.length; i++) {
            this.currentBuffer[i] = 0;
          }
          this.connected = true;
          tick();
        }
      }
    );

    this.client.on("disconnect", () => {
      this.connected = false;
    });

    this.interval = setInterval(tick, 5000);

    this.client.on("error", (err: unknown) => {
      console.log(err);
    });

    this.client.connect();
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
.temp-container {
  color: #eeeeee;
  font-family: "provicaliregular", serif;
  padding-top: 50px;
  position: relative;
  height: 100vh;
  text-align: center;
}

.graph-container {
  position: absolute;
  width: 100%;
  bottom: 30px;
  padding: 20px;
}

.kitty {
  animation-name: kittyScale;
  animation-duration: 5000ms;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

@keyframes kittyScale {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0.9);
  }
}
</style>
