# 🌟 VOTEAPP

🚀 **Live Demo:** http://voteapp-duha.s3-website.eu-north-1.amazonaws.com/

## 📂 هيكل المشروع (Project Structure)

```text
src/
├── services/
│   └── api.js              # الجسر الذي يربط الواجهات بـ AWS Backend
├── pages/
│   ├── Dashboard.jsx       # صفحة البداية (إنشاء التصويت)
│   ├── ResultsPage.jsx     # مركز التحكم (النتائج + الباركود + الرابط)
│   ├── VotePage.jsx        # الصفحة التي يراها الجمهور للتصويت
│   └── PreviousPolls.jsx   # سجل التصويتات وإرسال الإيميلات
├── App.jsx                 # مدير المسارات وتصميم الهيدر الملون
└── index.css               # إعدادات Tailwind والألوان
