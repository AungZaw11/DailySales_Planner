import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  Plus,
  Trash2,
  Moon,
  Sun,
  BrainCircuit,
  DollarSign,
} from "lucide-react";

const firebaseConfig = {
  apiKey: "AIzaSyBfZDqL3oynap-pKx-sicb_Fybhn-NIFlQ",
  authDomain: "dailyplanner-c0691.firebaseapp.com",
  projectId: "dailyplanner-c0691",
  storageBucket: "dailyplanner-c0691.firebasestorage.app",
  messagingSenderId: "942859622871",
  appId: "1:942859622871:web:276daf458d4ff7d0355392",
  measurementId: "G-2FSYFTJS7J",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DailySalesApp = () => {
  const [entries, setEntries] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [usdRate, setUsdRate] = useState(4500);
  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [expense, setExpense] = useState("");

  useEffect(() => {
    const q = query(collection(db, "sales"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  const totalSales = entries.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpenses = entries.reduce((sum, e) => sum + Number(e.expense), 0);
  const netProfit = totalSales - totalExpenses;
  const profitUSD = (netProfit / usdRate).toFixed(2);

  const addEntry = async () => {
    if (!itemName || (!amount && !expense)) return;
    await addDoc(collection(db, "sales"), {
      name: itemName,
      amount: Number(amount) || 0,
      expense: Number(expense) || 0,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    });
    setItemName("");
    setAmount("");
    setExpense("");
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 bg-gray-800 p-2 rounded border border-gray-700">
            <DollarSign size={18} className="text-green-400" />
            <input
              type="number"
              value={usdRate}
              onChange={(e) => setUsdRate(e.target.value)}
              className="w-20 bg-transparent outline-none text-white"
            />
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 bg-gray-700 rounded-full"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-white text-center">
          <div className="p-4 bg-blue-600 rounded-2xl">
            <p className="text-xs opacity-80 uppercase">ရောင်းရငွေ</p>
            <h2 className="text-2xl font-bold">
              {totalSales.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-red-500 rounded-2xl">
            <p className="text-xs opacity-80 uppercase">အသုံးစရိတ်</p>
            <h2 className="text-2xl font-bold">
              {totalExpenses.toLocaleString()}
            </h2>
          </div>
          <div className="p-4 bg-green-600 rounded-2xl">
            <p className="text-xs opacity-80 uppercase">
              အသားတင်အမြတ် (MMK / USD)
            </p>
            <h2 className="text-2xl font-bold">{netProfit.toLocaleString()}</h2>
            <p className="text-sm font-bold text-yellow-300 mt-1">
              ≈ ${profitUSD}
            </p>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mb-6 p-4 bg-indigo-900/40 border border-indigo-500 rounded-2xl flex gap-3 items-center">
          <BrainCircuit className="text-indigo-400" />
          <p className="text-sm">
            {entries.length > 0
              ? `ယနေ့ အမြတ်သည် ဒေါ်လာဈေး ${usdRate} နှင့်တွက်လျှင် $${profitUSD} ရှိပါသည်။`
              : "စာရင်းသွင်းရန် စောင့်ဆိုင်းနေပါသည်..."}
          </p>
        </div>

        {/* Input */}
        <div
          className={`p-4 rounded-2xl mb-6 shadow-lg ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              list="items"
              placeholder="ပစ္စည်းအမည်"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <datalist id="items">
              {[...new Set(entries.map((e) => e.name))].map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <input
              type="number"
              placeholder="အရောင်း"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none"
            />
            <input
              type="number"
              placeholder="အသုံးစရိတ်"
              value={expense}
              onChange={(e) => setExpense(e.target.value)}
              className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none"
            />
            <button
              onClick={addEntry}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 p-3 transition-all"
            >
              <Plus size={20} /> စာရင်းသွင်း
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">အကြောင်းအရာ</th>
                <th className="p-4 text-right">ရောင်းရငွေ</th>
                <th className="p-4 text-right">အသုံးစရိတ်</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-800/50 transition">
                  <td className="p-4 font-medium">
                    {e.name} <br />{" "}
                    <span className="text-[10px] opacity-40">{e.date}</span>
                  </td>
                  <td className="p-4 text-right text-blue-400 font-bold">
                    {e.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-red-400 font-bold">
                    {e.expense.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={async () =>
                        await deleteDoc(doc(db, "sales", e.id))
                      }
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailySalesApp;
