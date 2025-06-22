import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Building, DollarSign, ArrowRight, Shield, Check, AlertCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BankAccount {
  accountNumber: string;
  balance: number;
  accountType: string;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'quiz_winning';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface BankingSystemProps {
  onClose: () => void;
  pendingWinnings?: number;
}

const BankingSystem: React.FC<BankingSystemProps> = ({ onClose, pendingWinnings = 0 }) => {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'transfer' | 'deposit' | 'withdraw'>('login');
  
  // Form states
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  
  const [account, setAccount] = useState<BankAccount>({
    accountNumber: '****-****-****-4582',
    balance: 15420.50,
    accountType: 'Premium Checking',
    transactions: [
      {
        id: '001',
        type: 'deposit',
        amount: 2500.00,
        description: 'Salary Deposit - TechCorp Inc.',
        date: '2024-06-20',
        status: 'completed'
      },
      {
        id: '002',
        type: 'withdrawal',
        amount: -250.00,
        description: 'ATM Withdrawal - Downtown Branch',
        date: '2024-06-19',
        status: 'completed'
      },
      {
        id: '003',
        type: 'transfer',
        amount: -500.00,
        description: 'Transfer to Savings Account',
        date: '2024-06-18',
        status: 'completed'
      }
    ]
  });

  const handleLogin = () => {
    if (pin === '1234' || pin === '0000') {
      setIsLoggedIn(true);
      setCurrentView('dashboard');
      toast({
        title: "Login Successful",
        description: "Welcome to SecureBank Online Banking",
      });
    } else {
      toast({
        title: "Invalid PIN",
        description: "Please enter your 4-digit PIN",
        variant: "destructive"
      });
    }
  };

  const processQuizWinnings = () => {
    if (pendingWinnings > 0) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'quiz_winning',
        amount: pendingWinnings,
        description: `Quiz Game Winnings - Millionaire Challenge`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };

      setAccount(prev => ({
        ...prev,
        balance: prev.balance + pendingWinnings,
        transactions: [newTransaction, ...prev.transactions]
      }));

      toast({
        title: "🎉 Winnings Deposited!",
        description: `$${pendingWinnings.toLocaleString()} has been added to your account`,
      });
    }
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (amount > 0 && amount <= account.balance && transferTo.trim()) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'transfer',
        amount: -amount,
        description: `Transfer to ${transferTo}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };

      setAccount(prev => ({
        ...prev,
        balance: prev.balance - amount,
        transactions: [newTransaction, ...prev.transactions]
      }));

      toast({
        title: "Transfer Successful",
        description: `$${amount.toLocaleString()} transferred to ${transferTo}`,
      });

      setTransferAmount('');
      setTransferTo('');
      setCurrentView('dashboard');
    } else {
      toast({
        title: "Transfer Failed",
        description: "Please check the amount and recipient details",
        variant: "destructive"
      });
    }
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: amount,
        description: 'Cash Deposit - Online Banking',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };

      setAccount(prev => ({
        ...prev,
        balance: prev.balance + amount,
        transactions: [newTransaction, ...prev.transactions]
      }));

      toast({
        title: "Deposit Successful",
        description: `$${amount.toLocaleString()} deposited to your account`,
      });

      setDepositAmount('');
      setCurrentView('dashboard');
    } else {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive"
      });
    }
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= account.balance) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: -amount,
        description: 'Cash Withdrawal - Online Banking',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };

      setAccount(prev => ({
        ...prev,
        balance: prev.balance - amount,
        transactions: [newTransaction, ...prev.transactions]
      }));

      toast({
        title: "Withdrawal Successful",
        description: `$${amount.toLocaleString()} withdrawn from your account`,
      });

      setWithdrawAmount('');
      setCurrentView('dashboard');
    } else {
      toast({
        title: "Withdrawal Failed",
        description: "Insufficient funds or invalid amount",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn && pendingWinnings > 0) {
      setTimeout(processQuizWinnings, 1000);
    }
  }, [isLoggedIn, pendingWinnings]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-blue-900">SecureBank</h1>
            </div>
            <CardTitle className="text-xl text-gray-700">Online Banking</CardTitle>
            <p className="text-sm text-gray-500">Secure • Trusted • Reliable</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  4-Digit PIN
                </label>
                <div className="relative">
                  <Input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.slice(0, 4))}
                    placeholder="Enter your PIN"
                    className="pr-10"
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                onClick={handleLogin} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={pin.length !== 4}
              >
                <Shield className="w-4 h-4 mr-2" />
                Secure Login
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Demo PIN: 1234 or 0000
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center">
                <Shield className="w-3 h-3 mr-1" />
                256-bit SSL
              </div>
              <div className="flex items-center">
                <Check className="w-3 h-3 mr-1" />
                FDIC Insured
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Back to Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Building className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">SecureBank</h1>
                  <p className="text-blue-100">Online Banking Dashboard</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Account: {account.accountNumber}</p>
                <Badge className="bg-green-500 text-white mt-1">
                  {account.accountType}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Account Balance */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Account Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-4">
                  {formatCurrency(account.balance)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <p className="text-xl font-semibold text-green-700">
                      {formatCurrency(account.balance)}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="text-xl font-semibold text-blue-700">
                      {account.accountType}
                    </p>
                  </div>
                </div>
                {pendingWinnings > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="font-medium text-yellow-800">
                        Pending Quiz Winnings: {formatCurrency(pendingWinnings)}
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Will be automatically deposited to your account
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setCurrentView('transfer')}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Transfer Money
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setCurrentView('deposit')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Deposit Funds
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => setCurrentView('withdraw')}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Withdraw Cash
                </Button>
                <Separator />
                <Button 
                  onClick={onClose}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Back to Quiz Game
                </Button>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {account.transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'deposit' || transaction.type === 'quiz_winning' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'deposit' || transaction.type === 'quiz_winning' ? (
                            <ArrowRight className="w-5 h-5 rotate-180" />
                          ) : (
                            <ArrowRight className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transfer Money Form */}
        {currentView === 'transfer' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Transfer Money
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Transfer To</label>
                <Input 
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="Account Number or Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input 
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleTransfer} className="flex-1">
                  Transfer
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('dashboard')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deposit Form */}
        {currentView === 'deposit' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Deposit Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input 
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleDeposit} className="flex-1">
                  Deposit
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('dashboard')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Form */}
        {currentView === 'withdraw' && (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ArrowRight className="w-5 h-5 mr-2" />
                Withdraw Cash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input 
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  max={account.balance}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: {formatCurrency(account.balance)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleWithdraw} className="flex-1">
                  Withdraw
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('dashboard')}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BankingSystem;
