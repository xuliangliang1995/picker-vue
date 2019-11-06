<template>
    <div>
        <a-row type="flex" justify="start" align="top">
            <a-col :span="16">
                调试：{{current}}
                <a-list bordered :dataSource="currentData">
                    <a-list-item slot="renderItem" slot-scope="item, index" :style="{width:'100%'}">
                        <a-row :key="index" justify="start" align="middle">
                            <template v-if="item.parentId >= 0">
                                <a-icon type="folder-open"/>
                                <a @click="routeCategory(item.key)">
                                    {{item.title}}
                                </a>
                            </template>
                            <template v-else>
                                <router-link :to="item.route" target="_blank">
                                    <a-icon type="file-markdown" />
                                    {{item.title}}
                                </router-link>
                            </template>
                        </a-row>
                        <a-icon v-if="blogCanMove && ! (item.parentId >= 0) && ! sync " slot="actions" type="export" @click="transferBlog(item.key, item.title)"/>
                    </a-list-item>
                    <div slot="header">
                        <a-row type="flex" justify="start" align="middle">
                            <a-col :span="18">
                                <a-breadcrumb>
                                    <template v-for="bread in breadcrumb">
                                        <a-breadcrumb-item :key="bread.key" @click="routeCategory(bread.key)">
                                            <a-icon v-if="bread.icon" :type="bread.icon" @click="routeCategory(bread.key)"/>
                                            <a @click="routeCategory(bread.key)">
                                                {{bread.text}}
                                            </a>
                                        </a-breadcrumb-item>
                                    </template>
                                </a-breadcrumb>
                            </a-col>
                            <a-col :span="1" :offset="5">
                                <a-icon type="sync" :spin="loading" @click="loadData"/>
                            </a-col>
                        </a-row>
                    </div>
                    <!--<div slot="footer">注：可以把分类理解为文件夹。便于博客的归纳整理。</div>-->
                </a-list>
            </a-col>
            <a-col :span="6" :offset="1">
                调试：{{ selectedKeys }}
                <a-list bordered>
                    <a-list-item>
                        <a-directory-tree
                                :autoExpandParent="true"
                                :defaultExpandAll="true"
                                :expandedKeys="expandedKeys"
                                :treeData="dataWithLeaf"
                                :draggable="true"
                                :selectedKeys="selectedKeys"
                                @expand="expand"
                                @dragstart="dragstart"
                                @dragenter="dragenter"
                                @select="treeSelect"
                        />
                    </a-list-item>
                    <div slot="header">
                        <a-row type="flex" justify="start" align="middle">
                            <a-col :span="4" >
                                <a-icon type="folder-add" @click="() => modal.visible=true"/>
                            </a-col>
                            <a-col :span="4" >
                                <a-icon type="delete" />
                            </a-col>
                            <a-col :span="4" >
                                <a-icon type="sync" :spin="loading" @click="loadData"/>
                            </a-col>
                            <a-col :span="8" :offset="4">
                                <a-switch checkedChildren="同步" unCheckedChildren="锁定" v-model="sync" />
                            </a-col>
                        </a-row>
                    </div>
                </a-list>
            </a-col>
        </a-row>
        <a-modal
                title="添加博客分类"
                v-model="modal.visible"
                :confirmLoading="modal.confirmLoading"
                :destroyOnClose="true"
                @ok="addCategory"
                okText="确认"
                cancelText="取消">
            <p><a-input placeHolder="长度在 1 ~ 20 之间" v-model="modal.value" @change="categoryValueChange"/></p>
        </a-modal>
    </div>
</template>

