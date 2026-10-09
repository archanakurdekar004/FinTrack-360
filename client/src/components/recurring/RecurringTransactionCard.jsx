import React from 'react';
import { Card } from '../common/Card';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Calendar, Play, Pause, Trash2, Edit2, CheckCircle2, Clock } from 'lucide-react';

export const RecurringTransactionCard = ({ schedule, onEdit, onDelete, onPause, onResume }) => {
  const isCompleted = schedule.status === 'completed';
  const isPaused = schedule.status === 'paused';
  const isActive = schedule.status === 'active';
  
  return (
    <Card className={`flex flex-col h-full border ${isPaused ? 'border-amber-500/30' : isCompleted ? 'border-slate-800 opacity-70' : 'border-indigo-500/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-white line-clamp-1">{schedule.title}</h3>
            {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {isPaused && <Pause className="w-4 h-4 text-amber-400 shrink-0" />}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
              style={{ backgroundColor: `${schedule.categoryId?.color}20`, color: schedule.categoryId?.color }}
            >
              {schedule.categoryId?.icon}
            </div>
            <p className="text-xs text-slate-400">{schedule.categoryId?.name}</p>
          </div>
        </div>
        
        <div className="flex space-x-1 bg-slate-900 rounded-lg p-1 border border-slate-800 shrink-0 ml-2">
          {!isCompleted && (
            <button onClick={() => onEdit(schedule)} className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => onDelete(schedule)} className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className={`text-[10px] font-medium uppercase tracking-wider mb-0.5 ${schedule.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
              {schedule.type}
            </p>
            <p className="text-xl font-bold text-white">{formatCurrency(schedule.amount)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-0.5">Frequency</p>
            <p className="text-sm font-medium text-slate-300 capitalize">{schedule.frequency}</p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-3 space-y-2 border border-slate-800/50">
          <div className="flex justify-between items-center text-xs">
            <span className="flex items-center text-slate-400"><Clock className="w-3.5 h-3.5 mr-1" /> Next Due:</span>
            <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-500'}`}>
              {formatDate(schedule.nextDueDate)}
            </span>
          </div>
          {schedule.endDate && (
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center text-slate-400"><Calendar className="w-3.5 h-3.5 mr-1" /> Ends On:</span>
              <span className="text-slate-400 font-medium">{formatDate(schedule.endDate)}</span>
            </div>
          )}
        </div>

        {!isCompleted && (
          <button
            onClick={() => isActive ? onPause(schedule) : onResume(schedule)}
            className={`w-full py-2 px-3 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors border ${
              isActive 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isActive ? (
              <><Pause className="w-3.5 h-3.5 mr-2" /> Pause Schedule</>
            ) : (
              <><Play className="w-3.5 h-3.5 mr-2" /> Resume Schedule</>
            )}
          </button>
        )}
      </div>
    </Card>
  );
};

export default RecurringTransactionCard;
