import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <Container className="py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        <h1 className="text-4xl font-bold text-dark mb-4">الصفحة غير موجودة</h1>
        <p className="text-xl text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-5 h-5" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;

