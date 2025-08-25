import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { Lead } from "@/api/entities";

export default function ReassignDialog({ 
  open, 
  onOpenChange, 
  conversation, 
  promoters, 
  onSuccess 
}) {
  const [selectedPromoterId, setSelectedPromoterId] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);
  const [error, setError] = useState(null);

  const handleReassign = async () => {
    // בדיקת תקינות נתונים
    if (!selectedPromoterId) {
      setError('נא לבחור יחצן');
      return;
    }

    if (!conversation?.lead?.id) {
      setError('לא נמצא מידע על הליד');
      return;
    }

    setIsReassigning(true);
    setError(null);

    try {
      const leadId = conversation.lead.id;
      const selectedPromoter = promoters.find(p => p.id === selectedPromoterId);
      
      console.log('Reassigning lead:', { leadId, selectedPromoterId, selectedPromoter });

      // עדכון הליד עם היחצן החדש
      const updatedLead = await Lead.update(leadId, {
        assigned_promoter: selectedPromoterId,
        reassigned_at: new Date().toISOString(),
        reassigned_by: 'manual_admin',
        previous_promoter: conversation.lead.assigned_promoter
      });

      console.log('Lead updated successfully:', updatedLead);

      alert(`✅ הליד הועבר בהצלחה ליחצן: ${selectedPromoter?.name || 'לא ידוע'}`);
      
      // קריאה לפונקציית הצלחה
      if (onSuccess) {
        onSuccess();
      }
      
      // סגירת הדיאלוג
      onOpenChange(false);
      
    } catch (error) {
      console.error('Reassignment failed:', error);
      setError(`שגיאה בהעברה: ${error.message || 'שגיאה לא ידועה'}`);
    } finally {
      setIsReassigning(false);
    }
  };

  const resetDialog = () => {
    setSelectedPromoterId('');
    setError(null);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      resetDialog();
    }
    onOpenChange(isOpen);
  };

  if (!conversation?.lead) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-slate-900 border-red-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-red-400">שגיאה</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                לא נמצא מידע על השיחה או הליד. נסה לרענן את הדף.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end mt-4">
              <Button onClick={() => handleOpenChange(false)} variant="outline">
                סגור
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-purple-400" />
            העבר ליחצן אחר
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* פרטי הליד */}
          <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="font-medium text-white mb-2">פרטי הלקוח:</h4>
            <div className="text-sm text-slate-300">
              <div><strong>שם:</strong> {conversation.lead.first_name} {conversation.lead.last_name}</div>
              <div><strong>טלפון:</strong> {conversation.lead.phone_number}</div>
              <div><strong>סטטוס:</strong> 
                <Badge className="ml-2 bg-blue-500/20 text-blue-300">
                  {conversation.lead.status || 'לא ידוע'}
                </Badge>
              </div>
            </div>
          </div>

          {/* בחירת יחצן */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">
              בחר יחצן חדש:
            </label>
            <Select value={selectedPromoterId} onValueChange={setSelectedPromoterId}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="בחר יחצן..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {promoters.filter(p => p.is_active && p.id !== conversation.lead.assigned_promoter).map((promoter) => (
                  <SelectItem key={promoter.id} value={promoter.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={promoter.avatar_url} />
                        <AvatarFallback className="bg-purple-500 text-white text-xs">
                          {promoter.name?.charAt(0) || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{promoter.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {promoter.persona}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* הודעת שגיאה */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* כפתורים */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isReassigning}
              className="text-slate-300 border-slate-600"
            >
              ביטול
            </Button>
            <Button 
              onClick={handleReassign}
              disabled={isReassigning || !selectedPromoterId}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isReassigning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  מעביר...
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  בצע העברה
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}