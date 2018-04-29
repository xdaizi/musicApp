<!-- 歌单详情页 -->
<template>
    <transition name="silde">
        <music-list :title="title" :bgImage="bgImage" :songs="songList"></music-list>
    </transition>
</template>

<script>
import musicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import CreateSong from 'common/js/song'
export default {
    data() {
        return {
            songList: []
        }
    },
    computed: {
        title() {
            return this.disc.dissname
        },
        bgImage() {
            return this.disc.imgurl
        },
        ...mapGetters([
            'disc'
        ])
    },
    created() {
        this._getSonglist(this.disc.dissid)
    },
    methods: {
        _getSonglist(dissid) {
            if (!dissid) {
                this.$router.push({
                    path: '/recommend'
                })
                return
            }
            getSongList(dissid).then(res => {
                if (res.code === ERR_OK) {
                    this.songList = this._normalizeSongs(res.cdlist[0].songlist)
                }
            })
        },
        // 格式化数据方便调用
        _normalizeSongs(list) {
            let ret = []
            list.forEach((item, index) => {
                let musicData = item
                if (musicData.songid && musicData.albummid) {
                    ret.push(CreateSong(musicData))
                }
            })
            return ret
        }
    },
    components: {
        musicList
    }
}

</script>
<style lang='less' scoped>
    .slide-enter-active, .slide-leave-active {
        transition: all 0.3s
    }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0)
    }
</style>