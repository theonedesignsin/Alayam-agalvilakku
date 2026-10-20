import { AnimatePresence, motion } from 'framer-motion';
import useUIStore from '../../store/uiStore';
import './Notification.css';

export default function Notification() {
  const notification = useUIStore((state) => state.notification);

  return (
    <div className="notification-container">
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification notification--${notification.type}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <span className="notification__icon">
              {notification.type === 'success' ? '✓' : 'ℹ'}
            </span>
            <span className="notification__text">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
