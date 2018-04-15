// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 入口最订单导入babel-polyfill
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 引入fastclick
import FastClick from 'fastclick'
// 引入lazyload(vue得第三方插件)
import VueLazyload from 'vue-lazyload'
// 引入样式文件
import 'common/less/index.less'
// vue第三方通常使用us ,具体配置见相关文档e
Vue.use(VueLazyload, {
    // loading时得图片路径
    loading: require('common/image/default.png')
})
Vue.config.productionTip = false
// 注册到document上
FastClick.attach(document.body)
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})
