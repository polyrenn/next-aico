import React from 'react';
import { Invoice } from '@/types';
import { formatAmount, formatDate } from '@/utils/invoice-utils';

interface PrintableInvoiceProps {
  invoice: Invoice;
  isReceipt?: boolean;
}

const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice, isReceipt = false }) => {
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
          AICO GAS LIMITED
        </h1>
        <div style={{ fontSize: '10px', lineHeight: '1.2' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
            {isReceipt ? 'RECEIPT' : 'INVOICE'}: {invoice.invoiceNumber}
          </div>
          <div>Date: {formatDate(new Date(invoice.date))}</div>
          <div>Time: {invoice.time}</div>
          <div>Staff: {invoice.userName}</div>
          <div>Category: {invoice.salesCategory.toUpperCase()}</div>
        </div>
      </div>

      {/* Customer */}
      <div style={{ marginBottom: '9px', borderTop: '1px dashed #000', paddingTop: '6px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '9px', wordWrap: 'break-word' }}>
          Customer: {invoice.customerName}
        </div>
      </div>

      {/* Items */}
      {!isReceipt && invoice.items.length > 0 && (
        <div style={{ marginBottom: '9px' }}>
          <div style={{ borderBottom: '1px dashed #000', paddingBottom: '3px', marginBottom: '3px' }}>
            <div style={{ display: 'flex', fontSize: '10px', fontWeight: 'bold' }}>
              <div style={{ flex: '2' }}>Item</div>
              <div style={{ flex: '1', textAlign: 'center' }}>Qty</div>
              <div style={{ flex: '1', textAlign: 'right' }}>KG</div>
              <div style={{ flex: '1.5', textAlign: 'right' }}>Amount</div>
            </div>
          </div>
          {invoice.items.map((item, index) => (
            <div key={index} style={{ display: 'flex', fontSize: '10px', marginBottom: '3px' }}>
              <div style={{ flex: '2', wordWrap: 'break-word' }}>{item.kg}</div>
              <div style={{ flex: '1', textAlign: 'center' }}>{item.quantity}</div>
              <div style={{ flex: '1', textAlign: 'right' }}>{item.totalKg}</div>
              <div style={{ flex: '1.5', textAlign: 'right' }}>
                {formatAmount(item.totalAmount)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt Summary */}
      {isReceipt && (
        <div style={{ marginBottom: '12px', fontSize: '12px' }}>
          <div>Total KG: {invoice.totalKg}kg</div>
          <div style={{ fontWeight: 'bold', fontSize: '12px', marginTop: '3px' }}>
            Amount: {formatAmount(invoice.grandTotal)}
          </div>
        </div>
      )}

      {/* Totals and Payment Info */}
      <div style={{ borderTop: '1px dashed #000', paddingTop: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '11px' }}>
          <span>Total KG:</span>
          <span style={{ fontWeight: 'bold' }}>{invoice.totalKg}kg</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', marginBottom: '3px' }}>
          <span>TOTAL:</span>
          <span>{formatAmount(invoice.grandTotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
          <span>Paid:</span>
          <span style={{ fontWeight: 'bold' }}>{formatAmount(invoice.amountPaid)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 'bold', borderTop: '1px dashed #000', paddingTop: '3px' }}>
          <span>Balance:</span>
          <span style={{ color: invoice.balance >= 0 ? '#059669' : '#dc2626' }}>
            {formatAmount(invoice.balance)}
          </span>
        </div>
        {invoice.balance < 0 && (
          <div style={{ fontSize: '9px', textAlign: 'center', marginTop: '3px', color: '#dc2626' }}>
            Customer owes: {formatAmount(Math.abs(invoice.balance))}
          </div>
        )}
        {invoice.balance > 0 && (
          <div style={{ fontSize: '9px', textAlign: 'center', marginTop: '3px', color: '#059669' }}>
            Change: {formatAmount(invoice.balance)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px dashed #000', paddingTop: '8px', fontSize: '9px', textAlign: 'center', lineHeight: '1.2' }}>
        <div style={{ marginBottom: '3px' }}>Service Hours:</div>
        <div>Mon-Sat: 7am-6:30pm</div>
        <div>Sunday: 9am-4:30pm</div>
        <div style={{ marginTop: '2px', fontWeight: 'bold' }}>
          WhatsApp: +234 701 321 8705
        </div>
        <div style={{ marginTop: '3px', fontStyle: 'italic' }}>
          Thank you for your patronage!
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoice;