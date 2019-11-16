<template>
    <div>
        <a-menu>
            <a-menu-item @click="toUserInfo">
                <a-icon type="user" />资料修改
            </a-menu-item>
            <a-menu-item @click="toSetting">
                <a-icon type="setting" />基础设置
            </a-menu-item>
            <a-menu-item @click="changePwd">
                <a-icon type="lock" />修改密码
            </a-menu-item>
            <a-divider class="menu-avator-divider"/>
            <a-menu-item @click="logOut">
                <a-icon type="logout"/>注销登录
            </a-menu-item>
        </a-menu>
    </div>
</template>

<script>
    import { CLEAR_TOKEN, UPGRADE_PRIVILEGE } from "@/components/constant/mutation_types";
    import { mapMutations } from 'vuex';
    export default {
        methods: {
            logOut() {
                this.$store.commit(CLEAR_TOKEN);
            },
            toUserInfo() {
                this.$router.push('/user/info');
            },
            toSetting() {
                this.$router.push('/user/setting');
            },
            changePwd() {
                this.upgradePrivilege({
                    privilege: true,
                    url: '/pwd'
                });
            },
            ...mapMutations({
                upgradePrivilege: UPGRADE_PRIVILEGE
            })
        }
    }
</script>

<style scoped>
    .ant-menu-vertical > .ant-menu-item, .ant-menu-vertical-left > .ant-menu-item, .ant-menu-vertical-right > .ant-menu-item, .ant-menu-inline > .ant-menu-item, .ant-menu-vertical > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-vertical-left > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-vertical-right > .ant-menu-submenu > .ant-menu-submenu-title, .ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
        line-height: 30px;
        height: 30px;
    }
    .menu-avator-divider {
        padding: 0px;
        margin: 20px 0px 5px 0px;
    }

</style>