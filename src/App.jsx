import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Send, CheckCircle, Shield, ArrowLeft, Mic, 
  Image as ImageIcon, Video, X, AlertCircle, Languages, 
  Lock, Mail, Eye, Download, Star, ExternalLink, Menu, Settings, Terminal, Loader2, Play, Square, Trash2, Archive, RotateCcw
} from 'lucide-react';
import { supabase } from './supabaseClient';
import grad1 from './assets/grad1.jpg';
import grad2 from './assets/grad2.jpg';
import grad3 from './assets/grad3.jpg';


const graduates = [
  {
    id: 1,
    name: { en: 'Mohammad Alzaraa', ar: 'Mohammad Alzaraa' },
    role: { en: 'Class of 2026', ar: 'Class of 2026' },
    image: grad1,
    accent: 'var(--color-neon-blue)',
    glow: 'shadow-[0_0_20px_rgba(0,210,255,0.3)]',
  },
  {
    id: 2,
    name: { en: 'Yousef Alhardan', ar: 'Yousef Alhardan' },
    role: { en: 'Class of 2026', ar: 'Class of 2026' },
    image: grad2,
    accent: 'var(--color-neon-purple)',
    glow: 'shadow-[0_0_20px_rgba(157,80,187,0.3)]',
  },
  {
    id: 3,
    name: { en: 'Ibrahim Wazwaz', ar: 'Ibrahim Wazwaz' },
    role: { en: 'Class of 2026', ar: 'Class of 2026' },
    image: grad3,
    accent: '#10b981', // Emerald green
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
  },
];

const LIMITS = {
  voice: { max: 10, label: '10MB' },
  image: { max: 5, label: '5MB' },
  video: { max: 20, label: '20MB' },
};

const translations = {
  ar: {
    title: 'بصمة خريج',
    subtitle: 'لكل خريج حكاية.. اترك بصمتك في خزنتنا السرية، حيث لا يقرأ الكلمات إلا أصحابها.',
    writeToMe: 'اكتب لي',
    back: 'العودة للاختيار',
    messageFor: 'رسالة إلى',
    secureProtocol: 'بروتوكول الرسائل الآمنة نشط',
    yourName: 'اسمك',
    optional: 'اختياري',
    anonymousPlaceholder: 'اتركه فارغاً للإرسال بهوية مجهولة',
    yourMessage: 'رسالتك',
    messagePlaceholder: 'شارك ذكرى، أمنية، أو فقط قل مرحباً...',
    attachments: 'المرفقات',
    voice: 'تسجيل صوتي',
    image: 'صورة',
    video: 'فيديو',
    max: 'الحد الأقصى',
    attached: 'تم الحفظ',
    send: 'إرسال',
    successTitle: 'تم الارسال بنجاح',
    successSubtitle: 'تم تشفير رسالتك وإيداعها في الخزنة الخاصة بـ',
    successMedia: ' والوسائط المشفرة',
    privacyConfirmation: 'تأكيد الخصوصية',
    privacyText: 'هذه الرسالة الآن غير مرئية للعامة. يمكن فقط للمستلم فك تشفيرها وعرضها من خلال لوحة التحكم الآمنة الخاصة به.',
    returnHome: 'العودة للرئيسية',
    fileTooLarge: 'الملف كبير جداً. الحد الأقصى هو',
    for: 'لـ',
    certTitle: 'شهادة بصمة',
    certText: 'شكراً لك على ترك بصمتك في رحلة',
    downloadCert: 'تحميل الشهادة',
    graduateLogin: 'دخول الخريجين',
    dashboardTitle: 'خزنة البصمات',
    totalMessages: 'إجمالي البصمات',
    unlockVault: 'فتح الخزنة',
    enterPassword: 'أدخل كلمة المرور الخاصة بك',
    invalidPassword: 'كلمة المرور غير صحيحة',
    readMessage: 'قراءة الرسالة',
    sending: 'جاري الإرسال والتشفير...',
    mediaSecured: 'تم تأمين الوسائط بروابط موقتة',
    startRecording: 'ابدأ التسجيل',
    stopRecording: 'إيقاف وحفظ',
    recording: 'جاري التسجيل...',
  },
  en: {
    title: 'Grad Legacy',
    subtitle: 'Every graduate has a story.. Leave your mark in our secret vault, where words are only read by those they belong to.',
    writeToMe: 'Write to me',
    back: 'Back to Selection',
    messageFor: 'Message for',
    secureProtocol: 'Secure Message Protocol Active',
    yourName: 'Your Name',
    optional: 'Optional',
    anonymousPlaceholder: 'Leave blank for anonymous',
    yourMessage: 'Your Message',
    messagePlaceholder: 'Share a memory, a wish, or just say hi...',
    attachments: 'Attachments',
    voice: 'Voice Record',
    image: 'Image',
    video: 'Video',
    max: 'Max',
    attached: 'Recorded',
    send: 'Send',
    successTitle: 'Sent Successfully',
    successSubtitle: 'Your message has been encrypted and deposited into the private vault of',
    successMedia: ' and encrypted media',
    privacyConfirmation: 'Privacy Confirmation',
    privacyText: 'This message is now invisible to the public. It can only be decrypted and viewed by the recipient through their secure dashboard.',
    returnHome: 'Return Home',
    fileTooLarge: 'File too large. Max size is',
    for: 'for',
    certTitle: 'Legacy Certificate',
    certText: 'Thank you for leaving your mark on the journey of',
    downloadCert: 'Download Certificate',
    graduateLogin: 'Graduate Login',
    dashboardTitle: 'Legacy Vault',
    totalMessages: 'Total Marks',
    unlockVault: 'Unlock Vault',
    enterPassword: 'Enter your access key',
    invalidPassword: 'Invalid access key',
    readMessage: 'Read Message',
    sending: 'Encrypting and Sending...',
    mediaSecured: 'Media secured with temporary links',
    startRecording: 'Start Recording',
    stopRecording: 'Stop & Save',
    recording: 'Recording...',
    archive: 'الأرشيف',
    activeVault: 'الخزنة الرئيسية',
    restore: 'استعادة',
  }
};

