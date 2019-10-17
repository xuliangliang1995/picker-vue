<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <Lay>
        <!-- 页面头 -->
        <a-row slot="header" type="flex" justify="space-around">
          <a-col :span="2">
            <div id="logo">
              <img class="logo-img" src="https://grasswort.oss-cn-hangzhou.aliyuncs.com/logo/grasswort.png"/>
            </div>
          </a-col>
          <a-col :span="16">
            <MenuTop/>
          </a-col>
          <a-col :span="4">
            <template v-if="isLoggingIn">
              <a-dropdown>
                <a-avatar size="large" icon="user" src="https://grasswort.oss-cn-hangzhou.aliyuncs.com/logo/girl.jpeg"/>
                <MenuAvator slot="overlay"/>
              </a-dropdown>
            </template>
            <a-button v-if="! isLoggingIn" type="primary" class="header-btn" ghost @click="toSignIn">登录</a-button>
            <a-button v-if="! isLoggingIn" type="primary" class="header-btn" @click="toSignUp">注册</a-button>
          </a-col>
        </a-row>

        <MenuLeft slot="sider"/>
        <FirstPage slot="content"/>
      </Lay>

    </a-locale-provider>
  </div>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  moment.locale('zh-cn');

  import Lay from "@/components/layout/Lay";
  import MenuTop from "@/components/menu/MenuTop";
  import MenuLeft from "@/components/menu/MenuLeft";
  import FirstPage from "@/components/content/FirstPage";
  import MenuAvator from "@/components/menu/MenuAvator";
  import { mapGetters } from 'vuex';

  export default {
    name: 'app',
    components: {
      Lay,
      MenuTop,
      MenuLeft,
      FirstPage,
      MenuAvator
    },
    data() {
      return {
        loggingIn: false,
        locale: zh_CN
      }
    },
    methods: {
      toSignUp: function () {
        this.$router.push("/signUp");
      },
      toSignIn: function () {
        this.$router.push("/signIn")
      }
    },
    computed: mapGetters([
      'isLoggingIn'
    ])
  }
</script>
<style>
  #logo {
    height: 40px;
    text-align: center;
  }
  .logo-img {
    height: 100%;
  }
  .header-btn {
    margin-left: 5px;
  }
</style>

