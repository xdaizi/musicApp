<!-- 音乐列表基础组件,方便复用 -->
<template>
    <div class="song-list">
        <ul>
            <li v-for="(song, index) in songs" class="item" :key="index" @click="select(song, index)">
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { getVkey } from 'api/singer'
import { ERR_OK, GUID } from 'api/config'
export default {
    // 定义需要接收的参数
    props: {
        songs: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        getDesc(song) {
            return `${song.singer}·${song.album}`
        },
        select(item, index) {
            if (item.urlFlag) {
                this.$emit('select', item, index)
                return
            }
            getVkey(item).then(res => {
                let result = ''
                if (res.code === ERR_OK) {
                    result = res.data.items[0]['vkey']
                    result = 'http://dl.stream.qqmusic.qq.com/C400' + item.mid + '.m4a?vkey=' + result + '&guid=' + GUID + '&uin=0&fromtag=66'
                    // item.url = result
                    // item.urlFlag = true
                    this.$emit('select', item, index, result)
                }
            })
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
                        // .bg-image('first')
                    }
                    &.icon1 {
                        // .bg-image('second')
                    }
                    &.icon2 {
                        // .bg-image('third')
                    }
                    .text {
                        color: @color-theme;
                        font-size: @font-size-large;
                    }
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