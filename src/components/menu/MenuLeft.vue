<template>
    <div>
        <a-menu
                @click="handleClick"
                style="width: 100%"
                :defaultSelectedKeys="['4']"
                :openKeys.sync="openKeys"
                mode="inline"
        >
            <a-sub-menu key="blog" @titleClick="titleClick">
                <span slot="title"><a-icon type="mail" /><span>博客管理</span></span>
                <a-menu-item key="1">我的博客</a-menu-item>
                <a-menu-item-group key="g1">
                    <template slot="title"><a-icon type="qq" /><span>博客分类</span></template>
                    <a-menu-item key="2">Option 1</a-menu-item>
                    <a-menu-item key="3">Option 2</a-menu-item>
                </a-menu-item-group>
                <a-menu-item key="4">草稿箱</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub2" @titleClick="titleClick">
                <span slot="title"><a-icon type="appstore" /><span>Navigation Two</span></span>
                <a-menu-item key="5">Option 5</a-menu-item>
                <a-menu-item key="6">Option 6</a-menu-item>
                <a-sub-menu key="sub3" title="Submenu">
                    <a-menu-item key="7">Option 7</a-menu-item>
                    <a-menu-item key="8">Option 8</a-menu-item>
                </a-sub-menu>
            </a-sub-menu>
            <a-sub-menu key="sub4">
                <span slot="title"><a-icon type="setting" /><span>Navigation Three</span></span>
                <a-menu-item key="9">Option 9</a-menu-item>
                <a-menu-item key="10">Option 10</a-menu-item>
                <a-menu-item key="11">Option 11</a-menu-item>
                <a-menu-item key="12">Option 12</a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script>
    export default {
        name: "MenuLeft",
        data () {
            return {
                current: ['4'],
                openKeys: ['blog'],
            }
        },
        methods: {
            handleClick (e) {
                //console.log('click', e)
            },
            titleClick (e) {
                //console.log('titleClick', e)
            },
        },
        watch: {
            openKeys (val) {
                //console.log('openKeys', val)
            },
        },
    }
</script>

<style scoped>

</style>