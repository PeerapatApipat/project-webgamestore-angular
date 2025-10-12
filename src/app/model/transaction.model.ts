export interface Transaction {
  order_id: number;
  type: 'topup' | 'purchase'; // ประเภทรายการ: เติมเงิน หรือ ซื้อ
  amount: number;
  date: string; // วันที่จะมาในรูปแบบ string (ISO format)
  status: 'pending' | 'paid' | 'cancelled';
  games: string | null; // รายชื่อเกม อาจเป็น null ถ้าเป็นรายการ topup
}
export interface TransactionResponse {
  transactions: Transaction[];
  message?: string; // อาจมี message กรณีไม่พบข้อมูล
}
