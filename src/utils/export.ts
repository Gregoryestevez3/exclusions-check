import { ExclusionResult } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '';
  }
};

export const exportToCSV = (results: ExclusionResult[]): void => {
  // Header row
  let csvContent = "Result ID,First Name,Last Name,DOB,Status,Check Date,Message";
  
  // Add database-specific headers
  csvContent += ",Medical Check Status,OIG Status,SAM Status,NSOPW Status\n";
  
  // Data rows
  results.forEach(result => {
    // Find database specific results
    const medicalResult = result.databaseResults.find(dr => dr.databaseId === 'medical');
    const oigResult = result.databaseResults.find(dr => dr.databaseId === 'oig');
    const samResult = result.databaseResults.find(dr => dr.databaseId === 'sam');
    const nsopwResult = result.databaseResults.find(dr => dr.databaseId === 'nsopw');
    
    const row = [
      `"${result.resultId}"`,
      `"${result.firstName}"`,
      `"${result.lastName}"`,
      `"${formatDate(result.dateOfBirth)}"`,
      `"${result.status}"`,
      `"${formatDate(result.checkDate)}"`,
      `"${result.message.replace(/"/g, '""')}"`,
      `"${medicalResult?.status || 'not checked'}"`,
      `"${oigResult?.status || 'not checked'}"`,
      `"${samResult?.status || 'not checked'}"`,
      `"${nsopwResult?.status || 'not checked'}"`
    ];
    
    csvContent += row.join(',') + '\n';
  });
  
  // Create and download the CSV file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `exclusion-verification-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (results: ExclusionResult[]): void => {
  // Create new PDF document
  const doc = new jsPDF();
  const timestamp = new Date().toLocaleString();
  
  results.forEach((result, index) => {
    // Add a new page for each result after the first one
    if (index > 0) {
      doc.addPage();
    }
    
    // Add header
    doc.setFontSize(18);
    doc.setTextColor(66, 56, 202); // Indigo color
    doc.text('Exclusion Verification Report', 105, 15, { align: 'center' });
    
    // Add timestamp
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${timestamp}`, 105, 22, { align: 'center' });
    
    // Add subject information section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Subject Information', 14, 35);
    
    // Add line under section header
    doc.setDrawColor(220, 220, 220);
    doc.line(14, 38, 196, 38);
    
    // Add subject data
    doc.setFontSize(11);
    const subjectData = [
      ['Full Name:', `${result.firstName} ${result.lastName}`],
      ['Date of Birth:', formatDate(result.dateOfBirth)],
      ['Identification:', `${result.documentType.toUpperCase()}: ${result.identificationNumber}`],
      ['Status:', result.status.toUpperCase()],
      ['Verification Date:', formatDate(result.checkDate)]
    ];
    
    // Create subject info table
    doc.autoTable({
      startY: 42,
      head: [],
      body: subjectData,
      theme: 'plain',
      styles: { cellPadding: 2, fontSize: 11 },
      columnStyles: { 0: { cellWidth: 40, fontStyle: 'bold' } }
    });
    
    // Add verification results section
    const endY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('Verification Results', 14, endY);
    doc.line(14, endY + 3, 196, endY + 3);
    
    // Add message
    doc.setFontSize(11);
    doc.text('Summary:', 14, endY + 10);
    doc.setTextColor(80, 80, 80);
    
    // Handle multiline text for the message
    const splitMessage = doc.splitTextToSize(result.message, 175);
    doc.text(splitMessage, 14, endY + 16);
    
    // Add database results section
    let dbStartY = endY + 16 + (splitMessage.length * 6);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Database Search Results', 14, dbStartY);
    doc.line(14, dbStartY + 3, 196, dbStartY + 3);
    
    // Prepare database results data
    const dbData = result.databaseResults.map(db => [
      db.databaseName,
      db.status.toUpperCase(),
      formatDate(db.searchDate),
      db.details
    ]);
    
    // Create database results table
    doc.autoTable({
      startY: dbStartY + 7,
      head: [['Database', 'Status', 'Search Date', 'Details']],
      body: dbData,
      theme: 'striped',
      headStyles: { fillColor: [67, 56, 202], textColor: 255 },
      styles: { cellPadding: 3 }
    });
    
    // Add footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${pageCount} - Exclusion Verification Report`,
        105,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  });
  
  // Save the PDF
  doc.save(`verification-report-${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Generate a detailed report for printing or exporting
export const generateDetailedReport = (result: ExclusionResult): string => {
  let report = `
  <div class="report-section">
    <h2>Subject Information</h2>
    <table class="info-table">
      <tr>
        <td class="label">Name:</td>
        <td>${result.firstName} ${result.lastName}</td>
      </tr>
      <tr>
        <td class="label">Date of Birth:</td>
        <td>${formatDate(result.dateOfBirth)}</td>
      </tr>
      <tr>
        <td class="label">ID Type/Number:</td>
        <td>${result.documentType.toUpperCase()}: ${result.identificationNumber}</td>
      </tr>
      <tr>
        <td class="label">Verification Date:</td>
        <td>${formatDate(result.checkDate)} at ${formatTime(result.checkDate)}</td>
      </tr>
      <tr>
        <td class="label">Status:</td>
        <td class="status-${result.status}">${result.status.toUpperCase()}</td>
      </tr>
    </table>
  </div>
  
  <div class="report-section">
    <h2>Verification Summary</h2>
    <p class="summary-message">${result.message}</p>
  </div>

  <div class="report-section">
    <h2>Database Search Results</h2>
    ${result.databaseResults.map(db => `
      <div class="database-result">
        <h3>${db.databaseName}</h3>
        <table class="info-table">
          <tr>
            <td class="label">Status:</td>
            <td class="status-${db.status}">${db.status.toUpperCase()}</td>
          </tr>
          <tr>
            <td class="label">Search Date:</td>
            <td>${formatDate(db.searchDate)}</td>
          </tr>
          <tr>
            <td class="label">Source:</td>
            <td><a href="${db.searchUrl}" target="_blank">${db.searchUrl}</a></td>
          </tr>
          <tr>
            <td class="label">Details:</td>
            <td>${db.details}</td>
          </tr>
          ${db.referenceId ? `
          <tr>
            <td class="label">Reference ID:</td>
            <td>${db.referenceId}</td>
          </tr>` : ''}
        </table>
      </div>
    `).join('')}
  </div>

  <div class="report-footer">
    <p>This verification was conducted for screening purposes only on ${formatDate(result.checkDate)}.</p>
    <p>Results should be confirmed with official sources if required by applicable regulations.</p>
  </div>
  `;

  return report;
};
