// 管理相关得state
import { playMode } from 'common/js/config'
const state = {
    singer: {}, // 歌手信息
    playing: false, // 播放状态,暂停,播放
    fullScreen: false, // 播放器的状态,展开,收起
    playList: [], // 播放列表
    sequenceList: [], // 原始的列表
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 当前播放索引
    innerState: false, // 是否真正的进入播放页面
    disc: {}, // 歌单信息
    topList: {} // 排行榜歌单信息
}
export default state