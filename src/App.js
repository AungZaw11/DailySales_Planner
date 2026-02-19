import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Plus, Trash2, Moon, Sun, BrainCircuit, DollarSign, User, Key, Settings, Edit3, X } from 'lucide-react';

// Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "dailyplanner-c0691.firebaseapp.com",
  projectId: "dailyplanner-c0691",
  storageBucket: "dailyplanner-c0691.firebasestorage.app",
  messagingSenderId: "942859622871",
  appId: "1:942859622871:web:276daf458d4ff7d0355392"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const VPNTrackerApp = () => {
  const [entries, setEntries] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [usdRate, setUsdRate] = useState(4500);
  const [defaultCost, setDefaultCost] = useState(2000);

  // Input States
  const [customerName, setCustomerName] = useState("");
  const [vpnKey, setVpnKey] = useState("");
  const [amount, setAmount] = useState("");
  const [expense, setExpense] = useState(defaultCost);

  // Edit State
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "sales"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!editId) setExpense(defaultCost);
  }, [defaultCost, editId]);

  const totalSales = entries.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpenses = entries.reduce((sum, e) => sum + Number(e.expense), 0);
  const netProfit = totalSales - totalExpenses;

  // Edit စလုပ်သည့် Function
  const startEdit = (item) => {
    setEditId(item.id);
    setCustomerName(item.customer);
    setVpnKey(item.key);
    setAmount(item.amount);
    setExpense(item.expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit ကို ဖျက်သိမ်းသည့် Function
  const cancelEdit = () => {
    setEditId(null);
    setCustomerName(""); setVpnKey(""); setAmount(""); setExpense(defaultCost);
  };

  const handleSubmit = async () => {
    if (!customerName || !vpnKey || !amount) {
      alert("အချက်အလက် အပြည့်အစုံထည့်ပါ");
      return;
    }

    const data = {
      customer: customerName,
      key: vpnKey,
      amount: Number(amount) || 0,
      expense: Number(expense) || 0,
    };

    if (editId) {
      // Edit လုပ်ခြင်း (Update)
      await updateDoc(doc(db, "sales", editId), data);
      setEditId(null);
    } else {
      // အသစ်သွင်းခြင်း (Add)
      await addDoc(collection(db, "sales"), {
        ...data,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
      });
    }

    setCustomerName(""); setVpnKey(""); setAmount(""); setExpense(defaultCost);
  };

  return (
    <div className={`min-h-screen p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="max-w-5xl mx-auto">

        {/* Top Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded border border-gray-700">
              <DollarSign size={16} className="text-green-400" />
              <input type="number" value={usdRate} onChange={(e) => setUsdRate(e.target.value)} className="w-16 bg-transparent outline-none text-sm text-white" />
            </div>
            <div className="flex items-center gap-2 bg-gray-800 p-2 rounded border border-gray-700">
              <Settings size={16} className="text-blue-400" />
              <input type="number" value={defaultCost} onChange={(e) => setDefaultCost(e.target.value)} className="w-16 bg-transparent outline-none text-sm text-white font-bold" />
            </div>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-2 bg-gray-700 rounded-full">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard title="Total Sales" value={totalSales} color="blue" />
          <MetricCard title="Total Capital" value={totalExpenses} color="red" />
          <div className="p-5 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-lg">
            <p className="text-xs opacity-80 uppercase font-bold">Net Profit</p>
            <h2 className="text-3xl font-black">{netProfit.toLocaleString()} <span className="text-sm font-normal">Ks</span></h2>
          </div>
        </div>

        {/* Input Form Section */}
        <div className={`p-6 rounded-2xl mb-8 shadow-xl border-2 ${editId ? 'border-orange-500 bg-orange-500/5' : 'border-transparent ' + (isDark ? 'bg-gray-800' : 'bg-white')}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold opacity-70">
              {editId ? "⚠️ စာရင်းကို ပြန်ပြင်နေသည်" : "📝 စာရင်းအသစ်သွင်းရန်"}
            </h3>
            {editId && (
              <button onClick={cancelEdit} className="text-xs flex items-center gap-1 text-red-400 hover:underline">
                <X size={14} /> Cancel Edit
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none" placeholder="ဝယ်သူအမည်" />
            <input value={vpnKey} onChange={(e) => setVpnKey(e.target.value)} className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none" placeholder="VPN Key" />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none" placeholder="ရောင်းဈေး" />
            <input type="number" value={expense} onChange={(e) => setExpense(e.target.value)} className="p-3 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none" />
            <button onClick={handleSubmit} className={`w-full font-bold rounded-xl p-4 transition-all shadow-lg flex items-center justify-center gap-2 ${editId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
              {editId ? <Edit3 size={20} /> : <Plus size={20} />}
              {editId ? "Update ပြင်မည်" : "စာရင်းသွင်း"}
            </button>
          </div>
        </div>

        {/* Sales List Table */}
        <div className="rounded-2xl border border-gray-800 overflow-hidden shadow-2xl bg-gray-900/50">
          <table className="w-full text-left">
            <thead className="bg-gray-800/80 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="p-4">Customer Details</th>
                <th className="p-4 text-right">Price</th>
                <th className="p-4 text-right">Profit</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {entries.map((e) => (
                <tr key={e.id} className={`hover:bg-gray-800/30 transition group ${editId === e.id ? 'bg-orange-500/10' : ''}`}>
                  <td className="p-4">
                    <div className="font-bold text-blue-300">{e.customer}</div>
                    <code className="text-[10px] text-gray-500 bg-gray-800 px-1 rounded">{e.key}</code>
                    <div className="text-[9px] opacity-30 mt-1">{e.date}</div>
                  </td>
                  <td className="p-4 text-right font-mono text-gray-300">{e.amount.toLocaleString()}</td>
                  <td className="p-4 text-right font-mono text-green-400">{(e.amount - e.expense).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => startEdit(e)} className="text-gray-500 hover:text-orange-400 transition">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={async () => await deleteDoc(doc(db, "sales", e.id))} className="text-gray-500 hover:text-red-500 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
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

const MetricCard = ({ title, value, color }) => (
  <div className={`p-5 rounded-2xl shadow-lg border-l-4 border-${color}-500 bg-gray-800`}>
    <p className="text-xs text-gray-400 uppercase font-bold">{title}</p>
    <h2 className={`text-2xl font-bold text-${color}-400`}>{value.toLocaleString()} <span className="text-xs font-normal text-white">Ks</span></h2>
  </div>
);

export default VPNTrackerApp;