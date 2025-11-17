import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';
import Profile from './pages/Dashboard/Profile';

import { UserProvider } from "./context";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

        <Toaster
          toastOptions={{
            style: {
              fontSize: '13px'
            }
          }}
        />
      </Router>
    </UserProvider>
  );
}

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default App;
