📊 Daily Sales & Profit Tracker (AI Powered)
A smart, cloud-based web application designed for small business owners to track daily sales, expenses, and net profit with real-time currency conversion and AI-driven insights.

✨ Key Features
Cloud Data Storage: Powered by Firebase Firestore, ensuring your data is safely stored in the cloud and accessible from any device.

Real-time Financial Tracking: Automatically calculates total sales, total expenses, and net profit as you enter data.

Custom Currency Converter (MMK to USD): Integrated tool to convert your net profit into USD based on a customizable exchange rate.

Smart Auto-Suggestions: Remembers previously entered item names and suggests them to speed up data entry.

Daily AI Analysis: Provides an automated summary of your daily performance, highlighting profit margins and spending patterns.

Undo/Redo Functionality: Easily correct mistakes with a history-tracking system that lets you step back or forward.

Responsive UI with Dark Mode: A modern, mobile-friendly interface with a toggle for Light and Dark themes to reduce eye strain.

🛠 Tech Stack
Frontend: React.js (Vite)

Styling: Tailwind CSS

Database: Firebase Firestore

Icons: Lucide React

Hosting: Recommended for Vercel or Netlify

🚀 Setup & Installation
Clone the project:

Bash
git clone https://github.com/your-username/daily-sales-tracker.git
Install dependencies:

Bash
npm install firebase lucide-react
Configure Firebase:
Update the firebaseConfig object in App.js with your specific project credentials found in the Firebase Console.

Run the application:

Bash
npm run dev
🔒 Security & Rules
To ensure the app can write to the database during the initial setup, ensure your Firebase Rules are set to:

JavaScript
allow read, write: if true;
Note: For production use, it is highly recommended to implement Firebase Authentication and restrict data access to authorized users only.

📈 Roadmap
[ ] Export data to Excel/CSV.

[ ] Monthly and Yearly summary reports.

[ ] Multi-user account support.
