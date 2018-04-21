// 管理相关的actions,以及对mutation进行封装(可能一次性提供多个mutation)
import * as types from './mutation-types'
// 选择播放.需要提交多个mutation,所以用action封装
export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}