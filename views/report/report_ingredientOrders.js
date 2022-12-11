
// Importing modules
import PDFDocument from 'pdfkit'
import fs from 'fs'
  
// Create a document
const doc = new PDFDocument();
  
// Saving the pdf file in root directory.
doc.pipe(fs.createWriteStream('../report/example.pdf'));
  
// Adding functionality
doc
   
  .fontSize(27)
  .text('This the article for GeeksforGeeks', 100, 100);
  
// Adding an image in the pdf.
  
// Finalize PDF file
doc.end();
    
