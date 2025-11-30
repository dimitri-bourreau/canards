'use client';

import { useGameStore } from '@/store/gameStore';

export default function Notifications() {
  const notifications = useGameStore((state) => state.notifications);
  const removeNotification = useGameStore((state) => state.removeNotification);
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification, index) => {
        const bgColors = {
          success: 'bg-forest-600/90 border-forest-400',
          warning: 'bg-amber-600/90 border-amber-400',
          danger: 'bg-coral-600/90 border-coral-400',
          info: 'bg-lake-600/90 border-lake-400',
        };
        
        return (
          <div
            key={notification.id}
            className={`
              ${bgColors[notification.type]}
              border backdrop-blur-md rounded-xl p-3 pr-10 
              animate-slide-up shadow-lg cursor-pointer
              transition-all duration-300 hover:scale-[1.02]
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => removeNotification(notification.id)}
          >
            <p className="text-cream-100 text-sm font-medium">
              {notification.message}
            </p>
            <button
              className="absolute top-2 right-2 text-cream-100/60 hover:text-cream-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}

