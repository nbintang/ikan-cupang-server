import {createTransport} from "nodemailer";
interface MailProps {
  to: string;
  subject: string;
  text: string;
}
const isDev = process.env.NODE_ENV !== "production";
const config = {
  host: isDev ? process.env.DEV_EMAIL_HOST : process.env.PROD_EMAIL_HOST,
  user: isDev ? process.env.DEV_EMAIL_USER : process.env.PROD_EMAIL_USER,
  pass: isDev ? process.env.DEV_EMAIL_PASS : process.env.PROD_EMAIL_PASS,
  port: isDev
    ? Number(process.env.DEV_EMAIL_PORT)
    : Number(process.env.PROD_EMAIL_PORT),
};

async function sendTokenThroughEmail({ to, subject, text }: MailProps) {
  const { host, user, pass, port } = config;
  const transporter = await createTransport({
    port,
    host,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: user,
    to,
    subject,
    text,
  });
}

export default sendTokenThroughEmail;
