import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import { UPDATE_ACCESS_TOKEN, UPDATE_REFRESH_TOKEN, CLEAR_TOKEN, UPGRADE_PRIVILEGE, PRIVILEGE, UPDATE_AVATAR, UPDATE_SMS_CAPTCHA_ABLE,
UPDATE_MARKDOWN_THEME, UPDATE_SAFETY_CHECK_MODE, UPDATE_LOCAL_MARKDOWN, REMOVE_LOCAL_BLOG, UPDATE_BIND_WECHAT } from "@/components/constant/mutation_types";
import { CHECK_ACCESS_TOKEN, QUERY_PRIVILEGE, INIT_PRIVILEGE } from "@/components/constant/action_types";
import { USER_TOKEN_GET, USER_PRIVILEGE_GET } from "@/components/constant/url_path";
import { IS_LOGGING_IN, DEFAULT_SAFETY_CHECK_MODE } from "@/components/constant/getter_types";
import { MARKDOWN_LOCAL_STORAGE } from "@/components/constant/local_md_storage";
import jwt_decode from 'jwt-decode';
import moment from "moment";
import axios from 'axios';
/*access_token*/
const ACCESS_TOKEN = "access_token";
/*refresh_token*/
const REFRESH_TOKEN = "refresh_token";
/*avatar*/
const AVATAR = "avatar";
/*markdown 主题*/
const MARKDOWN_THEME = "markdown_theme";

let instance = axios.create({
    headers: {'Content-Type': 'application/json;charset=utf-8'},
    timeout: 5000
});

/**
 * 本地 markdown 存储
 * @type {string}
 */
let localMarkdown = JSON.parse(localStorage.getItem(MARKDOWN_LOCAL_STORAGE) == undefined ? '[]' : localStorage.getItem(MARKDOWN_LOCAL_STORAGE));
/**
 * 刷新 access_token
 * @param refreshToken
 * @returns {Promise<unknown>}
 */
function refreshAccessToken(refreshToken) {
    return new Promise((resolve, reject) => {
        instance.get(USER_TOKEN_GET, {
            headers: {
                REFRESH_TOKEN: refreshToken
            }
        }).then(function (response) {
            let code = response.data.code;
            if (code == 200) {
                let accessToken = response.headers.access_token;
                let refreshToken = response.headers.refresh_token;
                store.commit(UPDATE_ACCESS_TOKEN, accessToken);
                store.commit(UPDATE_REFRESH_TOKEN, refreshToken);
                resolve(accessToken)
                return accessToken;
            }
        })
            .catch(err => {
                reject(err)
            })
    })
}


/**
 * 登录状态维持
 * @type {Store<{access_token: *, refresh_token: *}>}
 */
