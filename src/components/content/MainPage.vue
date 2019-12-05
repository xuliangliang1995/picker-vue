<template>
    <a-layout class="main-wrapper">
        <a-row type="flex" justify="start">
            <a-col class="gutter-row" :span="15" :offset="3">
                <div class="content-wrapper" id="picker-content">
                    <a-card>
                        <a-card-meta title="Card title" description="This is the description">
                            <a-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" style="width: 100px;height: 100px"/>
                            哈哈
                        </a-card-meta>
                        内容
                    </a-card>
                    <div :style="{marginTop:'20px', minHeight:'500px'}">
                        <a-tabs defaultActiveKey="1" @change="callback">
                            <a-tab-pane tab="文章" key="1">Content of Tab Pane 1</a-tab-pane>
                            <a-tab-pane tab="专题" key="2" forceRender>Content of Tab Pane 2</a-tab-pane>
                            <a-tab-pane tab="Tab 3" key="3">Content of Tab Pane 3</a-tab-pane>
                        </a-tabs>
                    </div>
                </div>
            </a-col>
            <a-col class="gutter-row" :span="4">
                <slot name="sider"></slot>
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