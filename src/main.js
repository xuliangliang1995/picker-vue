import Vue from "vue";
import {LocaleProvider, Layout, Menu, Row, Col, Button, Icon } from 'ant-design-vue';
import App from "./App";

Vue.use(LocaleProvider);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Row);
Vue.use(Col);
Vue.use(Button);
Vue.use(Icon);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