const store = new Vuex.Store({
    state: {
        // 权限管理
        access_token: localStorage.getItem(ACCESS_TOKEN),
        refresh_token: localStorage.getItem(REFRESH_TOKEN),
        upgrade_privilege: false,
        upgrade_privilege_target_url: undefined,
        privilege: false,
        // 头像
        avatar: localStorage.getItem(AVATAR),
        // 是否可以通过短信校验身份
        sms_captcha_able: false,
        // 是否绑定微信
        bind_wechat: false,
        // 缺省校验身份方式
        safety_check_mode: 0,
        // markdown 主题
        markdown_theme: localStorage.getItem(MARKDOWN_THEME) == undefined ? 'github' : localStorage.getItem(MARKDOWN_THEME),
        // 本地存储的 markdown 信息
        markdown_data: localMarkdown
    },
    mutations: {
        /**
         * 更换头像
         */
        [UPDATE_AVATAR](state, avatar) {
            state.avatar = avatar;
            localStorage.setItem(AVATAR, avatar);
        },
        /**
         * 更改是否绑定微信状态
         * @param state
         * @param bindWechat
         */
        [UPDATE_BIND_WECHAT](state, bindWechat) {
            state.bind_wechat = bindWechat;
        },
        /**
         * 更改 markdown 主题
         * @param state
         * @param theme
         */
        [UPDATE_MARKDOWN_THEME](state, theme) {
            state.markdown_theme = theme;
        },
        /**
         * 是否开启短信校验身份方式
         * @param state
         * @param able
         */
        [UPDATE_SMS_CAPTCHA_ABLE](state, able) {
            state.sms_captcha_able = able;
        },
        /**
         * 更新安全校验方式
         * @param state
         * @param mode
         */
        [UPDATE_SAFETY_CHECK_MODE](state, mode) {
            state.safety_check_mode = mode;
        },
        /**
         * 更换 access_token
         * @param state
         * @param accessToken
         */
        [UPDATE_ACCESS_TOKEN](state, accessToken) {
            state.access_token = accessToken;
            localStorage.setItem(ACCESS_TOKEN, accessToken);
            store.dispatch(QUERY_PRIVILEGE);
        },
        /**
         * 更换 refresh_token
         * @param state
         * @param refreshToken
         */
        [UPDATE_REFRESH_TOKEN](state, refreshToken) {
            state.refresh_token = refreshToken;
            localStorage.setItem(REFRESH_TOKEN, refreshToken);
        },
        /**
         * 清空 access_token 和 refresh_token
         * @param state
         */
        [CLEAR_TOKEN](state) {
            state.access_token = null;
            state.refresh_token = null;
            state.upgrade_privilege = false;
            state.upgrade_privilege_target_url = undefined;
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        },
        /**
         * 设置是否需要提高权限
         * @param state
         * @param upgrade
         */
        [UPGRADE_PRIVILEGE](state, upgrade) {
            state.upgrade_privilege = upgrade.privilege;
            state.upgrade_privilege_target_url = upgrade.url;
        },
        /**
         * 更新权限
         * @param state
         * @param privilege
         */
        [PRIVILEGE](state, privilege) {
            state.privilege = privilege;
        },
        /**
         * 更新本地 markdown 存储
         * @param state
         * @param key
         * @param markdown
         */
        [UPDATE_LOCAL_MARKDOWN](state, info) {
            let key = info.key;
            let markdown = info.markdown;
            let push = true;
            for (let i = 0; i < state.markdown_data.length; i++) {
                if (state.markdown_data[i].key == key) {
                    let node = state.markdown_data[i];
                    node.markdown = markdown;
                    push = false;
                    break;
                }
            }
            if (push) {
                state.markdown_data.push({
                    key: key,
                    markdown: markdown,
                    time: moment().format("YYYYMMDDhhmm")
                });
            }
            localStorage.setItem(MARKDOWN_LOCAL_STORAGE, JSON.stringify(state.markdown_data));
        },
        /**
         * 根据 key 移除本地博客 markdown 存储
         * @param state
         * @param key
         */
        [REMOVE_LOCAL_BLOG](state, key) {
            let remove = false;
            for (let i = 0; i < state.markdown_data.length; i++) {
                if (state.markdown_data[i].key == key) {
                    state.markdown_data.splice(i, 1);
                    remove = true;
                    break;
                }
            }
            if (remove) {
                localStorage.setItem(MARKDOWN_LOCAL_STORAGE, JSON.stringify(state.markdown_data));
            }
        }
    },
    getters: {
        /**
         * 当前是否登录状态
         * @param state
         * @returns {boolean}
         */
        [IS_LOGGING_IN]: state =>  {
            let refresh_token = state.refresh_token;
            return refresh_token != undefined && refresh_token.length > 0;
        },
        /**
         * 缺省校验方式
         * @param state
         * @returns {number|number|*}
         */
        [DEFAULT_SAFETY_CHECK_MODE]: state => {
            if (state.sms_captcha_able) {
                return state.safety_check_mode;
            }
            return 0;
        }
    },
    actions:{
        /**
         * 查看当前 access_token 权限
         */
        [QUERY_PRIVILEGE]({ commit, state }) {
            let accessToken = state.access_token;
            if (accessToken != undefined && accessToken.length > 0) {
                let decode = jwt_decode(accessToken);
                let acTokenIsExpired = moment().isSameOrAfter(decode.exp * 1000 - 5 * 60 * 1000);
                if (! acTokenIsExpired) {
                    instance.get(USER_PRIVILEGE_GET, {
                        headers: {
                            ACCESS_TOKEN: accessToken
                        }
                    }).then(function (response) {
                        let code = response.data.code;
                        if (code == 200) {
                            commit(PRIVILEGE, response.data.result.privilege);
                            return;
                        }
                    })
                }
            }
            commit(PRIVILEGE, false);
        },
        /**
         * 检查 access_token ， 如果已经过期，则从服务端获取新的。
         * @param state
         * @returns {Promise<null|unknown|string|*>}
         */
        async [CHECK_ACCESS_TOKEN]({ commit, state }) {
            let accessToken = state.access_token;
            let refreshToken = state.refresh_token;
            if (accessToken != undefined && accessToken.length > 0) {
                let decode = jwt_decode(accessToken);
                let acTokenIsExpired = moment().isSameOrAfter(decode.exp * 1000 - 5 * 60 * 1000);
                if (acTokenIsExpired) {
                    let decodeRToken = jwt_decode(refreshToken);
                    let rfTokenIsExpired = moment().isSameOrAfter(decodeRToken.exp * 1000 - 6000);
                    if (rfTokenIsExpired) {
                        commit(CLEAR_TOKEN);
                    } else {
                        let newAccessToken = await refreshAccessToken(refreshToken);
                        commit(UPDATE_ACCESS_TOKEN, newAccessToken);
                    }
                }
            }
        },
        [INIT_PRIVILEGE]({dispatch}) {
            dispatch(QUERY_PRIVILEGE);
            dispatch(CHECK_ACCESS_TOKEN);
        }
    }
});
export default store;