<script>
    import { CATEGORY_TREE_GET, CATEGORY_POST, BLOG_LIST_GET, BLOG_CATEGORY_PATCH } from "@/components/constant/url_path";

    /**
     * 匹配 当前 key 的子节点
     * @param items
     * @param key
     * @returns {null|*|null}
     */
    function matches(items, key) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key == key) {
                return items[i].children;
            }
            if (items[i].children && items[i].children.length > 0) {
                let result =  matches(items[i].children, key);
                if (result != null) {
                    return result;
                }
            }
        }
        return null;
    }
    /**
     * 插入元素
     */
    function insertLeaf(items, item) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key == item.parentId) {
                items[i].children.push(item);
            }
            if (items[i].children && items[i].children.length > 0) {
                insertLeaf(items[i].children, item);
            }
        }
    }
    /**
     * 拼接面包屑
     * @param breads
     * @param items
     * @param key
     * @returns {null|*|null}
     */
    function jointBread(breads, items, key) {
        for (let i = 0; i < items.length; i++) {
            breads.push({ key: items[i].key, text:items[i].title});
            if (items[i].key == key) {
                return breads;
            }
            if (items[i].children && items[i].children.length > 0) {
                let result =  jointBread(breads, items[i].children, key);
                if (result != null) {
                    return result;
                }
            }
            breads.pop();
        }
        return null;
    }
    export default {
        name: "CategoryPage",
        data() {
            return {
                current:  0 ,
                currentData: [],
                selectedKeys: [],
                expandedKeys: [],
                data: [],
                leaf: [],
                loading: false,
                sync: true,
                modal: {
                    visible: false,
                    value: '',
                    confirmLoading: false
                }
            }
        },
        created() {
            this.loadData();
        },
        computed: {
            // 文件夹数据 + 操作中叶子数据
            dataWithLeaf() {
                let home = {

                }
                let dataCopy = this.data.concat();
                let leafCopy = this.leaf.concat();
                for (let i = 0; i < leafCopy.length; i++) {
                    insertLeaf(dataCopy, leafCopy[i])
                }
                return dataCopy;
            },
            // 面包屑
            breadcrumb() {
                let breads = [
                    { key: 0, icon: 'home', text:''}
                ];
                if (this.current == 0) {
                    return breads;
                }
                let result = jointBread(breads, this.data, this.current);
                if (result != null) {
                    return result;
                }
                return breads;
            },
            // 左右是否在同一文件夹下
            blogCanMove() {
                if (this.selectedKeys.length == 0 && this.current == 0) {
                    return false;
                }
                if (this.selectedKeys[0] == this.current) {
                    return false;
                }
                return true;
            }
        },
        methods: {
            routeCategory(key) {
                let _this = this;
                _this.current = key;
                if (_this.sync) {
                    _this.selectedKeys = [key];
                    // 顺手打开所有关联的父节点
                    for (let i = 0; i < _this.breadcrumb.length - 1 ; i++) {
                        let key = _this.breadcrumb[i].key;
                        let expanded = false;
                        for (let j = 0; j < _this.expandedKeys.length; j++) {
                            if (key == _this.expandedKeys[j]) {
                                expanded = true;
                                break;
                            }
                        }
                        if (! expanded) {
                            _this.expandedKeys.push(key);
                        }
                    }
                }
                // 更新 currentData
                if (_this.current == 0) {
                    _this.currentData = _this.data.concat();
                } else {
                    let items = matches(_this.data, _this.current);

                    if (items != null) {
                        let backs = [{ key: this.breadcrumb[this.breadcrumb.length-2].key, parentId: 0, title: '. .', children: []}];
                        for (let i = 0; i < items.length; i++) {
                            backs.push(items[i]);
                        }
                        _this.currentData = backs;
                    } else {
                        _this.currentData = [];
                    }
                }
                // 获取博客信息
                _this.loading = true;
                _this.$axios.get(BLOG_LIST_GET + "?pageNo=1&pageSize=10&categoryId=" + _this.current)
                    .then(function (response) {
                        _this.loading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.loading = false;
                            let blogs = response.data.result;
                            for (let i = 0; i < blogs.length ; i++) {
                                _this.currentData.push({
                                    key: blogs[i].blogId,
                                    title: blogs[i].title,
                                    route: '/blog/'.concat(blogs[i].blogId)
                                })
                            }
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.loading = false;
                        _this.$message.warn("当前网络不稳定，请刷新重试。")
                    })
            },
            treeSelect(selectedKeys) {
                if (this.selectedKeys.length > 0 && selectedKeys.length > 0 && this.selectedKeys[0] == selectedKeys[0]) {
                    // 说明重复点击，认为是取消
                    if (this.sync) {
                        this.routeCategory(0);
                    }
                    this.selectedKeys = [];
                } else {
                    this.selectedKeys = selectedKeys;
                    if (this.sync) {
                        if (this.selectedKeys.length == 0) {
                            this.routeCategory(0);
                        } else {
                            this.routeCategory(this.selectedKeys[0]);
                        }
                    }
                }
            },
            loadData() {
                let _this = this;
                _this.loading = true;
                _this.$axios.get(CATEGORY_TREE_GET)
                    .then(function (response) {
                        let code = response.data.code;
                        if (code == 200) {
                            _this.data = response.data.result.nodes;
                            _this.routeCategory(_this.current);
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                        _this.loading = false;
                    }).catch(function () {
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                        _this.loading = false;
                    })
            },
            addCategory() {
                let _this = this;
                _this.modal.confirmLoading = true;
                _this.$axios.post(CATEGORY_POST, {
                    parentId: _this.selectedKeys.length == 0 ? 0 :_this.selectedKeys[0],
                    category: _this.modal.value
                }).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        _this.modal.visible = false;
                        _this.modal.value = '';
                        _this.modal.confirmLoading = false;
                        _this.loadData();
                    } else {
                        _this.modal.confirmLoading = false;
                        _this.$message.warn(response.data.message);
                    }
                }).catch(function () {
                    _this.modal.confirmLoading = false;
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                })
            },
            // 转移博客到右侧所选文件夹
            transferBlog(blogId, title) {
                let _this = this;
                let categoryId = 0;
                if (_this.selectedKeys.length > 0) {
                    categoryId = _this.selectedKeys[0];
                }
                _this.loading = true;
                _this.$axios.patch(BLOG_CATEGORY_PATCH.replace("{blogId}", blogId), {
                    categoryId: categoryId
                }).then(function (response) {
                    let code = response.data.code;
                    _this.loading = false;
                    if (code == 200) {
                        // 从左侧移除
                        for (let j = 0; j < _this.currentData.length ; j++) {
                            if (_this.currentData[j].key == blogId) {
                                _this.currentData.splice(j, 1);
                                break;
                            }
                        }
                        // 从右侧移除并重新添加
                        for (let i = 0; i < _this.leaf.length; i++) {
                            if (_this.leaf[i].key == blogId) {
                                _this.leaf.splice(i, 1);
                                break;
                            }
                        }
                        _this.leaf.push({
                            key: blogId,
                            title: title,
                            parentId: categoryId,
                            isLeaf: true
                        });
                        // 展开父节点
                        let expanded = false;
                        for (let j = 0; j < _this.expandedKeys.length; j++) {
                            if (categoryId == _this.expandedKeys[j]) {
                                expanded = true;
                                break;
                            }
                        }
                        if (! expanded) {
                            _this.expandedKeys.push(categoryId);
                        }
                    } else {
                        _this.$message.warn(response.data.message);
                    }
                }).catch(function () {
                    _this.loading = false;
                    _this.$message.warn("当前网络不稳定，请稍后重试");
                })
            },
            categoryValueChange() {
                if (this.modal.value.length > 20) {
                    this.modal.value = this.modal.value.substring(0, 20);
                }
            },
            expand(expandedKeys, {node}) {
                for (let i = 0; i < this.expandedKeys.length; i++) {
                    if (this.expandedKeys[i] == node.dataRef.key) {
                        // 说明已经展开，需要关闭
                        this.expandedKeys.splice(i, 1);
                        return;
                    }
                }
                this.expandedKeys.push(node.dataRef.key);
            },
            dragstart({node}) {
                // eslint-disable-next-line no-console
                console.log(node.dataRef.key);
            },
            dragenter({node}) {
                // eslint-disable-next-line no-console
                console.log(node.dataRef.key);
            }
        }
    }
</script>

<style scoped>

</style>