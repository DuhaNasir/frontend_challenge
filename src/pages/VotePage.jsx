import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Share2, Users, Check, Loader2, QrCode } from 'lucide-react';

const VotePage = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await api.getPoll(id);
        setPoll(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (selectedOption === null) return;
    setIsVoting(true);
    try {
      await api.vote(id, selectedOption);
      setHasVoted(true);
    } catch  {
      alert('حدث خطأ. حاول مرة أخرى.');
    } finally {
      setIsVoting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader2 className="animate-spin text-primary-pink" size={40}/></div>;
  if (!poll) return <div className="text-center mt-20 text-red-500 font-bold">التصويت غير موجود.</div>;

  const totalVotes = poll.totalVotes || 0;

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-3xl shadow-lg border-2 border-primary-yellow animate-fade-in">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-50 pb-4">
        <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
          <Users size={18} />
          <span className="text-sm font-bold">المصوتين: {totalVotes + (hasVoted ? 1 : 0)}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowQR(!showQR)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors text-sm font-bold ${showQR ? 'bg-primary-yellow text-gray-800' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'}`}>
            <QrCode size={18} /> باركود
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 text-primary-pink hover:text-white bg-pink-50 hover:bg-primary-pink px-3 py-1.5 rounded-xl transition-colors text-sm font-bold">
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
        </div>
      </div>

      {showQR && (
        <div className="flex justify-center mb-8 p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 animate-fade-in">
          <QRCodeSVG value={window.location.href} size={120} level="H" fgColor="#1f2937" />
        </div>
      )}

      {hasVoted ? (
        <div className="text-center py-10 animate-fade-in">
          <div className="inline-block bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">شكراً لمشاركتك! 🎉</h2>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-black text-gray-800 mb-8 leading-relaxed text-center">{poll.question}</h1>
          <div className="space-y-3 mb-8">
            {poll.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`w-full text-right px-5 py-4 rounded-xl border-2 transition-all font-bold text-lg
                  ${selectedOption === index 
                    ? 'border-primary-pink bg-pink-50 text-primary-pink scale-[1.02] shadow-sm' 
                    : 'border-gray-100 bg-gray-50 text-gray-700 hover:border-primary-yellow hover:bg-yellow-50/30'
                  }
                `}
              >
                {option.text}
              </button>
            ))}
          </div>
          <button
            onClick={handleVote}
            disabled={selectedOption === null || isVoting}
            className={`w-full py-4 rounded-xl font-black text-lg transition-all flex justify-center items-center gap-2
              ${selectedOption !== null
                ? 'bg-primary-pink hover:bg-primary-pink-hover text-white shadow-md transform hover:-translate-y-1' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {isVoting ? <Loader2 className="animate-spin" size={24} /> : 'تأكيد التصويت'}
          </button>
        </>
      )}
    </div>
  );
};

export default VotePage;