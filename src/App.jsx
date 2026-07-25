import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "./i18n/I18nContext";
import { AuthProvider } from "./lib/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ServicesPage from "./pages/public/ServicesPage";
import ProjectsPage from "./pages/public/ProjectsPage";
import JobsPage from "./pages/public/JobsPage";
import EventsPage from "./pages/public/EventsPage";
import BlogPage from "./pages/public/BlogPage";
import BlogPostPage from "./pages/public/BlogPostPage";
import RentalsPage from "./pages/public/RentalsPage";
import LandPage from "./pages/public/LandPage";
import CommercePage from "./pages/public/CommercePage";
import ContactPage from "./pages/public/ContactPage";
import LegalPage from "./pages/public/LegalPage";
import NotFoundPage from "./pages/public/NotFoundPage";

import LoginPage from "./pages/admin/LoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import CollectionManagerPage from "./pages/admin/CollectionManagerPage";
import AdminApplicationsPage from "./pages/admin/AdminApplicationsPage";

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/a-propos" element={<AboutPage />} />
              <Route path="/activites" element={<ServicesPage />} />
              <Route path="/realisations" element={<ProjectsPage />} />
              <Route path="/carrieres" element={<JobsPage />} />
              <Route path="/evenements" element={<EventsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<BlogPostPage />} />
              <Route path="/location-maisons" element={<RentalsPage />} />
              <Route path="/vente-terrains" element={<LandPage />} />
              <Route path="/commerce-general" element={<CommercePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/mentions-legales" element={<LegalPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="applications" element={<AdminApplicationsPage />} />
              <Route path="collections/:key" element={<CollectionManagerPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}
