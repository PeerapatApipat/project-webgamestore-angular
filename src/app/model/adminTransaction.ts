export interface TransactionUserModel {
  order_id: number;
  type: string; // "เติมเงิน" หรือ "ซื้อเกม"
  amount: number;
  date: string; // ISO string จาก MySQL เช่น "2025-10-11T14:20:00.000Z"
  status: string; // เช่น "สำเร็จ", "รอดำเนินการ"
  games: string; // เช่น "Valorant, Apex Legends" หรือ "Top-up"
}

export interface UserTransaction {
  user_id: string; // เพิ่มเข้ามาเพื่อให้ UI ทำงานได้ถูกต้อง
  username: string;
  created_at: string; // เพิ่มเข้ามาเพื่อให้ UI ทำงานได้ถูกต้อง
  transactions: TransactionUserModel[];
}

export interface AllUserTransactionsResponse {
  total_users: number;
  users: UserTransaction[];
}

export interface SingleUserTransactionResponse {
  username: string | null;
  transactions: TransactionUserModel[];
  message?: string;
}
