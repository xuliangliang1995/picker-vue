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
                        route: '/user/info'
                    },
                    {
                        text: '账户设置',
                        icon: 'setting',
                        route: '/user/setting'
                    }
                ]
            }
        },

        methods: {
            route(index){
                this.selectIndex = index;
                this.$router.push(this.menu[index].route);
            }
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