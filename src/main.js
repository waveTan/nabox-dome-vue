import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import {post} from './api/https'
/*import Vconsole from 'vconsole';
new Vconsole();*/

Vue.prototype.NaboxJSBridge = window['NaboxJSBridge'];
Vue.config.productionTip = false;
//定义全局变量
Vue.prototype.$post = post;
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
