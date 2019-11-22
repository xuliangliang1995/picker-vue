<template>
    <div>
        <a-row type="flex" justify="start" align="top">
            <a-col :span="16">
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
                        <template v-if="blogCanMove && ! (item.parentId >= 0)" slot="actions">
                            <a-icon type="flag" :theme="item.triggerStatus == 0 ? 'filled' : 'outlined'"
                                    @click="curveStatusChange(item.triggerStatus != 0, item.key)"
                            />
                            <!--<a-switch :defaultChecked="item.triggerStatus == 0" @change="(checked, event) => { curveStatusChange(checked, event, item.key)}"/>-->
                            <a-icon type="form" @click="editBlog(item.key)"/>
                            <a-icon type="delete" @click="deleteBlog(item.key)"/>
                            <a-icon type="export" @click="transferBlog(item.key, item.title)"/>
                        </template>
                        <template v-if="! blogCanMove && ! (item.parentId >= 0)" slot="actions">
                            <a-icon type="flag" :theme="item.triggerStatus == 0 ? 'filled' : 'outlined'"
                                    @click="curveStatusChange(item.triggerStatus != 0, item.key)"
                            />
                            <!--<a-switch :defaultChecked="item.triggerStatus == 0" @change="(checked, event) => { curveStatusChange(checked, event, item.key)}"/>-->
                            <a-icon type="form" @click="editBlog(item.key)"/>
                            <a-icon type="delete" @click="deleteBlog(item.key)"/>
                        </template>
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
                <a-list bordered>
                    <a-list-item>
                        <a-directory-tree
                                :autoExpandParent="true"
                                :defaultExpandAll="true"
                                :expandedKeys="expandedKeys"
                                :treeData="dataWithLeaf"
                                :draggable="drag.able"
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
                                <a-icon type="folder-add" @click="showAddCategoryModal"/>
                            </a-col>
                            <a-col :span="4" >
                                <a-icon type="form" @click="showEditCategoryModal"  v-if="! editDisable"/>
                            </a-col>
                            <a-col :span="4" >
                                <a-icon type="delete" @click="deleteCategory" v-if="! deleteDisable"/>
                            </a-col>
                            <a-col :span="8">
                                <a-switch checkedChildren="同步" unCheckedChildren="锁定" v-model="sync" />
                            </a-col>
                            <a-col :span="4" >
                                <a-icon type="question" />
                            </a-col>
                        </a-row>
                    </div>
                </a-list>
            </a-col>
        </a-row>
        <a-modal
                title="添加分类"
                v-model="modal.visible"
                :confirmLoading="modal.confirmLoading"
                :destroyOnClose="true"
                @ok="addCategory"
                okText="确认"
                cancelText="取消">
            <p><a-input placeHolder="长度在 1 ~ 20 之间" v-model="modal.value" @change="categoryValueChange"/></p>
        </a-modal>
        <a-modal
                title="修改分类名称"
                v-model="modal.editVisible"
                :confirmLoading="modal.editConfirmLoading"
                :destroyOnClose="true"
                @ok="editCategory"
                okText="确认"
                cancelText="取消">
            <p><a-input placeHolder="长度在 1 ~ 20 之间" v-model="modal.value" @change="categoryValueChange"/></p>
        </a-modal>
    </div>
</template>

