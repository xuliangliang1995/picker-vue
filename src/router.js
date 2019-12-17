import Vue from 'vue';
import VueRouter from "vue-router";
Vue.use(VueRouter);
import FirstPage from "@/components/content/FirstPage";
import Register from "@/components/content/user/RegisterPage";
import Login from "@/components/content/user/LoginPage";
import Password from "@/components/content/user/PasswordPage";
import DraftsMd from "@/components/content/blog/MyDraftsMdPage";
import MyBlogPage from "@/components/content/blog/MyBlogPage";
import BlogListPage from "@/components/content/blog/MyBlogListPage";
import BlogViewPage from "@/components/content/blog/MyBlogViewPage";
import MenuLeft from "@/components/menu/MenuLeft";
import UserInfoPage from "@/components/content/user/UserInfoPage";
import UserSettingPage from "@/components/content/user/UserSettingPage";
import SettingPage from "@/components/content/user/SettingPage";
import MenuSetting from "@/components/menu/MenuSetting";
import NoContent from "@/components/content/NoContent";
import CategoryPage from "@/components/content/blog/MyCategoryPage";
import BindWechatPage from "@/components/content/user/BindWechatPage";
import CalendarPage from "@/components/content/blog/MyCalendarPage";
import PublicBlogViewPage from "@/components/content/blog/PublicBlogViewPage";
import UserMpQrcode from "@/components/content/user/UserMpQrcode";
import SearchPage from "@/components/content/search/SearchPage";
import MenuSearch from "@/components/menu/MenuSearch";
import BlogList from "@/components/content/blog/BlogList";
import UserList from "@/components/content/user/UserList";
import SearchHomePage from "@/components/content/search/SearchHomePage";
import RecycleBin from "@/components/content/blog/RecycleBin";
import MainPage from "@/components/content/MainPage";
import Topic from "@/components/content/topic/Topic";
import TopicList from "@/components/content/topic/TopicList";
import MyBlogViewPage from "@/components/content/blog/MyBlogViewPage";
import TopicListV2 from "@/components/content/topic/TopicListV2";
const routes = [
    {   path: '/', component: FirstPage },
    {   path: '/signUp', component: Register    },
    {   path: '/signIn', component: Login   },
    {   path: '/pwd', component: Password   },
    {   path: '/user', component: UserSettingPage,
        children: [
            {   path: '/user/info', components: {default: MenuSetting, content: UserInfoPage}, props: {default: {defaultIndex: 0 }}},
            {   path: '/user/mpQrcode', components: {default: MenuSetting, content: UserMpQrcode}, props: {default: {defaultIndex: 1}}},
            {   path: '/user/setting', components: {default: MenuSetting, content: SettingPage}, props: {default: {defaultIndex: 2}}},
            {   path: '/user/wechat', components: {default: MenuSetting, content: BindWechatPage}, props: {default: {defaultIndex: 3}}}
        ]
    },
    {   path: '/user/:pickerId', component: MainPage, props: true},
    {   path: '/search', component: SearchPage,
        children: [
            {   path: '/search', components: {default: MenuSearch, content: SearchHomePage}},
            {   path: '/search/blog', components: {default: MenuSearch, content: BlogList}, props: {default: {defaultIndex: 0}}},
            {   path: '/search/user', components: {default: MenuSearch, content: UserList}, props: {default: {defaultIndex: 1}}},
            {   path: '/search/subject', components: {default: MenuSearch, content: NoContent}, props: {default: {defaultIndex: 2}}}
        ]
    },
    {   path: '/blog/:blogId.html', component: PublicBlogViewPage, props: true},
    {   path: '/blog', component: MyBlogPage,
        children: [
            // 默认。同 /blog/list
            {   path: '/blog', components: {default: BlogListPage, sider: MenuLeft}, props: {default: false, sider: {selectKey: ['blog-list']}}},
            {   path: '/blog/drafts', components: {default: DraftsMd, sider: MenuLeft}, props: {default: false, sider: {selectKey: ['blog-draft']}}},
            {   path: '/blog/list', components: {default: BlogListPage, sider: MenuLeft}, props: {default: false, sider: {selectKey: ['blog-list']}}},
            {   path: '/blog/category', components: {default: CategoryPage, sider: MenuLeft}, props: {default: false, sider: {selectKey: ['blog-category']}}},
            {   path: '/blog/recycle-bin', components: {default: RecycleBin, sider: MenuLeft}, props: {default: true, sider: {selectKey: ['blog-recycle']}}},
            {   path: '/blog/:blogId', components: {default: BlogViewPage, sider: MenuLeft}, props: {default: true, sider: {selectKey: ['blog-list']}}},
            {   path: '/blog/:blogId/editor', components: {default: DraftsMd, sider: MenuLeft}, props: {default: true, sider: {selectKey: ['blog-category']}}}
        ]
    },
    {   path: '/topic', component: TopicListV2 },
    {   path: '/topic/:topicId', component: Topic, props: true },
    {   path: '/topic/:topicId/blog/:blogId', component: Topic, props: true },
    {   path: '/schedule', component: CalendarPage},
    {   path: '/message', component: NoContent},
    {   path: '/main', component: MainPage}
];

// const router = new VueRouter(routes);

export default new VueRouter({
    routes,
    mode: 'history',
    base: '/',
});