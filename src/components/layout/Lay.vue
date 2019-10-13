<template>
  <div id="components-layout-demo-basic">

    <a-layout>
      <!-- 头部 -->
      <a-layout-header :style="{'minHeight':headerHeight}" id="header"><slot name="header"></slot></a-layout-header>

      <router-view :style="{'minHeight':contentHeight}">

      </router-view>
      <!-- Footer  -->
      <a-layout-footer :style="{'minHeight':footerHeight}">
        <a-row type="flex" justify="space-around">
          <a-col>
            <span id="footer-info">
              京ICP备 18038495号-1
            </span>
          </a-col>
        </a-row>

      </a-layout-footer>
    </a-layout>

  </div>
</template>
<script>
  export default {
    data () {
      return {
        headerHeight: (window.screen.height * 5 / 100) + "px",
        contentHeight: (window.screen.height * 95 / 100) + "px",
        footerHeight: (window.screen.height * 10 / 100) + "px"
      }
    },
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