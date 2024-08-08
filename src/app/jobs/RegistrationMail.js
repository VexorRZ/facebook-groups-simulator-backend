import Mail from '../lib/Mail';

import { Resend } from 'resend';

const resend = new Resend('re_EX9vj4HH_9UDngZZjN7TxswqvcbDxB9kg');

export default {
  key: 'RegistrationMail',
  async handle({ data }) {
    try {
      const { user, link } = data;
      await resend.emails.send({
        from: 're_EX9vj4HH_9UDngZZjN7TxswqvcbDxB9kg',
        to: ` ${user.email}>`,
        subject: 'Cadastro de usuário',
        html: `<p>Olá, ${user.name}, recebemos sua solicitação. Clique neste<p><a href=${link}>link</a> para resetar sua senha</p>`,
      });
    } catch (err) {
      return err;
    }
  },
};
