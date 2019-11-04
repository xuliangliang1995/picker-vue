import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import { UPDATE_ACCESS_TOKEN, UPDATE_REFRESH_TOKEN, CLEAR_TOKEN, UPGRADE_PRIVILEGE, PRIVILEGE, UPDATE_AVATAR, UPDATE_SMS_CAPTCHA_ABLE } from "@/components/constant/mutation_types";
import { CHECK_ACCESS_TOKEN, QUERY_PRIVILEGE, INIT_PRIVILEGE } from "@/components/constant/action_types";
import { USER_TOKEN_GET, USER_PRIVILEGE_GET } from "@/components/constant/url_path";
import { IS_LOGGING_IN } from "@/components/constant/getter_types";
import jwt_decode from 'jwt-decode';
import moment from "moment";
import axios from 'axios';
/*access_token*/
const ACCESS_TOKEN = "access_token";
/*refresh_token*/
const REFRESH_TOKEN = "refresh_token";
/*avatar*/
const AVATAR = "avatar";

let instance = axios.create({
    headers: {'Content-Type': 'application/json;charset=utf-8'},
    timeout: 5000
});


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
        access_token: localStorage.getItem(ACCESS_TOKEN),
        refresh_token: localStorage.getItem(REFRESH_TOKEN),
        upgrade_privilege: false,
        privilege: false,
        avatar: localStorage.getItem(AVATAR),
        sms_captcha_able: false
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
         * 是否开启短信校验身份方式
         * @param state
         * @param able
         */
        [UPDATE_SMS_CAPTCHA_ABLE](state, able) {
            state.sms_captcha_able = able;
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
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        },
        /**
         * 设置是否需要提高权限
         * @param state
         * @param upgrade
         */
        [UPGRADE_PRIVILEGE](state, upgrade) {
            state.upgrade_privilege = upgrade;
        },
        /**
         * 更新权限
         * @param state
         * @param privilege
         */
        [PRIVILEGE](state, privilege) {
            state.privilege = privilege;
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
