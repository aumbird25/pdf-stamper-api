const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.post('/stamp-pdf', async (req, res) => {
  try {
    const { pdfBase64, bookNumber, receiveDate, objective } = req.body;
    if (!pdfBase64) return res.status(400).send('Missing PDF');

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText(
      `เลขที่หนังสือ: ${bookNumber}\nวันที่รับ: ${receiveDate}\nวัตถุประสงค์: ${objective}`,
      {
        x: 50,
        y: firstPage.getHeight() - 100,
        size: 12,
        color: rgb(0, 0, 0),
      }
    );

    const modifiedPdfBytes = await pdfDoc.save();
    const modifiedPdfBase64 = Buffer.from(modifiedPdfBytes).toString('base64');

    res.json({ pdfBase64: modifiedPdfBase64 });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

app.listen(port, () => console.log(`PDF Stamper running on port ${port}`));
