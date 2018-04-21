<!-- 歌手详情页 -->
<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songList"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import CreateSong from 'common/js/song'
export default {
    created() {
        // 拿到路由传递过来的参数:id
        // console.log(this.$route.params.id)
        // console.log(this.singer)
        this._getSingerDetail()
    },
    data() {
        return {
            songList: []
        }
    },
    computed: {
        title() {
            return this.singer.name
        },
        bgImage() {
            return this.singer.avatar
        },
        ...mapGetters([
            'singer' // this.singer映射为this.$store.getters.singer
        ])
    },
    methods: {
        _getSingerDetail() {
            // 当前页刷新拿不到singer时回到歌手页面
            if (!this.singer.id) {
                this.$router.push({
                    path: '/singer'
                })
                return
            }
            getSingerDetail(this.singer.id).then(res => {
                if (res.code === ERR_OK) {
                    this.songList = this._normalizeSongs(res.data.list)
                    // console.log(this.songList)
                }
            })
        },
        // 格式化数据方便调用
        _normalizeSongs(list) {
            let ret = []
            list.forEach((item, index) => {
                let musicData = item.musicData
                if (musicData.songid && musicData.albummid) {
                    ret.push(CreateSong(musicData))
                }
            })
            return ret
        }
    },
    // watch: {
    //     // songListKey(v) {
    //     //     console.log(v)
    //     // }
    // },
    components: {
        MusicList
    }
}

</script>
<style lang='less' scoped>
    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.3s;
    }
    .slide-enter,
    .slide-leave-to {
        transform: translate3d(100%,0,0);
    }
</style>