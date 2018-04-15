// 管理相关的mutations
// import * as name 导出的变量将依附在 name的属性上
import * as types from './mutation-types'
const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    }
}
export default mutations