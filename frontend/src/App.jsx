import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/Privacy';
import TermsConditions from './pages/TermCondition';
import RefundPolicy from './pages/RefundPolicy';
import GetInvolved from './pages/GetInvolved';
import Donate from './pages/Donate';
import Programs from './pages/Programs';
import Projects from './pages/Projects';
import Publications from './pages/Publications';
import MediaAndStories from './pages/MediaAndStories';
import ImpactAndEvidence from './pages/ImpactAndEvidence';
import Herosection from './components/Herosection';
import Testimonials from './pages/Testimonials';
import VolunteerForm from './pages/VolenteerForm';
import ProgramDetails from './pages/Programdetails';
import ProjectDetails from './pages/Projectdetails';
import PressCoverageDetails from './pages/PressCoverageDetails';
import PartnersSection from './components/Partners';




function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="termcondition" element={<TermsConditions />} />
          <Route path="refundpolicy" element={<RefundPolicy />} />
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="programs" element={<Programs />} />
          <Route path="programdetails/:slug" element={<ProgramDetails />} />

          <Route path="herosection" element={<Herosection/>} />
          <Route path="testimonials" element={<Testimonials/>} />
          <Route path="volunteerform" element={<VolunteerForm/>} />
          <Route path="projects" element={<Projects />} />
          <Route path="partners" element={<PartnersSection />} />
          <Route path="projectdetails/:slug" element={<ProjectDetails />} />
          <Route path="press-coverage/:slug" element={<PressCoverageDetails />} />
          <Route path="publications" element={<Publications />} />
          <Route path="media" element={<MediaAndStories />} />
          <Route path="impact" element={<ImpactAndEvidence />} />
          <Route path="contact" element={<Contact />} />
          <Route path="donate" element={<Donate />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
