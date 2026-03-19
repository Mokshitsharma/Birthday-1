import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { 
  Heart, 
  Gift, 
  Music, 
  Music2, 
  Send, 
  RotateCcw, 
  ChevronRight, 
  Star, 
  MessageCircle,
  Laugh,
  Sparkles,
  Quote,
  Home,
  Gamepad2,
  BookHeart,
  Smile,
  ScrollText,
  PackageOpen,
  Menu,
  X,
  Clock,
  MapPin,
  Camera,
  Puzzle,
  Brain,
  ArrowRight,
  Lock,
  Timer,
  Hourglass
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
interface Question {
  q: string;
  options: string[];
  correct: number;
}

interface ChatMessage {
  sender: 'me' | 'bot';
  text: string;
}

// --- Constants ---
const SECTIONS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'games', label: 'Games', icon: Gamepad2 },
  { id: 'story', label: 'Love Story', icon: BookHeart },
  { id: 'fun', label: 'Fun Zone', icon: Smile },
  { id: 'shayari', label: 'Shayari', icon: ScrollText },
  { id: 'surprise', label: 'Surprise Box', icon: PackageOpen },
];

const QUIZ_QUESTIONS: Question[] = [
  { q: "What is my favorite food that we always eat together?", options: ["rasgulla", "kaju katli", "pizza", "burger"], correct: 3 },
  { q: "Where did we meet for the first time?", options: ["At a Cafe", "In College", "Through Friends", "At a Party"], correct: 1 },
  { q: "What is my special nickname for you?", options: ["Sweetie", "Princess", "Bubu", "Cutie"], correct: 3 },
  { q: "Which month did we start dating?", options: ["october", "august", "april", "march"], correct: 3 },
  { 
    q: "What do I love more? ❤️", 
    options: [
      "https://media.giphy.com/media/LdOyjZ7TC5K3L/giphy.gif", // Money
      "https://media.giphy.com/media/v6aOebdGSpUha/giphy.gif", // Driving
      "https://media.giphy.com/media/L4lvBzeIlpU8E/giphy.gif", // Kisses
      "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif"  // Fighting
    ], 
    correct: 2 
  },
];

const WHEEL_OPTIONS = ["Hug 🤗", "Kiss 😳", "Movie Date 🎬", "Food Date 🍕", "Apology 😤", "Surprise Gift 🎁"];

const SHAYARIS = [
  "Tumhari ek muskurahat hi kaafi hai,\nMeri duniya ko roshan karne ke liye. ❤️",
  "Mohabbat toh tumse hi thi, tumse hi hai,\nAur hamesha tumse hi rahegi. 🌹",
  "Zindagi mein sab kuch mil gaya,\nBas tumhara saath milna baaki tha. ✨",
  "Har pal tumhari yaad aati hai,\nJaise saanson ko hawa ki zaroorat hoti hai. 🥺"
];

const FUNNY_LINES = [
  "Mental peace? No, you are my mental piece! 😭",
  "We don't argue, we just update our anger software. 💀",
  "Our relationship status: 90% eating, 10% deciding what to eat. 🍕",
  "I love you more than I love annoying you... which is a lot! 😂"
];

const TIMELINE_EVENTS = [
  { date: "The Beginning", title: "First Talk", desc: "That first message that changed everything. I still remember how nervous I was!", icon: MessageCircle },
  { date: "Magical Moment", title: "First Meet", desc: "Seeing you for the first time was like a dream come true. You looked so beautiful.", icon: MapPin },
  { date: "The Spice", title: "First Fight", desc: "Even our fights show how much we care. It only brought us closer.", icon: Heart },
  { date: "Forever", title: "Special Moments", desc: "Every laugh, every tear, every pizza we shared... I cherish them all.", icon: Star },
];

// --- Components ---

