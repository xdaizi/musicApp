// 管理相关的actions,以及对mutation进行封装(可能一次性提供多个mutation)
import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { getVkey } from 'api/singer'
import { ERR_OK, GUID } from 'api/config'
import { playMode } from 'common/js/config'
import { saveSearch, deleteOneHistory, clearHistory, savePlay } from 'common/js/cache'
// 选择播放.需要提交多个mutation,所以用action封装
export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_LIST, list)
    // commit(types.SET_CURRENT_INDEX, {index, url})
    setCurrentIndexAsyn({commit, state}, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_INNER_STATE, true)
}
export const setSongList = function({commit, state}, list) {
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_LIST, list)
}
// 由于要异步获取vkey,所以封装一个action
export const setCurrentIndexAsyn = function({commit, state}, index, fn) {
    let song = state.playList[index]
    commit(types.SET_CURRENT_INDEX, index)
    if (!song.urlFlag) {
        _getKey(state.playList[index]).then(res => {
            commit(types.SET_CURRENT_URL, res)
        })
    }
}
// 设置随机播放
export const setRandomPlay = function({commit, state}, list) {
    if (!list) return
    commit(types.SET_SEQUENCE_LIST, list)
    let templist = shuffle(list)
    commit(types.SET_PLAY_LIST, templist)
    let index = 0
    setCurrentIndexAsyn({commit, state}, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_INNER_STATE, true)
    commit(types.SET_PLAY_MODE, playMode.random)
}
// 插入歌曲
export const insertSong = function({commit, state}, song) {
    let playlist = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let currentSong = playlist[currentIndex]
    let index = _findIndex(playlist, song)
    // 播放列表中存在
    if (index !== -1) {
        playlist.splice(index, 1)
        currentIndex = index > currentIndex ? currentIndex : (currentIndex - 1)
    }
    playlist.splice(currentIndex + 1, 0, song)
    let sequIndex = _findIndex(sequenceList, song)
    let seuqCurrentIndex = _findIndex(sequenceList, currentSong)
    if (sequIndex !== -1) {
        sequenceList.splice(sequIndex, 1)
        seuqCurrentIndex = sequIndex > seuqCurrentIndex ? seuqCurrentIndex : (seuqCurrentIndex - 1)
    }
    sequenceList.splice(seuqCurrentIndex + 1, 0, song)
    currentIndex++
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_PLAY_LIST, playlist)
    // commit(types.SET_CURRENT_INDEX, {index: currentIndex})
    setCurrentIndexAsyn({commit, state}, currentIndex)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_INNER_STATE, true)
}
// 保存历史记录
export const saveSearchHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除一条历史记录
export const deleteHistory = function({commit}, query) {
    commit(types.SET_SEARCH_HISTORY, deleteOneHistory(query))
}
// 清空历史记录
export const clearAllHistory = function({commit}) {
    commit(types.SET_SEARCH_HISTORY, clearHistory())
}
export const deleteSong = function({commit, state}, song) {
    let playlist = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = playlist.findIndex(item => {
        return item.id === song.id
    })
    let sIndex = sequenceList.findIndex(item => {
        return item.id === song.id
    })
    playlist.splice(pIndex, 1)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }
    if (currentIndex === -1) currentIndex = 0
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_PLAY_LIST, playlist)
    // commit(types.SET_CURRENT_INDEX, currentIndex)
    // 没有列表时,不播放
    if (!playlist.length) {
        commit(types.SET_PLAYING_STATE, false)
        commit(types.SET_INNER_STATE, false)
    } else {
        setCurrentIndexAsyn({commit, state}, currentIndex)
        commit(types.SET_PLAYING_STATE, true)
    }
}
// 清空播放列表
export const clearList = function({commit, state}) {
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_PLAY_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
    commit(types.SET_INNER_STATE, false)
}
// 保存播放记录
export const savePlayHistory = function({commit}, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}
/**
 * 封装的带参数得Promise对象 ---- 核心return一个promis对象
 * @param {*} item 需要播放得歌曲
 */
const _getKey = function(item) {
    return new Promise((resolve, reject) => {
        getVkey(item).then(res => {
            let result = ''
            if (res.code === ERR_OK) {
                result = res.data.items[0]['vkey']
                result = 'http://dl.stream.qqmusic.qq.com/C400' + item.mid + '.m4a?vkey=' + result + '&guid=' + GUID + '&uin=0&fromtag=66'
                resolve(result)
            }
        })
    })
}
/**
 * 寻找元素所在的item
 * @param {Array} list 歌曲列表
 * @param {*} item 查询得对象
 */
const _findIndex = function(list, item) {
    if (list.length === 0) {
        return -1
    }
    return list.findIndex(v => {
        if (item.id) {
            return v.id === item.id
        }
    })
}