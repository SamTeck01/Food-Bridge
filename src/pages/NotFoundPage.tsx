import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col bg-bg">
    <Navbar />
    <main className="flex-1 flex items-center justify-center px-6 py-20">
      <div className="max-w-[480px] w-full flex flex-col items-center gap-6 text-center">
        {/* Giant 404 */}
        <div className="relative select-none">
          <span className="font-questrial text-[160px] leading-none text-brand-primary/10 font-bold">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-brand-primary/15 flex items-center justify-center">
              <span className="text-4xl">🍱</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-questrial text-2xl text-text-primary">Page Not Found</h1>
          <p className="font-questrial text-base text-text-secondary">
            Looks like this meal has already been claimed — or the page doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link to="/" className="btn-primary flex-1 gap-2">
            <Home size={18} /> Go Home
          </Link>
          <Link to="/listings" className="btn-outline flex-1 gap-2">
            <ArrowLeft size={18} /> Browse Food
          </Link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFoundPage;
