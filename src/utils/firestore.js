import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  deleteField,
  getDoc,
  setDoc,
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { encryptPayload, decryptPayload } from './crypto';

function normalizeDateValue(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function getTimestampForSort(value) {
  if (!value) return 0;
  if (value.toDate) return value.toDate().getTime();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

async function migrateLegacyTransaction(userId, transactionRef, current) {
  const payload = await encryptPayload(userId, {
    description: current.description || '',
    amount: Number(current.amount) || 0,
    type: current.type || 'expense',
    category: current.category || '',
    date: normalizeDateValue(current.date) || new Date().toISOString(),
    notes: current.notes || ''
  });

  await updateDoc(transactionRef, {
    payload,
    updatedAt: Timestamp.now(),
    description: deleteField(),
    amount: deleteField(),
    type: deleteField(),
    category: deleteField(),
    date: deleteField(),
    notes: deleteField()
  });
}

async function migrateLegacyCategory(userId, categoryRef, current) {
  const payload = await encryptPayload(userId, {
    name: current.name || '',
    type: current.type || 'expense',
    color: current.color || '#64748b'
  });

  await updateDoc(categoryRef, {
    payload,
    updatedAt: Timestamp.now(),
    name: deleteField(),
    type: deleteField(),
    color: deleteField()
  });
}

async function migrateLegacyGoal(userId, goalRef, current) {
  const payload = await encryptPayload(userId, {
    name: current.name || '',
    targetAmount: Number(current.targetAmount) || 0,
    currentAmount: Number(current.currentAmount) || 0,
    targetDate: normalizeDateValue(current.targetDate),
    description: current.description || ''
  });

  await updateDoc(goalRef, {
    payload,
    updatedAt: Timestamp.now(),
    name: deleteField(),
    targetAmount: deleteField(),
    currentAmount: deleteField(),
    targetDate: deleteField(),
    description: deleteField()
  });
}

// ============ USERS ============

export async function saveUserRecord(uid, email, provider) {
  return setDoc(doc(db, 'users', uid), {
    email: email.toLowerCase(),
    provider,
    updatedAt: Timestamp.now()
  }, { merge: true });
}

export async function getUserByEmail(email) {
  const q = query(
    collection(db, 'users'),
    where('email', '==', email.toLowerCase())
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

// ============ TRANSACTIONS ============

export async function getTransactions(userId) {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  const rows = await Promise.all(snapshot.docs.map(async (snapshotDoc) => {
    const data = snapshotDoc.data();

    if (data.payload) {
      try {
        const decrypted = await decryptPayload(userId, data.payload);
        if (!decrypted) return null;

        return {
          id: snapshotDoc.id,
          ...decrypted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      } catch (error) {
        console.error('Failed to decrypt transaction:', error);
        return null;
      }
    }

    try {
      await migrateLegacyTransaction(userId, doc(db, 'transactions', snapshotDoc.id), data);
    } catch (error) {
      console.error('Failed to migrate legacy transaction:', error);
    }

    return { id: snapshotDoc.id, ...data };
  }));

  return rows
    .filter(Boolean)
    .sort((a, b) => getTimestampForSort(b.date) - getTimestampForSort(a.date));
}

export async function addTransaction(userId, transaction) {
  try {
    const payload = await encryptPayload(userId, {
      description: transaction.description || '',
      amount: Number(transaction.amount) || 0,
      type: transaction.type || 'expense',
      category: transaction.category || '',
      date: normalizeDateValue(transaction.date) || new Date().toISOString(),
      notes: transaction.notes || ''
    });

    const transactionData = {
      userId,
      payload,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return await addDoc(collection(db, 'transactions'), transactionData);
  } catch (error) {
    console.error('Error in addTransaction:', error);
    throw error;
  }
}

export async function updateTransaction(transactionId, updates) {
  const transactionRef = doc(db, 'transactions', transactionId);
  const transactionSnap = await getDoc(transactionRef);

  if (!transactionSnap.exists()) {
    throw new Error('Transaction not found');
  }

  const current = transactionSnap.data();
  const userId = current.userId;

  let baseData;
  if (current.payload) {
    baseData = await decryptPayload(userId, current.payload);
  } else {
    baseData = {
      description: current.description || '',
      amount: Number(current.amount) || 0,
      type: current.type || 'expense',
      category: current.category || '',
      date: normalizeDateValue(current.date) || new Date().toISOString(),
      notes: current.notes || ''
    };
  }

  const merged = {
    ...baseData,
    ...updates,
    amount: updates.amount !== undefined ? Number(updates.amount) : Number(baseData.amount) || 0,
    date: updates.date !== undefined
      ? (normalizeDateValue(updates.date) || baseData.date || new Date().toISOString())
      : baseData.date
  };

  const payload = await encryptPayload(userId, merged);
  return await updateDoc(transactionRef, { payload, updatedAt: Timestamp.now() });
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
  const rows = await Promise.all(snapshot.docs.map(async (snapshotDoc) => {
    const data = snapshotDoc.data();

    if (data.payload) {
      try {
        const decrypted = await decryptPayload(userId, data.payload);
        if (!decrypted) return null;

        return {
          id: snapshotDoc.id,
          ...decrypted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      } catch (error) {
        console.error('Failed to decrypt category:', error);
        return null;
      }
    }

    try {
      await migrateLegacyCategory(userId, doc(db, 'categories', snapshotDoc.id), data);
    } catch (error) {
      console.error('Failed to migrate legacy category:', error);
    }

    return { id: snapshotDoc.id, ...data };
  }));

  return rows.filter(Boolean);
}

export async function addCategory(userId, category) {
  try {
    const payload = await encryptPayload(userId, {
      name: category.name || '',
      type: category.type || 'expense',
      color: category.color || '#64748b'
    });

    const categoryData = {
      userId,
      payload,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return await addDoc(collection(db, 'categories'), categoryData);
  } catch (error) {
    console.error('Error in addCategory:', error);
    throw error;
  }
}

export async function updateCategory(categoryId, updates) {
  const categoryRef = doc(db, 'categories', categoryId);
  const categorySnap = await getDoc(categoryRef);

  if (!categorySnap.exists()) {
    throw new Error('Category not found');
  }

  const current = categorySnap.data();
  const userId = current.userId;

  let baseData;
  if (current.payload) {
    baseData = await decryptPayload(userId, current.payload);
  } else {
    baseData = {
      name: current.name || '',
      type: current.type || 'expense',
      color: current.color || '#64748b'
    };
  }

  const payload = await encryptPayload(userId, { ...baseData, ...updates });
  return await updateDoc(categoryRef, { payload, updatedAt: Timestamp.now() });
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
  const rows = await Promise.all(snapshot.docs.map(async (snapshotDoc) => {
    const data = snapshotDoc.data();

    if (data.payload) {
      try {
        const decrypted = await decryptPayload(userId, data.payload);
        if (!decrypted) return null;

        return {
          id: snapshotDoc.id,
          ...decrypted,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        };
      } catch (error) {
        console.error('Failed to decrypt goal:', error);
        return null;
      }
    }

    try {
      await migrateLegacyGoal(userId, doc(db, 'goals', snapshotDoc.id), data);
    } catch (error) {
      console.error('Failed to migrate legacy goal:', error);
    }

    return { id: snapshotDoc.id, ...data };
  }));

  return rows.filter(Boolean);
}

export async function addGoal(userId, goal) {
  try {
    const payload = await encryptPayload(userId, {
      name: goal.name || '',
      targetAmount: Number(goal.targetAmount) || 0,
      currentAmount: Number(goal.currentAmount) || 0,
      targetDate: normalizeDateValue(goal.targetDate),
      description: goal.description || ''
    });

    const goalData = {
      userId,
      payload,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return await addDoc(collection(db, 'goals'), goalData);
  } catch (error) {
    console.error('Error in addGoal:', error);
    throw error;
  }
}

export async function updateGoal(goalId, updates) {
  const goalRef = doc(db, 'goals', goalId);

  const goalSnap = await getDoc(goalRef);
  if (!goalSnap.exists()) {
    throw new Error('Goal not found');
  }

  const current = goalSnap.data();
  const userId = current.userId;

  let baseData;
  if (current.payload) {
    baseData = await decryptPayload(userId, current.payload);
  } else {
    baseData = {
      name: current.name || '',
      targetAmount: Number(current.targetAmount) || 0,
      currentAmount: Number(current.currentAmount) || 0,
      targetDate: normalizeDateValue(current.targetDate),
      description: current.description || ''
    };
  }

  const merged = {
    ...baseData,
    ...updates,
    targetAmount: updates.targetAmount !== undefined ? Number(updates.targetAmount) : Number(baseData.targetAmount) || 0,
    currentAmount: updates.currentAmount !== undefined ? Number(updates.currentAmount) : Number(baseData.currentAmount) || 0,
    targetDate: updates.targetDate !== undefined ? normalizeDateValue(updates.targetDate) : baseData.targetDate
  };

  const payload = await encryptPayload(userId, merged);
  return await updateDoc(goalRef, { payload, updatedAt: Timestamp.now() });
}

export async function deleteGoal(goalId) {
  return await deleteDoc(doc(db, 'goals', goalId));
}

// Delete all user data (for account deletion)
export async function deleteAllUserData(userId) {
  try {
    // Delete all transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', userId)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    const transactionDeletes = transactionsSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Delete all categories
    const categoriesQuery = query(
      collection(db, 'categories'),
      where('userId', '==', userId)
    );
    const categoriesSnapshot = await getDocs(categoriesQuery);
    const categoryDeletes = categoriesSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Delete all goals
    const goalsQuery = query(
      collection(db, 'goals'),
      where('userId', '==', userId)
    );
    const goalsSnapshot = await getDocs(goalsQuery);
    const goalDeletes = goalsSnapshot.docs.map(doc => deleteDoc(doc.ref));

    // Delete user record
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    const userDelete = userDocSnap.exists() ? [deleteDoc(userDocRef)] : [];

    // Execute all deletes in parallel
    await Promise.all([...transactionDeletes, ...categoryDeletes, ...goalDeletes, ...userDelete]);
  } catch (error) {
    console.error('Error deleting user data:', error);
    throw error;
  }
}
