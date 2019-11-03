<template>
    <Main2 id="main">
        <router-view slot="sider" name="sider"></router-view>
        <router-view :style="{'minHeight':contentHeight}" slot="content">
        </router-view>
    </Main2>
</template>

<script>
    import Main2 from "@/components/layout/Main2";

    export default {
        data () {
            return {
                contentHeight: (window.screen.height * 95 / 100) + "px"
            }
        },
        components: {
            Main2
        }
    }
</script>

<style scoped>
    .v-note-wrapper {
        z-index: 0;
    }
</style>