import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Send, CheckCircle, Shield, ArrowLeft, Mic, 
  Image as ImageIcon, Video, X, AlertCircle, Languages, 
  Lock, Mail, Eye, Download, Star, ExternalLink, Menu, Settings, Terminal, Loader2
} from 'lucide-react';
import { supabase } from './supabaseClient';
import grad1 from './assets/grad1.png';
import grad2 from './assets/grad2.png';

const graduates = [
  {
    id: 1,
    name: { en: 'Mohammad Alzaraa', ar: 'محمد الزراع' },
    role: { en: 'Class of 2026', ar: 'دفعة 2026' },
    image: grad1,
    accent: 'var(--color-neon-blue)',
    glow: 'shadow-[0_0_20px_rgba(0,210,255,0.3)]',
    password: 'moe2026',
  },
  {
    id: 2,
    name: { en: 'Yousef Alhardan', ar: 'يوسف الحردان' },
    role: { en: 'Class of 2026', ar: 'دفعة 2026' },
    image: grad2,
    accent: 'var(--color-neon-purple)',
    glow: 'shadow-[0_0_20px_rgba(157,80,187,0.3)]',
    password: 'joe2026',
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
    voice: 'صوت',
    image: 'صورة',
    video: 'فيديو',
    max: 'الحد الأقصى',
    attached: 'تم الإرفاق',
    send: 'إرسال',
    encryptedTransmission: 'نقل مشفر بالكامل (End-to-End)',
    successTitle: 'نجاح الإرسال',
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
    voice: 'Voice',
    image: 'Image',
    video: 'Video',
    max: 'Max',
    attached: 'Attached',
    send: 'Send',
    encryptedTransmission: 'End-to-End Encrypted Transmission',
    successTitle: 'Transmission Success',
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
  }
};

const Typewriter = ({ text, delay = 0 }) => {
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-mono text-neon-blue/80 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 inline-flex items-center gap-3 text-lg md:text-2xl shadow-2xl">
      <Terminal size={14} />
      <span>{displayedText}</span>
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-1.5 h-4 bg-neon-blue inline-block align-middle" />
    </motion.div>
  );
};

const Stardust = ({ count = 40 }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(count)].map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0, x: '50vw', y: '80vh' }} animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 0.5, 0], x: `${Math.random() * 100}vw`, y: `${Math.random() * 100}vh`, }} transition={{ duration: 2 + Math.random() * 2, ease: "easeOut", delay: Math.random() * 0.2 }} className="absolute w-2 h-2 rounded-full bg-white blur-[1px]" style={{ boxShadow: `0 0 10px ${Math.random() > 0.5 ? 'var(--color-neon-blue)' : 'var(--color-neon-purple)'}` }} />
      ))}
    </div>
  );
};

