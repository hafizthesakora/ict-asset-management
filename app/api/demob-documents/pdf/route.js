import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Document ID is required' },
        { status: 400 }
      );
    }

    const demobDoc = await db.demobDocument.findUnique({
      where: { id },
      include: {
        people: true,
      },
    });

    if (!demobDoc) {
      return NextResponse.json(
        { message: 'Demob document not found' },
        { status: 404 }
      );
    }

    // Generate HTML for PDF
    const html = generateDemobPDF(demobDoc);

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      {
        error: error.message,
        message: 'Failed to generate PDF',
      },
      {
        status: 500,
      }
    );
  }
}

function generateDemobPDF(demobDoc) {
  const itemsReturned = demobDoc.itemsReturned || [];
  const accessesRevoked = demobDoc.accessesRevoked || [];

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Demobilization Document - ${demobDoc.people.title}</title>
  <style>
    @media print {
      @page { margin: 2cm; }
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #ffffff;
    }
    .header {
      text-align: center;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      padding: 30px 20px;
      border-radius: 10px;
      margin-bottom: 30px;
      box-shadow: 0 4px 6px rgba(251, 191, 36, 0.3);
    }
    .logo-container {
      margin-bottom: 20px;
    }
    .logo {
      max-width: 150px;
      height: auto;
      background: white;
      padding: 10px;
      border-radius: 8px;
    }
    .header h1 {
      color: #ffffff;
      margin: 15px 0 10px 0;
      font-size: 28px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      letter-spacing: 1px;
    }
    .header p {
      color: #fffbeb;
      margin: 5px 0;
    }
    .header .date {
      color: #fef3c7;
      font-size: 13px;
    }
    .section {
      margin-bottom: 30px;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 20px;
      background: #fffbeb;
    }
    .section h2 {
      color: #d97706;
      border-bottom: 3px solid #fbbf24;
      padding-bottom: 8px;
      margin: 0 0 15px 0;
      font-size: 20px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 12px;
      margin-bottom: 15px;
      background: white;
      padding: 15px;
      border-radius: 6px;
    }
    .info-label {
      font-weight: bold;
      color: #92400e;
    }
    .info-value {
      color: #1a1a1a;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    th, td {
      border: 1px solid #fde68a;
      padding: 12px;
      text-align: left;
    }
    th {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #ffffff;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    tr:nth-child(even) {
      background-color: #fffbeb;
    }
    tr:hover {
      background-color: #fef3c7;
    }
    .checkbox {
      width: 22px;
      height: 22px;
      border: 2px solid #f59e0b;
      display: inline-block;
      text-align: center;
      line-height: 20px;
      color: #f59e0b;
      font-weight: bold;
      border-radius: 4px;
      background: white;
    }
    .signature-section {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 3px solid #fbbf24;
    }
    .signature-box {
      margin-top: 40px;
      padding: 25px;
      border: 2px dashed #fbbf24;
      border-radius: 8px;
      background: #fffbeb;
    }
    .signature-line {
      border-bottom: 2px solid #d97706;
      width: 350px;
      margin-top: 60px;
    }
    .footer {
      margin-top: 50px;
      text-align: center;
      color: #78716c;
      font-size: 11px;
      border-top: 2px solid #fde68a;
      padding-top: 20px;
      background: #fffbeb;
      padding: 20px;
      border-radius: 8px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #fbbf24;
      color: #92400e;
      border-radius: 20px;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-container">
      <!-- Logo placeholder - Replace src with your actual logo URL -->
      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'%3E%3Crect fill='%23ffffff' width='150' height='60' rx='8'/%3E%3Ctext x='75' y='35' font-family='Arial, sans-serif' font-size='24' font-weight='bold' fill='%23f59e0b' text-anchor='middle'%3EENI GHANA%3C/text%3E%3C/svg%3E" alt="Eni Ghana Logo" class="logo">
    </div>
    <h1>EMPLOYEE DEMOBILIZATION DOCUMENT</h1>
    <p style="margin: 5px 0; font-size: 15px; font-weight: 600;">ICT Asset Management System</p>
    <p class="date">Generated on ${new Date(demobDoc.demobDate).toLocaleString()}</p>
  </div>

  <div class="section">
    <h2>Employee Information</h2>
    <div class="info-grid">
      <div class="info-label">Full Name:</div>
      <div>${demobDoc.people.title}</div>
      <div class="info-label">Email:</div>
      <div>${demobDoc.people.email || 'N/A'}</div>
      <div class="info-label">Department:</div>
      <div>${demobDoc.people.department || 'N/A'}</div>
      <div class="info-label">Area of Work:</div>
      <div>${demobDoc.people.aow || 'N/A'}</div>
      <div class="info-label">Topology:</div>
      <div>${demobDoc.people.topology || 'N/A'}</div>
    </div>
  </div>

  <div class="section">
    <h2>Assets Returned (${itemsReturned.length})</h2>
    ${
      itemsReturned.length === 0
        ? '<p style="color: #6b7280; font-style: italic;">No assets assigned</p>'
        : `
    <table>
      <thead>
        <tr>
          <th style="width: 50px;">Status</th>
          <th>Item Name</th>
          <th>Serial Number</th>
        </tr>
      </thead>
      <tbody>
        ${itemsReturned
          .map(
            (item) => `
        <tr>
          <td style="text-align: center;"><span class="checkbox">${item.checked ? '✓' : ''}</span></td>
          <td>${item.title}</td>
          <td>${item.serialNumber}</td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
    `
    }
  </div>

  <div class="section">
    <h2>System Accesses Revoked (${accessesRevoked.length})</h2>
    ${
      accessesRevoked.length === 0
        ? '<p style="color: #6b7280; font-style: italic;">No system accesses</p>'
        : `
    <table>
      <thead>
        <tr>
          <th style="width: 50px;">Status</th>
          <th>Access Name</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        ${accessesRevoked
          .map(
            (access) => `
        <tr>
          <td style="text-align: center;"><span class="checkbox">${access.checked ? '✓' : ''}</span></td>
          <td>${access.name}</td>
          <td>${access.category}</td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
    `
    }
  </div>

  <div class="signature-section">
    <h2>Demobilization Performed By</h2>
    <div class="info-grid">
      <div class="info-label">Name:</div>
      <div>${demobDoc.demobPerformedBy}</div>
      <div class="info-label">Email:</div>
      <div>${demobDoc.demobPerformedByEmail}</div>
      <div class="info-label">Date:</div>
      <div>${new Date(demobDoc.demobDate).toLocaleDateString()}</div>
    </div>

    <div class="signature-box">
      <p style="margin: 0 0 60px 0; color: #6b7280;">Employee Signature (to be signed and uploaded):</p>
      <div style="border-bottom: 2px solid #000; width: 300px;"></div>
      <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">Employee: ${demobDoc.people.title}</p>
    </div>
  </div>

  <div class="footer">
    <p>This is an official demobilization document generated by Eni Ghana ICT Asset Management System.</p>
    <p>Document ID: ${demobDoc.id}</p>
  </div>

  <script>
    // Auto-print on load
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;
}
