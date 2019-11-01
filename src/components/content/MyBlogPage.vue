<template>
    <Main2 id="main">
        <MenuLeft slot="sider"/>
        <router-view :style="{'minHeight':contentHeight}" slot="content">
        </router-view>
    </Main2>
</template>

<script>
    import Main2 from "@/components/layout/Main2";
    import MenuLeft from "@/components/menu/MenuLeft";
    export default {
        data () {
            return {
                contentHeight: (window.screen.height * 95 / 100) + "px"
            }
        },
        components: {
            Main2,
            MenuLeft
        }
    }
</script>

<style>
    .v-note-wrapper {
        z-index: 0;
    }
</style>