/*注册*/
export const SIGN_UP_POST = "/api/user/signUp";
/*激活邮件*/
export const SEND_ACTIVATE_EMAIL_POST = "/api/user/activate/email";
/*获取账号激活状态*/
export const ACCOUNT_ACTIVATE_STATUS = "/api/user/activate/status"
/*登录*/
export const SIGN_IN_POST = "/api/user/signIn";
/*刷新 access_token*/
export const USER_TOKEN_GET = "/api/user/token";
/*获取用户信息*/
export const USER_INFO_GET = "/api/user/info";
/*修改用户信息*/
export const USER_INFO_PUT = "/api/user/info";
/*修改密码*/
export const USER_PASSWORD_PATCH = "/api/user/info/password";
/*修改手机号*/
export const USER_PHONE_PATCH = "/api/user/info/phone";
/*查看当前 access_token 权限*/
export const USER_PRIVILEGE_GET = "/api/user/privilege";
/*获取邮件验证码（登录状态）*/
export const USER_EMAIL_CAPTCHA_GET = "/api/user/captcha/email";
/*获取短信验证（登录状态）*/
export const USER_SMS_CAPTCHA_GET = "/api/user/captcha/sms";
/*获取微信验证（登录状态）*/
export const USER_WECHAT_CAPTCHA_GET = "/api/user/captcha/wechat"
/*获取手机验证码（允许非登录状态获取）*/
export const USER_PHONE_CAPTCHA_POST = "/api/user/captcha/phone";
/*提权*/
export const USER_PRIVILEGE_POST = "/api/user/privilege/captcha";
/*获取用户配置*/
export const USER_SETTING_GET = "/api/user/setting";
/*修改用户配置*/
export const USER_SETTING_PUT = "/api/user/setting";
/*用户搜索*/
export const USER_SEARCH = "/api/user/search";
/*获取作者信息*/
export const AUTHOR_INFO_GET = "/api/user/{pickerId}";
/*关注列表*/
export const FOLLOWING_LIST = "/api/user/{pickerId}/following";
/*粉丝列表*/
export const FOLLOWER_LIST = "/api/user/{pickerId}/follower";
/*关注作者*/
export const AUTHOR_SUBSCRIBE_POST_OR_DELETE = "/api/user/subscribe/author/{pickerId}";
/*关注状态*/
export const AUTHOR_SUBSCRIBE_STATUS_GET = "/api/user/subscribe/author/{pickerId}/status";
/*上传推广公众号二维码*/
export const MP_QRCODE_POST = "/api/user/mpQrcode";
/*获取推广公众号二维码*/
export const MP_QRCODE_GET = "/api/user/mpQrcode";
/*获取作者公众号二维码*/
export const AUTHOR_MP_QRCODE_GET = "/api/user/{pickerId}/mpQrcode";
/*上传图片*/
export const OSS_UPLOAD = "/api/oss/upload";

/*创建博客*/
export const BLOG_CREATE_POST = "/api/blog/";
/*修改博客*/
export const BLOG_EDIT_PUT = "/api/blog/{blogId}";
/* 获取博客列表 */
export const BLOG_LIST_GET = "/api/blog/";
/* 获取公共博客列表 */
export const BLOG_POOL_GET = "/api/blog/pool";
/* 获取博客 markdown */
export const BLOG_MARKDOWN_GET = "/api/blog/{blogId}/markdown";
/* 博客点赞 */
export const BLOG_LIKE = "/api/blog/{blogId}/like";
/* 博客收藏 */
export const BLOG_FAVORITE = "/api/blog/{blogId}/favorite";
/* 修改博客分类 */
export const BLOG_CATEGORY_PATCH = "/api/blog/{blogId}/category";
/* 删除博客 */
export const BLOG_DELETE = "/api/blog/{blogId}";
/* 博客回收 */
export const BLOG_RECYCLE_PATCH = "/api/blog/{blogId}/recycle";
/* 博客曲线调整 */
export const BLOG_CURVE_PATCH = "/api/blog/{blogId}/curve";
/* 添加评论 */
export const BLOG_COMMENT_POST = "/api/blog/{blogId}/comment";
/* 获取评论 */
export const BLOG_COMMENT_GET = "/api/blog/{blogId}/comment";
/* 回收站 */
export const BLOG_RECYCLE_BIN = "/api/blog/recycle/bin";
/* 搜索热词 */
export const BLOG_SEARCH_HOT_WORD = "/api/blog/hotWord";

/* 创建专题 */
export const TOPIC_CREATE_POST = "/api/blog/topic";
/* 专题列表 */
export const TOPICS_GET = "/api/blog/topic";
/* 专题更改 */
export const TOPIC_EDIT_PUT = "/api/blog/topic/{topicId}";
/* 删除专题 */
export const TOPIC_DELETE = "/api/blog/topic/{topicId}"
/* 专题状态更改 */
export const TOPIC_STATUS_PATCH = "/api/blog/topic/{topicId}/status";
/* 专题池 */
export const TOPIC_POOL_GET = "/api/blog/topic/pool";

/* 创建菜单 */
export const TOPIC_MENU_CREATE = "/api/blog/topic/{topicId}/menu";
/* 专题菜单 */
export const TOPIC_MENU_GET = "/api/blog/topic/{topicId}/menu";
/* 菜单删除 */
export const TOPIC_MENU_DELETE = "/api/blog/topic/{topicId}/menu/{menuId}";
/* 菜单上移 */
export const TOPIC_MENU_UP_PATCH = "/api/blog/topic/{topicId}/menu/{menuId}/up";
/* 菜单下移 */
export const TOPIC_MENU_DOWN_PATCH = "/api/blog/topic/{topicId}/menu/{menuId}/down";
/* 菜单重命名 */
export const TOPIC_MENU_RENAME_PATCH = "/api/blog/topic/{topicId}/menu/{menuId}";

/* 获取分类树 */
export const CATEGORY_TREE_GET = "/api/blog/category/tree";
/* 创建分类 */
export const CATEGORY_POST = "/api/blog/category";
/* 修改分类 */
export const CATEGORY_PATCH = "/api/blog/category/{categoryId}";
/* 删除分类 */
export const CATEGORY_DELETE = "/api/blog/category/{categoryId}"
/* 获取二维码 */
export const QRCODE_GET = "/api/user/wxmp/bind/qrcode";

