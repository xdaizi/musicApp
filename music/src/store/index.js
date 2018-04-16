// store的出口文件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 插件打印state的信息
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
// process.env.NODE_ENV判断是否为线上模式,开启debug
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    strict: debug, // dev开始模式,使用严格模式通过mutations修改state
    plugins: debug ? [createLogger()] : []
})