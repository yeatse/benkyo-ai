import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useGameStore from '../store/gameStore';
import LessonScreen from '../components/Lesson/LessonScreen';

export default function CourseReviewPracticePage() {
  const navigate = useNavigate();
  const lesson = useGameStore(s => s.lesson);

  useEffect(() => {
    if (!lesson || lesson.levelId !== 'course-review') {
      navigate('/vocab', { replace: true });
    }
  }, [lesson, navigate]);

  if (!lesson || lesson.levelId !== 'course-review') return null;

  return (
    <div className="flex h-full flex-col">
      <LessonScreen />
    </div>
  );
}
