export const formTplGroup = {
    login    : [
        {
            title      : "NAME",
            field      : "username",
            icon       : "icon-email",
            placeholder: "Please enter",
            required   : true,
        },
        {
            title      : "PASSWORD",
            field      : "pwd",
            icon       : "icon-pwd",
            placeholder: "Please enter",
            required   : true,
        },
    ],
    reg      : [
        {
            title      : "EMAIL",
            field      : "email",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
        },
        {
            title      : "PASSWORD",
            field      : "pwd",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
        },
        {
            title      : "USER NAME",
            field      : "uname",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
        },
        {
            title      : "VERIFICATION CODE", //行为验证码
            field      : "verification",
            icon       : "",
            placeholder: "Please enter",
            required   : false,
            code       : "change",
        },
        {
            title      : "VERIFICATION EMAIL", //邮箱验证码
            field      : "verification_email",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
            code       : "SEND CODE",
        },
        {
            title      : "INVITATION CODE (Optional)",//邀请码
            field      : "invitation",
            icon       : "",
            placeholder: "Please enter",
            required   : false,
        },
    ],
    retrieve : [
        {
            title      : "EMAIL",
            field      : "email",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
        },
        {
            title      : "PASSWORD",
            field      : "pwd",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
        },
        {
            title      : "CONFIRM PASSWORD",
            field      : "confirm_pwd",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
        },
        {
            title      : "VERIFICATION CODE", //行为验证码
            field      : "verification",
            icon       : "",
            placeholder: "Please enter",
            required   : false,
            code       : "change",
        },
        {
            title      : "VERIFICATION EMAIL", //邮箱验证码
            field      : "verification_email",
            icon       : "",
            placeholder: "Please enter",
            required   : true,
            code       : "SEND CODE",
        },
         
    ],
    resetting: [],
};
