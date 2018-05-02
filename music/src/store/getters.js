// 获取state的映射
// 获取歌手信息
export const singer = state => state.singer
// 获取播放状态
export const playing = state => state.playing
// 获取播放器是否收起
export const fullScreen = state => state.fullScreen
// 获取播放列表
export const playList = state => state.playList
// 获取顺讯列表
export const sequenceList = state => state.sequenceList
// 获取播放模式
export const mode = state => state.mode
// 获取当前播放索引
export const currentIndex = state => state.currentIndex
// 获取当前播放歌曲
export const currentSong = (state) => {
    return state.playList[state.currentIndex] || {}
}
// 获得是否真正得进入播放页
export const innerState = state => state.innerState
// 获得歌单信息
export const disc = state => state.disc
// 获取排行榜歌单信息
export const topList = state => state.topList
// 获取搜索历史信息
export const searchHistory = state => state.searchHistory