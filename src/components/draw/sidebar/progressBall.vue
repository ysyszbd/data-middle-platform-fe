<template>
  <div
    :class="[
      'progress_ball',
      'box-inner',
      props.disabled ? 'box-inner-disabled' : '',
    ]"
  >
    <div class="inner" :style="`bottom: calc(-128% + ${props.num}%);`">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 600 140"
        class="box-waves"
      >
        <path
          d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"
        ></path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 600 140"
        class="box-waves"
      >
        <path
          d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"
        ></path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.0"
        viewBox="0 0 600 140"
        class="box-waves"
      >
        <path
          d="M 0 70 Q 75 20,150 70 T 300 70 T 450 70 T 600 70 L 600 140 L 0 140 L 0 70Z"
        ></path>
      </svg>
    </div>
    <div id="percentText" class="box-text">
      {{ props.tip }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
const props = defineProps(["num", "tip", "disabled", "styleSign"]);
</script>

<style lang="scss" scoped>
.progress_ball {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.box-inner {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid transparent;
  background-image: linear-gradient(rgba(2, 31, 64, 0.5), rgba(2, 31, 64, 0.5)),
    linear-gradient(180deg, rgba(36, 144, 220, 0.41), rgba(37, 147, 225, 1));
  background-origin: border-box;
  background-clip: content-box, border-box;
  overflow: hidden;
}
.box-inner:hover {
  box-shadow: 0px 2px 7px 0px #238fdb;
}
.box-inner-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.inner {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  background: #a0edff;
  bottom: calc(-128% + var(--per));
}

.box-waves {
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 200%;
  stroke: none;
}

.box-waves:nth-child(1) {
  fill: #a0edff;
  transform: translate(-50%, 0);
  z-index: 3;
  animation: wave-move1 1.5s linear infinite;
  margin-bottom: -2px;
}

.box-waves:nth-child(2) {
  fill: rgba(40, 187, 255, 0.5);
  transform: translate(0, 0);
  z-index: 2;
  animation: wave-move2 3s linear infinite;
}

.box-waves:nth-child(3) {
  fill: #2084cc;
  transform: translate(-50%, 0);
  z-index: 1;
  animation: wave-move1 3s linear infinite;
}

@keyframes wave-move1 {
  100% {
    transform: translate(0, 0);
  }
}

@keyframes wave-move2 {
  100% {
    transform: translate(-50%, 0);
  }
}

.box-text {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: rgba(2, 31, 64, 1);
  position: absolute;
  z-index: 4;
}
</style>
