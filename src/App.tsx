import { Route, Routes } from 'react-router-dom';
import { Layout } from './layout/Layout';
import './App.css';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { SignUpPage } from './pages/SignUpPage';
import { VenuePage } from './pages/VenuePage';
import { AlertsProvider } from './components/Common/alerts/AlertsProvider';

function App() {
  return (
    <AlertsProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route
            path="/profile/:username/:section?"
            element={<ProfilePage />}
          />
          <Route path="venue/:venueId" element={<VenuePage />} />
          <Route
            path="*"
            element={
              <h1 className="text-center text-3xl font-large pt-10">
                404 Not Found
              </h1>
            }
          />
        </Route>
      </Routes>
    </AlertsProvider>
  );
}

export default App;
