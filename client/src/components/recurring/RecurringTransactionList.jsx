import React from 'react';
import RecurringTransactionCard from './RecurringTransactionCard';
import { CalendarClock } from 'lucide-react';
import { Button } from '../common/Button';

export const RecurringTransactionList = ({ schedules, onEdit, onDelete, onPause, onResume, onAddSchedule }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-panel rounded-2xl border border-slate-800">
        <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <CalendarClock className="w-8 h-8 text-indigo-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Recurring Transactions</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Set up automatic tracking for your rent, subscriptions, or paycheck.
        </p>
        <Button onClick={onAddSchedule} variant="primary">
          Create Schedule
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schedules.map((schedule) => (
        <RecurringTransactionCard 
          key={schedule._id} 
          schedule={schedule} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onPause={onPause} 
          onResume={onResume}
        />
      ))}
    </div>
  );
};

export default RecurringTransactionList;
