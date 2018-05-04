// 用来导出混入得mixin,适用于多组件复用,导出的可以是vue得任意对象,钩子是合并,函数以组件内为主
import {mapGetters, mapMutations, mapActions} from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
// 当是迷你播放器式,修改滚动组件的范围
export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playList',
            'innerState'
        ])
    },
    // mounted() {
    //     this.handlePlaylist(this.playList)
    // },
    // // keep-alive 切换路由时触发,组件激活石触发
    activated() {
        this.handlePlaylist(this.playList)
    },
    watch: {
        // playList(newVal) {
        //     this.handlePlaylist(newVal)
        // },
        innerState(newVal, oldVal) {
            // if (newVal !== oldVal) {
            this.handlePlaylist(this.playList)
            // }
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    }
}
// 由于播放器和播放列表都需要控制播放莫,所以利用mixin混入
export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        ...mapGetters([
            'mode',
            'sequenceList',
            'currentSong',
            'playList'
        ])
    },
    methods: {
        changeMode() {
            let mode = (this.mode + 1) % 3
            this.setPlayMode(mode)
            let list = null
            // 改变播放模式 --->改变播放列表
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            // 要先设置index
            this._resetIndex(list)
            this.setPlayList(list)
        },
        // 重置currentIndex
        _resetIndex(list) {
            if (!list || !list.length) return
            let index = list.findIndex(item => {
                return item.id === this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        ...mapMutations({
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAY_LIST',
            setCurrentIndex: 'SET_CURRENT_INDEX'
        }),
        ...mapActions([
            'setCurrentIndexAsyn'
        ])
    }
}
export const searchMixin = {
    data() {
        return {
            query: ''
        }
    },
    methods: {
        onQueryChange(query) {
            this.query = query
        },
        onScrollStart() {
            // 移动端滚动时,失去焦点从而不调起键盘
            this.$refs.searchBox.blurInput()
        },
        saveHistory() {
            // 存储搜索记录
            this.saveSearchHistory(this.query)
        },
        ...mapActions([
            'saveSearchHistory'
        ])
    }
}