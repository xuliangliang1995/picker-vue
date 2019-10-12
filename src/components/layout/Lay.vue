<template>
  <div id="components-layout-demo-basic">

    <a-layout>
      <!-- 头部 -->
      <a-layout-header id="header"><slot name="header"></slot></a-layout-header>

      <a-layout class="main-wrapper">
        <a-row :gutter="24" type="flex" justify="start">
          <a-col class="gutter-row" :span="4">
            <slot name="sider"></slot>
          </a-col>
          <a-col class="gutter-row" :span="16">
            <div class="content-wrapper">
              <slot name="content"></slot>

            </div>
          </a-col>
        </a-row>
      </a-layout>
      <!-- Footer  -->
      <a-layout-footer>
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
  .main-wrapper {
    padding: 40px 40px 0 0;
    min-height: 80%;
  }
  .content-wrapper {
    padding: 0px 40px 0 40px;
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