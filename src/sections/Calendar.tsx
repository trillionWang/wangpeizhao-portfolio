import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Build calendar grid
  const days: Array<{ day: number; isCurrent: boolean; isToday: boolean; isOtherMonth: boolean }> = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrent: false,
      isToday: false,
      isOtherMonth: true,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    days.push({ day: i, isCurrent: true, isToday, isOtherMonth: false });
  }

  // Next month days to fill grid
  const remaining = (7 - (days.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrent: false, isToday: false, isOtherMonth: true });
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151515] border border-gray-200/60 dark:border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#4ade80]" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-lg text-gray-500 dark:text-gray-400 hover:text-[#4ade80] hover:bg-[#4ade80]/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 dark:text-gray-500 py-1">
            {d}
          </div>
        ))}
        {days.map((d, i) => (
          <div
            key={i}
            className={`text-center text-sm py-1 rounded-lg transition-all ${
              d.isToday
                ? 'bg-[#4ade80] text-white font-semibold'
                : d.isOtherMonth
                ? 'text-gray-300 dark:text-gray-700'
                : 'text-gray-700 dark:text-gray-300 hover:bg-[#4ade80]/10 hover:text-[#4ade80] cursor-pointer'
            }`}
          >
            {d.day}
          </div>
        ))}
      </div>
    </div>
  );
}
