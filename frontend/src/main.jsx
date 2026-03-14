import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BrowserRouter as Router } from 'react-router-dom'; // <--- ADD THIS
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Router>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </Router>
);
