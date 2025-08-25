
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Phone,
  PhoneCall,
  Headphones,
  AudioLines, // Changed from Waveform
  Settings
} from "lucide-react";

export default function VoiceAIPromoter({ promoter, onVoiceMessage }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'rachel', // ElevenLabs voice ID
    speed: 1.0,
    pitch: 1.0,
    emotion: 'friendly'
  });

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const availableVoices = [
    { id: 'rachel', name: 'Rachel - Friendly Female', language: 'he' },
    { id: 'josh', name: 'Josh - Professional Male', language: 'en' },
    { id: 'bella', name: 'Bella - Energetic Female', language: 'he' },
    { id: 'adam', name: 'Adam - Cool Male', language: 'en' }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks(prev => [...prev, event.data]);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Here you would typically send to speech-to-text service
        console.log('Recording stopped, processing audio...');
        await processVoiceMessage(audioBlob);
        
        setAudioChunks([]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Cannot access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoiceMessage = async (audioBlob) => {
    try {
      // Mock processing - in real app, send to speech-to-text service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranscription = "היי, אני מעוניין לשמוע על האירוע הבא שלכם";
      
      // Generate AI response
      const aiResponse = await generateVoiceResponse(mockTranscription);
      
      // Convert to speech and play
      await playVoiceResponse(aiResponse);
      
      if (onVoiceMessage) {
        onVoiceMessage({
          transcription: mockTranscription,
          response: aiResponse,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error processing voice message:', error);
    }
  };

  const generateVoiceResponse = async (userMessage) => {
    // Mock AI response generation
    const responses = [
      "שלום! אני שמח לספר לך על האירוע הקרוב שלנו. יש לנו מסיבה מדהימה ביום שישי עם DJ בינלאומי!",
      "וואו, אתה בזמן הנכון! יש לנו הצעה מיוחדת לכניסה חינם עד השעה 23:30.",
      "תן לי לבדוק מה הכי מתאים לך - אתה מעדיף מוזיקת טכנו או האוס?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const playVoiceResponse = async (text) => {
    try {
      setIsPlaying(true);
      
      // Mock text-to-speech - in real app, use ElevenLabs or similar
      // const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/...', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'xi-api-key': 'your-api-key'
      //   },
      //   body: JSON.stringify({
      //     text,
      //     voice_settings: voiceSettings
      //   })
      // });
      
      // Mock audio playback
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing voice response:', error);
      setIsPlaying(false);
    }
  };

  const initiateCall = async () => {
    setIsCalling(true);
    
    // Mock call initiation
    setTimeout(() => {
      setIsCalling(false);
      alert('📞 שיחה נכנסת מלקוח חדש!');
    }, 5000);
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Headphones className="w-6 h-6 text-purple-400" />
          יחצן AI קולי - {promoter?.name}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-500/20 text-green-300">
            🎤 זמין לשיחות
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-300">
            {voiceSettings.voice} Voice
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`h-20 ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {isRecording ? <MicOff className="w-8 h-8 mb-2" /> : <Mic className="w-8 h-8 mb-2" />}
            <div className="text-sm">
              {isRecording ? 'עצור הקלטה' : 'התחל הקלטה'}
            </div>
          </Button>

          <Button
            onClick={() => playVoiceResponse("שלום, זהו מבחן של המערכת הקולית")}
            disabled={isPlaying}
            className="h-20 bg-emerald-600 hover:bg-emerald-700"
          >
            {isPlaying ? <AudioLines className="w-8 h-8 mb-2 animate-bounce" /> : <Play className="w-8 h-8 mb-2" />}
            <div className="text-sm">
              {isPlaying ? 'מדבר...' : 'בדיקת קול'}
            </div>
          </Button>

          <Button
            onClick={initiateCall}
            disabled={isCalling}
            className="h-20 bg-blue-600 hover:bg-blue-700"
          >
            {isCalling ? <PhoneCall className="w-8 h-8 mb-2 animate-pulse" /> : <Phone className="w-8 h-8 mb-2" />}
            <div className="text-sm">
              {isCalling ? 'מחבר...' : 'התחל שיחה'}
            </div>
          </Button>
        </div>

        {/* Voice Settings */}
        <div className="space-y-4">
          <h4 className="text-white font-medium">הגדרות קול</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">סוג קול</label>
              <select 
                value={voiceSettings.voice}
                onChange={(e) => setVoiceSettings({...voiceSettings, voice: e.target.value})}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                {availableVoices.map(voice => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 text-sm mb-2 block">רגש</label>
              <select 
                value={voiceSettings.emotion}
                onChange={(e) => setVoiceSettings({...voiceSettings, emotion: e.target.value})}
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                <option value="friendly">ידידותי</option>
                <option value="professional">מקצועי</option>
                <option value="energetic">אנרגטי</option>
                <option value="cool">קליל</option>
                <option value="seductive">מפתה</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">מהירות דיבור</label>
              <Slider
                value={[voiceSettings.speed]}
                onValueChange={([value]) => setVoiceSettings({...voiceSettings, speed: value})}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-slate-400 mt-1">{voiceSettings.speed}x</div>
            </div>

            <div>
              <label className="text-slate-300 text-sm mb-2 block">עלות קול</label>
              <Slider
                value={[voiceSettings.pitch]}
                onValueChange={([value]) => setVoiceSettings({...voiceSettings, pitch: value})}
                max={2}
                min={0.5}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-slate-400 mt-1">{voiceSettings.pitch}x</div>
            </div>

            <div>
              <label className="text-slate-300 text-sm mb-2 block flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                עוצמת קול
              </label>
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-slate-400 mt-1">{Math.round(volume[0] * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Live Status */}
        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h5 className="text-white font-medium mb-2">סטטוס לייב</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-emerald-400 font-bold">12</div>
              <div className="text-slate-400">שיחות היום</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold">4m 32s</div>
              <div className="text-slate-400">זמן ממוצע</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 font-bold">67%</div>
              <div className="text-slate-400">שיעור המרה</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold">₪2,340</div>
              <div className="text-slate-400">הכנסות</div>
            </div>
          </div>
        </div>

        {/* Cost Information */}
        <div className="p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-300">עלות AI קולי:</span>
            <span className="text-white font-bold">$0.05 לדקה</span>
          </div>
          <div className="text-xs text-yellow-200 mt-1">
            כולל: Speech-to-Text, AI Processing, Text-to-Speech
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