<script>
    import { CATEGORY_TREE_GET, CATEGORY_POST, BLOG_LIST_GET, BLOG_CATEGORY_PATCH, CATEGORY_PATCH, BLOG_DELETE, BLOG_RECYCLE_PATCH, CATEGORY_DELETE, BLOG_CURVE_PATCH } from "@/components/constant/url_path";
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
    function insertItem(items, item) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key == item.parentId) {
                items[i].children.unshift(item);
            }
            if (items[i].children && items[i].children.length > 0) {
                insertItem(items[i].children, item);
            }
        }
    }
    /**
     * 根据 key 获取节点
     */
    function findNodeByKey(items, key) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key == key) {
                return items[i];
            } else if (items[i].children && items[i].children.length > 0) {
                let node = findNodeByKey(items[i].children, key);
                if (node != null) {
                    return node;
                }
            }
        }
        return null;
    }
    /**
     * 添加元素
     */
    function removeItem(items, key) {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key == key) {
                items.splice(i, 1);
                return;
            }
            if (items[i].children && items[i].children.length > 0) {
                removeItem(items[i].children, key);
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
                selectedKeys: [ 0 ],
                expandedKeys: [],
                data: [],
                leaf: [],
                loading: false,
                sync: true,
                modal: {
                    visible: false,
                    confirmLoading: false,
                    editVisible: false,
                    editConfirmLoading: false,
                    value: '',
                },
                drag: {
                    start: null,
                    end: null,
                    able: true
                }
            }
        },
        created() {
            this.loadData();
        },
        mounted() {
            this.expandedKeys.push(0);
        },
        computed: {
            // 文件夹数据 + 操作中叶子数据
            dataWithLeaf() {
                let home = {
                    key: 0,
                    title: 'Home',
                    children: []
                }
                let dataCopy = JSON.parse(JSON.stringify(this.data));
                let leafCopy = JSON.parse(JSON.stringify(this.leaf));
                for (let i = 0; i < leafCopy.length; i++) {
                    insertItem(dataCopy, leafCopy[i])
                }
                for (let j = 0; j < leafCopy.length; j++) {
                    if (leafCopy[j].parentId == 0) {
                        dataCopy.push(leafCopy[j]);
                    }
                }
                home.children = dataCopy;
                return [home];
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
                if (this.sync) {
                    return false;
                }
                if (this.selectedKeys.length == 0 && this.current == 0) {
                    return false;
                }
                if (this.selectedKeys[0] == this.current) {
                    return false;
                }
                return true;
            },
            deleteDisable() {
                if (this.selectedKeys.length == 0 || this.selectedKeys[0] == 0) {
                    return true;
                }
                let children = findNodeByKey(this.data, this.selectedKeys[0]).children;
                return children && children.length > 0;
            },
            editDisable() {
                return this.selectedKeys.length == 0 || this.selectedKeys[0] == 0;
            }
        },
        methods: {
            // 删除分类
            deleteCategory() {
                let _this = this;
                if (_this.selectedKeys.length == 0 || _this.selectedKeys[0] == 0) {
                    return;
                }
                const categoryId = _this.selectedKeys[0];
                _this.loading = true;
                _this.$axios.delete(CATEGORY_DELETE.replace("{categoryId}", categoryId))
                    .then(function (response) {
                        let code = response.data.code;
                        _this.loading = false;
                        if (code == 200) {
                            if (_this.current == categoryId) {
                                // 如果删除的是当前所在文件夹，那么回退到父文件夹
                                _this.routeCategory(_this.currentData[0].key);
                            }
                            // 从左侧移除
                            for (let j = 0; j < _this.currentData.length ; j++) {
                                if (_this.currentData[j].key == categoryId) {
                                    _this.currentData.splice(j, 1);
                                    break;
                                }
                            }
                            // 从右侧移除
                            for (let i = 0; i < _this.data.length; i++) {
                                if (_this.data[i].key == categoryId) {
                                    _this.data.splice(i, 1);
                                    break;
                                }
                            }
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.loading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
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
                    _this.currentData = JSON.parse(JSON.stringify(this.data));
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
                _this.$axios.get(BLOG_LIST_GET + "?pageNo=1&pageSize=100&categoryId=" + _this.current)
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
                                    route: '/blog/'.concat(blogs[i].blogId),
                                    //route: '/api/blog/'.concat(blogs[i].blogId).concat('.html'),
                                    triggerStatus: blogs[i].triggerStatus
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
            treeSelect(selectedKeys, { node }) {
                if (node.dataRef.isLeaf) {
                    return;
                }
                this.selectedKeys = selectedKeys;
                if (this.sync) {
                    if (this.selectedKeys.length == 0) {
                        this.routeCategory(0);
                    } else {
                        this.routeCategory(this.selectedKeys[0]);
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
            showAddCategoryModal() {
                this.modal.value = '';
                this.modal.visible = true;
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
            showEditCategoryModal() {
                if (this.selectedKeys.length == 0 || this.selectedKeys[0] == 0) {
                    return;
                }
                this.modal.value = findNodeByKey(this.data, this.selectedKeys[0]).title;
                this.modal.editVisible = true;
            },
            editCategory() {
                let _this = this;
                if (_this.selectedKeys.length == 0 || _this.selectedKeys[0] == 0) {
                    _this.modal.editVisible = false;
                    return;
                }
                const categoryId = _this.selectedKeys[0];
                let node = findNodeByKey(this.data, categoryId);
                if (_this.modal.value == node.title) {
                    _this.modal.editVisible = false;
                    return;
                }
                _this.modal.editConfirmLoading = true;
                _this.$axios.patch(CATEGORY_PATCH.replace("{categoryId}", categoryId), {
                    category: _this.modal.value
                }).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        node.title = _this.modal.value;
                        _this.modal.editVisible = false;
                    } else {
                        _this.$message.warn(response.data.message);
                    }
                    _this.modal.editConfirmLoading = false;
                }).catch(function () {
                    _this.modal.editConfirmLoading = false;
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                })
            },
            // 转移博客到指定分类
            transferBlogTo(blogId, title, toCategoryId) {
                let _this = this;
                _this.loading = true;
                _this.$axios.patch(BLOG_CATEGORY_PATCH.replace("{blogId}", blogId), {
                    categoryId: toCategoryId
                }).then(function (response) {
                    let code = response.data.code;
                    _this.loading = false;
                    _this.drag.able = true;
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
                            }
                        }
                        _this.leaf.push({
                            key: blogId,
                            title: title,
                            parentId: toCategoryId,
                            isLeaf: true
                        });
                        // 展开父节点
                        /*for (let j = 0; j < _this.expandedKeys.length; j++) {
                            if (toCategoryId == _this.expandedKeys[j]) {
                                _this.expandedKeys.splice(j, 1);
                                break;
                            }
                        }
                        _this.expandedKeys.push(toCategoryId);
                        if (toCategoryId == _this.current) {
                            _this.loadData();
                        }*/
                    } else {
                        _this.$message.warn(response.data.message);
                    }
                }).catch(function () {
                    _this.drag.able = true;
                    _this.loading = false;
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                })
            },
            editBlog(blogId) {
                window.open('/blog/'.concat(blogId).concat('/editor'), '_blank');
                /*this.$router.push();*/
            },
            deleteBlog(blogId) {
                let _this = this;
                _this.loading = true;
                _this.$axios.delete(BLOG_DELETE.replace("{blogId}", blogId))
                    .then(function (response) {
                        _this.loading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            // 从左侧移除
                            for (let j = 0; j < _this.currentData.length ; j++) {
                                if (_this.currentData[j].key == blogId) {
                                    _this.currentData.splice(j, 1);
                                    break;
                                }
                            }
                            // 从右侧移除
                            for (let i = 0; i < _this.leaf.length; i++) {
                                if (_this.leaf[i].key == blogId) {
                                    _this.leaf.splice(i, 1);
                                    break;
                                }
                            }
                            _this.$message.success(h => {
                                return h(
                                    'span',
                                    [
                                        '删除成功。',
                                        h(
                                            'a',
                                            {
                                                on: {
                                                    click: () => _this.recycleBlog(blogId),
                                                },
                                            },
                                            '撤销',
                                        )
                                    ]
                                );
                            }, 3);
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.loading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
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
                            _this.loadData();
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                    })
                    .catch(function () {
                        _this.loading = false;
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
                _this.transferBlogTo(blogId, title, categoryId);
            },
            categoryValueChange() {
                if (this.modal.value.length > 20) {
                    this.modal.value = this.modal.value.substring(0, 20);
                }
            },
            expand(expandedKeys, {node}) {
                if (node.dataRef.children == undefined || node.dataRef.children.length == 0) {
                    // 没节点的不允许打开，因为打开后影响父节点的关闭，比较诡异
                    for (let i = 0; i < this.expandedKeys.length; i++) {
                        if (this.expandedKeys[i] == node.dataRef.key) {
                            this.expandedKeys.splice(i, 1);
                        }
                    }
                    return;
                }
                this.expandedKeys = expandedKeys;
            },
            dragstart({node}) {
                this.drag.start = JSON.parse(JSON.stringify(node.dataRef));
            },
            dragenter({node}) {
                let _this = this;
                _this.drag.end = JSON.parse(JSON.stringify(node.dataRef));
                _this.drag.able = false; // 暂时禁用滑动
                if (_this.drag.end.isLeaf) {
                    return ; // 如果结束点是 leaf,则毫无意义。return
                }
                if (_this.drag.start.isLeaf) {
                    // 说明是修改博客位置
                    _this.transferBlogTo(_this.drag.start.key, _this.drag.start.title, _this.drag.end.key);
                } else {
                    // 文件夹调整

                    _this.$axios.patch(CATEGORY_PATCH.replace("{categoryId}", _this.drag.start.key), {
                        parentId: _this.drag.end.key
                    }).then(function (response) {
                        let code = response.data.code;
                        if (code == 200) {
                            removeItem(_this.data, _this.drag.start.key); // 移除该文件夹
                            let item = {
                                key: _this.drag.start.key,
                                title: _this.drag.start.title,
                                parentId: _this.drag.end.key,
                                children: _this.drag.start.children
                            };
                            if (_this.drag.end.key == 0) {
                                _this.data.unshift(item)
                            } else {
                                insertItem(_this.data, item);
                            }
                            // 展开目标文件夹
                            let expanded = false;
                            for (let i = 0; i < _this.expandedKeys.length; i++) {
                                if (_this.expandedKeys[i] == _this.drag.end.key) {
                                    expanded = true;
                                    break;
                                }
                            }
                            if (! expanded) {
                                _this.expandedKeys.push(_this.drag.end.key);
                            }
                        } else {
                            _this.$message.warn(response.data.message);
                        }
                        _this.drag.able = true;
                    }).catch(function () {
                        _this.drag.able = true;
                        _this.$message.warn("当前网路不稳定，请稍后重试。");
                    })
                }
            },
            curveStatusChange(checked, blogId) {
                let _this = this;
                _this.$axios.patch(BLOG_CURVE_PATCH.replace("{blogId}", blogId), {
                    status: checked ? 0 : 1
                }).then(function (response) {
                    let code = response.data.code;
                    if (code == 200) {
                        if (checked) {
                            _this.$notification['success']({
                                message: '已加入推送计划',
                                description:
                                    '您已将该博客加入复习推送计划。系统会按照设定的记忆曲线定时推送给您。',
                            });
                            let node = findNodeByKey(_this.currentData, blogId);
                            node.triggerStatus = 0;
                        } else {
                            _this.$notification['success']({
                                message: '已取消推送计划',
                                description:
                                    '您已将该博客从推送计划中移除。',
                            });
                            let node = findNodeByKey(_this.currentData, blogId);
                            node.triggerStatus = 1;
                        }

                    } else {
                        _this.$message.warn(response.data.message);
                        _this.loadData();
                    }
                }).catch(function () {
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                    _this.loadData();
                })
            }
        }
    }
</script>

<style scoped>
    .ant-tree.ant-tree-directory {
        width: 100%
    }
</style>