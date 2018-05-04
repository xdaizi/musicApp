<!-- toplist详情页 -->
<template>
    <transition name="slider">
        <music-list :rank="rank" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import { gstMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
    data() {
        return {
            songs: []
        }
    },
    created() {
        this.rank = true
        this._getMusicList()
    },
    computed: {
        title() {
            return this.topList.topTitle
        },
        bgImage() {
            if (this.songs.length) {
                return this.songs[0].image
            }
        },
        ...mapGetters([
            'topList'
        ])
    },
    methods: {
        _getMusicList() {
            if (!this.topList.id) {
                this.$router.push({
                    path: '/rank'
                })
                return
            }
            gstMusicList(this.topList.id).then(res => {
                if (res.code === ERR_OK) {
                    this.songs = this._normalizeSongs(res.songlist)
                    // console.log(this.songs)
                }
            })
        },
        _normalizeSongs(list) {
            let ret = []
            list.forEach(item => {
                let musicData = item.data
                ret.push(createSong(musicData))
            })
            return ret
        }
    },
    components: {
        MusicList
    }
}

</script>
<style lang='less' scoped>
    .slide-enter-active, .slide-leave-active {
          transition: all 0.3s ease
      }
    .slide-enter, .slide-leave-to {
        transform: translate3d(100%, 0, 0)
    }
</style>