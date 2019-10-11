<template>
  <div id="app">
    <a-locale-provider :locale="locale">
      <Boot>
        <a-row :gutter="24" slot="header" type="flex" justify="space-around">
          <a-col :span="2">
            <div id="logo">
              <img height="100%" src="https://grasswort.oss-cn-hangzhou.aliyuncs.com/logo/grasswort.png"/>
            </div>
          </a-col>
          <a-col :span="16">
            <MenuTop/>
          </a-col>
          <a-col :span="4">
            <a-avatar size="large" icon="user"/>
          </a-col>
        </a-row>

        <MenuLeft slot="sider"/>
        <ContentDemo slot="content"/>
      </Boot>
      <!--<img src="./assets/logo.png">
      <a-button type="primary">Button></a-button>-->
    </a-locale-provider>
  </div>
</template>

<script>
  import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
  import moment from 'moment';
  import 'moment/locale/zh-cn';
  moment.locale('zh-cn');

  import Boot from "@/components/Boot";
  import MenuTop from "@/components/menu/MenuTop";
  import MenuLeft from "@/components/menu/MenuLeft";
  import ContentDemo from "@/components/content/ContentDemo";

  export default {
    name: 'app',
    components: {
      Boot,
      MenuTop,
      MenuLeft,
      ContentDemo
    },
    data() {
      return {
        locale: zh_CN
      }
    }
  }
</script>
<style>
  #logo {
    height: 40px;
    text-align: center;
  }
</style>

