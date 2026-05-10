import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Brain, Activity, Zap, Trophy, Flame } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// --- FIREBASE CLOUD CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyD35KTrgFZ_xsqsQaeGUnwhWKJ6Tgg-5Q8",
  authDomain: "rbi-tracker.firebaseapp.com",
  projectId: "rbi-tracker",
  storageBucket: "rbi-tracker.firebasestorage.app",
  messagingSenderId: "6793297472",
  appId: "1:6793297472:web:56ff97a9eb9741331f69a5",
  // I have manually added this databaseURL format. If your sync fails, check your 
  // Firebase Realtime DB dashboard to ensure your URL matches this:
  databaseURL: "https://rbi-tracker-default-rtdb.firebaseio.com" 
};

// Initialize Cloud Connection
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Upgraded Schedule Array with Micro-Details (Week 1 fully populated)
const rawSchedule = [
  { 
    d: "May 11", w: 1, p: 1, 
    ga: { title: "GA Setup + CA", desc: "Download Affairscloud April 2026 monthly PDF. Read it cover to cover, highlight only banking/RBI/economy items. Create a notebook section for GA." },
    dw1: { title: "Reasoning: Intro to Puzzles", desc: "Watch 1 YouTube intro video on RBI Grade B reasoning pattern. Solve 5 easy linear seating arrangement puzzles from Testbook. Write steps in notebook." },
    dw2: { title: "ESI: NCERT Foundation", desc: "Start NCERT Class 11 'Indian Economic Development' — read Chapter 1 & Chapter 2. Note key dates and policy milestones." },
    arena: { title: "English Baseline Test", desc: "Take a free English section test on Testbook. Identify weakest areas: RC, cloze test, or error spotting. This sets your baseline." },
    review: { title: "RBI Basics & Day Review", desc: "Read 'About RBI' page on rbi.org.in. Note: founding year, HQs, governor, repo rates. Write 10 facts learned today. Download all free resources." }
  },
  { 
    d: "May 12", w: 1, p: 1, 
    ga: { title: "GA Daily Current Affairs", desc: "Read Affairscloud today's update. Focus: any RBI news, government scheme, economic data. Note 5 key facts in GA notebook." },
    dw1: { title: "Quant: DI Introduction", desc: "Watch a 30-min YouTube tutorial on bar graph DI. Then solve 2 bar graph DI sets from Oliveboard free section. Write approach for each." },
    dw2: { title: "ESI: NCERT Ch 3 & 4", desc: "Read Ch 3 (LPG Reforms) and Ch 4 (Poverty) from NCERT Class 11. Take structured notes: causes → measures → current status." },
    arena: { title: "Reasoning: Circular Seating", desc: "Study circular seating arrangement rules (facing centre vs outside). Solve 5 medium circular puzzles from Testbook." },
    review: { title: "Monetary Policy Deep-Dive", desc: "Study RBI's monetary policy tools: repo, reverse repo, CRR, SLR, MSF, OMO. Make a one-page cheat sheet with current values." }
  },
  { 
    d: "May 13", w: 1, p: 1, 
    ga: { title: "CA + Scheme Revision", desc: "Affairscloud daily. Then revise PM Jan Dhan Yojana, PM Mudra Yojana, PM SVANidhi — purpose, beneficiary, launch year, current stats." },
    dw1: { title: "Reasoning: Syllogism & Inequalities", desc: "Learn syllogism rules (All, Some, No). Solve 20 syllogism Qs + 15 inequality Qs from Testbook. These are easy marks." },
    dw2: { title: "ESI: NCERT Ch 5 & 6", desc: "Read Ch 5 (Human Capital) & Ch 6 (Rural Dev). Note: education spending % of GDP, rural credit sources, e-NAM, Kisan Credit Card." },
    arena: { title: "Quant: Pie Chart DI", desc: "Solve 2 pie chart DI sets. Practice percentage calculation speed. Aim: each DI set under 7 minutes." },
    review: { title: "Digital Payments Review", desc: "Study RTGS/NEFT/IMPS limits. NPCI products: UPI, RuPay, NACH. Write a comparison table." }
  },
  { 
    d: "May 14", w: 1, p: 1, 
    ga: { title: "CA + Banking Appointments", desc: "Affairscloud daily. Note all bank CEO/MD appointments in last 3 months. These appear in GA frequently." },
    dw1: { title: "Quant: Profit & Loss", desc: "Study P&L formulas (CP, SP, profit%, loss%, marked price, discount). Solve 30 mixed questions. Focus on speed." },
    dw2: { title: "GFM: RBI Functions & Institutions", desc: "Study RBI's 3 core roles. Then: NABARD, SIDBI, EXIM, NHB, NaBFID. Note mandate, established year, recent news." },
    arena: { title: "English & Reasoning Drill", desc: "10 cloze test Qs + 10 error spotting Qs. Then solve 5 Box-based puzzles (items in boxes, order/attributes)." },
    review: { title: "International Organisations", desc: "IMF, World Bank, WTO, ADB, BIS. Make HQ + function table. Memorise India's vote share in IMF." }
  },
  { 
    d: "May 15", w: 1, p: 1, 
    ga: { title: "CA + MPC Review", desc: "Affairscloud daily. Read the latest MPC policy statement on rbi.org.in. Note: stance, rate decision, reason, inflation forecast." },
    dw1: { title: "Reasoning: Blood Relations & Directions", desc: "Blood relation rules + 20 practice Qs. Direction sense: 15 Qs. Lock them in today." },
    dw2: { title: "GFM: Motivation Theories", desc: "Maslow's hierarchy, Herzberg's two-factor, McClelland's needs, Alderfer's ERG. Make a comparison table — MCQ gold." },
    arena: { title: "Quant & Hard Puzzles", desc: "Simple and compound interest formulas (25 Qs). Then 5 multi-variable puzzles (person + floor + colour). Draw grids." },
    review: { title: "Union Budget Highlights", desc: "Read PRS India's Budget summary. Note: fiscal deficit %, capital expenditure, top allocations, tax changes." }
  },
  { 
    d: "May 16", w: 1, p: 1, 
    ga: { title: "Week 1 GA Revision", desc: "Revise monetary policy cheat sheet, RBI functions, digital payments table, international orgs, budget. Do from memory." },
    dw1: { title: "MOCK TEST 1", desc: "Take your first full Phase I mock on Oliveboard. Exam conditions: no phone, strict 2-hr timer. It's a diagnostic." },
    dw2: { title: "Mock Analysis", desc: "Go through every wrong answer. Categorise mistakes: silly error / concept gap / time issue. Write weak-topic list." },
    arena: { title: "ESI First Essay Practice", desc: "Write 400-word essay: 'Impact of 1991 reforms on Indian economy.' Structure: intro → pre-reform → LPG impact → conclusion." },
    review: { title: "Plan Week 2", desc: "Compile weak spots from the mock and adjust your focus for the upcoming week." }
  },
  { 
    d: "May 17", w: 1, p: 1, isRest: true, msg: "SUNDAY REVISION: Revise NCERT Ch 1-6 and GFM Management evolution. Do a Static GK blitz with flashcards. Rest your mind." },

  // WEEK 2
  { d: "May 18", w: 2, p: 1, dw1: { title: "Caselet DI Intro", desc: "Solve 2 sets." }, dw2: { title: "Ramesh Singh Ch 1", desc: "Economic Concepts" } },
  { d: "May 19", w: 2, p: 1, dw1: { title: "Coding-Decoding", desc: "20 Qs" }, dw2: { title: "Ramesh Singh Ch 2", desc: "Poverty" } },
  { d: "May 20", w: 2, p: 1, dw1: { title: "Time & Work", desc: "30 Qs" }, dw2: { title: "Ramesh Singh Ch 3", desc: "Employment" } },
  { d: "May 21", w: 2, p: 1, dw1: { title: "Machine Input-Output", desc: "15 Qs" }, dw2: { title: "Ramesh Singh Ch 4", desc: "Agriculture" } },
  { d: "May 22", w: 2, p: 1, dw1: { title: "Speed-Time-Distance", desc: "30 Qs" }, dw2: { title: "Ethics Basics", desc: "Corporate Governance" } },
  { d: "May 23", w: 2, p: 1, dw1: { title: "MOCK TEST 2", desc: "Full Phase I" }, dw2: { title: "Mock Analysis", desc: "Deep review" } },
  { d: "May 24", w: 2, p: 1, isRest: true, msg: "SUNDAY REVISION: Revise Week 2 Notes and memorize squares/cubes." }
];

