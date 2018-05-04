<!-- 播放列表组件 -->
<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click.stop="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click.stop="changeMode"></i>
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click.stop="showConfirm"><i class="icon-clear"></i></span>
                    </h1>
                </div>
                <Scroll :refreshDelay="refreshDelay" :click="click" ref="scroll" class="list-content" :data="sequenceList">
                    <transition-group ref="list" name="list" tag="ul">
                        <li class="item" ref="listItem" @click="select(item, index)" v-for="(item,index) in sequenceList" :key="item.id">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span class="like">
                                <i></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </Scroll>
                <div class="list-operate">
                    <div class="add" @click="showAddSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click.stop="hide">
                    <span>关闭</span>
                </div>
            </div>
        <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="clearPlayList"></confirm>
        <add-song ref="addSong"></add-song>
        </div>
    </transition>
</template>

<script>
import { mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/add-song/add-song'
import { playerMixin } from 'common/js/mixin'
export default {
    mixins: [playerMixin],
    data() {
        return {
            showFlag: false,
            refreshDelay: 120
        }
    },
    created() {
        this.click = true
    },
    computed: {
        modeText() {
            return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
        }
    },
    methods: {
        show() {
            this.showFlag = true
            // 控制显示隐藏,用的是display:none,所以要等dom渲染后再次重新刷新scroll组件
            this.$nextTick(() => {
                this.$refs.scroll.refresh()
                this.scrollToCurrent(this.currentSong)
            })
        },
        hide() {
            this.showFlag = false
        },
        getCurrentIcon(item) {
            if (item.id === this.currentSong.id) {
                return 'icon-play'
            }
            return ''
        },
        select(item, index) {
            if (this.mode === playMode.random) {
                index = this.playList.findIndex((song) => {
                    return song.id === item.id
                })
            }
            this.setCurrentIndexAsyn(index)
        },
        scrollToCurrent(current) {
            let index = this.sequenceList.findIndex((item) => {
                return item.id === current.id
            })
            // this.$refs.scroll.scrollToElement(this.$refs.listItem[index], 300)
            this.$refs.scroll.scrollToElement(this.$refs.list.$el.children[index], 300)
        },
        deleteOne(item) {
            this.deleteSong(item)
            // 没有歌曲时隐藏
            if (!this.playList.length) {
                this.hide()
            }
        },
        showConfirm() {
            this.$refs.confirm.show()
        },
        clearPlayList() {
            this.clearList()
            this.hide()
        },
        showAddSong() {
            this.$refs.addSong.show()
        },
        ...mapActions([
            'deleteSong',
            'clearList'
        ])
    },
    components: {
        Scroll,
        Confirm,
        AddSong
    },
    watch: {
        currentSong(newVal, oldVal) {
            if (!this.showFlag || newVal.id === oldVal.id) {
                return
            }
            this.scrollToCurrent(newVal)
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .playlist {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 200;
        background-color: @color-background-d;
        &.list-fade-enter-active, &.list-fade-leave-active {
            transition: opacity 0.3s;
            .list-wrapper {
                transition: all 0.3s;
            }
        }
        &.list-fade-enter, &.list-fade-leave-to {
            opacity: 0;
            .list-wrapper {
                transform: translate3d(0, 100%, 0);
            }
        }
        &.list-fade-enter {
        }
        .list-wrapper {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            background-color: @color-highlight-background;
            .list-header {
                position: relative;
                padding: 20px 30px 10px 20px;
                .title {
                    display: flex;
                    align-items: center;
                    .icon {
                        margin-right: 10px;
                        font-size: 30px;
                        color: @color-theme-d;
                    }
                    .text {
                        flex: 1;
                        font-size: @font-size-medium;
                        color: @color-text-l;
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
            .list-content {
                max-height: 240px;
                overflow: hidden;
                .item {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    padding: 0 30px 0 20px;
                    overflow: hidden;
                    &.list-enter-active, &.list-leave-active {
                        transition: all 0.1s;
                    }
                    &.list-enter, &.list-leave-to {
                        height: 0;
                    }
                    .current {
                        flex: 0 0 20px;
                        width: 20px;
                        font-size: @font-size-small;
                        color: @color-theme-d;
                    }
                    .text {
                        flex: 1;
                        .no-wrap();
                        font-size: @font-size-medium;
                        color: @color-text-d;
                    }
                    .like {
                        .extend-click();
                        margin-right: 15px;
                        font-size: @font-size-small;
                        color: @color-theme;
                        .icon-favorite {
                            color: @color-sub-theme;
                        }
                    }
                    .delete {
                        .extend-click();
                        font-size: @font-size-small;
                        color: @color-theme;
                    }
                }
            }
            .list-operate {
                width: 140px;
                margin: 20px auto 30px auto;
                .add {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px;
                    border: 1px solid @color-text-l;
                    border-radius: 100px;
                    color: @color-text-l;
                    .icon-add {
                        margin-right: 5px;
                        font-size: @font-size-small-s;
                    }
                    .text {
                        font-size: @font-size-small
                    }
                }
            }
            .list-close {
                text-align: center;
                line-height: 50px;
                background: @color-background;
                font-size: @font-size-medium-x;
                color: @color-text-l;
            }
        }
    }
</style>