<template>
  <div id="app">
    <Header></Header>
    <tab></tab>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script>
import Header from 'components/header/header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
    name: 'App',
    components: {
        Header,
        Tab,
        Player
    }
}
</script>

<style scoped lang='less'>

</style>
