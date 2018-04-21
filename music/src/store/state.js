// 管理相关得state
import { playMode } from 'common/js/config'
const state = {
    singer: {}, // 歌手信息
    playing: false, // 播放状态,暂停,播放
    fullScreen: false, // 播放器的状态,展开,收起
    playList: [], // 播放列表
    sequenceList: [], // 顺序列表,由于有三种播放模式
    mode: playMode.sequence, // 播放模式
    currentIndex: -1 // 当前播放索引
}
export default state