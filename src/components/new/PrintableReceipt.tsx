import React from 'react';
import { Invoice } from '@/types';
import { formatAmount, formatDate } from '@/utils/invoice-utils';

interface PrintableReceiptProps {
  invoice: Invoice;
  companyName: string;
}

const PrintableReceipt: React.FC<PrintableReceiptProps> = ({ invoice, companyName }) => {
  return (
    <div className="printable-content" style={{
      fontFamily: "'Courier New', monospace",
      width: '57mm',
      margin: '0 auto',
      padding: '5mm',
      fontSize: '10px',
      lineHeight: '1.3',
      color: '#000',
      background: '#fff'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '13px' }}>
        <h1 style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 8px 0', letterSpacing: '0.5px' }}>
          {companyName.toUpperCase()}
        </h1>
        <div style={{ fontSize: '10px', lineHeight: '1.2' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            RECEIPT: {invoice.invoiceNumber}
          </div>
          <div>Date: {formatDate(new Date(invoice.date))}</div>
          <div>Time: {invoice.time}</div>
          <div>Staff: {invoice.userName}</div>
          <div>Category: {invoice.salesCategory.toUpperCase()}</div>
        </div>
      </div>

      {/* Customer */}
      <div style={{ marginBottom: '9px', borderTop: '1px dashed #000', paddingTop: '6px' }}>
        <div style={{ fontWeight: '600', fontSize: '12px', wordWrap: 'break-word' }}>
          Customer: {invoice.customerName}
        </div>
      </div>

      {/* Receipt Summary */}
      <div style={{ marginBottom: '12px', fontSize: '13px' }}>
        <div style={{ fontWeight: 'bold' }}>Total KG: {invoice.totalKg}kg</div>
        <div style={{ fontWeight: '900', fontSize: '14px', marginTop: '3px' }}>
          Amount: {formatAmount(invoice.grandTotal)}
        </div>
      </div>

      {/* Totals */}
      <div style={{ borderTop: '1px dashed #000', paddingTop: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '13px', fontWeight: 'bold' }}>
          <span>Total KG:</span>
          <span>{invoice.totalKg}kg</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '900' }}>
          <span>TOTAL:</span>
          <span>{formatAmount(invoice.grandTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '11px' }}>
          <span>Paid:</span>
          <span>{formatAmount(invoice.amountPaid)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px', fontSize: '11px', fontWeight: 'bold' }}>
          <span>Change:</span>
          <span>{invoice.balance > 0 ? formatAmount(invoice.balance) : '₦0'}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px dashed #000', paddingTop: '8px', fontSize: '9px', textAlign: 'center', lineHeight: '1.2' }}>
        <div style={{ marginBottom: '3px' }}>Service Hours:</div>
        <div>Mon-Sat: 7am-6:30pm</div>
        <div>Sunday: 9am-4:30pm</div>
        <div style={{ marginTop: '2px', fontWeight: 'bold' }}>
          WhatsApp: 0701 321 8705
        </div>
        <div style={{ marginTop: '3px', fontStyle: 'italic' }}>
          Thank you for your patronage!
        </div>
      </div>
    </div>
  );
};

export default PrintableReceipt;
