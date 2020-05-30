<template>
  <svg viewBox="0 0 45 45" stroke="#fff" fill="none">
    <circle cx="22" cy="22" r="9.89651" stroke-opacity="0">
      <animate attributeName="r" begin="1.5s" dur="3s"
        values="6;22" calcMode="linear" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" begin="1.5s"
        dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" begin="1.5s"
        dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"/>
    </circle><circle cx="22" cy="22" r="17.8965" stroke-opacity="0">
      <animate attributeName="r" begin="3s" dur="3s"
        values="6;22" calcMode="linear" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" begin="3s"
        dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite"/>
      <animate attributeName="stroke-width" begin="3s"
        dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite"/>
    </circle><circle cx="22" cy="22" r="2.92238">
      <animate attributeName="r" begin="0s" dur="1.5s"
        values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite"/>
    </circle>
  </svg>
</template>

<style scoped>
svg {
  position: fixed;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
  height: 100px;
}
</style>
