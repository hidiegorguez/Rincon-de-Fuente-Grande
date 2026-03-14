import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ScrollToTop } from '@/components/common';
import { AuthProvider } from '@/contexts';
import {
  HomePage,
  ServicesPage,
  PortfolioPage,
  ProjectDetailPage,
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
  LoginPage,
  RegisterPage,
  PortalPage,
  PortalProjectPage,
} from '@/pages';
import { useAuth } from '@/contexts';
import '@/i18n';

function AuthRedirectContact() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/portal" replace /> : <ContactPage />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/contacto" element={<AuthRedirectContact />} />
            <Route path="/privacidad" element={<PrivacyPolicyPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/portal" element={<PortalPage />} />
            <Route path="/portal/proyecto/:slug" element={<PortalProjectPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
