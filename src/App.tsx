import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { ScrollToTop } from '@/components/common';
import {
  HomePage,
  ServicesPage,
  PortfolioPage,
  ProjectDetailPage,
  AboutPage,
  ContactPage,
  PrivacyPolicyPage,
  TermsPage,
} from '@/pages';
import '@/i18n';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/privacidad" element={<PrivacyPolicyPage />} />
          <Route path="/terminos" element={<TermsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
