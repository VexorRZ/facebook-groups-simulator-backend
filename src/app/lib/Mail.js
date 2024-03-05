import nodemailer from 'nodemailer';
import mailConfig from '../../config/mail';
const hbs = require('nodemailer-express-handlebars');
import path from 'path';

const transport = nodemailer.createTransport(mailConfig);

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('../resources/mail'),
    extName: '.html',
  })
);

export default transport;
