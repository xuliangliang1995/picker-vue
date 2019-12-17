<template>
    <div title="排序" class="ant-table-column-sorter">
        <a-row :style="{height: '15px', width: '15px'}">
            <i aria-label="图标: caret-up" class="ant-table-column-sorter-up off anticon anticon-caret-up" @click="up">
                <svg viewBox="0 0 1024 1024" data-icon="caret-up" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" :style="upStyle">
                    <path d="M858.9 689L530.5 308.2c-9.4-10.9-27.5-10.9-37 0L165.1 689c-12.2 14.2-1.2 35 18.5 35h656.8c19.7 0 30.7-20.8 18.5-35z">
                    </path>
                </svg>
            </i>
        </a-row>
        <a-row :style="{height: '15px', width: '15px'}">
            <i aria-label="图标: caret-down" class="ant-table-column-sorter-down on anticon anticon-caret-down" @click="down">
                <svg viewBox="0 0 1024 1024" data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" :style="downStyle">
                    <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z">
                    </path>
                </svg>
            </i>
        </a-row>
    </div>
</template>

<script>
    export default {
        name: "Sortable",
        data() {
            return {
                sort: 1
            }
        },
        computed: {
            upStyle() {
                if (this.sort == 1) {
                    return {
                        color: '#1890ff'
                    }
                }
                return {};
            },
            downStyle() {
                if (this.sort == 2) {
                    return {
                        color: '#1890ff'
                    }
                }
                return {};
            }
        },
        methods: {
            up() {
                if (this.sort == 1) {
                    this.sort = 3;
                } else {
                    this.sort = 1;
                }
            },
            down() {
                if (this.sort == 2) {
                    this.sort = 3;
                } else {
                    this.sort = 2;
                }
            }
        }
    }
</script>

<style scoped>
    .blue {
        color: #1890ff
    }
</style>