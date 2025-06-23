import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Building, DollarSign, ArrowRight, Shield, Check, AlertCircle, Eye, EyeOff, ArrowLeft, User, Bell, Settings, Search, Home, Wallet, TrendingUp, PiggyBank, FileText, HelpCircle, Globe, Menu, Download, Calendar, Plus, Minus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

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
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'transfer' | 'deposit' | 'withdraw' | 'accounts' | 'cards' | 'investments' | 'loans' | 'payments' | 'settings'>('login');
  
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

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount > 0) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: amount,
        description: 'Cash Deposit - OnlineSBI',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
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
      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
        <span className="text-white font-bold text-lg">🏦</span>
      </div>
      <div>
        <h1 className="text-xl font-bold text-blue-600">SBI</h1>
        <p className="text-blue-500 text-xs">State Bank of India</p>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl border-0">
          <CardHeader className="text-center pb-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <SBILogo />
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
    { icon: AlertCircle, label: 'Emergency', key: 'emergency' },
    { icon: HelpCircle, label: 'Help', key: 'help' },
    { icon: Globe, label: 'Languages', key: 'languages' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-4 border-b">
          <SBILogo />
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">PRODUCTS</h3>
          <div className="space-y-1">
            {sidebarItems.slice(0, 4).map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key as any)}
                className={`w-full flex items-center p-3 rounded-lg text-left hover:bg-blue-50 ${
                  currentView === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>

          <h3 className="text-sm font-semibold text-gray-500 mb-3 mt-6">SERVICES</h3>
          <div className="space-y-1">
            {sidebarItems.slice(4).map((item) => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key as any)}
                className={`w-full flex items-center p-3 rounded-lg text-left hover:bg-blue-50 ${
                  currentView === item.key ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>

          <Separator className="my-4" />
          <Button 
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Back to Quiz Game
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Search className="w-5 h-5 text-gray-400" />
            <Input placeholder="Search for Account statements" className="w-80" />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-blue-600">Quick Actions</span>
            </div>
            <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-600">Emergency</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Help</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Languages</span>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          {currentView === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Expenses */}
              <div className="space-y-6">
                {expenses.map((expense, index) => (
                  <Card key={expense.name} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{expense.icon}</span>
                        <span className="text-sm font-medium">{expense.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">₹ {expense.amount.toLocaleString()}</span>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateExpense(index, expense.amount - 1000)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateExpense(index, expense.amount + 1000)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Payment
                </Button>

                <Card className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">₹25,000</span>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">Pay</Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">₹16,000</span>
                    <Button size="sm" variant="outline">⋮</Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold">₹4,000</span>
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600">Pay</Button>
                  </div>
                </Card>
              </div>

              {/* Middle Column - Main Dashboard */}
              <div className="space-y-6">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-blue-800 mb-1">Welcome back, Vishal!</h2>
                        <p className="text-blue-600 text-sm mb-4">Your financial journey matters to us!</p>
                        <p className="text-blue-700 text-sm">Have a question? We're here to help!</p>
                      </div>
                      <div className="text-6xl">🎯</div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-lg font-semibold">Hello, Vishal</div>
                  <div className="text-sm text-gray-500">Last logged on 01 Sep 2023, 9:41 AM</div>
                </div>

                {/* Account Details */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-4">Savings Account</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Account:</span>
                            <span className="font-medium">{account.accountNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">VISHAL G</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Branch:</span>
                            <span className="font-medium">{account.branch}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">CIF No:</span>
                            <span className="font-medium">{account.cifNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">IFSC:</span>
                            <span className="font-medium">{account.ifscCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 text-right">
                      <div className="text-sm text-gray-600 mb-1">Check Balance</div>
                      <div className="text-2xl font-bold text-green-600 flex items-center justify-end">
                        {formatCurrency(account.balance)}
                        <Eye className="w-5 h-5 ml-2 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {account.transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-3 ${
                                  transaction.amount > 0 ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <div>
                                  <div className="font-medium text-sm">{transaction.description}</div>
                                  <div className="text-xs text-gray-500">{transaction.date}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className={`font-bold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-medium">
                              ₹{(account.balance + 
                                account.transactions.slice(account.transactions.indexOf(transaction) + 1)
                                  .reduce((sum, t) => sum - t.amount, 0)
                              ).toLocaleString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Profile & Notifications */}
              <div className="space-y-6">
                {/* Profile Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold">Vishal G</h3>
                        <button className="text-blue-500 text-sm">Change Password</button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Username</span>
                        <div className="font-medium">Gvishaluna1*</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Account type</span>
                        <div className="font-medium">Savings account <button className="text-blue-500 ml-2">Update</button></div>
                      </div>
                      <div>
                        <span className="text-gray-600">UPI ID</span>
                        <div className="font-medium">9558742587@sbi <button className="text-blue-500 ml-2">Modify</button></div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>64% Profile completed</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* SBI Card */}
                <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="text-lg font-bold">SBI</div>
                        <div className="text-sm opacity-90">STATE BANK</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">SBI</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-lg tracking-wider">5322 2596 2150 2658</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-75">07/29</div>
                          <div className="text-sm font-medium">VISHAL G</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs">RuPay</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Notifications
                      <Badge className="ml-2 bg-red-500">2</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">Your Account Statement for September 2023 is now available for download</p>
                      <button className="text-blue-500 text-sm mt-1">Download</button>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium">Your new Chequebook has been dispatched</p>
                      <p className="text-xs text-gray-500 mt-1">04 SEP 2023</p>
                      <button className="text-blue-500 text-sm">Track order</button>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center mb-2">
                        <span className="text-lg font-bold mr-2">SBI</span>
                        <div>
                          <p className="text-sm font-medium">Request calls SBI Representative</p>
                          <p className="text-xs text-gray-500">We're here to help!</p>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600">Build your career with SBI as a Data Analyst</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Other Views */}
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

          {/* Placeholder views for other sections */}
          {['accounts', 'cards', 'investments', 'loans', 'payments', 'settings'].includes(currentView) && (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="capitalize">{currentView}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-center text-gray-500">
                  {currentView.charAt(0).toUpperCase() + currentView.slice(1)} section coming soon...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankingSystem;
