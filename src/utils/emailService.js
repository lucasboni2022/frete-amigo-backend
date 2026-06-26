import nodemailer from 'nodemailer';

const isSmtpConfigured = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return (
    user &&
    pass &&
    user !== 'seu_email@gmail.com' &&
    pass !== 'sua_senha_de_app_gmail'
  );
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Envia e-mail de redefinição de senha.
 * Em desenvolvimento sem SMTP configurado, imprime o link no console.
 * @param {string} toEmail - Endereço de destino
 * @param {string} resetToken - Token gerado para reset
 * @param {string} userName - Nome do usuário para personalizar o e-mail
 */
export const sendPasswordResetEmail = async (toEmail, resetToken, userName) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

  // Modo dev: SMTP não configurado → apenas loga o link no console
  if (!isSmtpConfigured()) {
    console.warn('\n⚠️  SMTP não configurado. Em produção configure SMTP_USER e SMTP_PASS no .env');
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.info(`📧 [DEV] Link de redefinição para ${toEmail}:`);
    console.info(`   ${resetLink}`);
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return; // Não lança erro em dev
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Frete Amigo" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Redefinição de senha - Frete Amigo',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background-color:#1a56db;padding:32px 40px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">🚚 Frete Amigo</h1>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <h2 style="color:#111827;font-size:20px;margin:0 0 16px 0;">Redefinição de senha</h2>
                    <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
                      Olá, <strong>${userName || 'usuário'}</strong>!<br><br>
                      Recebemos uma solicitação para redefinir a senha da sua conta.
                      Clique no botão abaixo para criar uma nova senha.
                      O link é válido por <strong>1 hora</strong>.
                    </p>
                    <div style="text-align:center;margin:32px 0;">
                      <a href="${resetLink}"
                         style="background-color:#1a56db;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;">
                        Redefinir minha senha
                      </a>
                    </div>
                    <p style="color:#9ca3af;font-size:13px;line-height:1.6;margin:0;">
                      Se você não solicitou a redefinição de senha, ignore este e-mail.
                      Sua senha permanecerá a mesma.
                    </p>
                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
                    <p style="color:#9ca3af;font-size:12px;margin:0;">
                      Ou copie e cole este link no seu navegador:<br>
                      <a href="${resetLink}" style="color:#1a56db;word-break:break-all;">${resetLink}</a>
                    </p>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="background-color:#f9fafb;padding:20px 40px;text-align:center;">
                    <p style="color:#9ca3af;font-size:12px;margin:0;">
                      © ${new Date().getFullYear()} Frete Amigo. Todos os direitos reservados.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.info(`✅ E-mail de redefinição enviado para: ${toEmail}`);
  } catch (smtpError) {
    console.error('❌ Erro ao enviar e-mail via SMTP:');
    console.error(`   Código: ${smtpError.code}`);
    console.error(`   Mensagem: ${smtpError.message}`);
    if (smtpError.code === 'EAUTH') {
      console.error('   💡 Verifique SMTP_USER e SMTP_PASS no .env');
      console.error('   💡 Para Gmail, use uma Senha de App: https://myaccount.google.com/apppasswords');
    }
    throw smtpError; // re-lança para o controller tratar
  }
};
