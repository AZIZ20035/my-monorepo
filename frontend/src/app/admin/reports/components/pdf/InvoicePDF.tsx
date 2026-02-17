'use client';

import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Font,
  Image
} from '@react-pdf/renderer';
import { InvoiceResponse } from '@/dto/report.dto';

// Register Cairo font for Arabic support
Font.register({
  family: 'Cairo',
  src: 'https://fonts.gstatic.com/s/cairo/v20/SLXGc1jP_M5idBL4Sk0HS72_SkhS.ttf',
  fontWeight: 'normal',
});

Font.register({
  family: 'CairoBold',
  src: 'https://fonts.gstatic.com/s/cairo/v20/SLXGc1jP_M5idBL4Sk0HS72_SkhS.ttf', // In a real app, use a proper bold weight URL
  fontWeight: 'bold',
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
    fontSize: 10,
    color: '#64748b',
    marginTop: 5,
  },
  invoiceNoBlock: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  invoiceNoLabel: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  invoiceNoValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
    marginBottom: 8,
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
  },
  tableCell: {
    padding: 10,
    fontSize: 9,
    color: '#334155',
  },
  totalSection: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: '#0f172a',
  },
  totalBox: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 24,
    color: '#fff',
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

export function InvoicePDF({ data }: { data: InvoiceResponse }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>مطابخ المدفون</Text>
            <Text style={styles.subtitle}>الرقم الضريبي: 30045678900003</Text>
          </View>
          <View style={styles.invoiceNoBlock}>
            <Text style={styles.invoiceNoLabel}>رقم الفاتورة / Invoice No.</Text>
            <Text style={styles.invoiceNoValue}>#{100 + data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoSection}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>بيانات العميل / Customer Info</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.customer.name}</Text>
              <Text style={styles.infoLabel}>الاسم:</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.customer.phone}</Text>
              <Text style={styles.infoLabel}>الجوال:</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.address}</Text>
              <Text style={styles.infoLabel}>العنوان:</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>تفاصيل الطلب / Order Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.day}</Text>
              <Text style={styles.infoLabel}>التاريخ:</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.period}</Text>
              <Text style={styles.infoLabel}>الفترة:</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoValue}>{data.deliveryTime}</Text>
              <Text style={styles.infoLabel}>وقت التوصيل:</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>المنتج</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>الحجم</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>نوع الطبق</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.5, textAlign: 'center' }]}>الكمية</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'left' }]}>الإجمالي</Text>
          </View>
          {data.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.product}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.size || '-'}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{item.plateType}</Text>
              <Text style={[styles.tableCell, { flex: 0.5, textAlign: 'center' }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'left', fontWeight: 'bold' }]}>{item.totalPrice.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalValue}>{data.totalCost.toLocaleString()} ر.س</Text>
              <Text style={styles.totalLabel}>الإجمالي الكلي</Text>
            </View>
            {data.remainingAmount > 0 ? (
              <View style={{ marginTop: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 6 }}>
                <Text style={{ fontSize: 10, color: '#fbbf24', textAlign: 'center', fontWeight: 'bold' }}>
                  المتبقي للتحصيل: {data.remainingAmount.toLocaleString()} ر.س
                </Text>
              </View>
            ) : (
              <View style={{ marginTop: 10, padding: 8, backgroundColor: 'rgba(52,211,153,0.1)', borderRadius: 6 }}>
                <Text style={{ fontSize: 10, color: '#34d399', textAlign: 'center', fontWeight: 'bold' }}>
                  مدفوعة بالكامل / PAID
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Printed via ERP System - License #8822</Text>
          <Text style={[styles.footerText, { color: '#0f172a', fontWeight: 'bold' }]}>مطابخ المدفون - جودة نثق بها</Text>
        </View>
      </Page>
    </Document>
  );
}
