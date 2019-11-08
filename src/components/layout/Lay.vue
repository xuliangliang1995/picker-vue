<template>
  <div id="components-layout-demo-basic">

    <a-layout :style="{minHeight:windowHeight}">
      <!-- 头部 -->
      <a-layout-header :style="{minHeight: headerHeight}" id="header">
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
  console.log(bodyHeight);
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
        this.upgradePrivilege(false);
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
    z-index: 10;
    background: #fff;
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

</style>