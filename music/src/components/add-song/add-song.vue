<!-- 添加歌曲组件 -->
<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <div class="title">添加歌手列表</div>
                <div class="close" @click="hide">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box ref="searchBox" placeholder="输入搜索的歌曲" @queryChange="onQueryChange"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :switches="switches" :currentIndex="currentIndex" @selectSwitch="onSelectSwitch"></switches>
                <div class="list-wrapper">
                    <scroll ref="playHistory" :click="click" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
                        <div class="list-inner">
                            <song-list :songs="playHistory" @select="onSelect"></song-list>
                        </div>
                    </scroll>
                    <scroll :click="click" :refreshDelay="refreshDelay" ref="searchHistory" v-if="currentIndex===1" class="list-scroll">
                        <div class="list-inner">
                            <search-list
                            :searches="searchHistory"
                            @selectQuery="selectQuery"
                            @deletOne="onDeleteOne"></search-list>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <suggest :query="query" :showSinger="showSinger" @scrollStart="onScrollStart" @selectItem="onSelectItem"></suggest>
            </div>
            <top-tip ref="topTip">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">歌曲已经添加到播放列表</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import TopTip from 'base/top-tip/top-tip'
import { mapGetters, mapActions } from 'vuex'
import { searchMixin } from 'common/js/mixin'
import { Song } from 'common/js/song'
export default {
    mixins: [searchMixin],
    data() {
        return {
            showFlag: false,
            showSinger: false,
            currentIndex: 0,
            switches: [{name: '最近播放'}, {name: '搜索历史'}]
        }
    },
    created() {
        this.click = true
    },
    computed: {
        ...mapGetters([
            'playHistory'
        ])
    },
    methods: {
        show() {
            this.showFlag = true
            this.$nextTick(() => {
                if (this.currentIndex === 0) {
                    this.$refs.playHistory.refresh()
                }
                if (this.currentIndex === 1) {
                    this.$refs.searchHistory.refresh()
                }
            })
        },
        hide() {
            this.showFlag = false
        },
        onSelectSwitch(index) {
            this.currentIndex = index
        },
        onSelect(item, index) {
            if (index === 0) return
            // 要转化为song的实例,才能调用内部的属性,方法
            this.insertSong(new Song(item))
            this.showTopTip()
        },
        onSelectItem() {
            this.saveHistory()
            this.showTopTip()
        },
        showTopTip() {
            this.$refs.topTip.show()
        },
        ...mapActions([
            'insertSong'
        ])
    },
    components: {
        SearchBox,
        Suggest,
        Switches,
        Scroll,
        SongList,
        SearchList,
        TopTip
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .add-song {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 200;
        background: @color-background;
        &.slide-enter-active, &.slide-leave-active {
            transition: all 0.3s
        }
        &.slide-enter, &.slide-leave-to {
            transform: translate3d(100%, 0, 0)
        }
        .header {
            position: relative;
            height: 44px;
            text-align: center;
            .title {
                line-height: 44px;
                font-size: @font-size-large;
                color: @color-text;
            }
            .close {
                position: absolute;
                top: 0;
                right: 8px;
                .icon-close {
                    display: block;
                    padding: 12px;
                    font-size: 20px;
                    color: @color-theme;
                }
            }
        }
        .search-box-wrapper {
            margin: 20px;
        }
        .shortcut {
            .list-wrapper {
                position: absolute;
                top: 165px;
                bottom: 0;
                width: 100%;
                .list-scroll {
                    height: 100%;
                    overflow: hidden;
                    .list-inner {
                        padding: 20px 30px;
                    }
                }
            }
        }
        .search-result {
            position: fixed;
            top: 124px;
            bottom: 0;
            width: 100%;
        }
        .tip-title {
            text-align: center;
            padding: 18px 0;
            font-size: 0;
            .icon-ok {
                font-size: @font-size-medium;
                color: @color-theme;
                margin-right: 4px;
            }
            .text {
                font-size: @font-size-medium;
                color: @color-text;
            }
        }
    }
</style>