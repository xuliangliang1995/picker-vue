<template>
    <div>
        <a-layout class="main-wrapper">
            <a-row type="flex" justify="start">
                <a-col class="gutter-row" :span="4">
                    <slot name="sider"></slot>
                </a-col>
                <a-col class="gutter-row" :span="16">
                    <a-layout-content>
                        <div class="content-wrapper" id="picker-content">
                            <slot name="content"></slot>
                        </div>
                    </a-layout-content>
                </a-col>
            </a-row>
        </a-layout>
        <a-layout-footer :style="{'minHeight':'200px'}">
            <a-row type="flex" justify="space-around">
                <a-col>
                    <span id="footer-info">
                      京ICP备 18038495号-1
                    </span>
                </a-col>
            </a-row>
        </a-layout-footer>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        }
    }
</script>

<style scoped>
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