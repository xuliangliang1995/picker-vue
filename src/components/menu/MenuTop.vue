<template>
    <div id="topMenu">
        <a-menu mode="horizontal" :defaultSelectedKeys="selectKey">
            <a-menu-item key="home" @click="route('/')">
                <a-icon type="home" />首页
            </a-menu-item>
            <a-menu-item key="topic" @click="routeIfLogin('/topic')">
                <a-icon type="flag" />专题
            </a-menu-item>
            <a-menu-item key="blog" @click="routeIfLogin('/blog')">
                <a-icon type="read" />博客
            </a-menu-item>
            <a-menu-item key="schedule" @click="routeIfLogin('/schedule')">
                <a-icon type="schedule" />日历
            </a-menu-item>
            <a-menu-item key="message" @click="routeIfLogin('/message')">
                <a-icon type="message" /> 消息
            </a-menu-item>
            <a-menu-item key="main" @click="routeIfLogin('/main')">
                <a-icon type="idcard" />主页
            </a-menu-item>
        </a-menu>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                defaultSelectedKeys: this.$route.name != undefined ? [ this.$route.name ] : []
            }
        },
        computed: {
            selectKey() {
                let key = [this.$route.fullPath.split("/")[1].length > 0 ? this.$route.fullPath.split("/")[1] : 'home'];
                if (key == undefined || key == '') {
                    key = 'home';
                }
                return key;
            },
            ...mapGetters(['isLoggingIn'])
        },
        methods: {
            route(path) {
                this.$router.push(path);
            },
            routeIfLogin(path) {
                if (this.isLoggingIn) {
                    if (path == "/main") {
                        window.location.href = "/main";
                    } else {
                        this.$router.push(path);
                    }
                } else {
                    this.$router.push('/signIn');
                }
            }
        }
    }
</script>
<style>
    #topMenu {
        text-align: center;
    }
    .ant-menu {
        line-height: unset;
    }
    .ant-menu-horizontal {
        border-bottom: unset;
    }
    .ant-menu-horizontal > .ant-menu-item:hover, .ant-menu-horizontal > .ant-menu-submenu:hover, .ant-menu-horizontal > .ant-menu-item-active, .ant-menu-horizontal > .ant-menu-submenu-active, .ant-menu-horizontal > .ant-menu-item-open, .ant-menu-horizontal > .ant-menu-submenu-open, .ant-menu-horizontal > .ant-menu-item-selected, .ant-menu-horizontal > .ant-menu-submenu-selected {
        color: #1DA57A;
        border-top: 2px solid #1DA57A;
        border-bottom: unset;
    }
    .ant-menu-horizontal > .ant-menu-item, .ant-menu-horizontal > .ant-menu-submenu {
        border-bottom: unset;
    }
</style>