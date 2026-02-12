
import React, { useState } from 'react';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Users, FileText, Search, Settings, Shield, Plus, Upload, Trash2, Download, Landmark, Server, Database, Activity, Loader2, X, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useEffect, useRef } from 'react';

const dataBar = [
  { name: 'EECS', queries: 4000 },
  { name: 'Mech', queries: 3000 },
  { name: 'Chem', queries: 2000 },
  { name: 'Civil', queries: 2780 },
  { name: 'ጀማሪ', queries: 4890 },
];

const dataPie = [
  { name: 'Admissions', value: 400 },
  { name: 'Academics', value: 300 },
  { name: 'Labs', value: 300 },
  { name: 'Policy', value: 200 },
];

const COLORS = ['#556B2F', '#d57a66', '#b6c096', '#3c4a21'];

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
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('uploading');
    setIndexedChunks(null);
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
      console.error('Upload failed:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this document from the knowledge base?')) return;

    try {
      await api.delete(`/admin/documents/${id}`);
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const stats = [
    { label: 'Knowledge Base', value: '1.2k Files', change: '+5%', icon: Database, color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'Total Vectors', value: '450k', change: '+12k Today', icon: Activity, color: 'text-clay-500', bg: 'bg-clay-50' },
    { label: 'AI Accuracy', value: '98.5%', change: '+0.2%', icon: Search, color: 'text-teal-600', bg: 'bg-teal-100' },
    { label: 'System Health', value: '99.9%', change: 'Stable', icon: Server, color: 'text-teal-800', bg: 'bg-teal-200' },
  ];

  return (
    <div className="flex min-h-screen paper-texture dark:bg-teal-950">
      <aside className="w-80 border-r border-teal-100 dark:border-teal-800 glass hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-10 space-y-12">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-300">RAG Knowledge Hub</h4>
            <nav className="space-y-2">
              {[
                { id: 'docs', label: 'Knowledge Base', icon: FileText },
                { id: 'dashboard', label: 'System Overview', icon: Landmark },
                { id: 'users', label: 'Staff Registry', icon: Users },
                { id: 'analytics', label: 'AI Performance', icon: BarChart },
                { id: 'settings', label: 'API & Config', icon: Settings },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.8rem] transition-all font-bold text-sm ${activeTab === item.id
                    ? 'bg-teal-500 text-white shadow-xl shadow-teal-100 dark:shadow-none'
                    : 'hover:bg-teal-50 dark:hover:bg-teal-900 text-teal-400'
                    }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      <div className="flex-1 p-8 lg:p-16 space-y-12 overflow-x-hidden max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black font-display text-teal-950 dark:text-teal-50">Staff Hub</h1>
            <p className="text-teal-400 font-medium text-lg italic">Signed in as {adminName} • Registry Management Active.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-white rounded-2xl hover:bg-teal-600 shadow-xl font-bold text-xs uppercase tracking-widest">
              <Plus size={16} />
              Upload Source
            </button>
          </div>
        </header>

        {activeTab === 'docs' ? (
          <div className="space-y-12">
            <div className="bg-[#f0f1e8] dark:bg-teal-900/30 p-12 rounded-[4rem] border-2 border-white dark:border-teal-800 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <h3 className="text-3xl font-black font-display text-teal-950 dark:text-teal-50">Source Management</h3>
                  <p className="text-teal-600 dark:text-teal-400 font-medium text-lg">Central control for ASTU Knowledge Base indexing.</p>
                </div>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-teal-200 dark:border-teal-800 rounded-[3rem] p-16 text-center space-y-6 hover:border-teal-400 dark:hover:border-teal-600 transition-all cursor-pointer bg-white/50 dark:bg-teal-950/20 group relative overflow-hidden"
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                />

                {uploadStatus === 'uploading' ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="w-24 h-24 bg-teal-500 rounded-[2.5rem] flex items-center justify-center mx-auto text-white shadow-lg">
                      <Loader2 size={40} className="animate-spin" />
                    </div>
                    <p className="text-2xl font-black font-display text-teal-900 dark:text-teal-50">Vectorizing Document...</p>
                  </div>
                ) : uploadStatus === 'success' ? (
                  <div className="space-y-4 text-teal-600">
                    <div className="w-24 h-24 bg-teal-500 rounded-[2.5rem] flex items-center justify-center mx-auto text-white shadow-lg">
                      <CheckCircle2 size={40} />
                    </div>
                    <p className="text-2xl font-black font-display">Data Indexed Successfully</p>
                    {indexedChunks !== null && (
                      <p className="text-sm font-bold uppercase tracking-widest">{indexedChunks} Chunks Created</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-teal-100 dark:bg-teal-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-teal-700 group-hover:bg-teal-500 group-hover:text-white transition-all shadow-lg">
                      <Upload size={40} />
                    </div>
                    <div>
                      <p className="text-2xl font-black font-display text-teal-900 dark:text-teal-50">Drop Technical Documentation</p>
                      <p className="text-teal-500 font-medium">Automatic OCR & Vectorization upon upload.</p>
                    </div>
                    <button className="px-10 py-4 bg-teal-800 text-white rounded-2xl shadow-xl hover:bg-teal-900 transition-all font-black text-sm uppercase tracking-widest">
                      Browse pdf Files
                    </button>
                  </>
                )}
              </div>

              <div className="mt-12 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6">Knowledge Graph Index</h4>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 size={40} className="animate-spin text-teal-500" />
                  </div>
                ) : documents.length > 0 ? (
                  documents.map((doc, i) => (
                    <div key={doc._id || i} className="flex items-center justify-between p-6 bg-white dark:bg-teal-900 rounded-3xl shadow-sm border border-teal-50 transition-all hover:border-teal-200 group">
                      <div className="flex items-center gap-6">
                        <div className="p-4 bg-clay-50 dark:bg-clay-900/40 rounded-2xl text-clay-500">
                          <FileText size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-teal-950 dark:text-teal-50 leading-tight">{doc.name}</p>
                          <p className="text-xs text-teal-400 font-bold uppercase tracking-wide mt-1">
                            {(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <span
                          title={doc.errorMessage || ''}
                          className={`text-[10px] font-black px-4 py-2 rounded-xl tracking-widest uppercase cursor-help ${doc.status === 'Indexed' ? 'bg-teal-100 text-teal-700' : 'bg-clay-100 text-clay-700 animate-pulse'}`}
                        >
                          {doc.status}
                        </span>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="text-teal-200 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={22} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-teal-400 font-medium">
                    No documents indexed yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white dark:bg-teal-900/50 p-8 rounded-[3rem] border border-teal-50 dark:border-teal-800 shadow-sm transition-all hover:shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`${stat.bg} p-4 rounded-2xl ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase bg-teal-50 text-teal-500`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-teal-300 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                  <h3 className="text-3xl font-black mt-2 font-display text-teal-950 dark:text-teal-50">{stat.value}</h3>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 bg-white dark:bg-teal-900 p-12 rounded-[3.5rem] border border-teal-100 shadow-sm">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-2xl font-bold font-display">Inquiry Volume Analytics</h3>
                </div>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataBar}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#92a06c', fontSize: 10, fontWeight: 700 }} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#92a06c', fontSize: 10, fontWeight: 700 }} />
                      <Tooltip cursor={{ fill: '#f4f6f0' }} />
                      <Bar dataKey="queries" radius={[12, 12, 0, 0]}>
                        {dataBar.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#556B2F' : '#b6c096'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-teal-900 p-12 rounded-[3.5rem] border border-teal-100 shadow-sm">
                <h3 className="text-2xl font-bold font-display mb-10">Regional Documentation</h3>
                <div className="h-[280px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {dataPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {dataPie.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-teal-400 uppercase tracking-widest">{entry.name}</span>
                      </div>
                      <span className="text-teal-900 dark:text-teal-50">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

