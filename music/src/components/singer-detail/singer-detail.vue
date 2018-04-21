<!-- 歌手详情页 -->
<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songList"></music-list>
    </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSingerDetail, getVkey } from 'api/singer'
import { ERR_OK, GUID } from 'api/config'
import CreateSong from 'common/js/song'
// 定义优先加载的歌曲数量,剩下的等图片懒加载的时候请求,或者点击得时候请求
const SONG_LEN = 20
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
                    console.log(this.songList)
                }
            })
        },
        _dealKey(musicData, index) {
            getVkey(musicData).then(res => {
                let result = ''
                if (res.code === ERR_OK) {
                    result = res.data.items[0]['vkey']
                    result = 'http://dl.stream.qqmusic.qq.com/C400' + musicData.songmid + '.m4a?vkey=' + result + '&guid=' + GUID + '&uin=0&fromtag=66'
                    this.songList[index].url = result
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
                    if (index <= SONG_LEN) {
                        this._dealKey(musicData, index)
                    }
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