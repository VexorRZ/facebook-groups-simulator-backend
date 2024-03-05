import Mail from '../lib/Mail';

export default {
  key: 'RegistrationMail',
  async handle({ data }) {
    const { user, link } = data;
    await Mail.sendMail({
      from: 'queirozrafael348@gmail.com',
      to: ` ${user.email}>`,
      subject: 'Cadastro de usuário',
      html: `<p>Olá, ${user.name}, isso é um segundo teste. Acesse este link  <link> ${link} </link></p> `,
    });
  },
};
