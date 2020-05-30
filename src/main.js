import Vue from 'vue';
import api from './api';
import app from './app.vue';

Vue.config.productionTip = false;

Vue.prototype.api = api();

new Vue({
  render: (h) => h(app),
}).$mount('#app');
