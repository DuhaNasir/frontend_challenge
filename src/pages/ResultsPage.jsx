import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode, BarChart3, ArrowRight } from 'lucide-react';

const ResultsPage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // 👈 التعديل هنا: إجبار الرابط على أن يكون http واسم الموقع بدون أي إضافات أخرى
  const currentHost = window.location.host; 
  const pollLink = `http://${currentHost}/vote/${id}`;
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await api.getPoll(id);
        setPoll(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pollLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="text-center mt-20 text-primary-pink font-bold animate-pulse">جاري جلب بيانات التصويت...</div>;
  if (!poll) return <div className="text-center mt-20 text-red-500 font-bold">لم يتم العثور على التصويت.</div>;

  const totalVotes = poll.totalVotes || 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      
      {/* قسم المشاركة والباركود */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-primary-yellow grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-pink-100 text-primary-pink p-2 rounded-full"><QrCode size={20}/></span>
            <h2 className="font-black text-gray-800">شارك التصويت</h2>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={pollLink}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-600 outline-none text-left text-sm"
              dir="ltr"
            />
            <button
              onClick={handleCopy}
              className="bg-primary-pink hover:bg-primary-pink-hover text-white p-3 rounded-xl transition-all flex items-center justify-center min-w-[50px] shadow-sm transform hover:-translate-y-1 active:translate-y-0"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r-2 border-gray-50 pt-6 md:pt-0">
          <div className="p-3 bg-white border-4 border-primary-yellow rounded-2xl shadow-sm transform transition-transform hover:scale-105">
            <QRCodeSVG value={pollLink} size={130} level="H" fgColor="#1f2937" />
          </div>
        </div>
      </div>

      {/* قسم النتائج */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-gray-50">
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <BarChart3 className="text-primary-yellow" /> {poll.question}
          </h1>
          <span className="text-sm font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            الأصوات: {totalVotes}
          </span>
        </div>

        <div className="space-y-6">
          {poll.options?.map((option, index) => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            return (
              <div key={index} className="space-y-2 relative">
                <div className="flex justify-between text-sm font-bold text-gray-700 z-10 relative px-2">
                  <span>{option.text}</span>
                  <span>{percentage}% ({option.votes})</span>
                </div>
                <div className="w-full bg-gray-100 h-10 rounded-xl overflow-hidden absolute top-[-8px] left-0 right-0 z-0 opacity-40">
                  <div 
                    className="bg-primary-pink h-full transition-all duration-1000 ease-out" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Link to="/previous" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary-pink transition-colors">
          <ArrowRight size={18} /> العودة للتصويتات السابقة
        </Link>
      </div>

    </div>
  );
};

export default ResultsPage;