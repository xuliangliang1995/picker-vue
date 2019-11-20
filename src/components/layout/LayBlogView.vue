<template>
    <a-layout class="main-wrapper" :style="{height: '100%'}">
        <!--<a-layout-sider width="8%" :style="{height: '100%'}">
            <slot name="sider" :style="{height: '100%'}"></slot>
        </a-layout-sider>-->
        <a-layout-content width="100%" :style="{height: '100%'}">
            <a-layout>
                <a-layout-content :style="{minHeight:'1080px'}">
                    <div class="content-wrapper" id="picker-content">
                        <slot name="content"></slot>
                    </div>
                </a-layout-content>
            </a-layout>
            <a-layout-footer :style="{minHeight:'200px'}">
                <a-row type="flex" justify="space-around">
                    <a-col>
                    <span id="footer-info">
                      京ICP备 18038495号-1
                    </span>
                    </a-col>
                </a-row>
            </a-layout-footer>
        </a-layout-content>
    </a-layout>
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
        padding: 40px 0px 0 0;
        min-height: 80%;
    }
    .content-wrapper {
        padding: 0px 40px 0 40px;
    }
</style>