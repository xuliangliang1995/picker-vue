import Vue from 'vue';
import VueRouter from "vue-router";
Vue.use(VueRouter);
import FirstPage from "@/components/content/FirstPage";
import Register from "@/components/content/user/RegisterPage";
import Login from "@/components/content/user/LoginPage";
import Password from "@/components/content/user/PasswordPage";
import DraftsMd from "@/components/content/blog/DraftsMdPage";
import MyBlogPage from "@/components/content/blog/MyBlogPage";
import BlogListPage from "@/components/content/blog/BlogListPage";
import BlogViewPage from "@/components/content/blog/BlogViewPage";
import MenuLeft from "@/components/menu/MenuLeft";
import UserInfoPage from "@/components/content/user/UserInfoPage";
import UserSettingPage from "@/components/content/user/UserSettingPage";
import SettingPage from "@/components/content/user/SettingPage";
import MenuSetting from "@/components/menu/MenuSetting";
import NoContent from "@/components/content/NoContent";
import CategoryPage from "@/components/content/blog/CategoryPage";
const routes = [
    {
        path: '/',
        component: FirstPage
    },
    {
        path: '/signUp',
        component: Register
    },
    {
        path: '/signIn',
        component: Login
    },
    {
        path: '/pwd',
        component: Password
    },
    {
        path: '/user',
        component: UserSettingPage,
        children: [
            {
                path: '/user/info',
                components: {
                    default: MenuSetting,
                    content: UserInfoPage
                },
                props: {
                    default: {
                        defaultIndex: 0
                    }
                }
            },
            {
                path: '/user/setting',
                components: {
                    default: MenuSetting,
                    content: SettingPage
                },
                props: {
                    default: {
                        defaultIndex: 1
                    }
                }
            }
        ]
    },
    {
        path: '/blog',
        component: MyBlogPage,
        children: [
            // 默认。同 /blog/list
            {
                path: '/blog',
                components: {
                    default: BlogListPage,
                    sider: MenuLeft
                },
                props: {
                    default: false,
                    sider: {
                        selectKey: ['blog-list']
                    }
                }
            },
            {
                path: '/blog/drafts',
                components: {
                    default: DraftsMd,
                    sider: MenuLeft
                },
                props: {
                    default: false,
                    sider: {
                        selectKey: ['blog-draft']
                    }
                }
            },
            {
                path: '/blog/list',
                components: {
                    default: BlogListPage,
                    sider: MenuLeft
                },
                props: {
                    default: false,
                    sider: {
                        selectKey: ['blog-list']
                    }
                }
            },
            {
                path: '/blog/category',
                components: {
                    default: CategoryPage,
                    sider: MenuLeft
                },
                props: {
                    default: false,
                    sider: {
                        selectKey: ['blog-category']
                    }
                }
            },
            {
                path: '/blog/:blogId',
                components: {
                    default: BlogViewPage,
                    sider: MenuLeft
                },
                props: {
                    default: true,
                    sider: {
                        selectKey: ['blog-list']
                    }
                }
            },
            {
                path: '/blog/:blogId/editor',
                components: {
                    default: DraftsMd,
                    sider: MenuLeft
                },
                props: {
                    default: true,
                    sider: {
                        selectKey: ['blog-category']
                    }
                }
            }
        ]
    },
    {
        path: '/topic',
        component: NoContent
    },
    {
        path: '/schedule',
        component: NoContent
    },
    {
        path: '/message',
        component: NoContent
    },
    {
        path: '/main',
        component: NoContent
    }
];

// const router = new VueRouter(routes);

export default new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
});