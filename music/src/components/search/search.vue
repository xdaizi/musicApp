<!--搜索页面组件  -->
<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @queryChange="onQueryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li @click="selectQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
                            {{item.k}}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="search-result" v-show="query">
            <Suggest :query="query" @scrollStart="onScrollStart" @selectItem="saveHistory"></Suggest>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import { mapActions } from 'vuex'
export default {
    data() {
        return {
            hotKey: [],
            query: ''
        }
    },
    created() {
        this._getHotKey()
    },
    methods: {
        selectQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
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
        _getHotKey() {
            getHotKey().then(res => {
                if (res.code === ERR_OK) {
                    this.hotKey = res.data.hotkey.slice(0, 10)
                }
                console.log(this.hotKey)
            })
        },
        ...mapActions([
            'saveSearchHistory'
        ])
    },
    components: {
        SearchBox,
        Suggest
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
        }
        .search-result {
            position: fixed;
            width: 100%;
            top: 178px;
            bottom: 0;
        }
    }
</style>