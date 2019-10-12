import Vue from "vue";
import VueRouter from "vue-router";
import {LocaleProvider, Layout, Menu, Row, Col, Button, Icon, Skeleton, Avatar } from 'ant-design-vue';
import App from "./App";

Vue.use(VueRouter);
Vue.use(LocaleProvider);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Icon);
Vue.use(Skeleton);
Vue.use(Avatar);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
