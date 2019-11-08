<template>
    <div :style="{height: '100%'}">
        <a-affix :style="{height: '100%'}">
            <a-menu
                    :style="{height: '100%', width: '100%'}"
                    :defaultSelectedKeys="selectKey"
                    :openKeys.sync="openKeys"
                    v-model="selectedKeys"
                    mode="inline"
            >
                <template v-for="item in menu">
                    <a-menu-item v-if="! item.children" :key="item.key">
                        <router-link :to="item.route">
                            <a-icon v-if="item.icon" :type="item.icon" />
                            {{item.title}}
                        </router-link>
                    </a-menu-item>
                    <a-sub-menu v-else :key="item.key">
                    <span slot="title">
                        <a-icon v-if="item.icon" :type="item.icon" />
                        <span>{{item.title}}</span>
                    </span>
                        <template v-for="lv2Menu in item.children">
                            <a-menu-item  :key="lv2Menu.key">
                                <router-link :to="lv2Menu.route">
                                    <a-icon v-if="lv2Menu.icon" :type="lv2Menu.icon" />
                                    {{lv2Menu.title}}
                                </router-link>
                            </a-menu-item>
                        </template>
                    </a-sub-menu>
                </template>
                <!--<a-sub-menu key="blog">
                    <span slot="title"><a-icon type="mail" /><span>博客管理</span></span>
                    <a-menu-item key="1">
                        <router-link to="/blog/list">我的博客</router-link>
                    </a-menu-item>
                    <a-menu-item-group key="g1">
                        <template slot="title"><a-icon type="qq" /><span>博客分类</span></template>
                        <a-menu-item key="2">Option 1</a-menu-item>
                        <a-menu-item key="3">Option 2</a-menu-item>
                    </a-menu-item-group>
                    <a-menu-item key="4">
                        <router-link to="/blog/drafts">草稿箱</router-link>
                    </a-menu-item>
                </a-sub-menu>-->
            </a-menu>
        </a-affix>
    </div>
</template>

<script>
    export default {
        name: "MenuLeft",
        props: ['selectKey'],
        watch:{
            selectKey(){
                this.selectedKeys = this.selectKey;
            }
        },
        data () {
            return {
                menu: [
                    {
                        key: 'blog',
                        title: '博客管理',
                        icon: 'book',
                        children: [
                            {
                                key:'blog-list',
                                title: '我的博客',
                                route: '/blog/list',
                                icon: 'bars'
                            },
                            {
                                key:'blog-draft',
                                title: '草稿箱',
                                route: '/blog/drafts',
                                icon: 'file'
                            },
                            {
                                key:'blog-category',
                                title: '博客分类',
                                route: '/blog/category',
                                icon: 'folder-open'
                            }
                        ]
                    }
                ],
                openKeys: ['blog'],
                selectedKeys: this.selectKey
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>