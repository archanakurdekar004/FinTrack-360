import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import budgetService from './budgetService.js';

export const analyticsService = {
  getOverview: async (userId, month, year) => {
    // Current month date boundaries
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    // Previous month date boundaries
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevStartDate = new Date(Date.UTC(prevYear, prevMonth - 1, 1));
    const prevEndDate = new Date(Date.UTC(prevYear, prevMonth, 1));

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: prevStartDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: {
            type: '$type',
            isCurrentMonth: { $gte: ['$date', startDate] }
          },
          total: { $sum: '$amount' }
        }
      }
    ];

    const results = await Transaction.aggregate(pipeline);

    let currentIncome = 0;
    let currentExpense = 0;
    let prevIncome = 0;
    let prevExpense = 0;

    results.forEach(r => {
      if (r._id.isCurrentMonth) {
        if (r._id.type === 'income') currentIncome = r.total;
        if (r._id.type === 'expense') currentExpense = r.total;
      } else {
        if (r._id.type === 'income') prevIncome = r.total;
        if (r._id.type === 'expense') prevExpense = r.total;
      }
    });

    const currentNet = currentIncome - currentExpense;
    const prevNet = prevIncome - prevExpense;

    let savingsRate = 0;
    if (currentIncome > 0) {
      savingsRate = ((currentIncome - currentExpense) / currentIncome) * 100;
    }

    // Month over Month calculations
    const calculateChange = (current, prev) => {
      if (prev === 0) {
        if (current === 0) return 0;
        return 100; // 100% increase if prev was 0 and current > 0
      }
      return ((current - prev) / prev) * 100;
    };

    return {
      currentMonth: {
        income: currentIncome,
        expenses: currentExpense,
        netCashFlow: currentNet,
        savingsRate
      },
      previousMonth: {
        income: prevIncome,
        expenses: prevExpense,
        netCashFlow: prevNet
      },
      changes: {
        income: calculateChange(currentIncome, prevIncome),
        expenses: calculateChange(currentExpense, prevExpense),
        netCashFlow: calculateChange(currentNet, prevNet)
      }
    };
  },

  getMonthlyTrends: async (userId, monthsCount) => {
    // Determine the start date for the trend
    const today = new Date();
    // We want the last X months ending with the current month
    // Go back `monthsCount - 1` months
    let startMonth = today.getUTCMonth() - (monthsCount - 1);
    let startYear = today.getUTCFullYear();
    
    // JS Date handles negative months gracefully by rolling back years, 
    // but Date.UTC needs to be used carefully.
    const startDate = new Date(Date.UTC(startYear, startMonth, 1));
    const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1));

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      }
    ];

    const results = await Transaction.aggregate(pipeline);

    // Build timeline array with zeros for months without transactions
    const timeline = [];
    for (let i = 0; i < monthsCount; i++) {
      const d = new Date(Date.UTC(startYear, startMonth + i, 1));
      timeline.push({
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1, // 1-12
        income: 0,
        expenses: 0,
        netCashFlow: 0
      });
    }

    results.forEach(r => {
      const point = timeline.find(t => t.year === r._id.year && t.month === r._id.month);
      if (point) {
        if (r._id.type === 'income') point.income = r.total;
        if (r._id.type === 'expense') point.expenses = r.total;
        point.netCashFlow = point.income - point.expenses;
      }
    });

    return timeline;
  },

  getCategoryBreakdown: async (userId, month, year) => {
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: 'expense',
          date: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: '$categoryId',
          totalSpent: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $sort: { totalSpent: -1 }
      }
    ];

    const results = await Transaction.aggregate(pipeline);

    const totalExpenses = results.reduce((sum, item) => sum + item.totalSpent, 0);

    return results.map(item => ({
      categoryId: item.category._id,
      name: item.category.name,
      icon: item.category.icon,
      color: item.category.color,
      totalSpent: item.totalSpent,
      percentage: totalExpenses > 0 ? (item.totalSpent / totalExpenses) * 100 : 0
    }));
  },

  getBudgetPerformance: async (userId, month, year) => {
    // We can reuse the budget service logic which already handles 
    // aggregation of budget limits, lookup of categories, and lookup of transactions!
    const budgets = await budgetService.getBudgets(userId, month, year);

    return budgets.map(b => {
      let status = 'on-track';
      if (b.isExceeded) status = 'exceeded';
      else if (b.usagePercentage >= 80) status = 'warning';

      return {
        categoryId: b.category._id,
        name: b.category.name,
        icon: b.category.icon,
        color: b.category.color,
        budgetAmount: b.amount,
        spentAmount: b.spentAmount,
        remainingAmount: b.remainingAmount,
        usagePercentage: b.usagePercentage,
        status
      };
    });
  }
};

export default analyticsService;
