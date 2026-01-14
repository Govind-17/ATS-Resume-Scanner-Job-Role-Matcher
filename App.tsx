import React, { useState, useEffect } from 'react';
import { FileText, Loader2, AlertTriangle, CheckCircle2, Circle, History, Sun, Moon } from 'lucide-react';
import FileUpload from './components/FileUpload';
import ResultsDashboard from './components/ResultsDashboard';
import { AppStatus, FileData, ResumeAnalysis } from './types';

// Helper component for loading steps
const AnalysisStep = ({ label, completed, active }: { label: string, completed: boolean, active: boolean }) => (
  <div className={`flex items-center space-x-3 transition-all duration-300 ${active || completed ? 'opacity-100' : 'opacity-50'}`}>
    {completed ? (
      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
    ) : active ? (
      <div className="w-5 h-5 flex items-center justify-center">
        <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse" />
      </div>
    ) : (
      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-700 flex-shrink-0" />
    )}
    <span className={`text-sm font-medium ${completed ? 'text-slate-700 dark:text-slate-300' : active ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
      {label}
    </span>
  </div>
);

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysisData, setAnalysisData] = useState<ResumeAnalysis | null>(null);
  const [currentFile, setCurrentFile] = useState<FileData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [progress, setProgress] = useState(0);
  const [hasSavedData, setHasSavedData] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Handle theme application
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check for saved data when entering IDLE state
  useEffect(() => {
    if (status === AppStatus.IDLE) {
      const saved = localStorage.getItem('savedResumeAnalysis');
      setHasSavedData(!!saved);
    }
  }, [status]);

  // Handle Progress Simulation
  useEffect(() => {
    if (status !== AppStatus.ANALYZING) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const diff = 95 - prev;
        const increment = Math.max(0.2, diff / 40);
        return prev + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status]);

  const handleFileSelect = async (data: FileData) => {
    setCurrentFile(data);
    setStatus(AppStatus.ANALYZING);
    setErrorMessage(null);
    setLoadingMessage("Preparing document...");

    try {
      const result = await analyzeResume(data.base64, data.mimeType, (msg) => {
        setLoadingMessage(msg);
        if (msg.includes("Parsing")) setProgress((p) => Math.max(p, 10));
        if (msg.includes("Uploading")) setProgress((p) => Math.max(p, 20));
        if (msg.includes("Analyzing")) setProgress((p) => Math.max(p, 40));
      });

      setProgress(100);
      setTimeout(() => {
        setAnalysisData(result);
        setStatus(AppStatus.SUCCESS);
      }, 600);

    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  };

  const handleLoadSaved = () => {
    try {
      const saved = localStorage.getItem('savedResumeAnalysis');
      if (saved) {
        const parsed = JSON.parse(saved);
        setAnalysisData(parsed);
        setStatus(AppStatus.SUCCESS);
      }
    } catch (e) {
      console.error("Failed to load saved data", e);
      setErrorMessage("Could not load saved data.");
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setAnalysisData(null);
    setCurrentFile(null);
    setErrorMessage(null);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-950 dark:to-indigo-950/20 transition-colors duration-300">

      {/* Navigation / Header */}
      <nav className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              ResumeAI
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <span className="hidden md:inline text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">By Govind

            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {status === AppStatus.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12 animate-fade-in-up">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                Optimize Your Resume for <span className="text-indigo-600 dark:text-indigo-400">ATS Success</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your resume to get an instant ATS score, find your perfect role match, and receive AI-driven improvement tips.
              </p>
            </div>

            <div className="w-full flex flex-col items-center">
              <FileUpload onFileSelect={handleFileSelect} />

              {hasSavedData && (
                <button
                  onClick={handleLoadSaved}
                  className="mt-6 flex items-center px-5 py-2 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all text-sm font-medium shadow-sm"
                >
                  <History className="w-4 h-4 mr-2" />
                  Load Previous Analysis
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl w-full">
              {[
                { title: 'Smart Parsing', desc: 'Deep analysis of skills & experience' },
                { title: 'Role Matching', desc: 'Find the best job title for you' },
                { title: 'Actionable Advice', desc: 'Clear steps to boost your score' }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === AppStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 max-w-md w-full animate-fade-in transition-colors duration-300">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 rounded-full"></div>
                  <div className="relative bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-full">
                    <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Analyzing Resume</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[20px]">{loadingMessage}</p>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-8">
                <div
                  className="absolute top-0 left-0 h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Detailed Steps */}
              <div className="space-y-4 pl-2">
                <AnalysisStep
                  label="Parsing Document Structure"
                  completed={progress > 25}
                  active={progress <= 25}
                />
                <AnalysisStep
                  label="Extracting Skills & Experience"
                  completed={progress > 50}
                  active={progress > 25 && progress <= 50}
                />
                <AnalysisStep
                  label="Matching with Market Roles"
                  completed={progress > 75}
                  active={progress > 50 && progress <= 75}
                />
                <AnalysisStep
                  label="Generating ATS Score & Insights"
                  completed={progress > 95}
                  active={progress > 75}
                />
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && analysisData && (
          <ResultsDashboard data={analysisData} onReset={handleReset} isDark={theme === 'dark'} />
        )}

        {status === AppStatus.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-lg mx-auto animate-fade-in">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Analysis Failed</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              {errorMessage || "We couldn't analyze your resume. Please check the file format or try again later."}
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Try Again
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;