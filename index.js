const express = require('express');
const { PDFDocument, rgb } = require('pdf-lib');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

app.post('/stamp-pdf', async (req, res) => {
  try {
    const { pdfBase64, bookNumber, receiveDate, objective } = req.body;

    const pdfBytes = Buffer.from(pdfBase64, 'base64');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const text = "เลขที่หนังสือ: " + bookNumber +
                 "\\nวันที่รับ: " + receiveDate +
                 "\\nวัตถุประสงค์: " + objective;

    firstPage.drawText(text, {
      x: 50,
      y: firstPage.getHeight() - 100,
      size: 12,
      color: rgb(0, 0, 0)
    });

    const newPdfBytes = await pdfDoc.save();
    const stampedBase64 = Buffer.from(newPdfBytes).toString('base64');

    res.json({ pdfBase64: stampedBase64 });
  } catch (err) {
    res.status(500).send('ERROR: ' + err.message);
  }
});

app.listen(port, () => console.log("PDF Stamper API running on port " + port));
