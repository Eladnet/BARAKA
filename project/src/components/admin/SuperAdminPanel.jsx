
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
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Users,
  UserPlus,
  UserX,
  Mail,
  Key,
  Settings,
  Crown,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Database,
  Activity,
  Lock,
  Unlock,
  Send,
  Loader2,
  Brain,
  Info
} from "lucide-react";
import { User } from "@/api/entities";
import { Lead } from "@/api/entities";
import { Campaign } from "@/api/entities";
import { AIPromoter } from "@/api/entities";
import { SendEmail } from "@/api/integrations";
import SystemErrorManager from './SystemErrorManager';
import MassCommunications from './MassCommunications';
import FinancialManager from './FinancialManager'; // New import for FinancialManager

export default function SuperAdminPanel() {
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newUserData, setNewUserData] = useState({
    full_name: '',
    email: '',
    role: 'user',
    password: ''
  });
  const [systemStats, setSystemStats] = useState({
    total_users: 0,
    total_leads: 0,
    total_campaigns: 0,
    total_promoters: 0
  });

  useEffect(() => {
    checkSuperAdminAccess();
    loadSystemData();
  }, []);

  const checkSuperAdminAccess = async () => {
    try {
      const user = await User.me();

      // בדיקה אם המשתמש הוא Super Admin
      const superAdminEmails = [
        'elad@bigcohen.com',
        'dor.azriel@gmail.com',
        'alihassanvirk.ahv@gmail.com'
      ];

      const isSuperAdmin = superAdminEmails.includes(user.email);
      const isRegularAdmin = user.role === 'admin';

      if (!isSuperAdmin && !isRegularAdmin) {
        throw new Error('Unauthorized access - Admin role required');
      }

      setCurrentUser({
        ...user,
        isSuperAdmin: isSuperAdmin,
        isRegularAdmin: isRegularAdmin,
        displayRole: isSuperAdmin ? 'Super Admin' : 'Admin'
      });

    } catch (error) {
      alert('⛔ גישה נדחתה - נדרשות הרשאות Admin');
      window.location.href = '/Dashboard';
    }
  };

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      const users = await User.list();
      setAllUsers(users);

      const [leads, campaigns, promoters] = await Promise.all([
        Lead.list(),
        Campaign.list(),
        AIPromoter.list()
      ]);

      setSystemStats({
        total_users: users.length,
        total_leads: leads.length,
        total_campaigns: campaigns.length,
        total_promoters: promoters.length
      });

    } catch (error) {
      console.error('Error loading system data:', error);
    }
    setIsLoading(false);
  };

  const getUserDisplayRole = (userEmail, userRole) => {
    if (userEmail === 'elad@bigcohen.com') {
      return { role: 'Super Admin - Creator', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    }
    if (userEmail === 'dor.azriel@gmail.com') {
      return { role: 'Super Admin - Co-Manager', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    }
    if (userEmail === 'alihassanvirk.ahv@gmail.com') {
      return { role: 'Super Admin - Technical Lead', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
    if (userRole === 'admin') {
      return { role: 'Admin', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    }
    return { role: 'User', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
  };

  const handleCreateUser = async () => {
    if (!currentUser.isSuperAdmin && !currentUser.isRegularAdmin) {
      alert('⛔ נדרשות הרשאות Admin ליצירת משתמשים');
      return;
    }

    if (!newUserData.full_name || !newUserData.email) {
      alert('נא למלא שם מלא ואימייל');
      return;
    }

    setIsLoading(true);
    try {
      // שימוש ב-invite endpoint במקום create
      const response = await fetch('/api/users/invite-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserData.email,
          full_name: newUserData.full_name,
          role: newUserData.role,
          created_by_admin: true,
          admin_created_date: new Date().toISOString(),
          status: 'active'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to invite user');
      }

      const invitedUser = await response.json();

      // שליחת מייל עם פרטי הגישה
      await SendEmail({
        to: newUserData.email,
        subject: 'ברוכים הבאים ל-NocturneAI - הזמנה למערכת',
        from_name: 'NocturneAI Support',
        body: `שלום ${newUserData.full_name},

הוזמנת להצטרף למערכת NocturneAI!

פרטי החשבון:
📧 אימייל: ${newUserData.email}
👤 תפקיד: ${newUserData.role === 'admin' ? 'מנהל מערכת' : newUserData.role === 'super_admin' ? 'Super Admin' : 'משתמש רגיל'}

🔗 קישור להתחברות: ${window.location.origin}

להתחברות למערכת:
1. לחץ על הקישור למעלה
2. השתמש באימייל שלך
3. לחץ על "התחבר עם Google"

אם זו הפעם הראשונה שלך במערכת, ייתכן שתצטרך ליצור חשבון Google חדש או להשתמש בחשבון הקיים שלך.

בברכה,
צוות NocturneAI`
      });

      alert(`✅ הזמנה נשלחה בהצלחה ל-${newUserData.full_name}!`);
      setShowCreateUser(false);
      setNewUserData({ full_name: '', email: '', role: 'user', password: '' });

      // רענון רשימת המשתמשים אחרי זמן קצר
      setTimeout(() => {
        loadSystemData();
      }, 1000);

    } catch (error) {
      console.error('Error inviting user:', error);
      alert(`❌ שגיאה בהזמנת משתמש: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleDeleteUser = async () => {
    if (!currentUser.isSuperAdmin) {
      alert('⛔ רק Super Admin יכול למחוק משתמשים - פעולה רגישה מדי');
      return;
    }

    if (!selectedUser) return;

    const superAdminEmails = ['elad@bigcohen.com', 'dor.azriel@gmail.com', 'alihassanvirk.ahv@gmail.com'];

    // מניעת מחיקת יוצר האפליקציה
    if (selectedUser.email === 'elad@bigcohen.com') {
      alert('⛔ לא ניתן למחוק את יוצר האפליקציה');
      return;
    }

    if (superAdminEmails.includes(selectedUser.email)) {
      alert('⛔ לא ניתן למחוק Super Admin');
      return;
    }

    setIsLoading(true);
    try {
      await User.delete(selectedUser.id);
      alert('✅ משתמש נמחק בהצלחה');
      setShowDeleteConfirm(false);
      setSelectedUser(null);
      loadSystemData();
    } catch (error) {
      console.error('Error deleting user:', error);

      if (error.message && error.message.includes('creator of the app')) {
        alert('⛔ לא ניתן למחוק את יוצר האפליקציה');
      } else {
        alert(`❌ שגיאה במחיקת משתמש: ${error.message}`);
      }
    }
    setIsLoading(false);
  };

  const handleToggleUserStatus = async (user) => {
    if (!currentUser.isSuperAdmin && !currentUser.isRegularAdmin) {
      alert('⛔ נדרשות הרשאות Admin להשעית משתמשים');
      return;
    }

    const superAdminEmails = ['elad@bigcohen.com', 'dor.azriel@gmail.com', 'alihassanvirk.ahv@gmail.com'];

    // מניעת השעיית יוצר האפליקציה
    if (user.email === 'elad@bigcohen.com') {
      alert('⛔ לא ניתן להשעות את יוצר האפליקציה');
      return;
    }

    if (superAdminEmails.includes(user.email)) {
      alert('⛔ לא ניתן להשעות Super Admin');
      return;
    }

    setIsLoading(true);
    try {
      const newStatus = user.status === 'active' ? 'suspended' : 'active';
      await User.update(user.id, {
        status: newStatus,
        last_status_change: new Date().toISOString(),
        status_changed_by: currentUser.email
      });

      alert(`✅ סטטוס משתמש עודכן ל-${newStatus === 'active' ? 'פעיל' : 'מושעה'}`);
      loadSystemData();
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(`❌ שגיאה בעדכון סטטוס: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (user) => {
    if (!currentUser.isSuperAdmin && !currentUser.isRegularAdmin) {
      alert('⛔ נדרשות הרשאות Admin לאיפוס סיסמאות');
      return;
    }

    const superAdminEmails = ['elad@bigcohen.com', 'dor.azriel@gmail.com', 'alihassanvirk.ahv@gmail.com'];

    // מניעת איפוס סיסמה של יוצר האפליקציה
    if (user.email === 'elad@bigcohen.com') {
      alert('⛔ לא ניתן לאפס סיסמה של יוצר האפליקציה');
      return;
    }

    if (superAdminEmails.includes(user.email)) {
      alert('⛔ לא ניתן לאפס סיסמה של Super Admin');
      return;
    }

    setIsLoading(true);
    try {
      // במקום איפוס סיסמה, נשלח הזמנה מחדש
      await SendEmail({
        to: user.email,
        subject: 'NocturneAI - הזמנה מחודשת למערכת',
        from_name: 'NocturneAI Support',
        body: `שלום ${user.full_name},

קיבלת הזמנה מחודשת למערכת NocturneAI.

🔗 קישור להתחברות: ${window.location.origin}

להתחברות:
1. לחץ על הקישור למעלה
2. השתמש באימייל: ${user.email}
3. התחבר עם Google

אם אתה נתקל בבעיות, פנה לתמיכה טכנית.

בברכה,
צוות NocturneAI`
      });

      alert(`✅ הזמנה מחודשת נשלחה ל-${user.full_name}!`);
    } catch (error) {
      console.error('Error sending reset email:', error);
      alert(`❌ שגיאה בשליחת הזמנה מחודשת: ${error.message}`);
    }
    setIsLoading(false);
  };

  const handleUserRoleChange = async (user, newRole) => {
    if (!currentUser.isSuperAdmin) {
      alert('⛔ רק Super Admin יכול לשנות תפקידים');
      return;
    }

    const superAdminEmails = ['elad@bigcohen.com', 'dor.azriel@gmail.com', 'alihassanvirk.ahv@gmail.com'];

    // מניעת שינוי תפקיד של יוצר האפליקציה
    if (user.email === 'elad@bigcohen.com') {
      alert('⛔ לא ניתן לשנות את תפקיד יוצר האפליקציה');
      return;
    }

    // מניעת הורדת תפקיד של Super Admin אחר
    if (superAdminEmails.includes(user.email) && newRole !== 'super_admin') {
      alert('⛔ לא ניתן להוריד תפקיד של Super Admin');
      return;
    }

    // Super Admin לא יכול לשנות תפקיד של Super Admin אחר (למעט עצמו)
    if (superAdminEmails.includes(user.email) && superAdminEmails.includes(currentUser.email) && user.email !== currentUser.email) {
      alert('⛔ Super Admins cannot change the role of other Super Admins.');
      return;
    }

    setIsLoading(true);
    try {
      await User.update(user.id, {
        role: newRole,
        role_changed_date: new Date().toISOString(),
        role_changed_by: currentUser.email
      });

      const roleNames = {
        'user': 'משתמש רגיל',
        'admin': 'מנהל',
        'super_admin': 'Super Admin'
      };

      alert(`✅ תפקיד משתמש עודכן ל-${roleNames[newRole]}`);
      loadSystemData();
    } catch (error) {
      console.error('Error updating user role:', error);

      // טיפול בשגיאות ספציפיות
      if (error.message && error.message.includes('creator of the app')) {
        alert('⛔ לא ניתן לשנות את תפקיד יוצר האפליקציה');
      } else {
        alert(`❌ שגיאה בעדכון תפקיד: ${error.message}`);
      }
    }
    setIsLoading(false);
  };

  const handleSendCustomEmail = async (user) => {
    const message = prompt('הכנס הודעה לשליחה למשתמש:');
    if (!message) return;

    setIsLoading(true);
    try {
      await SendEmail({
        to: user.email,
        subject: 'הודעה מצוות NocturneAI',
        from_name: 'NocturneAI Management',
        body: `שלום ${user.full_name},

${message}

בברכה,
צוות NocturneAI`
      });

      alert('✅ מייל נשלח בהצלחה!');
    } catch (error) {
      alert(`❌ שגיאה בשליחת מייל: ${error.message}`);
    }
    setIsLoading(false);
  };

  if (!currentUser || (!currentUser.isSuperAdmin && !currentUser.isRegularAdmin)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 flex items-center justify-center">
        <Card className="bg-red-900/80 border-red-500/50 p-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">גישה מוגבלת</h2>
            <p className="text-red-300">נדרשות הרשאות Admin לגישה לפאנל זה</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Crown className="w-8 h-8 text-yellow-400" />
            {currentUser.isSuperAdmin ? 'Super Admin Panel' : 'Admin Panel'}
          </h1>
          <p className="text-purple-300 mt-2">
            {currentUser.isSuperAdmin ? 'שליטה מלאה במערכת NocturneAI' : 'ניהול מתקדם מערכת NocturneAI'}
          </p>
        </div>
        <Badge className={`px-4 py-2 ${
          currentUser.isSuperAdmin
            ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
        }`}>
          <Shield className="w-4 h-4 mr-2" />
          {currentUser.isSuperAdmin ? 'Super Admin' : 'Admin'}: {currentUser.full_name}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{systemStats.total_users}</p>
                <p className="text-slate-400 text-sm">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Database className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-white">{systemStats.total_leads}</p>
                <p className="text-slate-400 text-sm">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Activity className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-white">{systemStats.total_campaigns}</p>
                <p className="text-slate-400 text-sm">Total Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold text-white">{systemStats.total_promoters}</p>
                <p className="text-slate-400 text-sm">AI Promoters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="system">System Control</TabsTrigger>
          <TabsTrigger value="errors">🤖 Smart Error Fix</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                {(currentUser.isSuperAdmin || currentUser.isRegularAdmin) && (
                  <Button onClick={() => setShowCreateUser(true)} className="bg-green-600 hover:bg-green-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite New User
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.map(user => {
                  const displayRole = getUserDisplayRole(user.email, user.role);
                  const superAdminEmails = ['elad@bigcohen.com', 'dor.azriel@gmail.com', 'alihassanvirk.ahv@gmail.com'];

                  return (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          user.email === 'elad@bigcohen.com' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                          user.email === 'dor.azriel@gmail.com' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          user.email === 'alihassanvirk.ahv@gmail.com' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                          'bg-gradient-to-r from-purple-500 to-pink-500'
                        }`}>
                          <span className="text-white font-bold text-sm">
                            {user.full_name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-white flex items-center gap-2">
                            {user.full_name}
                            {user.email === 'elad@bigcohen.com' && (
                              <Crown className="w-4 h-4 text-yellow-400" title="System Creator" />
                            )}
                            {user.email === 'dor.azriel@gmail.com' && (
                              <Shield className="w-4 h-4 text-purple-400" title="Co-Manager" />
                            )}
                            {user.email === 'alihassanvirk.ahv@gmail.com' && (
                              <Brain className="w-4 h-4 text-emerald-400" title="Technical Lead" />
                            )}
                          </h3>
                          <p className="text-slate-400 text-sm">{user.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge className={displayRole.color}>
                              {displayRole.role}
                            </Badge>
                            <Badge className={user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                              {user.status || 'active'}
                            </Badge>
                            {user.created_by_admin && (
                              <Badge className="bg-orange-500/20 text-orange-300">
                                Admin Created
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* כל אדמין יכול לשלוח מייל */}
                        <Button variant="ghost" size="icon" onClick={() => handleSendCustomEmail(user)}>
                          <Mail className="w-4 h-4 text-blue-400" />
                        </Button>

                        {/* רק אדמינים יכולים לאפס סיסמאות (אך לא לSuper Admins כולל יוצר האפליקציה) */}
                        {(currentUser.isSuperAdmin || currentUser.isRegularAdmin) &&
                         (user.email !== 'elad@bigcohen.com' && !superAdminEmails.includes(user.email)) && (
                          <Button variant="ghost" size="icon" onClick={() => handleResetPassword(user)}>
                            <Key className="w-4 h-4 text-yellow-400" />
                          </Button>
                        )}

                        {/* רק אדמינים יכולים להשעות (אך לא Super Admins כולל יוצר האפליקציה) */}
                        {(currentUser.isSuperAdmin || currentUser.isRegularAdmin) &&
                         (user.email !== 'elad@bigcohen.com' && !superAdminEmails.includes(user.email)) && (
                          <Button variant="ghost" size="icon" onClick={() => handleToggleUserStatus(user)}>
                            {user.status === 'active' ? <Lock className="w-4 h-4 text-red-400" /> : <Unlock className="w-4 h-4 text-green-400" />}
                          </Button>
                        )}

                        {/* רק Super Admins יכולים לשנות תפקידים (אך לא של יוצר האפליקציה או Super Admins אחרים) */}
                        {currentUser.isSuperAdmin && user.email !== 'elad@bigcohen.com' && (!superAdminEmails.includes(user.email) || user.email === currentUser.email) ? (
                          <Select value={user.role || 'user'} onValueChange={(value) => handleUserRoleChange(user, value)}>
                            <SelectTrigger className="w-36 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className={`w-36 text-center ${displayRole.color}`}>
                            {displayRole.role}
                            {user.email === 'elad@bigcohen.com' && (
                              <span className="text-xs block">🔒 Creator</span>
                            )}
                          </Badge>
                        )}

                        {/* רק Super Admins יכולים למחוק (אך לא יוצר האפליקציה או Super Admins אחרים) */}
                        {currentUser.isSuperAdmin &&
                         user.email !== 'elad@bigcohen.com' &&
                         (!superAdminEmails.includes(user.email)) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">System Control Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-yellow-500/30 bg-yellow-500/10">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  פעולות מערכת רגישות - השתמש בזהירות
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={loadSystemData}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh System Data
                </Button>

                <Button
                  onClick={() => alert('System backup functionality available in Smart Error Management.')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Create System Backup
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* הוספת מערכת ניהול כספים */}
          <FinancialManager />
        </TabsContent>

        <TabsContent value="errors" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-400" />
                Smart Error Management System - AI Powered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SystemErrorManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          <MassCommunications />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Activity Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400">System activity logs and audit trail will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
        <DialogContent className="bg-slate-900 border-purple-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Invite New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-300">Full Name</Label>
              <Input
                value={newUserData.full_name}
                onChange={(e) => setNewUserData({...newUserData, full_name: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label className="text-slate-300">Email</Label>
              <Input
                type="email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                className="bg-slate-800 border-slate-700 text-white"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <Label className="text-slate-300">Role</Label>
              <Select value={newUserData.role} onValueChange={(value) => setNewUserData({...newUserData, role: value})}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="user">Regular User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  {currentUser.isSuperAdmin && <SelectItem value="super_admin">Super Admin</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateUser(false)}>Cancel</Button>
            <Button onClick={handleCreateUser} disabled={isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-slate-900 border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Confirm User Deletion
            </DialogTitle>
          </DialogHeader>
          <p className="text-slate-300">
            האם אתה בטוח שברצונך למחוק את המשתמש <strong>{selectedUser?.full_name}</strong>?
            פעולה זו לא ניתנת לביטול.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button onClick={handleDeleteUser} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
