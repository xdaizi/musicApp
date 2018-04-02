// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 入口最订单导入babel-polyfill
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
// import router from './router'
// 引入fastclick
import FastClick from 'fastclick'

// 引入样式文件
import 'common/less/index.less'

Vue.config.productionTip = false
// 注册到document上
FastClick.attach(document.body)
/* eslint-disable no-new */
new Vue({
    el: '#app',
    // router,
    components: { App },
    template: '<App/>'
})
