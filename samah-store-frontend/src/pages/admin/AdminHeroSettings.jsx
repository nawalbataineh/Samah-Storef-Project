import { useEffect, useState } from 'react';
import { heroApi } from '../../services/heroApi';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const AdminHeroSettings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    badgeText: '',
    titleLine1: '',
    titleLine2: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    heroImageUrl: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    loadHeroSettings();
  }, []);

  const loadHeroSettings = async () => {
    try {
      setLoading(true);
      const data = await heroApi.getAdminHero();
      setFormData({
        badgeText: data.badgeText || '',
        titleLine1: data.titleLine1 || '',
        titleLine2: data.titleLine2 || '',
        description: data.description || '',
        ctaText: data.ctaText || '',
        ctaLink: data.ctaLink || '',
        heroImageUrl: data.heroImageUrl || '',
      });
    } catch (error) {
      showToast('فشل تحميل إعدادات الهيرو', 'error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.badgeText.trim()) errors.badgeText = 'نص الشارة مطلوب';
    if (!formData.titleLine1.trim()) errors.titleLine1 = 'السطر الأول من العنوان مطلوب';
    if (!formData.titleLine2.trim()) errors.titleLine2 = 'السطر الثاني من العنوان مطلوب';
    if (!formData.description.trim()) errors.description = 'الوصف مطلوب';
    if (!formData.ctaText.trim()) errors.ctaText = 'نص الزر مطلوب';
    if (!formData.ctaLink.trim()) {
      errors.ctaLink = 'الرابط مطلوب';
    } else if (!formData.ctaLink.startsWith('/')) {
      errors.ctaLink = 'الرابط يجب أن يبدأ بـ /';
    }
    if (!formData.heroImageUrl.trim()) errors.heroImageUrl = 'رابط الصورة مطلوب';

    if (formData.badgeText.length > 60) errors.badgeText = 'الحد الأقصى 60 حرف';
    if (formData.titleLine1.length > 120) errors.titleLine1 = 'الحد الأقصى 120 حرف';
    if (formData.titleLine2.length > 120) errors.titleLine2 = 'الحد الأقصى 120 حرف';
    if (formData.description.length > 500) errors.description = 'الحد الأقصى 500 حرف';
    if (formData.ctaText.length > 40) errors.ctaText = 'الحد الأقصى 40 حرف';
    if (formData.ctaLink.length > 120) errors.ctaLink = 'الحد الأقصى 120 حرف';
    if (formData.heroImageUrl.length > 500) errors.heroImageUrl = 'الحد الأقصى 500 حرف';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await heroApi.updateHero(formData);
      showToast('تم تحديث إعدادات الهيرو بنجاح', 'success');
      loadHeroSettings(); // Reload to get updated data
    } catch (error) {
      const message = error.response?.data?.message || 'فشل حفظ الإعدادات';
      showToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors({ ...formErrors, [field]: null });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('يرجى اختيار ملف صورة', 'error');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم الملف يجب ألا يتجاوز 5 ميجابايت', 'error');
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      showToast('يرجى اختيار صورة أولاً', 'error');
      return;
    }

    try {
      setUploading(true);
      const result = await heroApi.uploadHeroImage(selectedFile);

      // Update form with returned URL
      setFormData({ ...formData, heroImageUrl: result.url });
      showToast('تم رفع الصورة بنجاح', 'success');

      // Clear file input and preview
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    } catch (error) {
      const message = error.response?.data?.error || 'فشل رفع الصورة';
      showToast(message, 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">جاري التحميل...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto" dir="rtl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">إعدادات قسم الهيرو (الصفحة الرئيسية)</h1>
          <p className="text-sm text-gray-600 mt-1">
            تحكم في محتوى القسم الرئيسي في الصفحة الرئيسية
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Badge Text */}
          <div>
            <Input
              label="نص الشارة (Badge)"
              value={formData.badgeText}
              onChange={(e) => handleChange('badgeText', e.target.value)}
              error={formErrors.badgeText}
              placeholder="مثال: مجموعة جديدة"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.badgeText.length} / 60</p>
          </div>

          {/* Title Line 1 */}
          <div>
            <Input
              label="السطر الأول من العنوان"
              value={formData.titleLine1}
              onChange={(e) => handleChange('titleLine1', e.target.value)}
              error={formErrors.titleLine1}
              placeholder="مثال: أناقة عصرية"
              maxLength={120}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.titleLine1.length} / 120</p>
          </div>

          {/* Title Line 2 */}
          <div>
            <Input
              label="السطر الثاني من العنوان (ملون)"
              value={formData.titleLine2}
              onChange={(e) => handleChange('titleLine2', e.target.value)}
              error={formErrors.titleLine2}
              placeholder="مثال: بلمسة مميزة"
              maxLength={120}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.titleLine2.length} / 120</p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="مثال: اكتشفي تشكيلتنا المختارة بعناية من الأزياء العصرية..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent transition ${
                formErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {formErrors.description && (
              <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{formData.description.length} / 500</p>
          </div>

          {/* CTA Text */}
          <div>
            <Input
              label="نص زر الحث على الإجراء (CTA)"
              value={formData.ctaText}
              onChange={(e) => handleChange('ctaText', e.target.value)}
              error={formErrors.ctaText}
              placeholder="مثال: تسوّقي الآن"
              maxLength={40}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.ctaText.length} / 40</p>
          </div>

          {/* CTA Link */}
          <div>
            <Input
              label="رابط الزر (CTA Link)"
              value={formData.ctaLink}
              onChange={(e) => handleChange('ctaLink', e.target.value)}
              error={formErrors.ctaLink}
              placeholder="مثال: /products"
              maxLength={120}
            />
            <p className="text-xs text-gray-500 mt-1">يجب أن يبدأ بـ / (مثال: /products أو /about)</p>
          </div>

          {/* Upload Hero Image */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              رفع صورة الهيرو من جهازك
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-rose-50 file:text-rose-700
                    hover:file:bg-rose-100"
                />
                <Button
                  type="button"
                  onClick={handleUploadImage}
                  disabled={!selectedFile || uploading}
                  className="whitespace-nowrap px-6"
                >
                  {uploading ? 'جاري الرفع...' : 'رفع الصورة'}
                </Button>
              </div>

              {selectedFile && (
                <p className="text-xs text-gray-600">
                  ملف محدد: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}

              {previewUrl && (
                <div>
                  <p className="text-xs text-gray-600 mb-2">معاينة قبل الرفع:</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}

              <p className="text-xs text-gray-500">
                الحد الأقصى: 5 ميجابايت | الصيغ المدعومة: PNG, JPG, JPEG, WEBP
              </p>
            </div>
          </div>

          {/* Hero Image URL (manual entry or external link) */}
          <div>
            <Input
              label="رابط صورة الهيرو (اختياري - للروابط الخارجية)"
              value={formData.heroImageUrl}
              onChange={(e) => handleChange('heroImageUrl', e.target.value)}
              error={formErrors.heroImageUrl}
              placeholder="مثال: /uploads/hero/image.jpg أو https://example.com/image.jpg"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              يتم تحديث هذا الحقل تلقائياً عند رفع صورة، أو يمكنك إدخال رابط خارجي يدوياً
            </p>
            {formData.heroImageUrl && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">معاينة الصورة:</p>
                <img
                  src={
                    formData.heroImageUrl.startsWith('http')
                      ? formData.heroImageUrl
                      : `${import.meta.env.VITE_API_BASE_URL || ''}${formData.heroImageUrl}`
                  }
                  alt="Hero Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3Eخطأ في تحميل الصورة%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="submit" disabled={submitting} className="px-6">
              {submitting ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={loadHeroSettings}
              disabled={submitting}
            >
              إعادة تحميل
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminHeroSettings;

