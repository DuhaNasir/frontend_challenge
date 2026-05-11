# 🌟 VOTEAPP

🚀 **Live Demo:** [ضع رابط AWS هنا]

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