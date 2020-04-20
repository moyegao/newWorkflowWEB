// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import router from './router'
import 'babel-polyfill'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import $ from 'jquery'
import store from './store/index'
import axios from 'axios'
import Vue from 'vue'
import App from './App'
// 统一ui
import companyComponents from 'component-public-company'
import 'component-public-company/src/lib/css/allStyle.css'
Vue.use(companyComponents)

import { MP } from './map/map.js'
Vue.prototype.$mp = MP;

// md5加密账号密码
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

// Vue.prototype.$axios = axios;
// import api from './fetch/api.js'
// Vue.prototype.$api = api;
import api from '@/assets/js/api.js'
Vue.prototype.$api = api;

import 'default-passive-events'

// 公用函数工具
import common from '@/assets/js/common.js'
Vue.prototype.common = common;

import util from '@/assets/js/util.js'
Vue.prototype.util = util;


import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

// import '../plugins/ztree/js/jquery.ztree.core.min'
// import '../plugins/ztree/js/jquery.ztree.excheck.min'
// import '../plugins/ztree/zTreeStyle/zTreeStyle.css'
// import FullCalendar from 'vue-fullcalendar'//日历插件
// Vue.use(FullCalendar)

//高德地图
import VueAMap from 'vue-amap';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: '6cd5aa0e6752ea8bfdc7984179395f51',
    plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType','AMap.Geocoder','AMap.Geolocation'],
    uiVersion: '1.0.11'
})

window.$baseUrl = process.env.baseUrl
Vue.config.productionTip = false;

Vue.use(ElementUI);
// 鼠标右击事件
import VueContextMenu from 'vue-contextmenu'
Vue.use(VueContextMenu)

// bus总线
window.eventBus = new Vue();

// vuex
// import { mapGetters } from 'vuex'
// window.mapGetters = mapGetters;

/* eslint-disable no-new */
window.vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});


let token = "";
let url = window.location.search;
if(url.indexOf("?") != -1) {   //判断是否有参数
  var str = url.substr(1);
  var strs = str.split("=");
  token = strs[1];
}
if(token) {
  sessionStorage.setItem("token", token);

  window.location.href = location.href.split("?")[0];   //重定向，去掉链接的token值
}
token = sessionStorage.getItem("token");
if(!token){ 
  
  // window.location.href = process.env.baseUrl + '/cas.html';
  // window.location.href = 'http://login2.ebs.krdev.gdhwater.com/cas.htm?url=http://192.168.13.114:8080/loginCustomer.htm';
}
