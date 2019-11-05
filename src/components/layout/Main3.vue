<template>
    <a-layout class="main-wrapper">
        <a-row type="flex" justify="start">
            <a-col class="gutter-row" :span="1" :offset="1">
                <slot name="sider"></slot>
            </a-col>
            <a-col class="gutter-row" :span="16">
                <div class="content-wrapper" id="picker-content">
                    <slot name="content"></slot>
                </div>
            </a-col>
        </a-row>
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
        padding: 40px 40px 0 0;
        min-height: 80%;
    }
    .content-wrapper {
        padding: 0px 40px 0 40px;
    }
</style>