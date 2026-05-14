import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api';

const PaymentsPage = () => {
  const { USER_ID } = useApp();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [methods, setMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tab, setTab] = useState('wallet');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferDesc, setTransferDesc] = useState('');

  useEffect(() => {
    if (tab === 'wallet') loadWallet();
    else if (tab === 'transactions') loadTransactions();
    else if (tab === 'methods') loadMethods();
    else if (tab === 'invoices') loadInvoices();
  }, [tab]);

  const loadWallet = async () => {
    try { setWallet(await api(`/api/payments/wallet?user_id=${USER_ID}`)); }
    catch (e) { setWallet(null); }
  };

  const loadTransactions = async () => {
    try { setTransactions(await api(`/api/payments/wallet/transactions?user_id=${USER_ID}`)); }
    catch (e) { setTransactions([]); }
  };

  const loadMethods = async () => {
    try { setMethods(await api(`/api/payments/methods?user_id=${USER_ID}`)); }
    catch (e) { setMethods([]); }
  };

  const loadInvoices = async () => {
    try { setInvoices(await api(`/api/payments/invoices?user_id=${USER_ID}`)); }
    catch (e) { setInvoices([]); }
  };

  const handleTransfer = async () => {
    const amt = parseFloat(transferAmount);
    if (!amt || amt <= 0) return;
    try {
      await api('/api/payments/transfer', {
        method: 'POST',
        body: JSON.stringify({
          amount: amt,
          description: transferDesc || 'Transfer',
          to_user_id: transferTo ? parseInt(transferTo) : null,
        }),
      });
      setTransferAmount('');
      setTransferTo('');
      setTransferDesc('');
      loadWallet();
      loadTransactions();
    } catch (e) { alert('Transfer failed: ' + e.message); }
  };

  return (
    <div className="page page-3d">
      <div className="page-header">
        <h1 className="page-title text-3d-strong">Payments & <span>Wallet</span></h1>
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'wallet' ? 'active' : ''}`} onClick={() => setTab('wallet')}>💰 Wallet</button>
        <button className={`tab ${tab === 'transactions' ? 'active' : ''}`} onClick={() => setTab('transactions')}>📋 History</button>
        <button className={`tab ${tab === 'methods' ? 'active' : ''}`} onClick={() => setTab('methods')}>💳 Methods</button>
        <button className={`tab ${tab === 'invoices' ? 'active' : ''}`} onClick={() => setTab('invoices')}>🧾 Invoices</button>
      </div>

      {tab === 'wallet' && (
        <div>
          {wallet && (
            <div className="card card-3d" style={{ padding: '24px', textAlign: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '48px', fontWeight: '700' }}>${wallet.balance_usd?.toFixed(2)}</h2>
              <p>USD Balance</p>
            </div>
          )}
          <div className="card card-3d" style={{ padding: '16px' }}>
            <h3>Send Money</h3>
            <input className="input" type="number" placeholder="Amount (USD)" value={transferAmount}
              onChange={e => setTransferAmount(e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
            <input className="input" type="text" placeholder="Recipient User ID (optional)" value={transferTo}
              onChange={e => setTransferTo(e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
            <input className="input" type="text" placeholder="Description" value={transferDesc}
              onChange={e => setTransferDesc(e.target.value)} style={{ width: '100%', marginBottom: '8px' }} />
            <button className="btn btn-primary" onClick={handleTransfer}>Send</button>
          </div>
        </div>
      )}

      {tab === 'transactions' && (
        <div>
          {transactions.map(t => (
            <div key={t.id} className="card card-3d" style={{ padding: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{t.transaction_type}</strong>
                  <p style={{ fontSize: '12px' }}>{t.description || t.reference_id}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: t.transaction_type.includes('in') ? '#4caf50' : '#ff5252' }}>
                    {t.transaction_type.includes('in') ? '+' : '-'}${t.amount?.toFixed(2)}
                  </span>
                  <p style={{ fontSize: '11px' }}>{new Date(t.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
          {transactions.length === 0 && <p className="loading">No transactions</p>}
        </div>
      )}

      {tab === 'methods' && (
        <div className="grid-3">
          {methods.map(m => (
            <div key={m.id} className="card card-3d" style={{ padding: '16px' }}>
              <h3>{m.provider}</h3>
              <p>{m.method_type}</p>
              {m.is_default && <span className="badge">Default</span>}
            </div>
          ))}
          {methods.length === 0 && <p className="loading">No payment methods</p>}
        </div>
      )}

      {tab === 'invoices' && (
        <div>
          {invoices.map(inv => (
            <div key={inv.id} className="card card-3d" style={{ padding: '12px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>{inv.invoice_number}</strong>
                  <p style={{ fontSize: '12px' }}>Status: {inv.status}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span>${inv.amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
          {invoices.length === 0 && <p className="loading">No invoices</p>}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
