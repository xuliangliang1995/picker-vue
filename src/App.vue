<template>
  <div id="app">
    <a-back-top />
    <a-locale-provider :locale="locale">
      <Lay>
        <!-- 页面头 -->
        <a-row slot="header" type="flex" justify="space-around">
          <a-col :span="2">
            <div id="logo">
              <img class="logo-img" @click="toFirstPage" src="https://picker-oss.oss-cn-beijing.aliyuncs.com/meta/grasswort.png_target"/>
            </div>
          </a-col>
          <a-col :span="8">
            <MenuTop/>
          </a-col>
          <a-col :span="6" :style="{width:'200px'}">
            <a-input placeholder="搜索" v-model="keyword" @keyup.enter="toSearch">
              <a-icon slot="prefix" type="search"/>
            </a-input>
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
      </Lay>
    </a-locale-provider>
    <Init v-if="isLoggingIn"/>
  </div>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import { mapState, mapGetters, mapActions } from 'vuex';
  import { SEARCH } from "@/components/constant/action_types";
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  moment.locale('zh-cn');

  import Init from "@/components/content/Init";
  import Lay from "@/components/layout/Lay";
  import MenuTop from "@/components/menu/MenuTop";
  import MenuAvator from "@/components/menu/MenuAvator";

  export default {
    name: 'app',
    components: {
      Lay,
      MenuTop,
      MenuAvator,
      Init
    },
    data() {
      return {
        keyword: '',
        loggingIn: false,
        locale: zh_CN
      }
    },
    created() {
      if (this.$route.query.q) {
        this.keyword = this.$route.query.q;
      }
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
      ...mapActions({
        'search': SEARCH
      }),
      toSignUp: function () {
        this.$router.push("/signUp");
      },
      toSignIn: function () {
        this.$router.push("/signIn")
      },
      toDrafts: function () {
        this.$router.push('/blog/drafts');
      },
      toFirstPage: function () {
        this.$router.push('/');
      },
      toSearch: function () {
        let key = [this.$route.path.split("/")[1].length > 0 ? this.$route.path.split("/")[1] : 'home'];
        let isSearch = "search" == key;
        if (this.keyword && this.keyword != '') {
          this.search(this.keyword);
        }
        if (isSearch) {
          window.location.href = this.$route.path.concat("?q=").concat(this.keyword)
        } else {
          window.open('/search?q='.concat(this.keyword), "_blank");
        }
      }
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

