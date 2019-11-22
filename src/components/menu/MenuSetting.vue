<template>
    <strong class="menu-item">
        <a-list size="large" bordered :dataSource="menu">
            <a-list-item slot="renderItem" slot-scope="item, index" @click="route(index)" :style="{backgroundColor: (index == selectIndex ? 'gainsboro' : '') }">
                <a-row type="flex" justify="start" align="middle" :style="{margin: '0px', padding: '0px'}">
                    <a-col class="gutter-row"><a-icon :key="index" :type="item.icon" /></a-col>
                    <a-col class="gutter-row">
                        <span style="margin-left: 10px">
                            {{item.text}}
                        </span>
                    </a-col>
                </a-row>
            </a-list-item>
        </a-list>
    </strong>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { UPGRADE_PRIVILEGE } from "@/components/constant/mutation_types";

    export default {
        name: "MenuSetting",
        props: ['defaultIndex'],
        watch:{
            defaultIndex(){
                this.selectIndex = this.defaultIndex;
            }
        },
        data() {
            return {
                selectIndex: this.defaultIndex,
                menu: [
                    {
                        text: '个人资料',
                        icon: 'user',
                        route: '/user/info',
                        privilege: false
                    },
                    {
                        text: '个人公众号',
                        icon: 'wechat',
                        route: '/user/mpQrcode',
                        privilege: false
                    },
                    {
                        text: '账户设置',
                        icon: 'setting',
                        route: '/user/setting',
                        privilege: false
                    },
                    {
                        text: '微信绑定',
                        icon: 'wechat',
                        route: '/user/wechat',
                        privilege: true
                    }
                ]
            }
        },
        computed: {
            ...mapState([
                'privilege'
            ])
        },
        methods: {
            route(index){
                let _this = this;
                if (_this.menu[index].privilege) {
                    if (! _this.privilege) {
                        _this.upgradePrivilege({
                            privilege: true,
                            url: _this.menu[index].route
                        });
                        return;
                    }
                }
                _this.selectIndex = index;
                _this.$router.push(_this.menu[index].route);
            },
            ...mapMutations({
                'upgradePrivilege': UPGRADE_PRIVILEGE
            })
        }
    }
</script>

<style scoped>
    .menu-item, .ant-list {
        font-size: 16px;
    }
    .ant-list-item:hover {
        background-color: gainsboro;
    }
</style>