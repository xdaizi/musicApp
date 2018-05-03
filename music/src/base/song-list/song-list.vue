<!-- 音乐列表基础组件,方便复用 -->
<template>
    <div class="song-list">
        <ul>
            <li v-for="(song, index) in songs" class="item" :key="index" @click="select(song, index)">
                <div class="rank" v-if="rank">
                     <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    // 定义需要接收的参数
    props: {
        songs: {
            type: Array,
            default: () => []
        },
        rank: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getDesc(song) {
            return `${song.singer}·${song.album}`
        },
        select(item, index) {
            this.$emit('select', item, index)
        },
        getRankCls(index) {
            if (index <= 2) {
                return `icon icon${index}`
            }
            return 'text'
        },
        getRankText(index) {
            if (index > 2) {
                return index + 1
            }
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .song-list {
        .item {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 64px;
            font-size: @font-size-medium;
            .rank {
                flex: 0 0 25px;
                width: 25px;
                margin-right: 30px;
                text-align: center;
                .icon {
                    display: inline-block;
                    width: 25px;
                    height: 24px;
                    background-size: 25px 24px;
                    &.icon0 {
                        .bg-image('~base/song-list/first')
                    }
                    &.icon1 {
                        .bg-image('~base/song-list/second')
                    }
                    &.icon2 {
                        .bg-image('~base/song-list/third')
                    }
                }
                .text {
                    color: @color-theme;
                    font-size: @font-size-large;
                }
            }
            .content {
                flex: 1;
                line-height: 20px;
                overflow: hidden;
                .name {
                    .no-wrap();
                    color: @color-text;
                }
                .desc {
                    .no-wrap();
                    margin-top: 4px;
                    color: @color-text-d;
                }
            }
        }
    }
</style>