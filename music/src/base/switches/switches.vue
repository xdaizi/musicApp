<!-- switches组件 -->
<template>
    <ul class="switches">
        <li class="switch-item" v-for="(item,index) in switches" :key="index" @click.stop="selectItem(index)" :class="{'active':currentIndex === index}">
            <span>{{item.name}}</span>
        </li>
    </ul>
</template>

<script>
export default {
    // 定义外部可以传递的属性
    props: {
        switches: {
            type: Array,
            default: () => []
        },
        currentIndex: {
            type: Number,
            default: 0
        }
    },
    methods: {
        selectItem(index) {
            if (this.currentIndex === index) return
            this.$emit('selectSwitch', index)
        }
    }
}

</script>
<style lang='less' scoped>
    @import "~common/less/variable";
    .switches {
        display: flex;
        align-items: center;
        width: 240px;
        margin: 0 auto;
        border: 1px solid @color-highlight-background;
        border-radius: 5px;
        .switch-item {
            flex: 1;
            padding: 8px;
            text-align: center;
            font-size: @font-size-medium;
            color: @color-text-d;
            &.active {
                background: @color-highlight-background;
                color: @color-text;
            }
        }
    }
</style>