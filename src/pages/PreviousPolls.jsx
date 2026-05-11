import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import { Inbox, Loader2, Mail, ExternalLink, CheckCircle } from 'lucide-react';

const PreviousPolls = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const ids = JSON.parse(localStorage.getItem('my_polls') || '[]');
      if (ids.length === 0) { setLoading(false); return; }
      
      const data = await Promise.all(ids.map(id => api.getPoll(id).catch(() => null)));
      setPolls(data.filter(p => p !== null).reverse());
      setLoading(false);
    };
    fetch();
  }, []);

  const sendEmail = async (pollId) => {
    setSendingId(pollId);
    try { 
      await api.sendResults(pollId); 
      setSuccessId(pollId);
      setTimeout(() => setSuccessId(null), 3000);
    } catch{ 
      alert('فشل الإرسال'); 
    } finally { 
      setSendingId(null); 
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-primary-pink" size={40}/></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black text-gray-800 mb-8 flex items-center gap-2">تصويتات سابقة </h1>

      {polls.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border-2 border-dashed border-gray-200 text-center flex flex-col items-center">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">لا توجد تصويتات</h2>
          <Link to="/" className="bg-primary-pink hover:bg-primary-pink-hover text-white px-6 py-3 rounded-xl font-bold transition-colors mt-4">
            إنشاء أول تصويت
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => {
            const isSending = sendingId === (poll.pollId || poll.id);
            const isSuccess = successId === (poll.pollId || poll.id);

            return (
              <div key={poll.pollId || poll.id} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100 hover:border-primary-yellow transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 bottom-0 w-2 bg-primary-yellow"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pr-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{poll.question}</h3>
                    <div className="flex gap-4 text-sm font-bold text-gray-500">
                      <span className="bg-gray-50 px-3 py-1 rounded-lg">المصوتين: {poll.totalVotes || 0}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <Link to={`/results/${poll.pollId || poll.id}`} className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex-1 justify-center">
                      <ExternalLink size={16} /> النتائج
                    </Link>
                    <button onClick={() => sendEmail(poll.pollId || poll.id)} disabled={isSending || isSuccess} className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors flex-1 justify-center ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-primary-pink hover:bg-primary-pink-hover text-white'}`}>
                      {isSuccess ? <><CheckCircle size={16}/> تم الإرسال</> : isSending ? <><Loader2 size={16} className="animate-spin"/> جاري...</> : <><Mail size={16}/> إرسال النتائج</>}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PreviousPolls;