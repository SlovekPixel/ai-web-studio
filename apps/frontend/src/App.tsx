import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { DashboardPage } from '~/pages/admin/DashboardPage';
import { HomePage } from '~/pages/user/HomePage';
import { LoginPage } from '~/pages/user/LoginPage';
import { RegisterPage } from '~/pages/user/RegisterPage';

export function App() {
  return (
    <BrowserRouter>
      <main className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
