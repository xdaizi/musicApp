<!-- search-list组件 -->
<template>
    <div class="search-list" v-show="searches.length">
        <transition-group name="list" tag="ul">
            <li :key="item" class="search-item" v-for="item in searches" @click="select(item)">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="delet(item)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>

<script>
export default {
    props: {
        searches: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        // 基础组件不做与其无关的业务,只负责派发事件,因为是复用的应根据调用者的逻辑来处理
        select(item) {
            this.$emit('selectQuery', item)
        },
        delet(item) {
            this.$emit('deletOne', item)
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    @import "~common/less/mixin";
    .search-list {
        .search-item {
            display: flex;
            align-items: center;
            height: 40px;
            overflow: hidden;
            &.list-enter-active, &.list-leave-active {
                transition: all 0.1s
            }
            &.list-enter, &.list-leave-to {
                height: 0
            }
            .text {
                flex: 1;
                color: @color-text-l;
            }
            .icon {
                .extend-click();
                .icon-delete {
                    font-size: @font-size-small;
                    color: @color-text-d;
                }
            }
        }
    }
</style>