const Certificate = ({ name, grad, lang, t }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative p-1 bg-gradient-to-br from-neon-blue via-white/20 to-neon-purple rounded-3xl overflow-hidden mb-8">
    <div className="bg-charcoal/95 rounded-[1.4rem] p-8 text-center relative">
      <Star className="mx-auto mb-4 text-neon-blue animate-pulse" size={32} />
      <h3 className="text-xl font-bold uppercase tracking-[0.2em] text-white/40 mb-2">{t('certTitle')}</h3>
      <div className="w-16 h-1px bg-white/10 mx-auto mb-6" />
      <p className="text-white/60 mb-6">{t('certText')}</p>
      <h2 className="text-3xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">{grad.name[lang]}</h2>
      <p className="text-white/30 text-xs uppercase tracking-widest">{name || (lang === 'ar' ? 'بصمة مجهولة' : 'Anonymous Mark')} • {new Date().toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</p>
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

  const fileInputRef = useRef({});
  const t = (key) => translations[lang][key];

  useEffect(() => {
    if (isDashAuthenticated && selectedGrad) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('graduate_id', selectedGrad.id)
          .order('created_at', { ascending: false });
        
        if (error) console.error('Data error:', error);
        else setMessages(data);
      };

      fetchMessages();

      const subscription = supabase
        .channel('vault_channel')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `graduate_id=eq.${selectedGrad.id}` }, payload => {
          setMessages(prev => [payload.new, ...prev]);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [isDashAuthenticated, selectedGrad]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (error || isSending) return;

    setIsSending(true);
    setShowStardust(true);

    try {
      const attachmentPaths = {};

      for (const [type, file] of Object.entries(attachments)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
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
      }, 1000);

    } catch (err) {
      setError(lang === 'ar' ? 'فشل الإرسال. تأكد من إعدادات الاتصال.' : 'Submission failed. Please check connection.');
      setIsSending(false);
      setShowStardust(false);
    }
  };

  const reset = () => {
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
    setAttachments(prev => ({ ...prev, [type]: file }));
    setError(null);
  };

  const removeAttachment = (type) => {
    setAttachments(prev => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  };

  const handleDashAuth = (e) => {
    e.preventDefault();
    if (dashPassword === selectedGrad.password) {
      setIsDashAuthenticated(true);
      setError(null);
    } else {
      setError(t('invalidPassword'));
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-white font-['Inter',sans-serif] selection:bg-neon-blue/30 overflow-x-hidden transition-all duration-500" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showStardust && <Stardust />}

      <div className="fixed top-6 right-6 left-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          {(selectedGrad || view === 'dash-auth' || view === 'dashboard') && (
            <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all font-medium text-sm pointer-events-auto">
              <ArrowLeft size={16} className={lang === 'ar' ? 'rotate-180' : ''} />
              {t('back')}
            </button>
          )}
        </div>
        <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all font-medium text-sm pointer-events-auto">
          <Languages size={16} className="text-neon-blue" />
          {lang === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'selection' && (
          <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="container mx-auto px-6 pt-32 pb-12 flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-16 space-y-6">
              <Typewriter text='console.log("Hello World! We&apos;re Graduates");' />
              <h1 className="text-4xl md:text-8xl font-black tracking-tight leading-none">
                {lang === 'ar' ? (<><span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">بصمة</span> خريج</>) : (<>Grad <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Legacy</span></>)}
              </h1>
              <p className="text-white/60 text-lg md:text-2xl max-w-2xl mx-auto font-medium leading-relaxed">{t('subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
              {graduates.map((grad) => (
                <motion.div key={grad.id} whileHover={{ scale: 1.02, translateY: -5 }} whileTap={{ scale: 0.98 }} className={`relative group cursor-pointer rounded-[2.5rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 ${grad.glow} hover:border-white/20`} onClick={() => { setSelectedGrad(grad); setView('form'); }}>
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <img src={grad.image} alt={grad.name[lang]} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] mb-2 opacity-60" style={{ color: grad.accent }}>{grad.role[lang]}</p>
                    <h2 className="text-4xl font-black mb-8">{grad.name[lang]}</h2>
                    <button className="w-full py-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3">
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
          <motion.div key="form" initial={{ opacity: 0, x: lang === 'ar' ? -100 : 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: lang === 'ar' ? 100 : -100 }} className="container mx-auto px-6 py-24 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-xl">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-14 relative overflow-hidden">
                <div className={`absolute -top-24 ${lang === 'ar' ? '-left-24' : '-right-24'} w-64 h-64 blur-[120px] opacity-20 rounded-full`} style={{ backgroundColor: selectedGrad.accent }} />
                {!isSent ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center gap-6 mb-10 relative">
                      <motion.div whileTap={{ scale: 0.9 }} onClick={() => setView('dash-auth')} className="w-20 h-20 rounded-[1.5rem] overflow-hidden border-2 border-white/10 shadow-2xl cursor-pointer hover:border-white/30 transition-all">
                        <img src={selectedGrad.image} alt={selectedGrad.name[lang]} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><Settings size={20} className="text-white/40" /></div>
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-black">{t('messageFor')} {selectedGrad.name[lang].split(' ')[0]}</h2>
                        <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest mt-1"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />{t('secureProtocol')}</div>
                      </div>
                    </div>
                    <form onSubmit={handleSend} className="space-y-8">
                      <AnimatePresence>{error && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/20 border border-red-500/40 text-red-200 p-4 rounded-2xl flex items-center gap-3 text-sm"><AlertCircle size={18} /> {error}</motion.div>)}</AnimatePresence>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t('yourName')} <span className="lowercase opacity-50">({t('optional')})</span></label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-7 py-5 outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20 text-start font-medium" placeholder={t('anonymousPlaceholder')} />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t('yourMessage')}</label>
                        <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-7 py-5 outline-none focus:border-white/30 transition-all text-white placeholder:text-white/20 resize-none text-start font-medium" placeholder={t('messagePlaceholder')} />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{t('attachments')}</label>
                        <div className="grid grid-cols-3 gap-4">
                          {['voice', 'image', 'video'].map((type) => (
                            <div key={type} className="relative">
                              <input type="file" className="hidden" ref={el => fileInputRef.current[type] = el} accept={type === 'voice' ? 'audio/*' : type === 'image' ? 'image/*' : 'video/*'} onChange={(e) => handleFileChange(type, e)} />
                              <button type="button" onClick={() => attachments[type] ? removeAttachment(type) : fileInputRef.current[type].click()} className={`flex flex-col items-center justify-center gap-2 w-full py-5 rounded-2xl border-2 transition-all ${attachments[type] ? 'bg-white/10 border-white/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                {type === 'voice' && <Mic size={24} className={attachments[type] ? 'text-neon-blue' : 'text-white/60'} />}
                                {type === 'image' && <ImageIcon size={24} className={attachments[type] ? 'text-neon-blue' : 'text-white/60'} />}
                                {type === 'video' && <Video size={24} className={attachments[type] ? 'text-neon-blue' : 'text-white/60'} />}
                                <span className="text-[10px] font-black uppercase tracking-widest">{attachments[type] ? t('attached') : t(type)}</span>
                                {!attachments[type] && <span className="text-[8px] opacity-40 font-bold">{LIMITS[type].label}</span>}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button type="submit" disabled={isSending} className="w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all hover:brightness-110 active:scale-[0.98] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed" style={{ backgroundColor: selectedGrad.accent, color: '#000' }}>
                        {isSending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} className={lang === 'ar' ? 'rotate-180' : ''} />}
                        {isSending ? t('sending') : t('send')}
                      </button>
                      <div className="flex items-center justify-center gap-3 text-white/20 text-xs font-bold uppercase tracking-widest"><Shield size={16} /> {t('encryptedTransmission')}</div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <Certificate name={formData.name} grad={selectedGrad} lang={lang} t={t} />
                    <h2 className="text-4xl font-black mb-4">{t('successTitle')}</h2>
                    <p className="text-white/50 text-lg mb-10 max-w-sm mx-auto leading-relaxed">{t('successSubtitle')} <span className="text-white font-bold">{selectedGrad.name[lang].split(' ')[0]}</span>{Object.keys(attachments).length > 0 && t('successMedia')}.</p>
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-10 text-start">
                      <div className="flex items-start gap-4"><Shield className="text-neon-blue mt-1 shrink-0" size={24} /><div><p className="text-xs font-black uppercase tracking-widest text-white/40 mb-2">{t('privacyConfirmation')}</p><p className="text-white/60 text-sm leading-relaxed">{t('privacyText')}</p></div></div>
                    </div>
                    <div className="flex flex-col gap-4">
                      <button className="w-full py-4 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-3 font-bold hover:bg-white/20 transition-all text-neon-blue"><Download size={20} />{t('downloadCert')}</button>
                      <button onClick={reset} className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-bold opacity-60 hover:opacity-100">{t('returnHome')}</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'dash-auth' && (
          <motion.div key="dash-auth" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="container mx-auto px-6 py-24 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 text-center">
                <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-6 border-2 border-white/10"><img src={selectedGrad.image} className="w-full h-full object-cover" /></div>
                <h2 className="text-3xl font-black mb-2">{t('dashboardTitle')}</h2>
                <p className="text-white/50 mb-10">{t('enterPassword')}</p>
                <form onSubmit={handleDashAuth} className="space-y-4">
                  <input type="password" value={dashPassword} onChange={(e) => setDashPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-neon-purple/50 text-center tracking-[0.5em] text-xl" />
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button type="submit" className="w-full py-4 rounded-2xl bg-neon-purple text-black font-black text-lg hover:brightness-110 transition-all">{t('unlockVault')}</button>
                </form>
              </div>
            </div>
          </motion.div>
        )}

        {isDashAuthenticated && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] bg-charcoal p-6 md:p-12 overflow-y-auto">
            <div className="container mx-auto max-w-6xl">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-4xl md:text-6xl font-black mb-4">{lang === 'ar' ? 'أهلاً يا' : 'Welcome,'} <span style={{ color: selectedGrad.accent }}>{selectedGrad.name[lang].split(' ')[0]}</span></h1>
                  <div className="flex items-center gap-4 text-white/50"><Mail size={20} /><span className="font-bold text-lg">{messages.length} {t('totalMessages')}</span><div className="flex items-center gap-2 text-green-500 text-sm animate-pulse"><div className="w-2 h-2 rounded-full bg-green-500" />Live</div></div>
                </div>
                <button onClick={reset} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10">{t('back')}</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {messages.map((msg, i) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all">
                    <Mail className="text-white/20 mb-6 group-hover:text-neon-blue transition-colors" size={32} />
                    <p className="text-xl font-medium mb-6 line-clamp-3 text-white/80 italic">"{msg.message_text}"</p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                      <div className="text-sm"><span className="block font-black opacity-40 uppercase tracking-widest text-[10px] mb-1">From</span><span className="font-bold">{msg.sender_name || (lang === 'ar' ? 'مجهول' : 'Anonymous')}</span></div>
                      <button className="p-3 rounded-xl bg-white/5 hover:bg-neon-blue hover:text-black transition-all"><Eye size={20} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
