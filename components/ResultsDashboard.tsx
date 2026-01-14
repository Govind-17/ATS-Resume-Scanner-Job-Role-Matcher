
import React, { useState } from 'react';
import { ResumeAnalysis } from '../types';
import ScoreChart from './ScoreChart';
import { CheckCircle2, XCircle, Briefcase, GraduationCap, Award, Lightbulb, Save, Check, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

interface ResultsDashboardProps {
  data: ResumeAnalysis;
  onReset: () => void;
  isDark?: boolean;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data, onReset, isDark = false }) => {
  const [isSaved, setIsSaved] = useState(false);
  
  // Aggregate skills by category with explicit type safety to avoid potential arithmetic errors in reduce
  const skillCounts: Record<string, number> = {};
  if (data.skills && Array.isArray(data.skills)) {
    data.skills.forEach(skill => {
      const cat = skill.category || 'Other';
      const currentValue = skillCounts[cat] ?? 0;
      skillCounts[cat] = currentValue + 1;
    });
  }

  const chartData = Object.entries(skillCounts)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value);

  const BAR_COLORS = isDark 
    ? ['#818cf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24']
    : ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  const handleSave = () => {
    try {
      localStorage.setItem('savedResumeAnalysis', JSON.stringify(data));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save to local storage", error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
           <ScoreChart score={data.atsScore} isDark={isDark} />
           <div className="text-center md:text-left space-y-2 flex-1">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                {data.candidateName || 'Candidate'}
              </h2>
              <div className="inline-flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-semibold">
                <Briefcase className="w-4 h-4 mr-2" />
                Best Fit: {data.bestRole}
              </div>
              <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm leading-relaxed">{data.summary}</p>
           </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={handleSave}
            className={`flex items-center justify-center px-6 py-2.5 rounded-lg font-medium transition-all duration-200 border ${
              isSaved 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 hover:border-indigo-200 dark:hover:border-indigo-800'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaved ? 'Saved!' : 'Save Analysis'}
          </button>
          <button 
            onClick={onReset}
            className="flex-shrink-0 px-6 py-2.5 bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Upload Another
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Skills Analysis Section */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
              <BarChart2 className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> Skills Distribution
            </h3>
            
            <div className="flex flex-col gap-8">
              {/* Chart */}
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={120} 
                      tick={{fill: isDark ? '#94a3b8' : '#475569', fontSize: 13, fontWeight: 500}} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}}
                      contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#ffffff',
                        borderRadius: '8px', 
                        border: isDark ? '1px solid #1e293b' : 'none', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        color: isDark ? '#f1f5f9' : '#1e293b'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tags */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                  <Award className="w-4 h-4 mr-2" /> Detected Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-default"
                      title={skill.category}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Experience & Education */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300 space-y-6">
             <div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> Experience Highlights
                </h4>
                <ul className="space-y-3">
                  {data.experienceHighlights.map((item, i) => (
                    <li key={i} className="flex items-start text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      <div className="min-w-1.5 min-h-1.5 w-1.5 h-1.5 mt-2 rounded-full bg-indigo-500 dark:bg-indigo-400 mr-3 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

               <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" /> Education
                </h4>
                <div className="space-y-2">
                  {data.education.map((edu, i) => (
                    <div key={i} className="flex items-center text-slate-700 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                      <span className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full mr-3"></span>
                      {edu}
                    </div>
                  ))}
                </div>
              </div>
          </div>

          {/* Detailed Feedback */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Strengths
              </h3>
              <ul className="space-y-3">
                {data.strengths.map((str, i) => (
                  <li key={i} className="flex items-start text-green-900 dark:text-green-300/80 text-sm">
                    <span className="mr-2 text-green-600 dark:text-green-500 font-bold">•</span> {str}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50/50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
              <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4 flex items-center">
                <XCircle className="w-5 h-5 mr-2" /> Weaknesses
              </h3>
              <ul className="space-y-3">
                {data.weaknesses.map((weak, i) => (
                  <li key={i} className="flex items-start text-red-900 dark:text-red-300/80 text-sm">
                    <span className="mr-2 text-red-600 dark:text-red-500 font-bold">•</span> {weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Right Column: Improvement Plan */}
        <div className="lg:col-span-1">
          <div className="bg-indigo-900 dark:bg-slate-900 text-white p-6 rounded-2xl shadow-lg border border-transparent dark:border-slate-800 sticky top-24 transition-all duration-300">
            <h3 className="text-xl font-bold mb-1 flex items-center text-white dark:text-indigo-400">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-300 dark:text-yellow-400" /> Improvement Plan
            </h3>
            <p className="text-indigo-200 dark:text-slate-400 text-sm mb-6">Actionable steps to increase your score.</p>
            
            <div className="space-y-4">
              {data.improvementSuggestions.map((tip, i) => (
                <div key={i} className="flex gap-4 p-3 bg-indigo-800/50 dark:bg-slate-800/50 rounded-lg border border-indigo-700/50 dark:border-slate-700 backdrop-blur-sm transition-transform hover:scale-[1.02]">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 dark:bg-indigo-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm text-indigo-50 dark:text-slate-200 leading-snug">
                    {tip}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-indigo-700/50 dark:border-slate-800 text-center">
              <p className="text-xs text-indigo-300 dark:text-slate-500 uppercase tracking-widest font-semibold mb-2">Total Score Impact</p>
              <div className="text-3xl font-bold text-white dark:text-indigo-400">+{Math.min(100 - data.atsScore, 25)} pts</div>
              <p className="text-xs text-indigo-300 dark:text-slate-500 mt-1">potential improvement</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsDashboard;
