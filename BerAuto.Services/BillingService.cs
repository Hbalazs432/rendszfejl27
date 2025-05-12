using BerAuto.DataContext.Dtos;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BerAuto.Services
{
    public class BillingService
    {
        public byte[] GenerateInvoicePdf(InvoiceDto invoice)
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);

                    page.Header().Element(c => ComposeHeader(c, invoice));
                    page.Content().Element(c => ComposeContent(c, invoice));
                });
            });

            return document.GeneratePdf();
        }

        void ComposeHeader(IContainer container, InvoiceDto invoice)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item()
                        .Text($"Számla #{invoice.RentId}")
                        .FontSize(20).SemiBold().FontColor(Colors.Blue.Medium);

                    column.Item().Text(text =>
                    {
                        text.Span("Kiállítási idő: ").SemiBold();
                        text.Span($"{invoice.InvStartDate}");
                    });

                    column.Item().Text(text =>
                    {
                        text.Span("Fizetési határidő: ").SemiBold();
                        text.Span($"{invoice.InvEndDate}");
                    });
                });
            });
        }

        void ComposeContent(IContainer container, InvoiceDto invoice)
        {
            container.PaddingVertical(40).Column(column =>
            {
                column.Spacing(5);

                column.Item().Element(c => ComposeTable(c, invoice));
            });
        }

        void ComposeTable(IContainer container, InvoiceDto invoice)
        {
            container.Table(table =>
            {
                table.ColumnsDefinition(columns =>
                {
                    columns.ConstantColumn(25);
                    columns.RelativeColumn(3);
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                    columns.RelativeColumn();
                });

                table.Header(header =>
                {
                    header.Cell().Element(CellStyle).Text("#");
                    header.Cell().Element(CellStyle).Text("Autó");
                    header.Cell().Element(CellStyle).AlignRight().Text("Ár");
                    header.Cell().Element(CellStyle).AlignRight().Text("Napok");
                    header.Cell().Element(CellStyle).AlignRight().Text("Összesen");

                    static IContainer CellStyle(IContainer container)
                    {
                        return container.DefaultTextStyle(x => x.SemiBold()).PaddingVertical(5).
                        BorderBottom(1).BorderColor(Colors.Black);
                    }
                });

                table.Cell().Element(CellStyle).Text("1");
                table.Cell().Element(CellStyle).Text(invoice.Car);
                table.Cell().Element(CellStyle).AlignRight().Text($"{invoice.Price} Ft");
                table.Cell().Element(CellStyle).AlignRight().Text(invoice.Days.ToString());
                table.Cell().Element(CellStyle).AlignRight().Text($"{invoice.TotalAmount} Ft");

                static IContainer CellStyle(IContainer container)
                {
                    return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).PaddingVertical(5);
                }
            });
        }

    }
}
