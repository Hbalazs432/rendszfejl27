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

        public async Task SendAcceptedEmailAsync(string toEmail, string carBrand, string carModel, 
            DateOnly startDate, DateOnly endDate)
        {
            var email = new MimeMessage();
            email.From.Add(new MailboxAddress("BérAutó", _settings.From));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = "Elfogadtuk a bérlésedet!";
            email.Body = new TextPart("plain")
            {
                Text = $@"
                Tisztelt Uram/Hölgyem!,

                Elfogadtuk az autóbérlési igényét.

                Részletek:
                - Autó: {carBrand} {carModel}
                - Bérlés kezdete: {startDate:yyyy-MM-dd}
                - Bérlés vége: {endDate:yyyy-MM-dd}

                BérAutó"
            };

            using var smtp = new SmtpClient();
            try
            {
                await smtp.ConnectAsync(_settings.SmtpServer, _settings.Port, MailKit.Security.SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_settings.From, _settings.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");
                throw;
            }
        }
    }
}