const CountdownOverlay = ({ timeLeft }: { timeLeft: { days: number; hours: number; minutes: number; seconds: number } }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center space-y-12 max-w-2xl"
      >
        <div className="space-y-4">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-block"
          >
            <Hourglass className="text-pink-500 mx-auto" size={48} />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-serif italic text-white">
            Wait motu, kch accha hi milega... ❤️
          </h1>
          <p className="text-slate-400 font-display tracking-widest uppercase text-sm">
            Something special is brewing for you
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-0 bg-pink-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[120px]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={item.value}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="block text-3xl md:text-5xl font-mono font-bold text-pink-500"
                    >
                      {item.value.toString().padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <span className="block text-[10px] md:text-xs font-display uppercase tracking-widest text-slate-500">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="flex items-center justify-center gap-2 text-slate-500 text-sm font-display"
        >
          <Timer size={16} />
          <span>Counting down to March 23rd, 12:00 AM</span>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 opacity-20">
        <Heart className="text-pink-500" size={120} />
      </div>
      <div className="absolute top-10 right-10 opacity-10">
        <Star className="text-white" size={80} />
      </div>
    </div>
  );
};

const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; left: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 10,
      delay: Math.random() * 10,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="floating-heart text-pink-300 opacity-0"
          style={{
            left: heart.left,
            fontSize: `${heart.size}px`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${Math.random() * 5 + 5}s`
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toggleMusic = () => {
    if (!hasInteracted) setHasInteracted(true);
    setIsMusicPlaying(!isMusicPlaying);
  };

  const startApp = () => {
    setHasInteracted(true);
    setIsMusicPlaying(true);
    setCurrentGameIndex(0);
    setCurrentTimelineIndex(0);
    setCurrentFunIndex(0);
    setCurrentShayariIndex(0);
    setUnlockedSectionIndex(1);
    scrollTo('games');
  };

  // Love Game State
  const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
  const [yesBtnScale, setYesBtnScale] = useState(1);
  const [loveMsgIndex, setLoveMsgIndex] = useState(0);
  const loveMsgs = ["Are you sure? 🥺", "Think again ❤️", "Last chance 😭", "You can't escape love 😤", "I'll cry... 😭"];

  // Quiz State
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState<string | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'I miss you so much today... ❤️' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Catch My Love State
  const [fallingItems, setFallingItems] = useState<{ id: number; x: number; y: number; type: 'heart' | 'gold' | 'gift' }[]>([]);
  const [catchScore, setCatchScore] = useState(0);

  // Mood Detector State
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  // Sequential Games State
  const [currentGameIndex, setCurrentGameIndex] = useState(0);

  // Sequential Story State
  const [currentTimelineIndex, setCurrentTimelineIndex] = useState(0);

  // Sequential Fun State
  const [currentFunIndex, setCurrentFunIndex] = useState(0);

  // Sequential Shayari State
  const [currentShayariIndex, setCurrentShayariIndex] = useState(0);

  // Unlocked Sections State
  const [unlockedSectionIndex, setUnlockedSectionIndex] = useState(0);

  // Countdown State
  const [isLocked, setIsLocked] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const TARGET_DATE = new Date('2026-03-23T00:00:00').getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = TARGET_DATE - now;

      if (distance < 0) {
        setIsLocked(false);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Guess Memory State
  const [isMemoryRevealed, setIsMemoryRevealed] = useState(false);

  // Quiz Timer Effect
  useEffect(() => {
    let timer: any;
    if (activeSection === 'games' && !showQuizResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showQuizResult && activeSection === 'games') {
      setShowQuizResult(true);
    }
    return () => clearInterval(timer);
  }, [activeSection, showQuizResult, timeLeft]);

  // Catch My Love Game Loop
  useEffect(() => {
    if (activeSection !== 'games') return;
    const interval = setInterval(() => {
      setFallingItems(prev => [
        ...prev.map(item => ({ ...item, y: item.y + 5 })),
        { 
          id: Date.now() + Math.random(), 
          x: Math.random() * 90 + 5, 
          y: -10, 
          type: Math.random() > 0.8 ? 'gold' : Math.random() > 0.5 ? 'heart' : 'gift' 
        }
      ].filter(item => item.y < 110));
    }, 50);
    return () => clearInterval(interval);
  }, [activeSection]);

  const handleCatch = (id: number, type: 'heart' | 'gold' | 'gift') => {
    if (type === 'gold') {
      setCatchScore(prev => prev + 5);
      confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 } });
    } else {
      setCatchScore(prev => prev + 1);
    }
    setFallingItems(prev => prev.filter(item => item.id !== id));
  };

  const handleNoClick = () => {
    const x = Math.random() * 200 - 100;
    const y = Math.random() * 200 - 100;
    setNoBtnPos({ x, y });
    setYesBtnScale(prev => prev + 0.2);
    setLoveMsgIndex(prev => (prev + 1) % loveMsgs.length);
  };

  const handleYesClick = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#ffffff']
    });
  };

  const handleQuizAnswer = (index: number) => {
    if (index === QUIZ_QUESTIONS[currentQ].correct) {
      setScore(prev => prev + 1);
    }
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setTimeLeft(10);
    } else {
      setShowQuizResult(true);
    }
  };

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);
    const extraRounds = 5 + Math.random() * 5;
    const newRotation = rotation + extraRounds * 360;
    setRotation(newRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const normalizedRotation = newRotation % 360;
      const segmentSize = 360 / WHEEL_OPTIONS.length;
      const index = Math.floor((360 - (normalizedRotation % 360)) / segmentSize) % WHEEL_OPTIONS.length;
      setWheelResult(WHEEL_OPTIONS[index]);
    }, 3000);
  };

  const handleChatResponse = (type: 'cute' | 'angry' | 'ignore') => {
    let reply = "";
    let botResponse = "";
    if (type === 'cute') {
      reply = "I miss you more! ❤️";
      botResponse = "Aww, stop it! You're making me blush ☺️";
    } else if (type === 'angry') {
      reply = "Go away! I'm busy 😤";
      botResponse = "Someone is grumpy today... but I still love you! 🥺❤️";
    } else {
      reply = "...";
      botResponse = "Ignoring me? Fine, I'll just send more hearts! ❤️❤️❤️";
    }
    setChatMessages(prev => [...prev, { sender: 'me', text: reply }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1500);
  };

  const scrollTo = (id: string) => {
    const targetIndex = SECTIONS.findIndex(s => s.id === id);
    if (targetIndex > unlockedSectionIndex) return; // Prevent skipping ahead
    
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-pink-50/30 selection:bg-pink-200 selection:text-pink-900">
      <AnimatePresence>
        {isLocked && <CountdownOverlay timeLeft={countdown} />}
      </AnimatePresence>
      
      <FloatingHearts />
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-md border-b border-pink-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollTo('home')}
          >
            <Heart className="text-pink-500 fill-pink-500" size={28} />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Birthday Love
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {SECTIONS.map((sec, i) => {
              const isLocked = i > unlockedSectionIndex;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  disabled={isLocked}
                  className={`relative flex items-center gap-2 font-medium transition-all ${
                    isLocked ? 'text-slate-300 cursor-not-allowed' : 
                    activeSection === sec.id ? 'text-pink-600' : 'text-slate-500 hover:text-pink-600'
                  }`}
                >
                  {isLocked ? <Lock size={14} className="text-slate-300" /> : <sec.icon size={18} />}
                  {sec.label}
                  {activeSection === sec.id && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleMusic}
                className={`p-2 glass-card transition-all rounded-full ${isMusicPlaying ? 'text-pink-500 bg-pink-50' : 'text-slate-400'}`}
              >
                {isMusicPlaying ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                    <Music size={20} />
                  </motion.div>
                ) : (
                  <Music2 size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleMusic}
              className={`p-2 ${isMusicPlaying ? 'text-pink-500' : 'text-slate-400'}`}
            >
              {isMusicPlaying ? <Music size={20} /> : <Music2 size={20} />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-pink-600">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2 pb-4"
            >
              {SECTIONS.map((sec, i) => {
                const isLocked = i > unlockedSectionIndex;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.id)}
                    disabled={isLocked}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isLocked ? 'text-slate-300 cursor-not-allowed' :
                      activeSection === sec.id ? 'bg-pink-100 text-pink-600' : 'text-slate-600 hover:bg-pink-50'
                    }`}
                  >
                    {isLocked ? <Lock size={18} className="text-slate-300" /> : <sec.icon size={20} />}
                    {sec.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 origin-left" style={{ scaleX }} />
      </nav>

      {/* Now Playing Indicator */}
      {isMusicPlaying && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-20 right-6 z-[90] bg-white/80 backdrop-blur-sm border border-pink-100 px-3 py-1.5 rounded-full shadow-sm text-[10px] text-pink-500 font-medium flex items-center gap-2"
        >
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 bg-pink-500 rounded-full"
          />
          Now playing: My Honey Bunch Mode ❤️
        </motion.div>
      )}

      {/* Background Music (YouTube) */}
      {isMusicPlaying && hasInteracted && (
        <div className="hidden">
          <iframe 
            width="0" 
            height="0" 
            src="https://www.youtube.com/embed/h9nE2spOw_o?autoplay=1&loop=1&playlist=h9nE2spOw_o" 
            allow="autoplay"
          ></iframe>
        </div>
      )}

      {/* Autoplay Hint */}
      {hasInteracted && !isMusicPlaying && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-[100] bg-white/90 backdrop-blur-md border border-pink-100 px-4 py-2 rounded-full shadow-lg text-sm text-pink-600 font-medium flex items-center gap-2 cursor-pointer"
          onClick={toggleMusic}
        >
          <Music size={16} /> Click to play music! ❤️
        </motion.div>
      )}

      {/* --- Sections --- */}
      <main className="max-w-7xl mx-auto pt-24 px-4 pb-32">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.section 
              key="home"
              id="home" 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <motion.h1 
                  className="text-6xl md:text-8xl font-black text-pink-600 drop-shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  Happy Birthday <br /> My Love ❤️
                </motion.h1>
                <p className="text-2xl text-pink-400 font-medium italic max-w-2xl mx-auto">
                  "You are the best thing that ever happened to me. Today is all about you!"
                </p>
                <div className="flex gap-4 justify-center">
                  <button onClick={startApp} className="btn-romantic flex items-center gap-2 px-12 py-4 text-xl">
                    Start Your Birthday Journey! 🎮
                  </button>
                </div>
              </motion.div>
            </motion.section>
          )}

          {activeSection === 'games' && (
            <motion.section 
              key="games"
              id="games" 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-pink-600">The Fun Zone 🎮</h2>
                <p className="text-slate-500">Game {currentGameIndex + 1} of 7: Complete them all to unlock my heart!</p>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 w-8 rounded-full transition-all ${i <= currentGameIndex ? 'bg-pink-500' : 'bg-pink-100'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  {/* Game 1: YES/NO Love Game */}
                  {currentGameIndex === 0 && (
                    <motion.div 
                      key="game1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 text-center space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-pink-600">Do you love me? ❤️</h3>
                      <p className="text-pink-400 h-6">{loveMsgIndex > 0 ? loveMsgs[loveMsgIndex - 1] : "Be honest! 😉"}</p>
                      <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-4 min-h-[150px]">
                        <motion.button
                          onClick={() => { handleYesClick(); setCurrentGameIndex(1); }}
                          style={{ scale: yesBtnScale }}
                          className="btn-romantic"
                        >
                          YES! 🥰
                        </motion.button>
                        <motion.button
                          animate={{ x: noBtnPos.x, y: noBtnPos.y }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          onMouseEnter={handleNoClick}
                          onClick={handleNoClick}
                          className="btn-outline-romantic"
                        >
                          No 😢
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Game 2: Catch My Love */}
                  {currentGameIndex === 1 && (
                    <motion.div 
                      key="game2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 text-center space-y-4 relative overflow-hidden h-[500px]"
                    >
                      <h3 className="text-2xl font-bold text-pink-600">Catch My Love! 🎯</h3>
                      <p className="text-slate-500">Catch 10 items to proceed!</p>
                      <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Score: {catchScore}/10
                      </div>
                      <div className="relative w-full h-[300px]">
                        {fallingItems.map(item => (
                          <motion.button
                            key={item.id}
                            onClick={() => handleCatch(item.id, item.type)}
                            className="absolute text-2xl cursor-pointer"
                            style={{ left: `${item.x}%`, top: `${item.y}%` }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            {item.type === 'heart' ? '❤️' : item.type === 'gold' ? '💛' : '🎁'}
                          </motion.button>
                        ))}
                      </div>
                      {catchScore >= 10 && (
                        <motion.button 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setCurrentGameIndex(2)} 
                          className="btn-romantic w-full mt-4"
                        >
                          Next Game! 🚀
                        </motion.button>
                      )}
                    </motion.div>
                  )}

                  {/* Game 3: Quiz Game */}
                  {currentGameIndex === 2 && (
                    <motion.div 
                      key="game3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 space-y-6"
                    >
                      {!showQuizResult ? (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-pink-600">How well do you know me? 🧠</h3>
                            <div className="flex items-center gap-4">
                              <span className={`text-xl font-bold ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-pink-500'}`}>
                                {timeLeft}s
                              </span>
                              <span className="text-pink-400 font-bold">{currentQ + 1}/{QUIZ_QUESTIONS.length}</span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-pink-100 rounded-full overflow-hidden">
                            <motion.div 
                              animate={{ width: `${(timeLeft / 10) * 100}%` }}
                              className={`h-full ${timeLeft <= 3 ? 'bg-red-500' : 'bg-pink-500'}`}
                            />
                          </div>
                          <p className="text-lg font-medium text-slate-700">{QUIZ_QUESTIONS[currentQ].q}</p>
                          <div className={`grid gap-3 ${QUIZ_QUESTIONS[currentQ].options[0].startsWith('http') ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleQuizAnswer(i)}
                                className={`w-full text-left rounded-2xl border-2 border-pink-100 hover:border-pink-400 hover:bg-pink-50 transition-all text-slate-600 font-medium overflow-hidden ${
                                  opt.startsWith('http') ? 'p-0 aspect-square' : 'px-6 py-4'
                                }`}
                              >
                                {opt.startsWith('http') ? (
                                  <img src={opt} alt="Option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-6">
                          <h3 className="text-3xl font-bold text-pink-600">Quiz Finished! 🎉</h3>
                          <p className="text-xl">Score: <span className="font-bold text-pink-500">{score}/{QUIZ_QUESTIONS.length}</span></p>
                          <div className="flex flex-col gap-4">
                            <button onClick={() => {setShowQuizResult(false); setCurrentQ(0); setScore(0); setTimeLeft(10);}} className="btn-outline-romantic">
                              Try Again 🔄
                            </button>
                            <button onClick={() => setCurrentGameIndex(3)} className="btn-romantic">
                              Next Game! 🚀
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Game 4: Spin the Wheel */}
                  {currentGameIndex === 3 && (
                    <motion.div 
                      key="game4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 text-center space-y-8"
                    >
                      <h3 className="text-2xl font-bold text-pink-600">Wheel of Love 🎡</h3>
                      <div className="relative flex justify-center items-center">
                        <motion.div 
                          className="w-64 h-64 relative"
                          animate={{ rotate: rotation }}
                          transition={{ duration: 3, ease: "easeOut" }}
                        >
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {WHEEL_OPTIONS.map((opt, i) => {
                              const colors = ['#FFB7C5', '#FF9AA2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
                              const angle = 360 / WHEEL_OPTIONS.length;
                              const startAngle = i * angle;
                              const endAngle = (i + 1) * angle;
                              const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                              const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                              const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                              const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
                              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                              const textAngle = startAngle + angle / 2;
                              const tx = 50 + 32 * Math.cos((Math.PI * (textAngle - 90)) / 180);
                              const ty = 50 + 32 * Math.sin((Math.PI * (textAngle - 90)) / 180);
                              return (
                                <g key={i}>
                                  <path d={pathData} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="0.5" />
                                  <text x={tx} y={ty} fill="#642c44" fontSize="3" fontWeight="bold" textAnchor="middle" transform={`rotate(${textAngle}, ${tx}, ${ty})`}>
                                    {opt}
                                  </text>
                                </g>
                              );
                            })}
                            <circle cx="50" cy="50" r="4" fill="white" stroke="#ec4899" strokeWidth="2" />
                          </svg>
                        </motion.div>
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-pink-600 z-30" />
                      </div>
                      {wheelResult && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                          <p className="text-xl font-bold text-pink-600">Result: {wheelResult}</p>
                          <button onClick={() => setCurrentGameIndex(4)} className="btn-romantic w-full">
                            Next Game! 🚀
                          </button>
                        </motion.div>
                      )}
                      {!wheelResult && (
                        <button onClick={spinWheel} disabled={isSpinning} className="btn-romantic w-full">
                          {isSpinning ? 'Spinning...' : 'SPIN! 💫'}
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Game 5: Chat Simulator */}
                  {currentGameIndex === 4 && (
                    <motion.div 
                      key="game5"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-0 flex flex-col h-[500px] overflow-hidden"
                    >
                      <div className="bg-pink-500 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center text-pink-600 font-bold">M</div>
                          <h3 className="font-bold">Me (Your Love)</h3>
                        </div>
                        {chatMessages.length > 3 && (
                          <button onClick={() => setCurrentGameIndex(5)} className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30 transition-all">
                            Next Game 🚀
                          </button>
                        )}
                      </div>
                      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/50">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'me' ? 'bg-pink-500 text-white' : 'bg-white text-slate-700'}`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {isTyping && <div className="text-xs text-slate-400 italic">typing...</div>}
                      </div>
                      <div className="p-4 bg-white border-t border-pink-100 flex flex-wrap gap-2 justify-center">
                        <button onClick={() => handleChatResponse('cute')} className="px-3 py-1 bg-pink-50 text-pink-500 rounded-full text-xs border border-pink-200">Cute ❤️</button>
                        <button onClick={() => handleChatResponse('angry')} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs border border-slate-200">Angry 😤</button>
                        <button onClick={() => handleChatResponse('ignore')} className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs border border-slate-200">Ignore</button>
                      </div>
                    </motion.div>
                  )}

                  {/* Game 6: Mood Detector */}
                  {currentGameIndex === 5 && (
                    <motion.div 
                      key="game6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 text-center space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-pink-600">Mood Detector 😄</h3>
                      <p className="text-slate-500">How are you feeling right now?</p>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { m: 'Happy 😄', r: 'Yay! Your smile makes my day! ❤️' },
                          { m: 'Angry 😤', r: 'Oh no, who hurt my baby? I will fight them! 🥊' },
                          { m: 'Sad 🥺', r: 'Come here, let me give you a big warm hug! 🤗' },
                          { m: 'Hungry 🍕', r: 'Order whatever you want, my treat! (In your dreams lol) 💀' }
                        ].map(item => (
                          <button 
                            key={item.m} 
                            onClick={() => setSelectedMood(item.r)}
                            className="p-4 rounded-2xl bg-pink-50 hover:bg-pink-100 transition-all text-pink-600 font-bold border border-pink-200"
                          >
                            {item.m}
                          </button>
                        ))}
                      </div>
                      <AnimatePresence>
                        {selectedMood && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <p className="text-pink-500 font-medium italic">{selectedMood}</p>
                            <button onClick={() => setCurrentGameIndex(6)} className="btn-romantic w-full">
                              Next Game! 🚀
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Game 7: Guess the Memory */}
                  {currentGameIndex === 6 && (
                    <motion.div 
                      key="game7"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 text-center space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-pink-600">Guess the Memory 📸</h3>
                      <p className="text-slate-500">Do you remember this moment?</p>
                      <div className="relative aspect-video rounded-2xl overflow-hidden group">
                        <img 
                          src="https://picsum.photos/seed/couple/800/450" 
                          alt="Memory" 
                          className={`w-full h-full object-cover transition-all duration-700 ${isMemoryRevealed ? 'blur-0' : 'blur-xl'}`}
                          referrerPolicy="no-referrer"
                        />
                        {!isMemoryRevealed && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <button onClick={() => setIsMemoryRevealed(true)} className="btn-romantic">Reveal Moment ✨</button>
                          </div>
                        )}
                      </div>
                      {isMemoryRevealed && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                          <p className="text-pink-500 italic">
                            "This was the day I realized I never want to let you go. ❤️"
                          </p>
                          <button onClick={() => { setUnlockedSectionIndex(2); scrollTo('story'); }} className="btn-romantic w-full flex items-center justify-center gap-2">
                            More gifts ahead! 🎁 <ArrowRight size={20} />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {activeSection === 'story' && (
            <motion.section 
              key="story"
              id="story" 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-pink-600">Our Journey 💌</h2>
                <p className="text-slate-500">Step {currentTimelineIndex + 1} of {TIMELINE_EVENTS.length}: Every moment with you is special.</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTimelineIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card p-8 space-y-6 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-pink-500 text-white flex items-center justify-center mx-auto shadow-lg">
                      {React.createElement(TIMELINE_EVENTS[currentTimelineIndex].icon, { size: 40 })}
                    </div>
                    <div className="space-y-2">
                      <span className="text-pink-400 font-bold">{TIMELINE_EVENTS[currentTimelineIndex].date}</span>
                      <h4 className="text-3xl font-bold text-pink-600">{TIMELINE_EVENTS[currentTimelineIndex].title}</h4>
                      <p className="text-slate-600 text-lg leading-relaxed">{TIMELINE_EVENTS[currentTimelineIndex].desc}</p>
                    </div>

                    <div className="pt-6">
                      {currentTimelineIndex < TIMELINE_EVENTS.length - 1 ? (
                        <button 
                          onClick={() => setCurrentTimelineIndex(prev => prev + 1)}
                          className="btn-romantic w-full flex items-center justify-center gap-2"
                        >
                          Next Memory 📸 <ArrowRight size={20} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setUnlockedSectionIndex(3); scrollTo('fun'); }}
                          className="btn-romantic w-full flex items-center justify-center gap-2"
                        >
                          Proceed to Laughs! 😂 <ArrowRight size={20} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {activeSection === 'fun' && (
            <motion.section 
              key="fun"
              id="fun" 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-pink-600">Fun Zone 😂</h2>
                <p className="text-slate-500">Step {currentFunIndex + 1} of 3: Laughter is the secret ingredient of our love.</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  {currentFunIndex === 0 && (
                    <motion.div 
                      key="fun0"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 space-y-6 text-center"
                    >
                      <h4 className="text-3xl font-bold text-pink-600 flex items-center justify-center gap-2"><Laugh size={32} /> Couple Jokes</h4>
                      <div className="space-y-4">
                        {FUNNY_LINES.map((line, i) => (
                          <p key={i} className="p-4 bg-pink-50 rounded-xl text-slate-700 text-lg italic">"{line}"</p>
                        ))}
                      </div>
                      <button 
                        onClick={() => setCurrentFunIndex(1)}
                        className="btn-romantic w-full flex items-center justify-center gap-2"
                      >
                        Next Fun Bit! 🍕 <ArrowRight size={20} />
                      </button>
                    </motion.div>
                  )}

                  {currentFunIndex === 1 && (
                    <motion.div 
                      key="fun1"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 space-y-6 text-center"
                    >
                      <h4 className="text-3xl font-bold text-pink-600 flex items-center justify-center gap-2"><Smile size={32} /> Foodie Love</h4>
                      <div className="space-y-6">
                        <p className="text-slate-700 text-xl leading-relaxed">"I love you more than pizza, but please don't make me prove it." 🍕</p>
                        <p className="text-slate-700 text-xl leading-relaxed">"Our 40k monthly food bill is just an investment in our happiness." 💀</p>
                      </div>
                      <button 
                        onClick={() => setCurrentFunIndex(2)}
                        className="btn-romantic w-full flex items-center justify-center gap-2"
                      >
                        Next Fun Bit! ✨ <ArrowRight size={20} />
                      </button>
                    </motion.div>
                  )}

                  {currentFunIndex === 2 && (
                    <motion.div 
                      key="fun2"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-card p-8 space-y-6 text-center"
                    >
                      <h4 className="text-3xl font-bold text-pink-600 flex items-center justify-center gap-2"><Sparkles size={32} /> Cute Vibes</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <img src="https://media.giphy.com/media/108M2giQXSWUeI/giphy.gif" alt="Cute" className="rounded-2xl aspect-square object-cover shadow-md" referrerPolicy="no-referrer" />
                        <img src="https://media.giphy.com/media/MDJ9IbZYvvU22zGuQC/giphy.gif" alt="Cute" className="rounded-2xl aspect-square object-cover shadow-md" referrerPolicy="no-referrer" />
                        <img src="https://media.giphy.com/media/Z576629MAtM76/giphy.gif" alt="Cute" className="rounded-2xl aspect-square object-cover shadow-md" referrerPolicy="no-referrer" />
                        <img src="https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif" alt="Cute" className="rounded-2xl aspect-square object-cover shadow-md" referrerPolicy="no-referrer" />
                      </div>
                      <button 
                        onClick={() => { setUnlockedSectionIndex(4); scrollTo('shayari'); }}
                        className="btn-romantic w-full flex items-center justify-center gap-2"
                      >
                        Dil Ki Baat... 📜 <ArrowRight size={20} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {activeSection === 'shayari' && (
            <motion.section 
              key="shayari"
              id="shayari" 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-16"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-pink-600">Dil Se... 📜</h2>
                <p className="text-slate-500">Shayari {currentShayariIndex + 1} of {SHAYARIS.length}: Words that come straight from my heart.</p>
              </div>

              <div className="max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentShayariIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card p-12 text-center space-y-8"
                  >
                    <Quote className="mx-auto text-pink-200" size={48} />
                    <p className="text-3xl text-slate-700 italic leading-relaxed whitespace-pre-line">
                      {SHAYARIS[currentShayariIndex]}
                    </p>
                    
                    <div className="pt-8">
                      {currentShayariIndex < SHAYARIS.length - 1 ? (
                        <button 
                          onClick={() => setCurrentShayariIndex(prev => prev + 1)}
                          className="btn-romantic w-full flex items-center justify-center gap-2"
                        >
                          Next Shayari 📜 <ArrowRight size={20} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => { setUnlockedSectionIndex(5); scrollTo('surprise'); }}
                          className="btn-romantic w-full flex items-center justify-center gap-2"
                        >
                          The Final Surprise! 🎁 <ArrowRight size={20} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {activeSection === 'surprise' && (
            <motion.section 
              key="surprise"
              id="surprise" 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-pink-600">The Final Surprise 🎁</h2>
                <p className="text-slate-500">You've reached the end of this little world.</p>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card p-12 max-w-2xl space-y-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-rose-500" />
                <Heart className="mx-auto text-pink-500 animate-pulse" size={64} fill="currentColor" />
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-pink-600">To My Everything ❤️</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    "You are my happiness, my chaos, and my peace. Every moment with you is a gift, 
                    and I am so lucky to call you mine. On your birthday, I want you to know 
                    that you are the most special person in my life."
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
                    }}
                    className="btn-romantic w-full text-xl py-6"
                  >
                    One Last Surprise! ✨
                  </motion.button>
                </div>
              </motion.div>

              <button 
                onClick={() => {
                  setCurrentGameIndex(0);
                  setCurrentTimelineIndex(0);
                  setCurrentFunIndex(0);
                  setCurrentShayariIndex(0);
                  setUnlockedSectionIndex(0);
                  scrollTo('home');
                }}
                className="flex items-center gap-2 text-pink-400 hover:text-pink-600 transition-all font-bold"
              >
                <RotateCcw size={20} /> Back to Start
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-pink-300 text-sm border-t border-pink-100 bg-white/50">
        Made with ❤️ just for you | Happy Birthday! 🎂
      </footer>
    </div>
  );
}
