import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

/**
 * ConfirmModal - Reusable confirmation dialog for destructive actions
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'تأكيد العملية',
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'primary' : 'primary'}
            onClick={onConfirm}
            disabled={isLoading}
            className={isDestructive ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? 'جاري المعالجة...' : confirmText}
          </Button>
        </div>
      }
    >
      <p className="text-gray-700 text-base">{message}</p>
    </Modal>
  );
};

export default ConfirmModal;

