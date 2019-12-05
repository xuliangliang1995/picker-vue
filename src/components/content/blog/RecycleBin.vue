<template>
    <a-table
            :columns="columns"
            :rowKey="record => record.blogId"
            :dataSource="data"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
    >
        <span slot="operation" slot-scope="record" class="table-operation">
            <a href="#" @click.prevent.stop="recycleBlog(record.blogId)">回收</a>
        </span>
    </a-table>
</template>
<script>
    import { BLOG_RECYCLE_BIN, BLOG_RECYCLE_PATCH } from "@/components/constant/url_path";

    const columns = [
        {
            title: '标题',
            dataIndex: 'title'
        },
        {
            title: '删除时间',
            dataIndex: 'gmtModified'
        },
        {
            title: '回收截止时间',
            dataIndex: 'recycleDeadline'
        },
        {
            title: '操作',
            key: 'operation',
            scopedSlots: { customRender: 'operation' }
        }
    ];

    export default {
        mounted() {
            this.fetchData();
        },
        data() {
            return {
                data: [],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0
                },
                loading: false,
                columns,
            };
        },
        methods: {
            handleTableChange(pagination) {
                const pager = { ...this.pagination };
                pager.current = pagination.current;
                this.pagination = pager;
                this.fetchData();
            },
            fetchData() {
                let _this = this;
                _this.loading = true;
                _this.$axios.get(
                    BLOG_RECYCLE_BIN.concat("?pageNo=").concat(_this.pagination.current).concat("&pageSize=").concat(_this.pagination.pageSize)
                ).then(function (response) {
                    let code = response.data.code;
                    _this.loading = false;
                    if (code == 200) {
                        const pagination = { ..._this.pagination };
                        pagination.total = response.data.total;
                        _this.data = response.data.result;
                        _this.pagination = pagination;
                    }
                })
            },
            // 回收博客
            recycleBlog(blogId) {
                let _this = this;
                _this.loading = true;
                _this.$axios.patch(BLOG_RECYCLE_PATCH.replace("{blogId}", blogId))
                    .then(function (response) {
                        _this.loading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            // 从左侧移除
                            _this.fetchData();
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.loading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            }
        },
    };
</script>

<style scoped>

</style>