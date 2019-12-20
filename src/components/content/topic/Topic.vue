<template>
    <TopicLay>
        <a-affix slot="sider">
            <a-skeleton v-if="loading"/>
            <a-menu v-else mode="inline" :inlineCollapsed="false" :inlineIndent="20" v-model="selectedKeys" :defaultOpenKeys="openKeys">
                <a-menu-item :key="0" v-if="menu.length == 0">

                    <MenuTopicEdit :tier="0" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                        <span slot="content">右击我创建菜单</span>
                    </MenuTopicEdit>

                </a-menu-item>
                <template v-else v-for="item in menu">
                    <a-sub-menu v-if="item.menuType == 'folder'" :key="item.menuId" @click="routeBlog(item)">

                        <MenuTopicEdit slot="title" :tier="1" :parent="item" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                            <span slot="content">{{ item.menuName }}</span>
                        </MenuTopicEdit>

                        <template v-for="subItem in item.children">
                            <a-menu-item-group v-if="subItem.menuType == 'group'" :key="subItem.menuId" @click="routeBlog(subItem)">

                                <MenuTopicEdit slot="title" :tier="2" :parent="subItem" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                                    <span slot="content">{{ subItem.menuName }}</span>
                                </MenuTopicEdit>

                                <template v-for="subItem2 in subItem.children">
                                    <a-menu-item v-if="subItem2.menuType == 'link'" :key="subItem2.menuId" @click="routeBlog(subItem2)">

                                        <MenuTopicEdit :tier="3" :parent="subItem2" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                                            <span slot="content">{{ subItem2.menuName }}</span>
                                        </MenuTopicEdit>

                                    </a-menu-item>
                                </template>
                            </a-menu-item-group>
                            <a-menu-item v-if="subItem.menuType == 'link'" :key="subItem.menuId" @click="routeBlog(subItem)">

                                <MenuTopicEdit :tier="2" :parent="subItem" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                                    <span slot="content">{{ subItem.menuName }}</span>
                                </MenuTopicEdit>

                            </a-menu-item>
                        </template>
                    </a-sub-menu>
                    <a-menu-item-group v-if="item.menuType == 'group'" :key="item.menuId" @click="routeBlog(item)">

                        <MenuTopicEdit slot="title" :tier="1" :parent="item" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                            <span slot="content">{{ item.menuName }}</span>
                        </MenuTopicEdit>

                        <template v-for="subItem in item.children">
                            <a-menu-item v-if="subItem.menuType == 'link'" :key="subItem.menuId" @click="routeBlog(subItem)">

                                <MenuTopicEdit :tier="2" :parent="subItem" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                                    <span slot="content">{{ subItem.menuName }}</span>
                                </MenuTopicEdit>

                            </a-menu-item>
                        </template>
                    </a-menu-item-group>
                    <a-menu-item v-if="item.menuType == 'link'" :key="item.menuId" @click="routeBlog(item)">

                        <MenuTopicEdit :tier="1" :parent="item" :topic-id="topicId" @refresh="fetchMenu" :editable="editable">
                            <span slot="content">{{ item.menuName }}</span>
                        </MenuTopicEdit>

                    </a-menu-item>
                </template>
            </a-menu>
        </a-affix>
        <div slot="content">
            <MyBlogViewPage v-if="selectBlogId" :blog-id="selectBlogId"/>
            <NoContent v-else/>
        </div>
    </TopicLay>
</template>
<script>
    import TopicLay from "@/components/menu/TopicLay";
    import MenuTopicEdit from "@/components/menu/MenuTopicEdit";
    import { TOPIC_MENU_GET } from "@/components/constant/url_path";
    import NoContent from "@/components/content/NoContent";
    import MyBlogViewPage from "@/components/content/blog/MyBlogViewPage";

    export default {
        props: ['topicId', 'blogId'],
        data() {
            return {
                menu: [],
                selectedKeys: [],
                openKeys: [],
                selectBlogId: undefined,
                loading: true,
                editable: false
            }
        },
        components: {
            MyBlogViewPage,
            NoContent,
            MenuTopicEdit,
            TopicLay
        },
        watch: {
            blogId(value) {
                this.selectBlogId = undefined;
                this.$nextTick(() => {
                    this.selectBlogId = value;
                })
            }
        },
        created() {
            if (this.blogId) {
                this.selectBlogId = this.blogId;
            }
            this.fetchMenu();
        },
        methods: {
            fetchMenu() {
                let _this = this;
                _this.$axios.get(TOPIC_MENU_GET.replace("{topicId}", _this.topicId))
                    .then(function (response) {
                        if (response.data.code == 200) {
                            _this.menu = response.data.result.menu;
                            _this.editable = response.data.result.editable;
                            _this.loading = false;
                            _this.selectFirstLink();
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
            routeBlog(item) {
                if (item.menuType == 'link') {
                    this.$router.push('/topic/'.concat(this.topicId).concat('/blog/').concat(item.blogId));
                    this.selectBlogId = item.blogId;
                }
            },
            selectFirstLink() {
                let _this = this;
                let menu = _this.findFirstLinkMenu(_this.menu, _this.selectBlogId);
                if (! menu && _this.selectBlogId) {
                    window.location.href = '/topic/'.concat(_this.topicId);
                }
                if (menu) {
                    _this.selectedKeys = [ menu.menuId ];
                    _this.selectBlogId = menu.blogId;
                }
            },
            findFirstLinkMenu(menu, blogId) {
                let _this = this;
                for (let i = 0; i < menu.length; i++) {
                    if (menu[i].menuType == 'link') {
                        if (blogId) {
                            if (menu[i].blogId == blogId) {
                                return menu[i];
                            }
                        } else {
                            return menu[i];
                        }
                    }
                    if (menu[i].children) {
                        let findMenu = _this.findFirstLinkMenu(menu[i].children, blogId)
                        if (findMenu) {
                            if (menu[i].menuType == 'folder') {
                                _this.openKeys.push(menu[i].menuId);
                            }
                            return findMenu;
                        }
                    }
                }
                return null;
            }
        }
    }
</script>
<style>

</style>