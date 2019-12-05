<template>
    <div>
        <strong class="menu-item">
            <a-list size="large" bordered :dataSource="menu">
                <a-list-item slot="renderItem" slot-scope="item, index" @click="route(index)" :style="{backgroundColor: (index == selectIndex ? 'gainsboro' : '') }">
                    <a-row type="flex" justify="start" align="middle" :style="{margin: '0px', padding: '0px'}">
                        <a-col class="gutter-row"><a-icon :key="index" :type="item.icon" /></a-col>
                        <a-col class="gutter-row">
                        <span style="margin-left: 10px">
                            {{item.text}}
                        </span>
                        </a-col>
                    </a-row>
                </a-list-item>
            </a-list>

            <a-divider :style="{marginTop: '40px'}"/>
        </strong>
        <div :style="{fontSize: '16px'}">
            <strong>
                <a-row>
                    <a-col :span="18" :offset="1">
                        <span v-if="showHotwords">
                            热搜排行 <a-icon type="fire" />
                        </span>
                        <span v-else>
                            <a @click.prevent.stop="showHotwords=true">热搜排行 <a-icon type="fire" /></a>
                        </span>
                        <a-divider type="vertical" />
                        <span v-if="! showHotwords">
                            最近搜索 <a-icon type="clock-circle" />
                        </span>
                        <span v-else>
                            <a @click.prevent.stop="showHotwords=false">最近搜索 <a-icon type="clock-circle" /></a>
                        </span>
                    </a-col>
                </a-row>
            </strong>
            <div v-if="showHotwords">
                <template v-for="item in hotwords">
                    <div :key="item"  @click="toSearch(item)">
                        <a-row :style="{lineHeight:'45px'}" class="pk-search-word">
                            <a-col :span="2" :offset="1">
                                <a-icon type="fire" />
                            </a-col>
                            <a-col :span="20" :offset="1">
                                <em>{{item}}</em>
                            </a-col>
                        </a-row>
                    </div>
                </template>
            </div>
            <div v-else>
                <template v-for="item in recentwords">
                    <div :key="item" @click="toSearch(item)">
                        <a-row :style="{lineHeight:'45px'}" class="pk-search-word">
                            <a-col :span="2" :offset="1">
                                <a-icon type="clock-circle" />
                            </a-col>
                            <a-col :span="15" :offset="1">
                                <em>{{item}}</em>
                            </a-col>
                            <a-col :span="2" class="pk-search-word-close-icon">
                                <a-icon type="close" @click.prevent.stop="deleteWord(item)"/>
                            </a-col>
                        </a-row>
                    </div>
                </template>
            </div>

        </div>
    </div>
</template>

<script>
    import { BLOG_SEARCH_HOT_WORD } from "@/components/constant/url_path";
    import { SEARCH, DEL_SEARCH_WORD } from "@/components/constant/action_types";
    import { SEARCH_WORD_ARRAY} from "@/components/constant/getter_types";
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: "MenuSetting",
        props: ['defaultIndex'],
        watch:{
            defaultIndex(){
                this.selectIndex = this.defaultIndex;
            }
        },
        created() {
            this.fetchHotwords();
            if (this.recentwords.length > 3) {
                this.showHotwords = false;
            }
        },
        computed: {
            ...mapGetters({
                'recentwords':SEARCH_WORD_ARRAY
            })
        },
        data() {
            return {
                selectIndex: this.defaultIndex,
                showHotwords: true,
                hotwords:[],
                menu: [
                    {
                        text: '文章',
                        icon: 'file-text',
                        route: '/search/blog'
                    },
                    {
                        text: '用户',
                        icon: 'user',
                        route: '/search/user'
                    },
                    {
                        text: '专题',
                        icon: 'flag',
                        route: '/search/subject'
                    }
                ]
            }
        },
        methods: {
            ...mapActions({
                'search': SEARCH,
                'delSearchWord': DEL_SEARCH_WORD
            }),
            route(index){
                let _this = this;
                _this.selectIndex = index;
                if (_this.$route.query.q) {
                    _this.$router.push(_this.menu[index].route.concat("?q=").concat(_this.$route.query.q));
                } else {
                    _this.$router.push(_this.menu[index].route);
                }
            },
            fetchHotwords() {
                let _this = this;
                _this.$axios.get(BLOG_SEARCH_HOT_WORD)
                    .then(function (response) {
                        if (response.data.code == 200) {
                            _this.hotwords = response.data.result;
                        }
                    })
            },
            toSearch(keyword) {
                let key = [this.$route.path.split("/")[1].length > 0 ? this.$route.path.split("/")[1] : 'home'];
                let isSearch = "search" == key;
                if (keyword && keyword != '') {
                    this.search(keyword);
                }
                if (isSearch) {
                    window.location.href = this.$route.path.concat("?q=").concat(keyword)
                } else {
                    window.open('/search?q='.concat(keyword), "_blank");
                }
            },
            deleteWord(word) {
                this.delSearchWord(word);
            }
        }
    }
</script>

<style scoped>
    .menu-item, .ant-list {
        font-size: 16px;
    }
    .ant-list-item:hover {
        background-color: gainsboro;
    }
    .pk-search-word:hover {
        background-color: gainsboro;
    }

</style>