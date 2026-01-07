import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import Container from '../components/layout/Container';
import { normalizeRole, ROLES } from '../utils/roleUtils';

const LoginPage = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(formData.usernameOrEmail, formData.password);
      success('تم تسجيل الدخول بنجاح');

      // Navigate based on role from response (not AuthContext state)
      const role = normalizeRole(response.user?.role);

      let targetRoute = '/';
      if (role === ROLES.ADMIN) {
        targetRoute = '/admin/dashboard';
      } else if (role === ROLES.EMPLOYEE) {
        targetRoute = '/employee/dashboard';
      }

      navigate(targetRoute, { replace: true });
    } catch (err) {
      if (err.message === 'INVALID_ROLE') {
        error('تعذر تحديد صلاحيات الحساب');
      } else {
        error('فشل تسجيل الدخول. تحقق من بياناتك');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="max-w-md mx-auto card p-8">
        <h1 className="text-3xl font-bold text-center mb-8">تسجيل الدخول</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="البريد الإلكتروني أو اسم المستخدم"
            value={formData.usernameOrEmail}
            onChange={(e) => setFormData({ ...formData, usernameOrEmail: e.target.value })}
            required
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري التسجيل...' : 'دخول'}
          </Button>
        </form>
        <p className="text-center mt-6">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-brand-primary font-semibold hover:underline">
            سجل الآن
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;

