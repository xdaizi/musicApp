// 管理相关的mutations
// import * as name 导出的变量将依附在 name的属性上
import * as types from './mutation-types'
const mutations = {
    [types.SET_SINGER](state, singer) {
        state.singer = singer
    },
    [types.SET_PLAYING_STATE](state, flag) {
        state.playing = flag
    },
    [types.SET_FULL_SCREEN](state, flag) {
        state.fullScreen = flag
    },
    [types.SET_PLAY_LIST](state, list) {
        state.playList = list
    },
    [types.SET_SEQUENCE_LIST](state, list) {
        state.sequenceList = list
    },
    [types.SET_PLAY_MODE](state, mode) {
        state.mode = mode
    },
    [types.SET_INNER_STATE](state, flag) {
        state.innerState = flag
    },
    [types.SET_CURRENT_INDEX](state, index) {
        state.currentIndex = index
    },
    [types.SET_CURRENT_URL](state, url) {
        state.playList[state.currentIndex].url = url
        state.playList[state.currentIndex].urlFlag = true
    },
    [types.SET_DISC](state, disc) {
        state.disc = disc
    },
    [types.SET_TOP_LIST](state, topList) {
        state.topList = topList
    },
    [types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = history
    },
    [types.SET_PLAY_HISTORY](state, history) {
        state.playHistory = history
    },
    [types.SET_FAVORITE_LIST](state, list) {
        state.favoriteList = list
    }
}
export default mutations