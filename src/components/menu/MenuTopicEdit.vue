<template>
    <div>
        <a-dropdown v-if="editable" :trigger="['contextmenu']">
            <slot name="content"></slot>
            <a-menu slot="overlay">
                <template v-if="tier > 0">
                    <a-menu-item key="1" @click="handle(1)"><a-icon type="plus"/>同级</a-menu-item>
                    <a-menu-item key="2" :disabled="parent && parent.menuType == 'link'" @click="handle(2)"><a-icon type="plus"/>子级</a-menu-item>
                    <a-menu-item key="3" @click="handle(3)"><a-icon type="edit"/>重命名</a-menu-item>
                    <a-menu-item key="4" :disabled="parent && parent.children && parent.children.length > 0" @click="handle(4)"><a-icon type="delete"/>删除</a-menu-item>
                    <a-menu-item key="6" @click="moveUp"><a-icon type="arrow-up" />上移</a-menu-item>
                    <a-menu-item key="7" @click="moveDown"><a-icon type="arrow-down" />下移</a-menu-item>
                </template>
                <template v-else>
                    <a-menu-item key="2" :disabled="parent && parent.menuType == 'link'" @click="handle(2)"><a-icon type="plus"/>新建</a-menu-item>
                </template>
            </a-menu>
        </a-dropdown>
        <slot v-else name="content"></slot>
        <a-modal
                :title="title"
                :visible="visible"
                @ok="handleOk"
                :confirmLoading="confirmLoading"
                @cancel="handleCancel"
        >
            <template  v-if="inputable">
                <a-input v-model="menuName" placeholder="请输入菜单名称（50字以内）" />
                <a-row type="flex" justify="start" v-if="! isRename">
                    <a-col :span="12">
                        菜单类型： <a-select
                                v-model="type"
                                style="width: 120px;margin-top: 10px"
                        >
                            <a-select-option value="1">链接</a-select-option>
                            <a-select-option value="2" :disabled="tierAdd > 2 || (parent && parent.menuType == 'group' && tierAdd > tier)">分组</a-select-option>
                            <a-select-option value="3" :disabled="tierAdd > 1">菜单</a-select-option>
                        </a-select>
                    </a-col>
                    <a-col v-if="type == '1'" :span="12" style="margin-top: 10px">
                        <a-input v-model="blogId" placeholder="文章标识">
                            <a-tooltip slot="suffix">
                                <a-icon type="question" style="color: rgba(0,0,0,.45)" />
                            </a-tooltip>
                        </a-input>
                    </a-col>
                </a-row>
                <a-alert v-if="! isRename" :message="tip" type="info" style="margin-top: 10px"/>
            </template>
            <p v-else>{{content}}</p>
        </a-modal>
    </div>

</template>

