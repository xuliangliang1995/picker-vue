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
          <a-col :span="2" v-if="isLoggingIn">
            <a-button type="primary" class="header-btn" ghost @click="toDrafts"><a-icon type="edit" />写文章</a-button>
          </a-col>
          <a-col :span="isLoggingIn ? 2 : 4">
            <template v-if="isLoggingIn">
              <a-dropdown>
                <a-avatar size="large" icon="user" :src="avatar"/>
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
  import { USER_INFO_GET } from "@/components/constant/url_path";
  import { UPDATE_AVATAR} from "@/components/constant/mutation_types";
  import { mapState, mapGetters, mapMutations } from 'vuex';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  moment.locale('zh-cn');

  import Lay from "@/components/layout/Lay";
  import MenuTop from "@/components/menu/MenuTop";
  import MenuLeft from "@/components/menu/MenuLeft";
  import FirstPage from "@/components/content/FirstPage";
  import MenuAvator from "@/components/menu/MenuAvator";

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
    created() {
      let _this = this;
      _this.$axios.get(USER_INFO_GET)
              .then(function (response) {
                let code = response.data.code;
                if (code == 200) {
                  _this.updateAvatar(response.data.result.avatar);
                }
              })
    },
    computed: {
      ...mapGetters([
        'isLoggingIn',
      ]),
      ...mapState([
        'avatar'
      ])
    },
    methods: {
      toSignUp: function () {
        this.$router.push("/signUp");
      },
      toSignIn: function () {
        this.$router.push("/signIn")
      },
      toDrafts: function () {
        this.$router.push('/blog/drafts');
      },
      ...mapMutations({
        'updateAvatar': UPDATE_AVATAR
      })
    }
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
  .ant-dropdown {
    z-index: 2000;
  }
</style>

