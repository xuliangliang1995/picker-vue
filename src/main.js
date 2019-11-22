import Vue from "vue";
import VueRouter from "vue-router";
import {LocaleProvider, Layout, Menu, Row, Col, Button, Icon, Skeleton, Avatar, Divider, Input, Form, AutoComplete, Steps, Message,
Dropdown, Drawer, Radio, notification, List, Spin, Upload, Select, Tag, Modal, InputNumber, Tree, Breadcrumb, Switch, TreeSelect,
Affix, BackTop, Calendar, TimePicker, Carousel, Card, Comment, Tooltip, Alert } from 'ant-design-vue';
import App from "./App";
import router from "./router";
import axios from 'axios';
import store from "@/store";
import { UPDATE_ACCESS_TOKEN, UPDATE_REFRESH_TOKEN } from "@/components/constant/mutation_types";
import { CHECK_ACCESS_TOKEN } from "@/components/constant/action_types";
import moment from 'moment';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

// use
Vue.use(mavonEditor)
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
Vue.use(Message);
Vue.use(Dropdown);
Vue.use(Drawer);
Vue.use(Radio);
Vue.use(List);
Vue.use(Spin);
Vue.use(Upload);
Vue.use(Select);
Vue.use(Tag);
Vue.use(Modal);
Vue.use(InputNumber);
Vue.use(Tree);
Vue.use(Breadcrumb);
Vue.use(Switch);
Vue.use(TreeSelect);
Vue.use(Affix);
Vue.use(BackTop);
Vue.use(Calendar);
Vue.use(TimePicker);
Vue.use(Carousel);
Vue.use(Card);
Vue.use(Comment);
Vue.use(Tooltip);
Vue.use(Alert);

Vue.prototype.$moment = moment;
Vue.prototype.$message = Message;
Vue.prototype.$notification = notification;

/**
 * axios
 * @type {AxiosInstance}
 */
let instance = axios.create({
  headers: {'Content-Type': 'application/json;charset=utf-8'},
  timeout: 100000
});
instance.interceptors.request.use(
       async config => {
           await store.dispatch(CHECK_ACCESS_TOKEN);
        let accessToken = store.state.access_token;
        if (accessToken != null) {
            config.headers['access_token'] = accessToken;
        }
        return config
    },
    err => {
        return Promise.reject(err)
    })
instance.interceptors.response.use(
    response => {
      let accessToken = response.headers.access_token;
      let refreshToken = response.headers.refresh_token;
      if (accessToken != undefined && accessToken.length > 0) {
        store.commit(UPDATE_ACCESS_TOKEN, accessToken);
      }
      if (refreshToken != undefined && refreshToken.length > 0) {
        store.commit(UPDATE_REFRESH_TOKEN, refreshToken);
      }
      return response;
    },
    error => {
      return Promise.reject(error)
    }
)
Vue.prototype.$axios = instance;
Vue.config.productionTip = false;

new Vue({
  router, store,
  render: h => h(App)
}).$mount("#app");

