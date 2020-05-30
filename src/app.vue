<template>
  <div id="app">
    <div class="header">Kingbot</div>

    <loading v-show="tab=='loading'"></loading>
    <div class="container" v-show="tab=='default'">
      PAGE !
    </div>
  </div>
</template>

<script>
import filters from '@/filters';
import loading from '@/loading';

export default {
  name: 'Kingbot',
  filters,
  components: { loading },

  data() {
    return {
      tab: 'loading',
    };
  },

  methods: {
    update() {
      console.log('updating all infos');
      this.tab = 'default';
    },
  },

  mounted() {
    this.update();
    setInterval(this.update, 10000);
  },
};
</script>

<style>
:root {
  --bg: #1c2735;
  --text: #EEE;
  --color1: #293a48;
  --color2: #364e61;
  --color3: #41637b;
  --button: #00b176;
  --red: #c75252;
  --grey: #a7a7a7;
}

::-webkit-scrollbar { display: none }

#chart {
  background-color: var(--color1);
  padding: 20px;
  border-radius: 5px;
  margin: 25px 0;
  box-shadow: 3px 3px 8px #0000002e;
}

body {
  margin: 0;
  background-color: var(--bg);
  color: var(--text);
}

body * {
  transition-duration: 100ms;
  box-sizing: border-box;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-bottom: 80px;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  -webkit-app-region: drag;
  line-height: 50px;
  font-size: 25px;
  text-align: left;
  padding-left: 22px;
  background-color: var(--color2);
  box-shadow: 3px 3px 8px #0000002e;
  opacity: 0.8;
  user-select: none;
  z-index: 100;
}

.close {
  position: fixed;
  top: 15px;
  right: 15px;
  height: 20px;
  -webkit-app-region: none;
  cursor: pointer;
  padding: 4px;
  fill: var(--color1);
  background-color: var(--red);
  border-radius: 3px;
  box-shadow: 3px 3px 8px #0000002e;
  z-index: 101;
}

.container {
  display: flex;
  flex-direction: column;
  margin: 70px auto 0 auto;
  padding: 0 15px;
  max-width: 1000px;
}

.line_item {
  display: flex;
  flex-direction: column;
  background-color: var(--color1);
  margin: 5px 0;
  border-radius: 5px;
  user-select: none;
  box-shadow: 3px 3px 8px #0000002e;
}

.line_item > .line {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  cursor: pointer;
  background-color: var(--color2);
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  box-shadow: 3px 3px 8px #0000000e;
}

.line_item:not(.opened) > .line:hover,
.line_item.opened > .line { background-color: var(--color3) }
.line_item.opened > .line:hover { background-color: var(--color2) }

.line_item:not(.opened) > .line { border-radius: 5px }

.line_item > .line > * {
  align-self: center;
  padding: 0 10px;
  width: 100%
}

.line_item.opened > .infos {
  margin: 10px auto;
  width: calc(100% - 30px);
}

.line_item:not(.opened) > .infos { height: 0; pointer-events: none; }

.line_item:not(.opened) > .infos * {
  opacity: 0;
  margin: 0;
  padding: 0;
  height: 0;
  border: 0;
}

.inputs {
  min-width: 300px;
  display: grid;
  grid-template-rows: repeat(auto-fill, 40px);
  row-gap: 4px;
}

.input {
  display: flex;
}

input {
  padding: 12px;
  border: 0;
}

input[type=text], input[type=number] {
  width: 100%;
}

input[type=submit] {
  min-width: 150px;
  background-color: #e0e0e0;
  cursor: pointer;
}

.button {
  background-color: var(--button);
  line-height: 30px;
  margin: 10px auto;
  width: 110px;
  cursor: pointer;
  z-index: 10;
  border-radius: 3px;
  box-shadow: 3px 3px 8px #0000000e;
}

.button.disabled {
  background-color: var(--grey);
  cursor: not-allowed;
}

.table {
  min-width: 300px;
  display: grid;
  grid: auto / auto;
  row-gap: 4px;
  grid-template-rows: repeat(auto-fill, 39px);
  user-select: none;
}

.table > .inline {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--color2);
  opacity: 0.9;
  padding: 10px 20px;
  width: 100%;
}

.messages {
  background-color: #2d4252;
  height: 400px;
  padding: 10px;
  overflow-y: scroll;
}

.messages > * {
  text-align: left;
  margin: 5px 3px;
  overflow-x: hidden;
  line-break: anywhere;
}

.tabs {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 58px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  cursor: pointer;
  box-shadow: 3px 3px 8px #0000000e;
  opacity: 0.8;
}

.tabs > .tab {
  width: 100%;
  padding: 10px 0;
  background-color: var(--button);
}

.tabs > .tab.selected {
  box-shadow: inset 0 0 0 0 var(--color1);
}

.tabs > .tab:not(.selected) {
  box-shadow: inset 0 0 0 200px var(--color1);
  fill: #FFF;
}

.two_column_resp {
  display: grid;
  grid: auto / 50% 50%;
  column-gap: 5px;
  width: calc(100% - 5px);
}

@media screen and (max-width: 700px) {
  .negligible {
    font-size: 0 !important;
    opacity: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 0 !important;
  }
  .two_column_resp { grid: auto / auto; width: 100%; }
}

.uri {
  text-decoration: underline;
  color: #3330d8;
  cursor: pointer;
}

.separator { margin: 5px 0 }

.bg_red { background-color: var(--red) !important }
.bg_select { background-color: var(--button) !important }
.bg_select2 { background-color: var(--color3) !important }

.clickable { cursor: pointer }

</style>
