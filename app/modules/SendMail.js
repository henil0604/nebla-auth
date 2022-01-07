const nodemailer = require("nodemailer");

const EMAIL = env("NODE_MAILER_EMAIL");
const PASSWORD = env("NODE_MAILER_PASSWORD");
const TEST_ACCOUNT = env("NODE_MAILER_TEST_ACCOUNT");

if (EMAIL == undefined || PASSWORD == undefined || TEST_ACCOUNT == undefined) {
    throw new Error("Invalid NodeMailer Configration")
}


const SendMail = async (to = "", subject = "", message = "") => {
    let User = EMAIL;
    let Pass = PASSWORD;

    if (TEST_ACCOUNT === true) {
        let testAccount = await nodemailer.createTestAccount();
        User = testAccount.user;
        Pass = testAccount.pass;
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: User,
            pass: Pass,
        },
    });
    let info;

    try {
        // send mail with defined transport object
        info = await transporter.sendMail({
            from: User,
            to: to,
            subject: subject,
            html: message
        });
    } catch (e) {
        return {
            status: "error",
            error: e
        }
    }

    return {
        status: "success",
        info: info
    };;

}

module.exports = SendMail;