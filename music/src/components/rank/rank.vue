<!-- 排行榜组件 -->
<template>
    <div class="rank" ref="rank">
        <Scroll class="toplist" ref="toplist" :data="topList" :click="click">
            <ul>
                <li class="item" v-for="item in topList" :key="item.id" @click="selectItem(item)">
                    <div class="icon">
                        <img width="100" height="100" v-lazy="item.picUrl"/>
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(item, index) in item.songList" :key="index">
                            <span>{{index+1}}</span>
                            <span>{{item.songname}}--{{item.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <Loading></Loading>
            </div>
        </Scroll>
        <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
export default {
    mixins: [playlistMixin],
    data() {
        return {
            topList: []
        }
    },
    created() {
        this.click = true
        this._getTopList()
    },
    methods: {
        selectItem(item) {
            this.$router.push({
                path: `/rank/${item.id}`
            })
            this.setTopList(item)
        },
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.rank.style.bottom = bottom
            this.$refs.toplist.refresh()
        },
        _getTopList() {
            getTopList().then(res => {
                if (res.code === ERR_OK) {
                    this.topList = res.data.topList
                    // console.log(this.topList)
                }
            })
        },
        ...mapMutations({
            setTopList: 'SET_TOP_LIST'
        })
    },
    components: {
        Scroll,
        Loading
    }
}
</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .rank {
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;
        .toplist {
            height: 100%;
            overflow: hidden;
            .item {
                display: flex;
                margin: 0 20px;
                padding-top: 20px;
                height: 100px;
                &:last-child {
                    padding-bottom: 20px
                }
                .icon {
                    flex: 0 0 100px;
                    width: 100px;
                    height: 100px;
                }
                .songlist {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 0 20px;
                    height: 100px;
                    overflow: hidden;
                    background: @color-highlight-background;
                    color: @color-text-d;
                    font-size: @font-size-small;
                    .song {
                        .no-wrap();
                        line-height: 26px;
                    }
                }
            }
            .loading-container {
                position: absolute;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
            }
        }
    }
</style>