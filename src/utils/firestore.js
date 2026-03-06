import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============ TRANSACTIONS ============

export async function getTransactions(userId) {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addTransaction(userId, transaction) {
  const transactionData = {
    ...transaction,
    userId,
    date: transaction.date instanceof Date ? Timestamp.fromDate(transaction.date) : Timestamp.now(),
    createdAt: Timestamp.now()
  };
  return await addDoc(collection(db, 'transactions'), transactionData);
}

export async function updateTransaction(transactionId, updates) {
  const transactionRef = doc(db, 'transactions', transactionId);
  if (updates.date && updates.date instanceof Date) {
    updates.date = Timestamp.fromDate(updates.date);
  }
  return await updateDoc(transactionRef, updates);
}

export async function deleteTransaction(transactionId) {
  return await deleteDoc(doc(db, 'transactions', transactionId));
}

// ============ CATEGORIES ============

export async function getCategories(userId) {
  const q = query(
    collection(db, 'categories'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addCategory(userId, category) {
  const categoryData = {
    ...category,
    userId,
    createdAt: Timestamp.now()
  };
  return await addDoc(collection(db, 'categories'), categoryData);
}

export async function updateCategory(categoryId, updates) {
  const categoryRef = doc(db, 'categories', categoryId);
  return await updateDoc(categoryRef, updates);
}

export async function deleteCategory(categoryId) {
  return await deleteDoc(doc(db, 'categories', categoryId));
}

// ============ GOALS ============

export async function getGoals(userId) {
  const q = query(
    collection(db, 'goals'),
    where('userId', '==', userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addGoal(userId, goal) {
  const goalData = {
    ...goal,
    userId,
    currentAmount: 0,
    targetDate: goal.targetDate instanceof Date ? Timestamp.fromDate(goal.targetDate) : null,
    createdAt: Timestamp.now()
  };
  return await addDoc(collection(db, 'goals'), goalData);
}

export async function updateGoal(goalId, updates) {
  const goalRef = doc(db, 'goals', goalId);
  if (updates.targetDate && updates.targetDate instanceof Date) {
    updates.targetDate = Timestamp.fromDate(updates.targetDate);
  }
  return await updateDoc(goalRef, updates);
}

export async function deleteGoal(goalId) {
  return await deleteDoc(doc(db, 'goals', goalId));
}
