import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { asyncHandler } from "../utils/asyncHandler";

export const generatePdf = asyncHandler(async (req, res) => {
  const { imgData } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const htmlContent = `
      <html>
        <body style="margin: 0; padding: 0;">
          <img src="${imgData}" style="width: 100%; height: auto;" />
        </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // Generate PDF
    // const pdfPath = path.join(__dirname, "invoice.pdf");
    const pdfPath = path.join("/tmp", "invoice.pdf");
    console.log("imgData length:", imgData?.length);
console.log("Generating PDF at:", pdfPath);
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // Read the generated PDF and send it as a response
    fs.readFile(pdfPath, (err, data) => {
      if (err) {
        res.status(500).send("Error reading PDF file");
        return;
      }

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="invoice.pdf"',
      });

      res.send(data);

      // Optional cleanup
      fs.unlink(pdfPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting the PDF file:", unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Failed to generate PDF");
  }
});
