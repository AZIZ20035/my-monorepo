'use client';

import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer';
import { DeliveryInvoiceResponse } from '@/dto/report.dto';

// Register Cairo font for Arabic support
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v20/SLXGc1jP_M5idBL4Sk0HS72_SkhS.ttf',
  fontWeight: 'normal',
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#fff',
    fontFamily: 'Cairo',
    direction: 'rtl',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    paddingBottom: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 5,
    textTransform: 'uppercase',
  },
  refBlock: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  refLabel: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  refValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: 'bold',
    marginTop: 2,
  },
  addressBox: {
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#cbd5e1',
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    lineHeight: 1.5,
  },
  infoSection: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 30,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    paddingBottom: 5,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
  },
  tableHeaderCell: {
    padding: 10,
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#0f172a',
    borderRadius: 3,
    marginLeft: 10,
  },
  tableCell: {
    padding: 12,
    fontSize: 9,
    color: '#334155',
  },
  summarySection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },
  signatureBlock: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
    marginTop: 20,
  },
  signatureLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  paymentBox: {
    width: 220,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  paymentLabel: {
    fontSize: 8,
    color: '#64748b',
  },
  paymentValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  remainingBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingLabel: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  remainingValue: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
});

export function DeliveryReceiptPDF({ data }: { data: DeliveryInvoiceResponse }) {
  const subtotal = data.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = data.totalCost - subtotal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>مطابخ المدفون</Text>
            <Text style={styles.subtitle}>كشف عمليات التسليم / DELIVERY RECEIPT</Text>
          </View>
          <View style={styles.refBlock}>
            <Text style={styles.refLabel}>رقم الطلب / Order Ref.</Text>
            <Text style={styles.refValue}>#{100 + data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Address Box */}
        <View style={styles.addressBox}>
          <Text style={styles.addressTitle}>عنوان التوصيل / DELIVERY ADDRESS</Text>
          <Text style={styles.addressText}>{data.address || 'لم يتم تحديد عنوان'}</Text>
        </View>

        {/* Info Grid */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>بيانات العميل / Customer Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.customer.name}</Text>
              <Text style={styles.infoLabel}>اسم العميل:</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.customer.phone}</Text>
              <Text style={styles.infoLabel}>الجوال:</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: 30, textAlign: 'center' }]}>✓</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>المنتج</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>الحجم</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>نوع الطبق</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.5, textAlign: 'center' }]}>الكمية</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={[styles.tableCell, { width: 30, alignItems: 'center' }]}>
                <View style={styles.checkbox} />
              </View>
              <Text style={[styles.tableCell, { flex: 2, fontWeight: 'bold' }]}>{item.product}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.size || '-'}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.plateType}</Text>
              <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center', backgroundColor: '#f8fafc' }]}>{item.quantity}</Text>
            </View>
          ))}
        </View>

        {/* Summary & Signatures */}
        <View style={styles.summarySection}>
          <View style={{ flex: 1 }}>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureLabel}>توقيع مراجع الطلب / REVIEWER SIGNATURE</Text>
            </View>
            <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 5, fontStyle: 'italic' }}>
              I confirm that I have checked all the above items for quality and completeness.
            </Text>
          </View>

          <View style={styles.paymentBox}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentValue}>{subtotal.toLocaleString()} ر.س</Text>
              <Text style={styles.paymentLabel}>المجموع الفرعي:</Text>
            </View>
            <View style={[styles.paymentRow, { borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 5 }]}>
              <Text style={styles.paymentValue}>{deliveryFee.toLocaleString()} ر.س</Text>
              <Text style={styles.paymentLabel}>خدمة التوصيل:</Text>
            </View>
            <View style={[styles.paymentRow, { marginTop: 5 }]}>
              <Text style={[styles.paymentValue, { fontSize: 11 }]}>{data.totalCost.toLocaleString()} ر.س</Text>
              <Text style={[styles.paymentLabel, { fontWeight: 'bold' }]}>الإجمالي الكلي:</Text>
            </View>

            {data.remainingAmount > 0 && (
              <View style={styles.remainingBox}>
                <Text style={styles.remainingValue}>{data.remainingAmount.toLocaleString()} ر.س</Text>
                <Text style={styles.remainingLabel}>المتبقي للتحصيل:</Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Printed via ERP System - License #8822</Text>
          <Text style={[styles.footerText, { color: '#0f172a', fontWeight: 'bold' }]}>مطابخ المدفون - كشف العمليات</Text>
        </View>
      </Page>
    </Document>
  );
}
