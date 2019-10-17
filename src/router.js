import Vue from 'vue';
import VueRouter from "vue-router";
Vue.use(VueRouter);
import FirstPage from "@/components/content/FirstPage";
import Register from "@/components/content/Register";
import Login from "@/components/content/Login";
import Password from "@/components/content/Password";
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
    }
];

// const router = new VueRouter(routes);

export default new VueRouter({
    routes,
    mode: 'history',
    base: process.env.BASE_URL,
});