import Mail from '../lib/Mail';

export default {
  key: 'RegistrationMail',
  async handle({ data }) {
    const { user, link } = data;
    await Mail.sendMail({
      from: 'queirozrafael348@gmail.com',
      to: ` ${user.email}>`,
      subject: 'Cadastro de usuário',
      html: `<p>Olá, ${user.name}, recebemos sua solicitação. Clique neste<p><a href=${link}>link</a> para resetar sua senha</p>`,
    });
  },
};
