import { useEffect } from 'react';
import useDailyTaskStore, { DAILY_TASK_META } from '../../store/dailyTaskStore';
import { useIcon } from '../../lib/icons';

const TOAST_DURATION_MS = 2000;

export default function DailyTaskToast() {
  const toast = useDailyTaskStore(s => s.toastQueue[0] ?? null);
  const dismissToast = useDailyTaskStore(s => s.dismissToast);
  const collectStarImg = useIcon('ui/collect_star.png');

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dismissToast(toast.id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [dismissToast, toast]);

  if (!toast) return null;

  const meta = DAILY_TASK_META[toast.difficulty] ?? DAILY_TASK_META.small;

  return (
    <div key={toast.id} className="daily-task-toast" style={{ '--daily-task-accent': meta.color }}>
      <div className="daily-task-toast__icon">
        <img src={collectStarImg} alt="" width={30} height={30} style={{ objectFit: 'contain' }} />
      </div>
      <div className="min-w-0">
        <div className="daily-task-toast__label">每日任务完成</div>
        <div className="daily-task-toast__title">{toast.title}</div>
      </div>
    </div>
  );
}
