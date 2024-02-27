import Mail from '../lib/Mail';

export default {
  key: 'RegistrationMail',
  async handle({ data }) {
    const { user } = data;
    await Mail.sendMail({
      from: 'queirozrafael348@gmail.com',
      to: ` ${user.email}>`,
      subject: 'Cadastro de usuário',
      html: `Olá, ${user.name}, isso é um segundo teste`,
    });
  },
};
