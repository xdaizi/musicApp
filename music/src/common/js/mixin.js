// 用来导出混入得mixin,适用于多组件复用,导出的可以是vue得任意对象,钩子是合并,函数以组件内为主
import {mapGetters} from 'vuex'
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
    // // keep-alive 切换路由时触发
    // activated() {
    //     this.handlePlaylist(this.playList)
    // },
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