import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Building, DollarSign, ArrowRight, Shield, Check, AlertCircle, Eye, EyeOff, ArrowLeft, User, Bell, Settings, Search } from 'lucide-react';
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
    accountNumber: '23476385309',
    balance: 332430.65,
    accountType: 'Savings Account',
    transactions: [
      {
        id: '001',
        type: 'deposit',
        amount: 25000.00,
        description: 'UPI/CR/328091574847/PRAMIL',
        date: '2024-06-20',
        status: 'completed'
      },
      {
        id: '002',
        type: 'withdrawal',
        amount: -26770.00,
        description: 'UPI/DR/328240908978/Bruhat',
        date: '2024-06-19',
        status: 'completed'
      },
      {
        id: '003',
        type: 'transfer',
        amount: -5000.00,
        description: 'NEFT Transfer to Savings Account',
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
        description: "Welcome to SBI OnlineSBI",
      });
    } else {
      toast({
        title: "Invalid MPIN",
        description: "Please enter your 4-digit MPIN",
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
        title: "🎉 Winnings Credited!",
        description: `₹${pendingWinnings.toLocaleString()} has been credited to your account`,
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
        description: `UPI Transfer to ${transferTo}`,
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
        description: `₹${amount.toLocaleString()} transferred to ${transferTo}`,
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
        description: 'Cash Deposit - OnlineSBI',
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
        description: `₹${amount.toLocaleString()} deposited to your account`,
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
        description: 'ATM Withdrawal - OnlineSBI',
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
        description: `₹${amount.toLocaleString()} withdrawn from your account`,
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
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(Math.abs(amount));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardHeader className="text-center pb-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold text-xl">SBI</span>
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold">State Bank of India</h1>
                <p className="text-blue-100 text-sm">OnlineSBI</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Personal Banking Login</h2>
              <p className="text-sm text-gray-600">Secure • Trusted • Reliable</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter MPIN
                </label>
                <div className="relative">
                  <Input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.slice(0, 4))}
                    placeholder="Enter 4-digit MPIN"
                    className="pr-10 border-gray-300"
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
                className="w-full bg-blue-600 hover:bg-blue-700 h-12"
                disabled={pin.length !== 4}
              >
                <Shield className="w-4 h-4 mr-2" />
                LOGIN
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Demo MPIN: 1234 or 0000
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
                RBI Approved
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Back to Quiz Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SBI Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-blue-600 font-bold">SBI</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">State Bank of India</h1>
              <p className="text-blue-100 text-sm">OnlineSBI - Personal Banking</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span className="text-sm">Vishal G</span>
            </div>
            <Bell className="w-5 h-5 cursor-pointer" />
            <Settings className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-blue-800">Welcome back, Vishal!</h2>
                    <p className="text-blue-600 text-sm">Your financial journey matters to us!</p>
                  </div>
                  <div className="text-right text-sm text-blue-700">
                    <p>Last logged on: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">QUICK ACTIONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full justify-start h-10 bg-blue-600 hover:bg-blue-700" 
                    onClick={() => setCurrentView('transfer')}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Transfer Money
                  </Button>
                  <Button 
                    className="w-full justify-start h-10" 
                    variant="outline"
                    onClick={() => setCurrentView('deposit')}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Deposit Funds
                  </Button>
                  <Button 
                    className="w-full justify-start h-10" 
                    variant="outline"
                    onClick={() => setCurrentView('withdraw')}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Withdraw Cash
                  </Button>
                  <Separator className="my-3" />
                  <Button 
                    onClick={onClose}
                    className="w-full bg-orange-500 hover:bg-orange-600 h-10"
                  >
                    Back to Quiz Game
                  </Button>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                {/* Account Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      Account Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Account Number</span>
                            <span className="font-medium">{account.accountNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Account Type</span>
                            <span className="font-medium">{account.accountType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Branch</span>
                            <span className="font-medium">RPC Layout Bangalore</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Available Balance</p>
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(account.balance)}
                        </p>
                        <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
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
                          Will be automatically credited to your account
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {account.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
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
                              <p className="font-medium text-sm">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{transaction.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                            </p>
                            <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Money Form */}
        {currentView === 'transfer' && (
          <Card className="max-w-md mx-auto">
            <CardHeader className="bg-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Fund Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Beneficiary Account/UPI ID</label>
                <Input 
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="Enter account number or UPI ID"
                  className="border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                <Input 
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="border-gray-300"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleTransfer} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Transfer Now
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
            <CardHeader className="bg-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Deposit Funds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                <Input 
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="border-gray-300"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleDeposit} className="flex-1 bg-green-600 hover:bg-green-700">
                  Deposit Now
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
            <CardHeader className="bg-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <ArrowRight className="w-5 h-5 mr-2" />
                Withdraw Cash
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                <Input 
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  max={account.balance}
                  className="border-gray-300"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: {formatCurrency(account.balance)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleWithdraw} className="flex-1 bg-red-600 hover:bg-red-700">
                  Withdraw Now
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
