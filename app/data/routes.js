
const $api = [
    get.routes("api/Root")
]

const $api$user = [
    get.routes("api/user/Root"),
    get.routes("api/user/Create"),
    get.routes("api/user/Login"),
    get.routes("api/user/Data"),
    get.routes("api/user/Logout"),
    get.routes("api/user/Avatar"),
];

const $api$user$verify = [
    get.routes("api/user/verify/Root"),
]

const $api$user$verify$email = [
    get.routes("api/user/verify/email/Root"),
    get.routes("api/user/verify/email/done${token}")
]

module.exports = [
    get.routes("Root"),
    ...$api,
    ...$api$user,
    ...$api$user$verify,
    ...$api$user$verify$email,
]