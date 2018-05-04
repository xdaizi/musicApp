<!--搜索页面组件  -->
<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @queryChange="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <scroll class="shortcut" ref="shortcut" :click="click" :data="shortcutData">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li @click="selectQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
                                {{item.k}}
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="confirmShow">
                                <i class="icon-clear"></i>
                            </span>
                        </h1>
                        <search-list
                        :searches="searchHistory"
                        @selectQuery="selectQuery"
                        @deletOne="onDeleteOne"
                        ></search-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchWrapper">
            <Suggest ref="suggest" :query="query" @scrollStart="onScrollStart" @selectItem="saveHistory"></Suggest>
        </div>
        <confirm ref="confirm"
        text="确定清空所有历史记录"
        confirmBtnText="清空"
        cancelBtnText="取消"
        @confirm="clear"
        ></confirm>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'
import { playlistMixin, searchMixin } from 'common/js/mixin'
export default {
    mixins: [playlistMixin, searchMixin],
    data() {
        return {
            hotKey: []
        }
    },
    created() {
        this.click = true
        this._getHotKey()
    },
    computed: {
        shortcutData() {
            // 由于searchHistory和hotkey都是异步获取的
            return this.searchHistory.concat(this.hotKey)
        }
    },
    methods: {
        confirmShow() {
            this.$refs.confirm.show()
        },
        clear() {
            this.clearAllHistory()
        },
        handlePlaylist(palylist) {
            const bottom = palylist.length > 0 ? '60px' : ''
            this.$refs.shortcutWrapper.style.bottom = bottom
            this.$refs.shortcut.refresh()
            this.$refs.searchWrapper.style.bottom = bottom
            this.$refs.suggest.refresh()
        },
        _getHotKey() {
            getHotKey().then(res => {
                if (res.code === ERR_OK) {
                    this.hotKey = res.data.hotkey.slice(0, 10)
                }
            })
        },
        ...mapActions([
            'clearAllHistory'
        ])
    },
    watch: {
        query(newVal) {
            if (!newVal) {
                this.timer = setTimeout(() => {
                    this.$refs.shortcut.refresh()
                }, 20)
            }
        }
    },
    components: {
        SearchBox,
        Suggest,
        SearchList,
        Confirm,
        Scroll
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .search {
        .search-box-wrapper {
            margin: 20px
        }
        .shortcut-wrapper {
            position: fixed;
            top: 178px;
            bottom: 0;
            width: 100%;
            .shortcut {
                height: 100%;
                overflow: hidden;
                .hot-key {
                    margin: 0 20px 20px 20px;
                    .title {
                        margin-bottom: 20px;
                        font-size: @font-size-medium;
                        color: @color-text-l;
                    }
                    .item {
                        display: inline-block;
                        padding: 5px 10px;
                        margin: 0 20px 10px 0;
                        border-radius: 6px;
                        background: @color-highlight-background;
                        font-size: @font-size-medium;
                        color: @color-text-d;
                    }
                }
            }
            .search-history {
                position: relative;
                margin: 0 20px;
                .title {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    font-size: @font-size-medium;
                    color: @color-text-l;
                    .text {
                        flex: 1
                    }
                    .clear {
                        .extend-click();
                        .icon-clear {
                            font-size: @font-size-medium;
                            color: @color-text-d;
                        }
                    }
                }
            }
        }
        .search-result {
            position: fixed;
            width: 100%;
            top: 178px;
            bottom: 0;
        }
    }
</style>