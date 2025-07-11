import puppeteer from "puppeteer"
import type { Browser } from "puppeteer";
import type { IInvoice } from "../types";
import { config } from "../config/config"

export class PDFService {
  private static instance: PDFService
   private browser: Browser | null = null;

  private constructor() {}

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService()
    }
    return PDFService.instance
  }

  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      })
    }
    return this.browser
  }

  public async generateInvoicePDF(invoice: IInvoice): Promise<Buffer> {
    const browser = await this.getBrowser()
    const page = await browser.newPage()

    try {
      const html = this.generateInvoiceHTML(invoice)

      await page.setContent(html, {
        waitUntil: "networkidle0",
        timeout: config.pdf.timeout,
      })

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      })

      return pdfBuffer
    } finally {
      await page.close()
    }
  }

  private generateInvoiceHTML(invoice: IInvoice): string {
    const formatDate = (date: Date): string => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    const formatCurrency = (amount: number): string => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    }

    const taxAmount = (invoice.subtotal * invoice.tax) / 100
    const discountAmount = invoice.discount || 0

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          
          .company-info h1 {
            color: #2563eb;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .company-info p {
            color: #666;
            font-size: 14px;
          }
          
          .invoice-info {
            text-align: right;
          }
          
          .invoice-info h2 {
            font-size: 28px;
            color: #333;
            margin-bottom: 10px;
          }
          
          .invoice-number {
            font-size: 18px;
            color: #666;
            margin-bottom: 10px;
          }
          
          .status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status.draft { background: #f3f4f6; color: #374151; }
          .status.sent { background: #dbeafe; color: #1d4ed8; }
          .status.paid { background: #d1fae5; color: #065f46; }
          .status.overdue { background: #fee2e2; color: #dc2626; }
          .status.cancelled { background: #f3f4f6; color: #6b7280; }
          
          .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            gap: 40px;
          }
          
          .billing-info {
            flex: 1;
          }
          
          .billing-info h3 {
            color: #2563eb;
            font-size: 16px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .billing-info p {
            margin-bottom: 5px;
            line-height: 1.5;
          }
          
          .billing-info .client-name {
            font-weight: bold;
            font-size: 16px;
            color: #333;
          }
          
          .items-section {
            margin-bottom: 30px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          .items-table th {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          
          .items-table th:last-child,
          .items-table td:last-child {
            text-align: right;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .items-table tr:nth-child(even) {
            background-color: #f9fafb;
          }
          
          .items-table tr:hover {
            background-color: #f3f4f6;
          }
          
          .quantity, .rate, .amount {
            text-align: right !important;
            font-weight: 500;
          }
          
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          
          .totals-table {
            width: 350px;
            border-collapse: collapse;
          }
          
          .totals-table td {
            padding: 10px 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .totals-table .label {
            font-weight: 500;
            color: #374151;
          }
          
          .totals-table .value {
            text-align: right;
            font-weight: 600;
            color: #111827;
          }
          
          .totals-table .total-row {
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            color: white;
            font-size: 18px;
            font-weight: bold;
          }
          
          .totals-table .total-row td {
            border: none;
            padding: 15px;
          }
          
          .notes-section {
            margin-bottom: 30px;
          }
          
          .notes-section h3 {
            color: #2563eb;
            font-size: 16px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .notes-section p {
            background: #f9fafb;
            padding: 15px;
            border-left: 4px solid #2563eb;
            border-radius: 4px;
            line-height: 1.6;
          }
          
          .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
          }
          
          .footer h3 {
            color: #2563eb;
            margin-bottom: 10px;
          }
          
          @media print {
            .container {
              padding: 0;
            }
            
            .header {
              break-inside: avoid;
            }
            
            .items-table {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-info">
              <h1>Invoice Generator</h1>
              <p>Professional Invoice Management System</p>
            </div>
            <div class="invoice-info">
              <h2>INVOICE</h2>
              <div class="invoice-number">#${invoice.invoiceNumber}</div>
              <div class="status ${invoice.status}">${invoice.status}</div>
            </div>
          </div>

          <div class="billing-section">
            <div class="billing-info">
              <h3>Bill To</h3>
              <p class="client-name">${invoice.clientName}</p>
              ${invoice.clientCompany ? `<p><strong>${invoice.clientCompany}</strong></p>` : ""}
              <p>${invoice.clientEmail}</p>
              ${invoice.clientPhone ? `<p>${invoice.clientPhone}</p>` : ""}
              <p style="white-space: pre-line;">${invoice.clientAddress}</p>
            </div>
            <div class="billing-info">
              <h3>Invoice Details</h3>
              <p><strong>Issue Date:</strong> ${formatDate(invoice.issueDate)}</p>
              <p><strong>Due Date:</strong> ${formatDate(invoice.dueDate)}</p>
              <p><strong>Status:</strong> ${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</p>
            </div>
          </div>

          <div class="items-section">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="quantity">${item.quantity}</td>
                    <td class="rate">${formatCurrency(item.rate)}</td>
                    <td class="amount">${formatCurrency(item.amount)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="totals-section">
            <table class="totals-table">
              <tr>
                <td class="label">Subtotal:</td>
                <td class="value">${formatCurrency(invoice.subtotal)}</td>
              </tr>
              ${
                discountAmount > 0
                  ? `
              <tr>
                <td class="label">Discount:</td>
                <td class="value">-${formatCurrency(discountAmount)}</td>
              </tr>
              `
                  : ""
              }
              <tr>
                <td class="label">Tax (${invoice.tax}%):</td>
                <td class="value">${formatCurrency(taxAmount)}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL</td>
                <td>${formatCurrency(invoice.total)}</td>
              </tr>
            </table>
          </div>

          ${
            invoice.notes
              ? `
          <div class="notes-section">
            <h3>Notes</h3>
            <p>${invoice.notes}</p>
          </div>
          `
              : ""
          }

          ${
            invoice.terms
              ? `
          <div class="notes-section">
            <h3>Terms & Conditions</h3>
            <p>${invoice.terms}</p>
          </div>
          `
              : ""
          }

          <div class="footer">
            <h3>Thank you for your business!</h3>
            <p>Generated on ${formatDate(new Date())}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  public async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}

export default PDFService.getInstance()
