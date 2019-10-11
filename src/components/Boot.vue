<template>
  <div id="components-layout-demo-basic">

    <a-layout>
      <a-layout-header id="header"><slot name="header"></slot></a-layout-header>

      <a-layout class="main-wrapper">
        <a-row :gutter="24" type="flex" justify="start">

          <a-col class="gutter-row" :span="4">
            <slot name="sider"></slot>
          </a-col>
          <a-col class="gutter-row" :span="16">
            <div class="content-wrapper">
              <slot name="content"></slot>
              <slot name="footer"></slot>
            </div>
          </a-col>
        </a-row>
      </a-layout>
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
  }
  .content-wrapper {
    padding: 0px 40px 0 40px;
  }
  .ant-layout {
    background: #fff;
  }
  .ant-layout-footer {
    background: #000;
  }

</style>