export default function App() {
  const [currentDayIdx, setCurrentDayIdx] = useState(0);
  const [progress, setProgress] = useState({});

  // --- FIREBASE CLOUD SYNC LOGIC ---
  useEffect(() => {
    // This connects to the cloud and listens for changes 24/7
    const progressRef = ref(db, 'user_progress');
    const unsubscribe = onValue(progressRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProgress(data);
      }
    });
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const toggleTask = (taskId) => {
    // 1. Update the screen instantly so it feels fast
    const newProgress = { ...progress, [taskId]: !progress[taskId] };
    setProgress(newProgress);
    
    // 2. Fire the updated data securely to the Firebase Cloud
    set(ref(db, 'user_progress'), newProgress);
  };

  const nextDay = () => {
    if (currentDayIdx < rawSchedule.length - 1) setCurrentDayIdx(prev => prev + 1);
  };

  const prevDay = () => {
    if (currentDayIdx > 0) setCurrentDayIdx(prev => prev - 1);
  };

  const currentDayData = rawSchedule[currentDayIdx];

  const getTasksForDay = (dayData, dIdx) => {
    if (dayData.isExam || dayData.isRest) {
      return [{ id: `d${dIdx}_special`, time: "All Day", title: dayData.msg, type: 'special' }];
    }
    return [
      { id: `d${dIdx}_0`, time: "06:00 AM", type: 'routine', title: dayData.ga?.title || "The Morning Primer", desc: dayData.ga?.desc || "General Awareness, Editorials, CA." },
      { id: `d${dIdx}_1`, time: "08:30 AM", type: 'physical', title: "PHYSICAL RESET", desc: "Workout, Bath, Breakfast. Zero screen time." },
      { id: `d${dIdx}_2`, time: "11:00 AM", type: 'core', title: dayData.dw1?.title || "Deep Work Block 1", desc: dayData.dw1?.desc || "Focus on primary analytical subject." },
      { id: `d${dIdx}_3`, time: "01:30 PM", type: 'routine', title: "LUNCH & NAP", desc: "Eat and rest your eyes." },
      { id: `d${dIdx}_4`, time: "02:30 PM", type: 'core', title: dayData.dw2?.title || "Deep Work Block 2", desc: dayData.dw2?.desc || "Focus on secondary subject or theory." },
      { id: `d${dIdx}_5`, time: "04:30 PM", type: 'routine', title: "TEA BREAK", desc: "Stretch, walk around." },
      { id: `d${dIdx}_6`, time: "05:00 PM", type: 'core', title: dayData.arena?.title || "The Arena", desc: dayData.arena?.desc || "Timed practice, sectional tests, or application." },
      { id: `d${dIdx}_7`, time: "07:00 PM", type: 'routine', title: dayData.review?.title || "The Autopsy", desc: dayData.review?.desc || "Review mistakes from today's drills. Make short notes." },
      { id: `d${dIdx}_8`, time: "08:00 PM", type: 'routine', title: "WIND DOWN", desc: "Dinner, relax, sleep by 10:30 PM." }
    ];
  };

  const tasks = getTasksForDay(currentDayData, currentDayIdx);
  const completedCount = tasks.filter(t => progress[t.id]).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0;
  const isPerfectDay = progressPercent === 100;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black p-0 sm:p-4 md:p-8 flex items-center justify-center font-sans text-slate-200 selection:bg-cyan-500/30">
      <div className="w-full max-w-7xl h-[100dvh] md:h-[90vh] flex flex-col md:flex-row bg-white/[0.03] backdrop-blur-2xl rounded-none sm:rounded-[2.5rem] shadow-none sm:shadow-[0_0_80px_rgba(0,0,0,0.6)] border-0 sm:border border-white/10 overflow-hidden relative">
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 hidden sm:block">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]"></div>
        </div>

        {/* LEFT/TOP PANE */}
        <div className="w-full md:w-2/5 lg:w-1/3 flex flex-col justify-between p-6 sm:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-white/10 bg-black/20 relative z-10 shrink-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text drop-shadow-sm border border-cyan-500/30 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-cyan-500/10">
                Phase {currentDayData.p} • Week {currentDayData.w}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-medium text-slate-400 bg-slate-900/50 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/5">
                <Flame size={12} className={isPerfectDay ? "text-orange-400" : "text-slate-500"} />
                Day {currentDayIdx + 1} of 75
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-lg mb-6 sm:mb-10 leading-tight">
              {currentDayData.d}
            </h1>

            <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-12">
              <button onClick={prevDay} disabled={currentDayIdx === 0} className="p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl disabled:opacity-30 transition-all duration-300 md:hover:-translate-x-1 border border-white/5 hover:border-white/20 group">
                <ChevronLeft size={24} className="text-cyan-400 group-hover:text-cyan-300" />
              </button>
              <button onClick={nextDay} disabled={currentDayIdx === rawSchedule.length - 1} className="p-3 sm:p-4 bg-white/5 hover:bg-white/10 rounded-xl sm:rounded-2xl disabled:opacity-30 transition-all duration-300 md:hover:translate-x-1 border border-white/5 hover:border-white/20 group">
                <ChevronRight size={24} className="text-cyan-400 group-hover:text-cyan-300" />
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 sm:mb-6">
              <div className="flex justify-between text-xs sm:text-sm mb-2 sm:mb-4">
                <span className="font-semibold text-slate-400 tracking-wide uppercase text-[10px] sm:text-xs">Mission Progress</span>
                <span className={`font-black tracking-wider text-lg sm:text-xl ${isPerfectDay ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-cyan-400'}`}>
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-900/80 rounded-full h-3 sm:h-4 overflow-hidden border border-white/5 shadow-inner">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isPerfectDay ? 'bg-gradient-to-r from-emerald-400 to-emerald-300' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>

            {isPerfectDay && (
              <div className="mt-4 sm:mt-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 animate-[pulse_3s_ease-in-out_infinite]">
                <Trophy className="text-emerald-400 shrink-0" size={24} />
                <span className="text-emerald-300 text-sm sm:text-base font-bold tracking-wide leading-tight">Perfect Day Achieved.<br className="hidden sm:block"/> Rest easy.</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT/BOTTOM PANE */}
        <div className="flex-1 w-full md:w-3/5 lg:w-2/3 p-4 sm:p-8 lg:p-12 overflow-y-auto custom-scrollbar relative z-10">
          <div className="space-y-3 sm:space-y-4 max-w-3xl pb-10">
            {tasks.map((task) => {
              const isDone = !!progress[task.id];
              const isSpecial = task.type === 'special';
              
              return (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`
                    relative group cursor-pointer rounded-xl sm:rounded-2xl p-5 sm:p-6 transition-all duration-300 border backdrop-blur-md
                    ${isDone 
                      ? 'bg-slate-900/40 border-emerald-500/20 opacity-60 hover:opacity-100' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] md:hover:-translate-y-1'
                    }
                    ${isSpecial ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 text-center py-8 sm:py-12' : ''}
                  `}
                >
                  <div className={`flex items-start gap-4 sm:gap-6 ${isSpecial ? 'justify-center flex-col items-center' : ''}`}>
                    
                    <div className="mt-1 shrink-0 relative">
                      {isDone ? (
                        <CheckCircle2 className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-transform duration-300 scale-110" size={24} />
                      ) : (
                        <div className="relative">
                          <Circle className="text-slate-600 transition-colors duration-300 group-hover:text-cyan-400" size={24} />
                          <div className="absolute inset-0 rounded-full border border-cyan-400 scale-150 opacity-0 group-hover:animate-ping hidden sm:block"></div>
                        </div>
                      )}
                    </div>

                    <div className={`flex-1 transition-all duration-300 ${isDone ? 'line-through decoration-slate-600 text-slate-500' : 'text-slate-200'}`}>
                      {!isSpecial && (
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <span className={`text-[10px] sm:text-xs font-bold tracking-wider px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg border ${isDone ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.1)]'}`}>
                            {task.time}
                          </span>
                          {task.type === 'core' && <Brain size={14} className={isDone ? 'text-slate-600' : 'text-purple-400'} />}
                          {task.type === 'physical' && <Zap size={14} className={isDone ? 'text-slate-600' : 'text-amber-400'} />}
                          {task.type === 'routine' && <Activity size={14} className={isDone ? 'text-slate-600' : 'text-blue-400'} />}
                        </div>
                      )}
                      
                      <h3 className={`font-bold tracking-wide ${isSpecial ? 'text-2xl sm:text-3xl text-indigo-300' : 'text-lg sm:text-xl'} mb-1 sm:mb-2`}>
                        {task.title}
                      </h3>
                      
                      {task.desc && (
                        <p className={`text-[0.85rem] sm:text-[0.95rem] leading-relaxed ${isDone ? 'text-slate-600' : 'text-slate-400 group-hover:text-slate-300'} transition-colors duration-300`}>
                          {task.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <p className="text-left text-cyan-500/50 text-[10px] sm:text-xs mt-6 sm:mt-12 tracking-widest uppercase font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Syncing live via Firebase Cloud
          </p>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}