const triggerHaptic = (style = 10) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(style);
  }
};

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [text]);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-neon-blue/80 bg-white/5 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl border border-white/10 inline-flex items-center gap-2 md:gap-3 text-sm md:text-2xl shadow-2xl">
      <Terminal size={14} />
      <span>{displayedText}</span>
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-4 bg-neon-blue inline-block align-middle" />
    </motion.div>
  );
};

const Stardust = ({ count = window.innerWidth < 768 ? 15 : 40 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0, x: '50vw', y: '80vh' }} animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 0.5, 0], x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh`, }} transition={{ duration: 2 + Math.random() * 2, ease: "easeOut", delay: Math.random() * 0.2 }} className="absolute w-2 h-2 rounded-full bg-white" style={{ boxShadow: `0 0 8px ${Math.random() > 0.5 ? 'var(--color-neon-blue)' : 'var(--color-neon-purple)'}` }} />
      ))}
    </div>
  );
};

const Certificate = ({ name, grad, lang, t }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative p-0.5 bg-gradient-to-br from-neon-blue via-white/20 to-neon-purple rounded-3xl overflow-hidden mb-8">
    <div className="bg-charcoal/95 rounded-[1.4rem] p-6 md:p-8 text-center relative">
      <Star className="mx-auto mb-4 text-neon-blue animate-pulse" size={28} />
      <h3 className="text-sm md:text-xl font-bold uppercase tracking-[0.2em] text-white/40 mb-2">{t('certTitle')}</h3>
      <div className="w-12 h-1px bg-white/10 mx-auto mb-6" />
      <p className="text-sm text-white/60 mb-6">{t('certText')}</p>
      <h2 className="text-2xl md:text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">{grad.name[lang]}</h2>
      <p className="text-white/30 text-[10px] uppercase tracking-widest">{name || (lang === 'ar' ? 'بصمة مجهولة' : 'Anonymous Mark')} • {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
    </div>
  </motion.div>
);

const App = () => {
  const [lang, setLang] = useState('ar');
  const [view, setView] = useState('selection');
  const [selectedGrad, setSelectedGrad] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showStardust, setShowStardust] = useState(false);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [attachments, setAttachments] = useState({});
  const [error, setError] = useState(null);
  
  const [dashPassword, setDashPassword] = useState('');
  const [isDashAuthenticated, setIsDashAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [viewMode, setViewMode] = useState('active'); // 'active' or 'hidden'


  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef(null);

  const fileInputRef = useRef({});
  const t = (key) => translations[lang][key];

  useEffect(() => {
    if (isDashAuthenticated && selectedGrad) {
      const fetchMessages = async () => {
        const rpcName = viewMode === 'active' ? 'fetch_vault_messages' : 'fetch_hidden_messages';
        const { data, error } = await supabase.rpc(rpcName, {
          target_grad_id: selectedGrad.id,
          input_key: dashPassword
        });
        
        if (error) {
          console.warn('RPC failed or missing. Attempting direct fallback...', error);
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('messages')
            .select('*')
            .eq('graduate_id', selectedGrad.id);
            
          if (fallbackError) {
             console.error('Fallback Data error:', fallbackError);
          } else {
             const sortedData = fallbackData ? fallbackData.sort((a, b) => b.id - a.id) : [];
             setMessages(sortedData);
          }
        } else {
          setMessages(data || []);
        }
      };

      fetchMessages();
    }
  }, [isDashAuthenticated, selectedGrad, viewMode]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
        const blob = new Blob(chunks, { type: mimeType });
        const file = new File([blob], `recording.${ext}`, { type: mimeType });
        setAttachments(prev => ({ ...prev, voice: file }));
        setIsRecording(false);
        setRecordingTime(0);
        clearInterval(timerRef.current);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      triggerHaptic(50);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
      setError(lang === 'ar' ? 'فشل الوصول للميكروفون.' : 'Microphone access failed.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      triggerHaptic(20);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (error || isSending || isRecording) return;

    triggerHaptic(30);
    setIsSending(true);
    setShowStardust(true);

    try {
      const attachmentPaths = {};

      for (const [type, file] of Object.entries(attachments)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${selectedGrad.id}/${type}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        attachmentPaths[type] = filePath;
      }

      const { error: dbError } = await supabase
        .from('messages')
        .insert([{
          sender_name: formData.name || null,
          message_text: formData.message,
          graduate_id: selectedGrad.id,
          attachments: attachmentPaths
        }]);

      if (dbError) throw dbError;

      setTimeout(() => {
        setIsSent(true);
        setIsSending(false);
        setShowStardust(false);
        triggerHaptic([50, 30, 50]);
      }, 1000);

    } catch (err) {
      setError(lang === 'ar' ? 'فشل الإرسال. تأكد من إعدادات الاتصال.' : 'Submission failed. Please check connection.');
      setIsSending(false);
      setShowStardust(false);
    }
  };

  const handleReset = () => {
    triggerHaptic(10);
    setView('selection');
    setSelectedGrad(null);
    setIsSent(false);
    setIsSending(false);
    setFormData({ name: '', message: '' });
    setAttachments({});
    setError(null);
    setIsDashAuthenticated(false);
    setDashPassword('');
    setMessages([]);
    setActiveMessage(null);
    if (isRecording) stopRecording();
  };

  const handleFileChange = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const maxSize = LIMITS[type].max * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`${t('fileTooLarge')} ${LIMITS[type].label} ${t('for')} ${t(type)}.`);
      setTimeout(() => setError(null), 4000);
      return;
    }
    triggerHaptic(15);
    setAttachments(prev => ({ ...prev, [type]: file }));
    setError(null);
  };

  const removeAttachment = (type) => {
    triggerHaptic(5);
    setAttachments(prev => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const handleDashAuth = async (e) => {
    e.preventDefault();
    triggerHaptic(20);
    setIsSending(true);

    try {
      const { data: isValid, error: rpcError } = await supabase.rpc('verify_graduate_key', {
        grad_id: selectedGrad.id,
        input_key: dashPassword
      });

      if (rpcError) throw rpcError;

      if (isValid) {
        setIsDashAuthenticated(true);
        setError(null);
      } else {
        setError(t('invalidPassword'));
        triggerHaptic([100, 50, 100]);
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(lang === 'ar' ? 'حدث خطأ أثناء التحقق.' : 'Error during verification.');
    } finally {
      setIsSending(false);
    }
  };

  const openMessage = async (msg) => {
    triggerHaptic(15);
    setIsSending(true); 
    try {
      const activeMediaItems = [];
      if (msg.attachments && Object.keys(msg.attachments).length > 0) {
        for (const mediaType of Object.keys(msg.attachments)) {
          const path = msg.attachments[mediaType];
          const { data, error } = await supabase.storage
            .from('attachments')
            .createSignedUrl(path, 60);

          if (error) throw error;
          activeMediaItems.push({ type: mediaType, url: data.signedUrl });
        }
      }
      setActiveMessage({ ...msg, mediaItems: activeMediaItems });
    } catch (err) {
      console.error('Signed URL error:', err);
      setError(lang === 'ar' ? 'فشل تحميل الملف الآمن.' : 'Failed to load secured file.');
    } finally {
      setIsSending(false);
    }
  };

  const hideMessage = async (msgId) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من إخفاء هذه البصمة؟' : 'Are you sure you want to hide this mark?')) return;
    
    triggerHaptic(50);
    try {
      const { data: success, error } = await supabase.rpc('hide_vault_message', {
        msg_id: msgId,
        input_key: dashPassword
      });

      if (error) throw error;
      if (success) {
        setMessages(prev => prev.filter(m => m.id !== msgId));
        if (activeMessage?.id === msgId) setActiveMessage(null);
      }
    } catch (err) {
      console.error('Hide error:', err);
      setError(lang === 'ar' ? 'فشل إخفاء الرسالة.' : 'Failed to hide message.');
    }
  };

  const restoreMessage = async (msgId) => {
    triggerHaptic(30);
    try {
      const { data: success, error } = await supabase.rpc('restore_vault_message', {
        msg_id: msgId,
        input_key: dashPassword
      });

      if (error) throw error;
      if (success) {
        setMessages(prev => prev.filter(m => m.id !== msgId));
      }
    } catch (err) {
      console.error('Restore error:', err);
      setError(lang === 'ar' ? 'فشل استعادة الرسالة.' : 'Failed to restore message.');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-white font-['Inter',sans-serif] selection:bg-neon-blue/30 overflow-x-hidden transition-all duration-500 safe-area-inset" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showStardust && <Stardust />}

      <div className="fixed top-safe left-0 right-0 px-6 py-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          {(selectedGrad || view === 'dash-auth' || view === 'dashboard') && (
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all font-medium text-sm">
              <ArrowLeft size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
              {t('back')}
            </button>
          )}
        </div>
        <button onClick={() => { setLang(lang === 'ar' ? 'en' : 'ar'); triggerHaptic(10); }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all font-medium text-sm pointer-events-auto">
          <Languages size={16} className="text-neon-blue" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'selection' && (
          <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="container mx-auto px-6 pt-32 pb-24 flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-16 space-y-6">
              <Typewriter text='console.log("Hello World! We&apos;re Graduates");' />
              <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none">
                {lang === 'ar' ? (<><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">بصمة</span> خريج</>) : (<>Grad <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Legacy</span></>)}
              </h1>
              <p className="text-white/60 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">{t('subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {graduates.map((grad) => (
                <motion.div key={grad.id} whileHover={{ scale: 1.02, translateY: -5 }} whileTap={{ scale: 0.98 }} className={`relative group cursor-pointer rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 ${grad.glow} hover:border-white/20`} onClick={() => { setSelectedGrad(grad); setView('form'); triggerHaptic(20); }}>
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={grad.image} alt={grad.name[lang]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100 mobile-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                    <p className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-2 opacity-60" style={{ color: grad.accent }}>{grad.role[lang]}</p>
                    <h2 className="text-3xl md:text-4xl font-black mb-6 md:mb-8">{grad.name[lang]}</h2>
                    <button className="w-full py-4 md:py-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md font-bold text-base md:text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3">
                      {t('writeToMe')}
                      <Send size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, x: lang === 'ar' ? -50 : 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }} className="container mx-auto px-4 py-24 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-xl">
              <div className="bg-white/5 backdrop-blur-xl md:backdrop-blur-3xl border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-14 relative overflow-hidden">
                <div className={`absolute -top-24 ${lang === 'ar' ? '-left-24' : '-right-24'} w-64 h-64 blur-[80px] md:blur-[120px] opacity-20 rounded-full`} style={{ backgroundColor: selectedGrad.accent }} />
                {!isSent ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-5 md:gap-6 mb-8 md:mb-10 relative">
                      <motion.div whileTap={{ scale: 0.9 }} onClick={() => { setView('dash-auth'); triggerHaptic(20); }} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[1.5rem] overflow-hidden border-2 border-white/10 shadow-2xl cursor-pointer hover:border-white/30 transition-all">
                        <img src={selectedGrad.image} alt={selectedGrad.name[lang]} className="w-full h-full object-cover" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black">{t('messageFor')} {selectedGrad.name[lang].split(' ')[0]}</h2>
                        <div className="flex items-center gap-2 text-white/40 text-[10px] md:text-xs uppercase tracking-widest mt-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />{t('secureProtocol')}</div>
                      </div>
                    </div>
                    <form onSubmit={handleSend} className="space-y-6 md:space-y-8">
                      <AnimatePresence>{error && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/20 border border-red-500/40 text-red-200 p-4 rounded-xl md:rounded-2xl flex items-center gap-3 text-sm"><AlertCircle size={18} /> {error}</motion.div>)}</AnimatePresence>
                      <div className="space-y-2">
                        <label className="block text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t('yourName')} <span className="lowercase opacity-50">({t('optional')})</span></label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-7 py-4 md:py-5 outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20 text-start font-medium text-sm md:text-base" placeholder={t('anonymousPlaceholder')} />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t('yourMessage')}</label>
                        <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-7 py-4 md:py-5 outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20 resize-none text-start font-medium text-sm md:text-base" placeholder={t('messagePlaceholder')} />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t('attachments')}</label>
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                          <div className="relative">
                            <button 
                              type="button" 
                              onClick={() => {
                                if (attachments.voice) removeAttachment('voice');
                                else if (isRecording) stopRecording();
                                else startRecording();
                              }} 
                              className={`flex flex-col items-center justify-center gap-1.5 md:gap-2 w-full py-4 md:py-5 rounded-xl md:rounded-2xl border-2 transition-all ${attachments.voice || isRecording ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            >
                              {isRecording ? (
                                <Square size={20} className="text-red-500 animate-pulse" />
                              ) : (
                                <Mic size={20} className={attachments.voice ? 'text-neon-blue' : 'text-white/60'} />
                              )}
                              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                {isRecording ? `${recordingTime}s` : attachments.voice ? t('attached') : t('voice')}
                              </span>
                              {!attachments.voice && !isRecording && <span className="text-[7px] md:text-[8px] opacity-40 font-bold">REC</span>}
                            </button>
                          </div>

                          <div className="relative">
                            <input type="file" className="hidden" ref={el => fileInputRef.current['image'] = el} accept="image/*" onChange={(e) => handleFileChange('image', e)} />
                            <button type="button" onClick={() => attachments['image'] ? removeAttachment('image') : fileInputRef.current['image'].click()} className={`flex flex-col items-center justify-center gap-1.5 md:gap-2 w-full py-4 md:py-5 rounded-xl md:rounded-2xl border-2 transition-all ${attachments['image'] ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                              <ImageIcon size={20} className={attachments['image'] ? 'text-neon-blue' : 'text-white/60'} />
                              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{attachments['image'] ? t('attached') : t('image')}</span>
                              {!attachments['image'] && <span className="text-[7px] md:text-[8px] opacity-40 font-bold">{LIMITS.image.label}</span>}
                            </button>
                          </div>

                          <div className="relative">
                            <input type="file" className="hidden" ref={el => fileInputRef.current['video'] = el} accept="video/*" onChange={(e) => handleFileChange('video', e)} />
                            <button type="button" onClick={() => attachments['video'] ? removeAttachment('video') : fileInputRef.current['video'].click()} className={`flex flex-col items-center justify-center gap-1.5 md:gap-2 w-full py-4 md:py-5 rounded-xl md:rounded-2xl border-2 transition-all ${attachments['video'] ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                              <Video size={20} className={attachments['video'] ? 'text-neon-blue' : 'text-white/60'} />
                              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{attachments['video'] ? t('attached') : t('video')}</span>
                              {!attachments['video'] && <span className="text-[7px] md:text-[8px] opacity-40 font-bold">{LIMITS.video.label}</span>}
                            </button>
                          </div>
                        </div>
                      </div>
                      <button type="submit" disabled={isSending || isRecording} className="w-full py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-lg md:text-xl flex items-center justify-center gap-4 transition-all hover:brightness-110 active:scale-[0.98] shadow-2xl disabled:opacity-50" style={{ backgroundColor: selectedGrad.accent, color: '#000' }}>
                        {isSending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} className={lang === 'ar' ? 'rotate-180' : ''} />}
                        {isSending ? t('sending') : t('send')}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <Certificate name={formData.name} grad={selectedGrad} lang={lang} t={t} />
                    <h2 className="text-3xl md:text-4xl font-black mb-4">{t('successTitle')}</h2>
                    <p className="text-white/50 text-base md:text-lg mb-8 md:mb-10 max-w-xs mx-auto leading-relaxed">{t('successSubtitle')} <span className="text-white font-bold">{selectedGrad.name[lang].split(' ')[0]}</span>{Object.keys(attachments).length > 0 && t('successMedia')}.</p>

                    <div className="flex flex-col gap-3 md:gap-4">
                      <button onClick={handleReset} className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold opacity-60 hover:opacity-100">{t('returnHome')}</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'dash-auth' && (
          <motion.div key="dash-auth" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="container mx-auto px-6 py-24 flex items-center justify-center min-h-screen">
            <div className="w-full max-md">
              <div className="bg-white/5 backdrop-blur-xl md:backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl overflow-hidden mx-auto mb-6 border-2 border-white/10"><img src={selectedGrad.image} className="w-full h-full object-cover" /></div>
                <h2 className="text-2xl md:text-3xl font-black mb-2">{t('dashboardTitle')}</h2>
                <p className="text-sm text-white/50 mb-10">{t('enterPassword')}</p>
                <form onSubmit={handleDashAuth} className="space-y-4">
                  <input type="password" value={dashPassword} onChange={(e) => setDashPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl px-6 py-4 outline-none focus:border-neon-purple/50 text-center tracking-[0.5em] text-lg md:text-xl" />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button type="submit" disabled={isSending} className="w-full py-4 rounded-xl md:rounded-2xl bg-neon-purple text-black font-black text-base md:text-lg hover:brightness-110 transition-all disabled:opacity-50">
                    {isSending ? <Loader2 className="animate-spin mx-auto" size={24} /> : t('unlockVault')}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {isDashAuthenticated && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-charcoal p-4 md:p-12 overflow-y-auto">
            <div className="container mx-auto max-w-6xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                  <h1 className="text-3xl md:text-6xl font-black mb-4">{lang === 'ar' ? 'أهلاً يا' : 'Welcome,'} <span style={{ color: selectedGrad.accent }}>{selectedGrad.name[lang].split(' ')[0]}</span></h1>
                  <div className="flex items-center gap-4 text-white/50"><Mail size={18} /><span className="font-bold text-base md:text-lg">{messages.length} {t('totalMessages')}</span><div className="flex items-center gap-2 text-green-500 text-xs animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-green-500" />Live</div></div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={() => { setViewMode(viewMode === 'active' ? 'hidden' : 'active'); triggerHaptic(20); }} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all font-bold text-sm ${viewMode === 'hidden' ? 'bg-neon-purple text-black border-neon-purple' : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                  >
                    {viewMode === 'active' ? <Archive size={18} /> : <RotateCcw size={18} />}
                    {viewMode === 'active' ? t('archive') : t('activeVault')}
                  </button>
                  <button onClick={handleReset} className="w-full md:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 text-sm md:text-base">{t('back')}</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {messages.map((msg, i) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 hover:bg-white/10 transition-all cursor-pointer" onClick={() => openMessage(msg)}>
                    <Mail className="text-white/20 mb-4 md:mb-6 group-hover:text-neon-blue transition-colors" size={28} />
                    <p className="text-lg md:text-xl font-medium mb-6 line-clamp-3 text-white/80 italic">"{msg.message_text}"</p>
                    <div className="flex flex-col gap-4 mt-6 pt-6 border-t border-white/10">
                      {msg.attachments && Object.keys(msg.attachments).length > 0 && (
                        <div className="w-full py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          <Play size={14} /> {t('mediaSecured')}
                        </div>
                      )}
                        <div className="flex justify-between items-center">
                          <div className="text-xs md:text-sm"><span className="font-bold text-neon-blue">{msg.sender_name || (lang === 'ar' ? 'مجهول' : 'Anonymous')}</span></div>
                          <div className="flex gap-2">
                            {viewMode === 'active' ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); hideMessage(msg.id); }} 
                                className="p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-red-500 hover:text-white transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); restoreMessage(msg.id); }} 
                                className="p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-green-500 hover:text-white transition-all"
                              >
                                <RotateCcw size={18} />
                              </button>
                            )}
                            <button className="p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-neon-blue hover:text-black transition-all">
                              <Eye size={18} />
                            </button>
                          </div>
                        </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {activeMessage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-start p-6 md:p-12 overflow-y-auto">
                  <button onClick={() => setActiveMessage(null)} className="fixed top-6 right-6 md:top-10 md:right-10 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white z-50"><X size={24} /></button>
                  <div className="max-w-4xl w-full flex flex-col gap-8 py-16 md:py-20">
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 text-center">
                      <Mail className="mx-auto text-neon-blue mb-8" size={48} />
                      <p className="text-xl md:text-3xl font-medium leading-relaxed italic text-white/90 mb-10">"{activeMessage.message_text}"</p>
                      <div className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10">
                        <span className="font-bold text-sm md:text-base text-neon-blue">{activeMessage.sender_name || (lang === 'ar' ? 'مجهول' : 'Anonymous')}</span>
                      </div>
                    </div>
                    {activeMessage.mediaItems && activeMessage.mediaItems.length > 0 && (
                      <div className="w-full flex flex-col items-center gap-8">
                        <div className="w-full h-px bg-white/10 my-4" />
                        {activeMessage.mediaItems.map((media, idx) => (
                          <div key={idx} className="w-full flex justify-center">
                            {media.type === 'image' && <img src={media.url} className="max-h-[70vh] rounded-[2rem] shadow-2xl border border-white/10 object-contain" />}
                            {media.type === 'video' && <video controls src={media.url} className="max-h-[70vh] rounded-[2rem] shadow-2xl border border-white/10 w-full" />}
                            {media.type === 'voice' && (
                              <div className="bg-white/5 p-8 md:p-12 rounded-[3rem] border border-white/10 text-center w-full max-w-md">
                                <Mic size={48} className="mx-auto mb-6 text-neon-purple animate-pulse" />
                                <audio controls src={media.url} className="w-full" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
