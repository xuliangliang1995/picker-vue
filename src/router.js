import Vue from 'vue';
import VueRouter from "vue-router";
Vue.use(VueRouter);
import FirstPage from "@/components/content/FirstPage";
import Register from "@/components/content/RegisterPage";
import Login from "@/components/content/LoginPage";
import Password from "@/components/content/PasswordPage";
import DraftsMd from "@/components/content/DraftsMdPage";
import MyBlogPage from "@/components/content/MyBlogPage";
import BlogListPage from "@/components/content/BlogListPage";
import BlogViewPage from "@/components/content/BlogViewPage";
import MenuLeft from "@/components/menu/MenuLeft";
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
        path: '/blog',
        component: MyBlogPage,
        children: [
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
                name: 'draft',
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
            }
        ]
    }
];

// const router = new VueRouter(routes);

export default new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
});