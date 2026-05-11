import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { PlusCircle, History } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import PreviousPolls from './pages/PreviousPolls';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-900 font-sans">
        
        {/* هيدر حيوي وملون */}
        <nav className="bg-white border-b-4 border-primary-yellow sticky top-0 z-10 shadow-sm">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              
              <div className="flex space-x-8 rtl:space-x-reverse">
                <Link to="/" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary-pink transition-colors">
                  <PlusCircle size={20} className="text-primary-pink" /> إنشاء تصويت
                </Link>
                <Link to="/previous" className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary-pink transition-colors">
                  <History size={20} className="text-primary-pink" /> التصويتات السابقة
                </Link>
              </div>

            

            </div>
          </div>
        </nav>

        <main className="max-w-3xl mx-auto p-6 mt-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/previous" element={<PreviousPolls />} />
            <Route path="/vote/:id" element={<VotePage />} />
            <Route path="/results/:id" element={<ResultsPage />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;