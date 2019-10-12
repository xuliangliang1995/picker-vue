import Vue from 'vue';
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
    {
        path: '/home',
        component: VueRouter
    }
];

const router = new VueRouter(routes);

export default router;