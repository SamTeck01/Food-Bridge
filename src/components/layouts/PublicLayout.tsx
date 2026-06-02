import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Navbar from '../Navbar';

const PublicLayout = () => (
  <>
    <Navbar />
    <main><Outlet /></main>
    <Footer />
  </>
);
export default PublicLayout;