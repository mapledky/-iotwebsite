import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './theme/element/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAMap from 'vue-amap'; // 高德
import * as echarts from 'echarts';

//Vue.prototype.$echarts=echarts
Vue.prototype.$echarts=echarts
Vue.use(VueAMap);
Vue.use(VueAxios,axios)
Vue.prototype.$axios = axios;
VueAMap.initAMapApiLoader({
// 高德key
  key: 'e2df70d22396a3f82829ecc392bb0d32',
// 插件集合 （插件按需引入）
   plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Geolocation', 'AMap.Geocoder','AMap.DistrictSearch','AMap.Maker'],
  // 高德 sdk 版本，默认为 1.4.4
  v:'1.4.4',
  uiVersion: '1.0'
});
Vue.config.productionTip = false;
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
