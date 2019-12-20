<template>
  <div id="components-layout-demo-basic">

    <a-layout :style="{minHeight:windowHeight}">
      <!-- 头部 -->
      <a-layout-header :style="{minHeight: headerHeight, background: 'white'}" id="header">
        <slot name="header"></slot>
      </a-layout-header>
      <router-view :style="{minHeight:contentHeight}"></router-view>
    </a-layout>

    <!-- 全局提权框 -->
    <a-drawer
            title="账户安全"
            placement="top"
            :closable="true"
            @close="onClose"
            :visible="visible"
            height="200px"
    >
      <PrivilegeForm/>
    </a-drawer>
  </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex';
  import { UPGRADE_PRIVILEGE } from "@/components/constant/mutation_types";
  import PrivilegeForm from "@/components/form/PrivilegeForm";
  const bodyHeight = document.body.clientHeight;
  const headerHeight = window.screen.height * 5 / 100;
  const contentHeight = bodyHeight - headerHeight;
  export default {
    data () {
      return {
        windowHeight: bodyHeight.toString().concat('px'),
        headerHeight: headerHeight.toString().concat('px'),
        contentHeight: contentHeight.toString().concat('px')
      }
    },
    components: {
      PrivilegeForm
    },
    methods: {
      onClose() {
        this.upgradePrivilege({
           privilege: false,
           url: undefined
        });
      },
      ...mapMutations({
        upgradePrivilege: UPGRADE_PRIVILEGE
      })
    },
    computed: {
      visible() {
        return this.upgrade_privilege && ! this.privilege ;
      },
      ...mapState([
        'upgrade_privilege',
        'privilege'
      ])
    }
  }
</script>
<style>
  #header {
    padding: 0px;
    box-shadow: 0 2px 8px #f0f1f2;
    background: #fff;
    z-index: 1;
  }

  #footer-info {
    color: #fff;
    text-align: center;
  }
  .ant-layout {
    background: #fff;
  }
  .ant-layout-footer {
    background: #000;
  }
  #header .ant-affix {
    background: white;
  }
  /*#header {
    z-index: 100;
  }*/

</style>