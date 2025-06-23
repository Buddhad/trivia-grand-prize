import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Building, DollarSign, ArrowRight, Shield, Check, AlertCircle, Eye, EyeOff, ArrowLeft, User, Bell, Settings, Search, Home, Wallet, TrendingUp, PiggyBank, FileText, HelpCircle, Globe, Menu, Download, Calendar, Plus, Minus, LogOut, Banknote, AreaChart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DepositDataForm from './DepositDataForm';
import { generateDepositFile } from '../utils/depositFileGenerator';

interface BankAccount {
  accountNumber: string;
  balance: number;
  accountType: string;
  transactions: Transaction[];
  cifNumber: string;
  ifscCode: string;
  branch: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'quiz_winning';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface ExpenseCategory {
  name: string;
  amount: number;
  icon: string;
}

interface BankingSystemProps {
  onClose: () => void;
  pendingWinnings?: number;
}

const BankingSystem: React.FC<BankingSystemProps> = ({ onClose, pendingWinnings = 0 }) => {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'transfer' | 'deposit' | 'deposit-form' | 'withdraw' | 'accounts' | 'cards' | 'investments' | 'loans' | 'payments' | 'settings' | 'support' | 'statements'>('login');
  
  // Form states
  const [transferAmount, setTransferAmount] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Expense tracking
  const [expenses, setExpenses] = useState<ExpenseCategory[]>([
    { name: 'Personal Expenses', amount: 14000, icon: '🛍️' },
    { name: 'Transportation', amount: 5000, icon: '🚗' },
    { name: 'Entertainment', amount: 5000, icon: '🎬' },
    { name: 'Family and Education', amount: 12000, icon: '👨‍👩‍👧‍👦' }
  ]);
  
  const [account, setAccount] = useState<BankAccount>({
    accountNumber: '23476385309',
    balance: 332430.65,
    accountType: 'Savings Account',
    cifNumber: '98443385679',
    ifscCode: 'SBIN0075319',
    branch: 'RPC Layout Bangalore',
    transactions: [
      {
        id: '001',
        type: 'withdrawal',
        amount: -26770.00,
        description: 'UPI/DR/328240908978/Bruhat...',
        date: '12 September 2023',
        status: 'completed'
      },
      {
        id: '002',
        type: 'deposit',
        amount: 4200.00,
        description: 'UPI/CR/328091574847/PRAMIL...',
        date: '11 September 2023',
        status: 'completed'
      }
    ]
  });

  // Function to save deposit data to txt file
  const saveDepositToFile = (transaction: Transaction) => {
    const depositData = `
=== SBI Bank Deposit Transaction Record ===
Transaction ID: ${transaction.id}
Date: ${transaction.date}
Amount: ₹${transaction.amount.toLocaleString()}
Description: ${transaction.description}
Status: ${transaction.status}

=== Steps to Fill SBI Bank Details for Online Payment (e.g., UPI, NEFT, IMPS, Merchant Payment) ===

1. Log in to SBI NetBanking
   - Go to https://www.onlinesbi.sbi
   - Click "Personal Banking" > Log in with username/password.

2. Navigate to Payments/Transfers
   - Select "Payments/Transfers" > Choose payment type (e.g., NEFT, IMPS, UPI).

3. Enter Recipient Details
   - Beneficiary Name: Enter the payee's name.
   - Account Number: Input the recipient's account number.
   - Confirm Account Number: Re-enter to avoid errors.
   - IFSC Code: Enter the recipient's bank IFSC (e.g., SBIN0001234).

4. Enter Payment Amount
   - Fill in the amount and add a remark (optional).

5. Authenticate Transaction
   - Verify details > Enter OTP (sent to your registered mobile).
   - Click "Submit" to complete the payment.

=== Account Details ===
Account Number: ${account.accountNumber}
Account Type: ${account.accountType}
CIF Number: ${account.cifNumber}
IFSC Code: ${account.ifscCode}
Branch: ${account.branch}
Current Balance: ₹${account.balance.toLocaleString()}

Generated on: ${new Date().toLocaleString()}
`;

    // Create and download the file
    const blob = new Blob([depositData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SBI_Deposit_${transaction.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
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
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
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

  const handleDepositWithData = (depositData: any) => {
    const amount = parseFloat(depositData.amount);
    if (amount > 0) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: amount,
        description: `${depositData.paymentType} Deposit to ${depositData.beneficiaryName}`,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        status: 'completed'
      };

      setAccount(prev => ({
        ...prev,
        balance: prev.balance + amount,
        transactions: [newTransaction, ...prev.transactions]
      }));

      // Generate and save deposit file with all collected data
      generateDepositFile({
        transaction: newTransaction,
        beneficiary: {
          name: depositData.beneficiaryName,
          account: depositData.beneficiaryAccount,
          ifsc: depositData.beneficiaryIFSC
        },
        payment: {
          type: depositData.paymentType,
          remark: depositData.remark
        },
        contact: {
          mobile: depositData.mobile,
          email: depositData.email
        },
        account: account
      });

      toast({
        title: "Deposit Successful",
        description: `₹${amount.toLocaleString()} deposited. Complete transaction details saved to file.`,
      });

      setCurrentView('dashboard');
    }
  };

  const handleDeposit = () => {
    setCurrentView('deposit-form');
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount > 0 && amount <= account.balance) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: -amount,
        description: 'ATM Withdrawal - OnlineSBI',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
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
    }
  };

  const updateExpense = (index: number, newAmount: number) => {
    setExpenses(prev => prev.map((expense, i) => 
      i === index ? { ...expense, amount: Math.max(0, newAmount) } : expense
    ));
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

  const SBILogo = () => (
    <div className="flex items-center">
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
        <span className="text-white font-bold text-sm">SBI</span>
      </div>
      <span className="text-blue-600 font-bold text-lg">SBI</span>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardHeader className="text-center pb-4">
            <SBILogo />
            <h2 className="text-xl font-semibold text-gray-800 mt-4">Personal Banking Login</h2>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
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
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
              disabled={pin.length !== 4}
            >
              <Shield className="w-4 h-4 mr-2" />
              LOGIN
            </Button>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">Demo MPIN: 1234 or 0000</p>
            </div>

            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full"
            >
              Back to Quiz Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sidebarItems = [
    { icon: Home, label: 'My Dashboard', key: 'dashboard' },
    { icon: Building, label: 'Accounts', key: 'accounts' },
    { icon: CreditCard, label: 'Cards', key: 'cards' },
    { icon: TrendingUp, label: 'Investments', key: 'investments' },
    { icon: PiggyBank, label: 'Loans', key: 'loans' },
    { icon: Wallet, label: 'Payments', key: 'payments' },
    { icon: ArrowRight, label: 'Transfer Money', key: 'transfer' },
    { icon: Settings, label: 'Settings', key: 'settings' },
    { icon: HelpCircle, label: 'Customer Support', key: 'support' },
    { icon: FileText, label: 'Account Statements', key: 'statements' },
    { icon: LogOut, label: 'Log out', key: 'logout' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-4 border-b">
          <SBILogo />
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center text-blue-600 mb-4">
              <Home className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">My Dashboard</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">PRODUCTS</h3>
            <div className="space-y-1">
              {sidebarItems.slice(1, 5).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key as any)}
                  className={`w-full flex items-center p-2 rounded text-left hover:bg-blue-50 text-sm ${
                    currentView === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">SERVICES</h3>
            <div className="space-y-1">
              {sidebarItems.slice(5, -1).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setCurrentView(item.key as any)}
                  className={`w-full flex items-center p-2 rounded text-left hover:bg-blue-50 text-sm ${
                    currentView === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={onClose}
              className="w-full flex items-center p-2 rounded text-left hover:bg-red-50 text-sm text-red-600"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Back to Quiz Game
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-400" />
            <Input placeholder="Search for Account statements" className="w-80 border-0 bg-gray-50" />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-gray-600">Quick Actions</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-gray-600">Emergency</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-gray-600">Help</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-gray-600">Languages</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* User Greeting */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Hello, Vishal</h1>
                  <p className="text-sm text-gray-500">Last logged on 01 Sep 2023, 9:41 AM</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Sort by</span>
                  <Button variant="outline" size="sm">
                    <Menu className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Column - Account Info */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Account Details */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-4 text-gray-800">Savings Account</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Account:</span>
                              <span className="font-medium">{account.accountNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Name:</span>
                              <span className="font-medium">VISHAL G</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">CIF No.</span>
                              <span className="font-medium">{account.cifNumber}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Branch</span>
                              <span className="font-medium">{account.branch}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">IFSC</span>
                              <span className="font-medium">{account.ifscCode}</span>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-right">
                            <div className="text-sm text-gray-600 mb-1">Check Balance</div>
                            <div className="text-xl font-bold text-gray-800 flex items-center justify-end">
                              ₹3,32,430.65
                              <Eye className="w-4 h-4 ml-2 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Transactions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {account.transactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between py-2">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                              }`}>
                                {transaction.amount > 0 ? 
                                  <ArrowRight className="w-4 h-4 text-green-600 rotate-180" /> : 
                                  <ArrowRight className="w-4 h-4 text-red-600" />
                                }
                              </div>
                              <div>
                                <div className="font-medium text-sm">{transaction.description}</div>
                                <div className="text-xs text-gray-500">{transaction.date}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold text-sm ${
                                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {transaction.amount > 0 ? '+' : '-'} ₹{Math.abs(transaction.amount).toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">₹{account.balance.toLocaleString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="link" className="w-full mt-4 text-blue-600">
                        + See more
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <button 
                          onClick={() => setCurrentView('transfer')}
                          className="flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200"
                        >
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                            <ArrowRight className="w-6 h-6 text-yellow-600" />
                          </div>
                          <span className="text-sm font-medium">One-Time Transfer</span>
                        </button>
                        <button 
                          onClick={() => setCurrentView('deposit')}
                          className="flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200"
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                            <Banknote className="w-6 h-6 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">Pay Bills & Recharge</span>
                        </button>
                        <button 
                          onClick={() => setCurrentView('transfer')}
                          className="flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 hover:border-blue-200"
                        >
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                            <User className="w-6 h-6 text-green-600" />
                          </div>
                          <span className="text-sm font-medium">Transfer to Beneficiary</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Profile & Card */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Welcome Card */}
                  <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-800 mb-1">Welcome back, Vishal! Your financial journey matters to us!</h2>
                          <p className="text-gray-600 text-sm">Have a question? We're here to help!</p>
                        </div>
                        <div className="text-4xl">🎯</div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SBI Card */}
                  <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="text-lg font-bold">SBI</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">07/29</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-lg tracking-wider">5322 2596 2150 2658</div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-sm font-medium">VISHAL G</div>
                          </div>
                          <Badge className="bg-green-500">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg font-medium">
                        Notifications
                        <Badge className="ml-2 bg-red-500 text-white">2</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium">Your Account Statement for September 2023 is now available for download</p>
                        <button className="text-blue-600 text-sm mt-1">Download</button>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium">Your new Chequebook has been dispatched</p>
                        <p className="text-xs text-gray-500 mt-1">04 SEP 2023</p>
                        <button className="text-blue-600 text-sm">Track order</button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Accounts View */}
          {currentView === 'accounts' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-800">My Accounts</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Savings Account</h3>
                        <p className="text-gray-600">{account.accountNumber}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-2xl font-bold text-gray-800 mb-2">₹3,32,430.65</div>
                    <p className="text-sm text-gray-600">Available Balance</p>
                    <Button className="w-full mt-4" onClick={() => setCurrentView('dashboard')}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border-dashed border-2">
                  <CardContent className="p-6 text-center">
                    <Plus className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-600 mb-2">Open New Account</h3>
                    <p className="text-sm text-gray-500">Apply for a new savings or current account</p>
                    <Button variant="outline" className="mt-4">Apply Now</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Cards View */}
          {currentView === 'cards' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-800">My Cards</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-lg font-bold">SBI Debit Card</div>
                        <div className="text-sm opacity-90">RuPay</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">07/29</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg tracking-wider">5322 2596 2150 2658</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-sm font-medium">VISHAL G</div>
                        </div>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-dashed border-2">
                  <CardContent className="p-6 text-center">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="font-medium text-gray-600 mb-2">Apply for Credit Card</h3>
                    <p className="text-sm text-gray-500">Get instant approval for SBI credit cards</p>
                    <Button variant="outline" className="mt-4">Apply Now</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Investments View */}
          {currentView === 'investments' && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-800">Investments</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-12 h-12 mx-auto text-green-600 mb-4" />
                    <h3 className="font-semibold mb-2">Mutual Funds</h3>
                    <p className="text-sm text-gray-600 mb-4">Start your investment journey with SIP</p>
                    <Button>Invest Now</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <PiggyBank className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Fixed Deposits</h3>
                    <p className="text-sm text-gray-600 mb-4">Secure returns with FD</p>
                    <Button>Open FD</Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <AreaChart className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                    <h3 className="font-semibold mb-2">Portfolio</h3>
                    <p className="text-sm text-gray-600 mb-4">Track your investments</p>
                    <Button variant="outline">View Portfolio</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other Views */}
          {['loans', 'payments', 'settings', 'support', 'statements'].includes(currentView) && (
            <div className="space-y-6">
              <h1 className="text-2xl font-semibold text-gray-800 capitalize">{currentView}</h1>
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {currentView.charAt(0).toUpperCase() + currentView.slice(1)} Section
                  </h3>
                  <p className="text-gray-600 mb-6">
                    This section is under development. All features will be available soon.
                  </p>
                  <Button onClick={() => setCurrentView('dashboard')}>
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transfer, Deposit, Withdraw views remain the same */}
          {currentView === 'transfer' && (
            <Card className="max-w-md mx-auto">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Transfer Money
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Beneficiary Account/UPI ID</label>
                  <Input 
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    placeholder="Enter account number or UPI ID"
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
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleDeposit} className="flex-1 bg-green-600 hover:bg-green-700">
                    Continue to Details
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

          {currentView === 'deposit-form' && (
            <DepositDataForm
              onSubmit={handleDepositWithData}
              onCancel={() => setCurrentView('dashboard')}
              initialAmount={depositAmount}
            />
          )}

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
    </div>
  );
};

export default BankingSystem;
