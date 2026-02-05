import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { creditsApi } from '../services/api/creditsApi';
import { formatCreditBalance } from '../utils/creditCalculator';
import { Coins, ArrowLeft } from 'lucide-react';

export function CreditsPage() {
  const { user, refreshCredits } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const b = await creditsApi.getBalance();
        setBalance(b);
        await refreshCredits();
      } catch {
        setBalance(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshCredits]);

  const displayBalance = balance !== null ? formatCreditBalance(balance) : formatCreditBalance(user?.credits);

  return (
    <div className="credits-page">
      <Link to="/app" className="back-link">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>
      <div className="credits-card glass-card">
        <div className="credits-header">
          <Coins size={40} className="credits-icon" />
          <h1>Credits & Store</h1>
          <p className="credits-subtitle">Manage your learning credits</p>
        </div>
        <div className="credits-balance-section">
          <span className="credits-balance-label">Current Balance</span>
          {loading ? (
            <div className="credits-loading" />
          ) : (
            <span className="credits-balance-value">{displayBalance} credits</span>
          )}
        </div>
        <p className="credits-info">
          Use the NerdX mobile app to purchase credit packages and access Ecocash or card payments.
        </p>
        <Link to="/app" className="gradient-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
