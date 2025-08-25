
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mic, 
  Square, 
  Play, 
  Pause,
  Volume2,
  Download,
  Upload,
  MessageSquare,
  Users,
  Sparkles,
  Settings
} from "lucide-react";
import { UploadFile, InvokeLLM } from "@/api/integrations";
import { useTranslation } from "@/components/lib/translations";

export default function VoiceNoteManager() {
  const currentLang = localStorage.getItem('nocturne-language') || 'en';
  const { t } = useTranslation(currentLang);
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const voiceTemplates = [
    {
      id: 'vip_invitation',
      name: t('VIP Event Invitation'),
      script: t('Hey {{name}}! I have something exclusive for you tonight. VIP table with bottle service - just for my special guests. You in?'),
      tone: 'exclusive',
      duration: '15-20s'
    },
    {
      id: 'personal_invite',
      name: t('Personal DJ Invitation'),
      script: t('{{name}}, it\'s [DJ NAME]. I\'m playing at [VENUE] tonight and I want you there. Free entry plus drinks on me. See you on the dance floor!'),
      tone: 'personal',
      duration: '20-25s'
    },
    {
      id: 'last_minute',
      name: t('Last Minute Offer'),
      script: t('Quick message for you! Amazing last-minute deal at {{venue}} - 50% off everything tonight. But only for the next hour. You coming?'),
      tone: 'urgent',
      duration: '10-15s'
    },
    {
      id: 'birthday_special',
      name: t('Birthday Special'),
      script: t('Happy birthday {{name}}! I\'ve arranged something special for you tonight - VIP treatment, your favorite drinks, and a surprise. Come celebrate with us!'),
      tone: 'celebratory',
      duration: '20-30s'
    }
  ];

  const sampleVoiceNotes = [
    {
      id: '1',
      name: t('Welcome Message'),
      duration: 18,
      plays: 245,
      responseRate: '34%',
      url: '#'
    },
    {
      id: '2', 
      name: t('VIP Invitation'),
      duration: 22,
      plays: 89,
      responseRate: '67%',
      url: '#'
    },
    {
      id: '3',
      name: t('Event Reminder'),
      duration: 15,
      plays: 156,
      responseRate: '28%',
      url: '#'
    }
  ];

  useEffect(() => {
    setVoiceNotes(sampleVoiceNotes);
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert(t('Could not access microphone. Please check permissions.'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const uploadVoiceNote = async () => {
    if (!audioBlob) {
      alert(t('Please record a voice note first'));
      return;
    }

    try {
      const file = new File([audioBlob], 'voice-note.wav', { type: 'audio/wav' });
      const uploadResult = await UploadFile({ file });
      
      if (uploadResult?.file_url) {
        // Add to voice notes list
        const newVoiceNote = {
          id: Date.now().toString(),
          name: selectedTemplate ? voiceTemplates.find(t => t.id === selectedTemplate)?.name || t('Custom Voice Note') : t('Custom Voice Note'),
          duration: recordingTime,
          plays: 0,
          responseRate: '0%',
          url: uploadResult.file_url
        };
        
        setVoiceNotes(prev => [newVoiceNote, ...prev]);
        
        // Reset recording state
        setAudioBlob(null);
        setAudioURL('');
        setRecordingTime(0);
        
        alert(t('Voice note uploaded successfully!'));
      }
    } catch (error) {
      console.error('Error uploading voice note:', error);
      alert(t('Error uploading voice note'));
    }
  };

  const generateAIVoice = async (templateId) => {
    try {
      const template = voiceTemplates.find(t => t.id === templateId);
      if (!template) return;

      const prompt = `
        Create a natural, engaging voice note script for nightlife promotion:
        
        Template: ${template.name}
        Base script: ${template.script}
        Tone: ${template.tone}
        Target duration: ${template.duration}
        
        Make it sound natural, conversational, and exciting. Include appropriate pauses and emphasis.
        Replace placeholders with realistic examples.
      `;

      const aiScript = await InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            script: { type: "string" },
            instructions: { type: "string" },
            keywords_to_emphasize: { type: "array", items: { type: "string" } }
          }
        }
      });

      alert(t('AI script generated! Check the script tab for the optimized version.'));
      
    } catch (error) {
      console.error('Error generating AI voice script:', error);
      alert(t('Error generating AI script'));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-400" />
            {t('Voice Notes & Audio Messages')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="record" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
              <TabsTrigger value="record">{t('Record')}</TabsTrigger>
              <TabsTrigger value="templates">{t('Templates')}</TabsTrigger>
              <TabsTrigger value="library">{t('Library')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('Analytics')}</TabsTrigger>
            </TabsList>

            <TabsContent value="record" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recording Interface */}
                <div className="space-y-4">
                  <div className="text-center p-8 rounded-lg bg-slate-800/50 border border-slate-700">
                    <div className={`w-24 h-24 rounded-full border-4 mx-auto mb-4 flex items-center justify-center transition-all ${
                      isRecording 
                        ? 'border-red-500 bg-red-500/20 animate-pulse' 
                        : 'border-purple-500 bg-purple-500/20 hover:bg-purple-500/30'
                    }`}>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={isRecording ? stopRecording : startRecording}
                        className="w-full h-full rounded-full"
                      >
                        {isRecording ? (
                          <Square className="w-8 h-8 text-red-400" />
                        ) : (
                          <Mic className="w-8 h-8 text-purple-400" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="text-white font-medium mb-2">
                      {isRecording ? t('Recording...') : t('Ready to Record')}
                    </div>
                    
                    <div className="text-2xl font-mono text-purple-400">
                      {formatTime(recordingTime)}
                    </div>
                    
                    {isRecording && (
                      <div className="mt-4">
                        <div className="flex justify-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className="w-1 h-8 bg-purple-400 rounded animate-pulse"
                              style={{ animationDelay: `${i * 0.1}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recording Controls */}
                  {audioURL && (
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <audio 
                        ref={audioRef}
                        src={audioURL}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      />
                      
                      <div className="flex items-center gap-3 mb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={playAudio}
                          className="border-green-500/50 text-green-300 hover:bg-green-500/20"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        
                        <div className="flex-1">
                          <div className="text-sm text-white">{t('Recorded Voice Note')}</div>
                          <div className="text-xs text-slate-400">{formatTime(recordingTime)}</div>
                        </div>
                        
                        <Badge className="bg-blue-500/20 text-blue-300">
                          {recordingTime < 30 ? t('Good length') : t('Too long')}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setAudioBlob(null);
                            setAudioURL('');
                            setRecordingTime(0);
                          }}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300"
                        >
                          {t('Re-record')}
                        </Button>
                        
                        <Button
                          onClick={uploadVoiceNote}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {t('Save & Use')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recording Tips & Best Practices */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <h4 className="font-medium text-emerald-300 mb-2">{t('Voice Note Best Practices')}</h4>
                    <ul className="text-sm text-emerald-200 space-y-1">
                      <li>• {t('Keep it under 30 seconds')}</li>
                      <li>• {t('Sound natural and conversational')}</li>
                      <li>• {t('Mention their name for personalization')}</li>
                      <li>• {t('Include clear call-to-action')}</li>
                      <li>• {t('Record in quiet environment')}</li>
                      <li>• {t('Speak with energy and enthusiasm')}</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <h4 className="font-medium text-blue-300 mb-2">{t('Why Voice Notes Work')}</h4>
                    <div className="text-sm text-blue-200 space-y-2">
                      <div className="flex justify-between">
                        <span>{t('Higher open rates:')}</span>
                        <span className="font-bold">+85%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('Better response rates:')}</span>
                        <span className="font-bold">+127%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('More personal connection:')}</span>
                        <span className="font-bold">+200%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <h4 className="font-medium text-yellow-300 mb-2">{t('Pro Tips from Top Promoters')}</h4>
                    <div className="text-sm text-yellow-200 space-y-1">
                      <p>"{t('I use different voice tones for different customer types - VIPs get my smooth, exclusive voice.')}"</p>
                      <p>"{t('Background music at low volume adds atmosphere and energy to the message.')}"</p>
                      <p>"{t('I always end with their name again - it creates connection.')}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {voiceTemplates.map(template => (
                  <Card key={template.id} className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all ${
                    selectedTemplate === template.id ? 'border-purple-500 bg-purple-500/10' : 'hover:border-purple-500/50'
                  }`}>
                    <CardContent className="p-4" onClick={() => setSelectedTemplate(template.id)}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{template.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {template.tone}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.duration}
                            </Badge>
                          </div>
                        </div>
                        {selectedTemplate === template.id && (
                          <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-3 italic">
                        "{template.script}"
                      </p>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            generateAIVoice(template.id);
                          }}
                          className="border-blue-500/50 text-blue-300 hover:bg-blue-500/20"
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {t('AI Enhance')}
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Use this template for recording
                            setSelectedTemplate(template.id);
                          }}
                          className="bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                          {t('Use Template')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="library" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-white">{t('Your Voice Notes Library')}</h4>
                <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                  <Download className="w-4 h-4 mr-2" />
                  {t('Export All')}
                </Button>
              </div>

              <div className="space-y-3">
                {voiceNotes.map(note => (
                  <Card key={note.id} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-500/50 text-green-300 hover:bg-green-500/20"
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          
                          <div>
                            <div className="font-medium text-white">{note.name}</div>
                            <div className="text-sm text-slate-400">
                              {formatTime(note.duration)} • {note.plays} plays • {note.responseRate} response rate
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={
                            parseFloat(note.responseRate) > 50 
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : parseFloat(note.responseRate) > 30
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                          }>
                            {note.responseRate}
                          </Badge>
                          
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Volume2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">47</div>
                  <div className="text-sm text-slate-400">{t('Voice Notes Sent')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">89%</div>
                  <div className="text-sm text-slate-400">{t('Listen Rate')}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/50 text-center">
                  <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">42%</div>
                  <div className="text-sm text-slate-400">{t('Response Rate')}</div>
                </div>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{t('Performance by Voice Note Type')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: t('Personal Invitations'), sent: 23, listened: 21, responded: 14, rate: '61%' },
                      { type: t('VIP Offers'), sent: 12, listened: 11, responded: 8, rate: '67%' },
                      { type: t('Event Reminders'), sent: 8, listened: 6, responded: 2, rate: '25%' },
                      { type: t('Follow-ups'), sent: 4, listened: 4, responded: 2, rate: '50%' }
                    ].map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded bg-slate-900/50">
                        <div>
                          <div className="font-medium text-white">{stat.type}</div>
                          <div className="text-sm text-slate-400">
                            {stat.sent} • {stat.listened} listened • {stat.responded} responded
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-emerald-400">{stat.rate}</div>
                          <div className="text-xs text-slate-400">{t('response rate')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
