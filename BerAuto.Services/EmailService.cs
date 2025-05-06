using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace BerAuto.Services
{
    public class EmailSettings
    {
        public string From { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
    }

    public class EmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("BérAutó", _settings.From));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;
            email.Body = new TextPart("plain")
            {
                Text = body};

            using var smtp = new SmtpClient();
            try
            {
                Console.WriteLine($"{_settings.SmtpServer}{_settings.Port}");
                await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_settings.Username, _settings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.ToString()}");
                throw;
            }
        }
    }
}
