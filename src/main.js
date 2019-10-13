import Vue from "vue";
import VueRouter from "vue-router";
import {LocaleProvider, Layout, Menu, Row, Col, Button, Icon, Skeleton, Avatar, Divider, Input, Form, AutoComplete, Steps } from 'ant-design-vue';
import App from "./App";
import router from "./router";
import axios from 'axios';
import VueAxios from "vue-axios";

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
Vue.use(Divider);
Vue.use(Input);
Vue.use(Form);
Vue.use(AutoComplete);
Vue.use(Steps);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
