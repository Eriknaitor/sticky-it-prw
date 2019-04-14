const email = require('nodemailer');
const credentials = process.env.MAIL.split(',');

const sendMail = async (to, mailinfo) => {
    let account = await email.createTransport({
        service: 'gmail',
        auth: {
            user: credentials[0],
            pass: credentials[1]
        }
    });

    let info = await account.sendMail({
        from: `"RemindMe 📝" <mailerremindme@gmail.com>`,
        to: to.email,
        subject: mailinfo.subject,
        text: mailinfo.text,
        html: mailinfo.html
    });
}

module.exports = {
    register: (to) => {
        sendMail(to, {
            text: `¡Bienvenid@ a RemindMe ${to.username}!\n
                   Nos alegra que hayas decicido confiar en nosotros para administrar tus notas y recordatorios.\n 
                   Si quieres iniciar sesión dirígete a ${process.env.DOMAIN + '/login'}`,

            html: `<h1>¡Bienvenid@ a RemindMe ${to.username}!</h1>
                   <p>Nos alegra que hayas decicido confiar en nosotros para administrar tus notas y recordatorios.</p>
                   <p>Si quieres iniciar sesión puedes hacer click en este botón y te redirigiá a la web</p>
                   <div style="background: ${to.color}; text-align: center; border: 0px; width:180px; padding: 4px 0; position:absolute; transform: translateX(-50%) translateY(-50%); border-radius: 3px;">
                        <a href="${process.env.DOMAIN + '/login'}" style="font-family: 'Roboto'; text-transform: uppercase; color: #FFF; user-select: none;">Iniciar sesión</a>
                   </div>`,
            subject: 'Gracias por registrarte en RemindMe'
        }).catch(err => console.log(err));
    },

    reminder: (to, note) => {
        sendMail(to, note).catch(err => console.log(err));
    }
}