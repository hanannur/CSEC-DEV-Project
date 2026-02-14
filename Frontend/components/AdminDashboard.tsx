import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { 
  Users, FileText, Search, Settings, Shield, Plus, Upload, Trash2, 
  Landmark, Server, Database, Activity, Loader2, X, CheckCircle2, Menu 
} from 'lucide-react';
import api from '../services/api';

interface Props {
  user: User | null;
}

const AdminDashboard: React.FC<Props> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('docs');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [indexedChunks, setIndexedChunks] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state for mobile nav
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adminName = user?.name || 'Administrator';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append('document', file);
    try {
      const response = await api.post('/admin/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIndexedChunks(response.data.chunksIndexed);
      setUploadStatus('success');
      fetchDocuments();
      setTimeout(() => setUploadStatus('idle'), 5000);
    } catch (error) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove from knowledge base?')) return;
    try {
      await api.delete(`/admin/documents/${id}`);
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (error) { console.error(error); }
  };

 

  const stats = [
    { label: 'Knowledge Base', value: '1.2k Files', change: '+5%', icon: Database, color: 'text-teal-500', bg: 'bg-teal-50' },
  ];

  return (
    <div className="flex min-h-screen paper-texture dark:bg-teal-950 flex-col lg:flex-row">
      
      {/* --- MOBILE NAVIGATION --- */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-teal-900 border-b border-teal-100 dark:border-teal-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Database className="text-teal-500" size={24} />
          <span className="font-black text-teal-900 dark:text-teal-50 uppercase tracking-tighter">Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-teal-500"
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-4 md:p-8 lg:p-16 space-y-8 md:space-y-12 overflow-x-hidden w-full max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black font-display text-teal-950 dark:text-teal-50 leading-tight">Admin Dashboard</h1>
            <p className="text-teal-400 font-medium text-sm md:text-lg italic leading-tight">Welcome, {adminName} • ASTU Hub.</p>
          </div>
          
        </header>

        {activeTab === 'docs' ? (
          <div className="space-y-8 md:space-y-12">
            <div className="bg-[#f0f1e8] dark:bg-teal-900/30 p-6 md:p-12 rounded-3xl md:rounded-[4rem] border-2 border-white dark:border-teal-800 shadow-xl">
              <div className="mb-8 md:mb-12">
                <h3 className="text-2xl md:text-3xl font-black font-display text-teal-950 dark:text-teal-50">Source Management</h3>
                <p className="text-teal-600 dark:text-teal-400 font-medium text-sm md:text-lg">Knowledge Base indexing control.</p>
              </div>

              {/* --- UPLOAD ZONE --- */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 md:border-4 border-dashed border-teal-200 dark:border-teal-800 rounded-2xl md:rounded-[3rem] p-8 md:p-16 text-center space-y-6 hover:border-teal-400 bg-white/50 dark:bg-teal-950/20 transition-all cursor-pointer group"
              >
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" />

                {uploadStatus === 'uploading' ? (
                  <div className="space-y-4 animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-teal-500 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-lg">
                      <Loader2 size={32} className="animate-spin" />
                    </div>
                    <p className="text-lg md:text-2xl font-black font-display text-teal-900 dark:text-teal-50">Vectorizing...</p>
                  </div>
                ) : uploadStatus === 'success' ? (
                  <div className="space-y-4 text-teal-600 flex flex-col items-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-teal-500 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-lg">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-lg md:text-2xl font-black font-display">Indexed Successfully</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-teal-100 dark:bg-teal-800 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center mx-auto text-teal-700 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-lg">
                      <Upload size={32} />
                    </div>
                    <div>
                      <p className="text-lg md:text-2xl font-black font-display text-teal-900 dark:text-teal-50">Upload Documentation</p>
                      <p className="text-teal-500 font-medium text-xs md:text-base">Automatic OCR & Vectorization.</p>
                    </div>
                    <button className="px-6 py-3 md:px-10 md:py-4 bg-teal-800 text-white rounded-xl md:rounded-2xl shadow-xl font-black text-[10px] md:text-sm uppercase tracking-widest">
                      Browse pdf Files
                    </button>
                  </>
                )}
              </div>

              {/* --- DOCUMENT LIST --- */}
              <div className="mt-8 md:mt-12 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-4 md:mb-6">Uploaded Files</h4>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={40} className="animate-spin text-teal-500" />
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc, i) => (
                      <div key={doc._id || i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 bg-white dark:bg-teal-900 rounded-2xl md:rounded-3xl border border-teal-50 shadow-sm gap-4 group">
                        <div className="flex items-center gap-4 md:gap-6 w-full">
                          <div className="p-3 md:p-4 bg-clay-50 dark:bg-clay-900/40 rounded-xl md:rounded-2xl text-clay-500 shrink-0">
                            <FileText size={20} md:size={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm md:text-lg text-teal-950 dark:text-teal-50 truncate leading-tight">{doc.name}</p>
                            <p className="text-[10px] md:text-xs text-teal-400 font-bold uppercase tracking-wide mt-1">
                              {(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 md:gap-8">
                          <span className={`text-[9px] md:text-[10px] font-black px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl tracking-widest uppercase ${doc.status === 'Indexed' ? 'bg-teal-100 text-teal-700' : 'bg-clay-100 text-clay-700 animate-pulse'}`}>
                            {doc.status}
                          </span>
                          <button onClick={() => handleDelete(doc._id)} className="text-teal-200 hover:text-red-500 transition-colors">
                            <Trash2 size={20} md:size={22} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-teal-400 font-medium">No documents indexed.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-teal-900/50 p-6 md:p-8 rounded-2xl md:rounded-[3rem] border border-teal-50 dark:border-teal-800 shadow-sm">
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className={`${stat.bg} p-3 md:p-4 rounded-xl md:rounded-2xl ${stat.color}`}>
                      <stat.icon size={20} md:size={24} />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-black px-2 py-1 rounded-full tracking-widest uppercase bg-teal-50 text-teal-500">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-teal-300 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-2xl md:text-3xl font-black mt-2 font-display text-teal-950 dark:text-teal-50">{stat.value}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- MOBILE OVERLAY --- */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-teal-950/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
