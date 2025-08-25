import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Crown,
  AlertTriangle,
  CheckCircle,
  Plus,
  Minus,
  Eye,
  History,
  Download,
  RefreshCw,
  Wallet,
  Target,
  PiggyBank
} from "lucide-react";
import { User } from "@/api/entities";
import { UsageTracking } from "@/api/entities";

export default function FinancialManager() {
  const [users, setUsers] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddBalanceDialog, setShowAddBalanceDialog] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceReason, setBalanceReason] = useState('');
  const [transactions, setTransactions] = useState([]);

  const [financialStats, setFinancialStats] = useState({
    totalSystemBalance: 0,
    totalRevenue: 0,
    totalSpent: 0,
    activePayingUsers: 0,
    monthlyRevenue: 0,
    averageUserBalance: 0
  });

  useEffect(() => {
    loadFinancialData();
  }, []);

  const loadFinancialData = async () => {
    setIsLoading(true);
    try {
      const [allUsers, usage] = await Promise.all([
        User.list('-created_date', 1000),
        UsageTracking.list('-date', 100)
      ]);

      setUsers(allUsers);
      setUsageData(usage);

      // חישוב סטטיסטיקות כספיות
      const totalSystemBalance = allUsers.reduce((sum, user) => sum + (user.account_balance || 0), 0);
      const totalSpent = allUsers.reduce((sum, user) => sum + (user.total_spent || 0), 0);
      const activePayingUsers = allUsers.filter(user => (user.account_balance || 0) > 0).length;
      const totalRevenue = usage.reduce((sum, u) => sum + (u.total_cost || 0), 0);
      
      // חישוב הכנסות החודש הנוכחי
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = usage
        .filter(u => {
          const date = new Date(u.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        })
        .reduce((sum, u) => sum + (u.total_cost || 0), 0);

      const averageUserBalance = allUsers.length > 0 ? totalSystemBalance / allUsers.length : 0;

      setFinancialStats({
        totalSystemBalance,
        totalRevenue,
        totalSpent,
        activePayingUsers,
        monthlyRevenue,
        averageUserBalance
      });

    } catch (error) {
      console.error('Error loading financial data:', error);
    }
    setIsLoading(false);
  };

  const addBalanceToUser = async () => {
    if (!selectedUser || !balanceAmount) {
      alert('אנא בחר משתמש והכנס סכום');
      return;
    }

    const amount = parseFloat(balanceAmount);
    if (isNaN(amount)) {
      alert('אנא הכנס סכום תקין');
      return;
    }

    setIsLoading(true);
    try {
      const currentBalance = selectedUser.account_balance || 0;
      const newBalance = currentBalance + amount;
      
      await User.update(selectedUser.id, {
        account_balance: newBalance,
        balance_updated_by: 'super_admin',
        balance_updated_at: new Date().toISOString(),
        last_balance_update_reason: balanceReason || 'Admin adjustment'
      });

      // יצירת רישום עסקה
      const transaction = {
        id: Date.now().toString(),
        user_id: selectedUser.id,
        user_name: selectedUser.full_name,
        user_email: selectedUser.email,
        amount: amount,
        previous_balance: currentBalance,
        new_balance: newBalance,
        type: amount > 0 ? 'credit' : 'debit',
        reason: balanceReason || 'Admin adjustment',
        created_by: 'super_admin',
        created_at: new Date().toISOString()
      };

      setTransactions(prev => [transaction, ...prev]);

      alert(`✅ הוספת $${amount} לחשבון של ${selectedUser.full_name} בהצלחה!`);
      setShowAddBalanceDialog(false);
      setSelectedUser(null);
      setBalanceAmount('');
      setBalanceReason('');
      loadFinancialData();
    } catch (error) {
      console.error('Error updating balance:', error);
      alert(`❌ שגיאה בעדכון יתרה: ${error.message}`);
    }
    setIsLoading(false);
  };

  const bulkAddBalance = async (amount, userType = 'all') => {
    if (!confirm(`האם אתה בטוח שברצונך להוסיף $${amount} לכל ${userType === 'admins' ? 'המנהלים' : 'המשתמשים'}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      let targetUsers = users;
      
      if (userType === 'admins') {
        targetUsers = users.filter(user => 
          user.role === 'admin' || 
          user.role === 'super_admin' ||
          ['elad@bigcohen.com', 'dor.azriel@gmail.com', 'alihassanvirk.ahv@gmail.com'].includes(user.email)
        );
      }

      let updatedCount = 0;
      for (const user of targetUsers) {
        try {
          const currentBalance = user.account_balance || 0;
          const newBalance = currentBalance + amount;
          
          await User.update(user.id, {
            account_balance: newBalance,
            balance_updated_by: 'super_admin_bulk',
            balance_updated_at: new Date().toISOString(),
            last_balance_update_reason: `Bulk ${userType} credit`
          });
          
          updatedCount++;
        } catch (error) {
          console.error(`Failed to update balance for user ${user.email}:`, error);
        }
      }
      
      alert(`✅ הוספת $${amount} ל-${updatedCount} משתמשים בהצלחה!`);
      loadFinancialData();
      
    } catch (error) {
      console.error('Error in bulk balance update:', error);
      alert(`❌ שגיאה בעדכון יתרות: ${error.message}`);
    }
    setIsLoading(false);
  };

  const exportFinancialReport = () => {
    const reportData = users.map(user => ({
      'Full Name': user.full_name,
      'Email': user.email,
      'Role': user.role,
      'Account Balance': user.account_balance || 0,
      'Total Spent': user.total_spent || 0,
      'Created Date': new Date(user.created_date).toLocaleDateString('he-IL'),
      'Last Login': user.last_login ? new Date(user.last_login).toLocaleDateString('he-IL') : 'Never'
    }));

    // Convert to CSV
    const headers = Object.keys(reportData[0]);
    const csvContent = [
      headers.join(','),
      ...reportData.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* סטטיסטיקות כספיות */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              יתרה כוללת במערכת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              ${financialStats.totalSystemBalance.toLocaleString()}
            </div>
            <p className="text-emerald-300 text-sm">
              ממוצע ${financialStats.averageUserBalance.toFixed(2)} למשתמש
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              הכנסות החודש
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              ${financialStats.monthlyRevenue.toLocaleString()}
            </div>
            <p className="text-blue-300 text-sm">
              סה"כ הכנסות: ${financialStats.totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              משתמשים פעילים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {financialStats.activePayingUsers}
            </div>
            <p className="text-purple-300 text-sm">
              מתוך {users.length} משתמשים כולל
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="balance-management" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
          <TabsTrigger value="balance-management">ניהול יתרות</TabsTrigger>
          <TabsTrigger value="user-overview">סקירת משתמשים</TabsTrigger>
          <TabsTrigger value="transactions">היסטוריית עסקות</TabsTrigger>
          <TabsTrigger value="reports">דוחות</TabsTrigger>
        </TabsList>

        <TabsContent value="balance-management" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-400" />
                פעולות יתרה מהירות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => bulkAddBalance(1000, 'admins')}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  הוסף $1,000 לכל האדמינים
                </Button>

                <Button
                  onClick={() => bulkAddBalance(500, 'all')}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  הוסף $500 לכל המשתמשים
                </Button>

                <Button
                  onClick={() => setShowAddBalanceDialog(true)}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  הוסף יתרה למשתמש ספציפי
                </Button>

                <Button
                  onClick={loadFinancialData}
                  disabled={isLoading}
                  variant="outline"
                  className="border-slate-600 text-slate-300"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  רענן נתונים
                </Button>
              </div>

              <Alert className="border-yellow-500/30 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  ⚠️ פעולות יתרה הן בלתי הפיכות ומשפיעות על היתרה בפועל של המשתמשים
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-overview" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">סקירת יתרות משתמשים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users
                  .sort((a, b) => (b.account_balance || 0) - (a.account_balance || 0))
                  .slice(0, 20)
                  .map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.role === 'super_admin' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                        'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}>
                        <span className="text-white font-bold text-sm">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white flex items-center gap-2">
                          {user.full_name}
                          {user.role === 'super_admin' && <Crown className="w-4 h-4 text-yellow-400" />}
                        </h3>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-emerald-400">
                        ${(user.account_balance || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-400">
                        נוצל: ${(user.total_spent || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                היסטוריית עסקות
              </CardTitle>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 10).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'
                        }`}>
                          {transaction.type === 'credit' ? 
                            <Plus className="w-4 h-4 text-green-400" /> : 
                            <Minus className="w-4 h-4 text-red-400" />
                          }
                        </div>
                        <div>
                          <p className="text-white font-medium">{transaction.user_name}</p>
                          <p className="text-slate-400 text-sm">{transaction.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount)}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {new Date(transaction.created_at).toLocaleString('he-IL')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-400">אין עסקות להצגה</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-purple-400" />
                דוחות כספיים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={exportFinancialReport}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                ייצא דוח כספי מלא (CSV)
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">סיכום כספי</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">יתרה כוללת:</span>
                      <span className="text-emerald-400">${financialStats.totalSystemBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">הוצאות כוללות:</span>
                      <span className="text-red-400">${financialStats.totalSpent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-700 pt-2">
                      <span className="text-white font-medium">נטו:</span>
                      <span className="text-blue-400 font-bold">
                        ${(financialStats.totalSystemBalance - financialStats.totalSpent).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">נתוני משתמשים</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">משתמשים פעילים:</span>
                      <span className="text-blue-400">{financialStats.activePayingUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">משתמשים כולל:</span>
                      <span className="text-purple-400">{users.length}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-700 pt-2">
                      <span className="text-white font-medium">אחוז פעילות:</span>
                      <span className="text-emerald-400 font-bold">
                        {users.length > 0 ? ((financialStats.activePayingUsers / users.length) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog להוספת יתרה */}
      <Dialog open={showAddBalanceDialog} onOpenChange={setShowAddBalanceDialog}>
        <DialogContent className="bg-slate-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">הוסף יתרה למשתמש</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">בחר משתמש</Label>
              <Select onValueChange={(value) => setSelectedUser(users.find(u => u.id === value))}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="בחר משתמש..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id} className="text-slate-300">
                      {user.full_name} ({user.email}) - ${(user.account_balance || 0).toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-slate-300">סכום (יכול להיות שלילי)</Label>
              <Input
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                placeholder="0.00"
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div>
              <Label className="text-slate-300">סיבה (אופציונלי)</Label>
              <Input
                value={balanceReason}
                onChange={(e) => setBalanceReason(e.target.value)}
                placeholder="מתנה, החזר, תיקון..."
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBalanceDialog(false)}>
              ביטול
            </Button>
            <Button onClick={addBalanceToUser} disabled={isLoading}>
              {isLoading ? 'מעדכן...' : 'הוסף יתרה'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}