<script>
    import { TOPIC_MENU_CREATE, TOPIC_MENU_DELETE, TOPIC_MENU_UP_PATCH, TOPIC_MENU_DOWN_PATCH, TOPIC_MENU_RENAME_PATCH } from "@/components/constant/url_path";

    export default {
        name: "MenuTopicEdit",
        props: ['tier', 'parent', 'topicId', 'editable'],
        data() {
            return {
                eventKey: undefined,
                visible: false,
                confirmLoading: false,
                inputable: false,
                tierAdd: undefined,
                content: undefined,
                title: undefined,

                parentMenuId: undefined,
                menuName: undefined,
                type: '1',
                blogId: undefined,
                isRename: false
            }
        },
        computed: {
            tip() {
                if (this.type) {
                    switch (this.type) {
                        case '1':
                            return '菜单类型说明：点击后右侧展示对应文章';
                        case '2':
                            return "菜单类型说明：无法点击，通过文字颜色和缩进对内容进行聚合分组";
                        case '3':
                            return "菜单类型说明：点击后打开子菜单";
                    }
                }
                return "";
            }
        },
        methods: {
            handle(eventKey) {
                let _this = this;
                _this.eventKey = eventKey;
                switch (eventKey) {
                    case 1:
                        _this.inputable = true;
                        _this.title = "添加同级菜单";
                        _this.tierAdd = _this.tier;
                        _this.visible = true;
                        _this.parentMenuId = _this.parent.parentMenuId;
                        break;
                    case 2:
                        _this.inputable = true;
                        _this.title = _this.tier > 0 ? "添加子级菜单" : '新建菜单';
                        _this.tierAdd = _this.tier + 1;
                        _this.visible = true;
                        _this.parentMenuId = _this.tier > 0 ? _this.parent.menuId : 0;
                        break;
                    case 3:
                        _this.inputable = true;
                        _this.isRename = true;
                        _this.title = '重命名';
                        _this.visible = true;
                        _this.menuName = _this.parent.menuName;
                        break;
                    case 4:
                        _this.inputable = false;
                        _this.title = "删除确认";
                        _this.content = '点击确定删除该菜单！'
                        _this.visible = true;
                        break;
                }
            },
            handleOk() {
                let _this = this;
                let eventKey = _this.eventKey;
                switch (eventKey) {
                    case 1:
                        _this.addMenu();
                        break;
                    case 2:
                        _this.addMenu();
                        break;
                    case 3:
                        _this.renameMenu();
                        break;
                    case 4:
                        _this.deleteMenu();
                        break;
                }
            },
            addMenu() {
                let _this = this;
                _this.confirmLoading = true;
                _this.$axios.post(TOPIC_MENU_CREATE.replace("{topicId}", _this.topicId), {
                    parentMenuId:_this.parentMenuId,
                    name: _this.menuName,
                    type: _this.type,
                    blogId: _this.blogId
                }).then(function (response) {
                    _this.confirmLoading = false;
                    let code = response.data.code;
                    if (code == 200) {
                        _this.$message.success("添加成功")
                        _this.clearStatus();
                        _this.$emit('refresh');
                        return;
                    }
                    _this.$message.info(response.data.message);
                }).catch(function () {
                    _this.confirmLoading = false;
                    _this.$message.warn("当前网络不稳定，请稍后再试。");
                })
            },
            deleteMenu() {
                let _this = this;
                _this.confirmLoading = true;
                _this.$axios.delete(TOPIC_MENU_DELETE.replace("{topicId}", _this.topicId).replace("{menuId}", _this.parent.menuId))
                    .then(function (response) {
                        _this.confirmLoading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.$message.success("删除成功");
                            _this.clearStatus();
                            _this.$emit('refresh');
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.confirmLoading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
            moveUp() {
                let _this = this;
                _this.confirmLoading = true;
                _this.$axios.patch(TOPIC_MENU_UP_PATCH.replace("{topicId}", _this.topicId).replace("{menuId}", _this.parent.menuId))
                    .then(function (response) {
                        _this.confirmLoading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.clearStatus();
                            _this.$emit('refresh');
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.confirmLoading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
            moveDown() {
                let _this = this;
                _this.confirmLoading = true;
                _this.$axios.patch(TOPIC_MENU_DOWN_PATCH.replace("{topicId}", _this.topicId).replace("{menuId}", _this.parent.menuId))
                    .then(function (response) {
                        _this.confirmLoading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.clearStatus();
                            _this.$emit('refresh');
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                        _this.confirmLoading = false;
                        _this.$message.warn("当前网络不稳定，请稍后重试。");
                    })
            },
            renameMenu() {
                let _this = this;
                _this.confirmLoading = true;
                _this.$axios.patch(TOPIC_MENU_RENAME_PATCH.replace("{topicId}", _this.topicId).replace("{menuId}", _this.parent.menuId), {
                    menuName: _this.menuName
                })
                    .then(function (response) {
                        _this.confirmLoading = false;
                        let code = response.data.code;
                        if (code == 200) {
                            _this.clearStatus();
                            _this.$emit('refresh');
                        } else {
                            _this.$message.info(response.data.message);
                        }
                    }).catch(function () {
                    _this.confirmLoading = false;
                    _this.$message.warn("当前网络不稳定，请稍后重试。");
                })
            },
            handleCancel() {
                this.clearStatus();
            },
            clearStatus() {
                this.parentMenuId = undefined;
                this.menuName = undefined;
                this.type = '1';
                this.blogId = undefined;
                this.inputable = false;
                this.title = undefined;
                this.content = undefined;
                this.visible = false;
                this.isRename = false;
            }
        }
    }
</script>

<style scoped>

</style>