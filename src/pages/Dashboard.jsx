import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Send } from 'lucide-react';
import { api } from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [options, setOptions] = useState([{ text: '' }, { text: '' }]);
  const [loading, setLoading] = useState(false);

  const addOption = () => setOptions([...options, { text: '' }]);

  const removeOption = (indexToRemove) => {
    if (options.length > 2) {
      setOptions(options.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pollData = { question, options, email };
      const response = await api.createPoll(pollData);
      
      const newPollId = response.pollId || response.id;
      const savedPolls = JSON.parse(localStorage.getItem('my_polls') || '[]');
      localStorage.setItem('my_polls', JSON.stringify([...savedPolls, newPollId]));

      // 💡 هنا التعديل: الانتقال لصفحة النتائج (مركز التحكم) فوراً
      navigate(`/results/${newPollId}`);
      
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إنشاء التصويت، تأكد من الاتصال بالإنترنت.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-lg border-2 border-primary-yellow">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-800 mb-2">إنشاء تصويت جديد ✨</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">سؤال التصويت</label>
          <input
            required
            type="text"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-pink outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="مثال: هل حبيتي التحدي؟"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-gray-700 mb-2">خيارات التصويت </label>
          {options.map((option, index) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-yellow outline-none transition-all bg-gray-50 focus:bg-white"
                  placeholder={`الخيار رقم ${index + 1}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="flex items-center gap-2 text-primary-pink font-bold text-sm hover:text-primary-pink-hover transition-colors mt-2 p-2 rounded-lg hover:bg-pink-50"
          >
            <Plus size={18} /> إضافة خيار جديد
          </button>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">إيميل استلام النتائج</label>
          <input
            required
            type="email"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-pink outline-none transition-all bg-gray-50 focus:bg-white"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-pink hover:bg-primary-pink-hover text-white font-black py-4 rounded-xl shadow-md transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2 text-lg mt-8"
        >
          {loading ? (
             <span className="animate-pulse">جاري إنشاء التصويت...</span>
          ) : (
            <>
              <span>إنشاء ونشر التصويت</span>
              <Send size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;