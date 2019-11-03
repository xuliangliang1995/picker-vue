/*注册*/
export const SIGN_UP_POST = "/api/user/signUp";
/*激活邮件*/
export const SEND_ACTIVATE_EMAIL_POST = "/api/user/activate/email";
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
/*查看当前 access_token 权限*/
export const USER_PRIVILEGE_GET = "/api/user/privilege";
/*获取验证码*/
export const USER_CAPTCHA_GET = "/api/user/captcha/email"
/*提权*/
export const USER_PRIVILEGE_POST = "/api/user/privilege/captcha";

/*上传图片*/
export const OSS_UPLOAD = "/api/oss/upload";

/*创建博客*/
export const BLOG_CREATE_POST = "/api/blog/";
/*获取博客列表*/
export const BLOG_LIST_GET = "/api/blog/";
/*获取博客 markdown*/
export const BLOG_MARKDOWN_GET = "/api/blog/{blogId}/markdown";