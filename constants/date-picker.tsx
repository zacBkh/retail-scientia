const today = new Date()
let threeMonthsAgo = new Date(today)
threeMonthsAgo.setMonth(today.getMonth() - 3)

export const SHORTCUT_LABELS = {
  shortcuts: {
    today: 'Today',
    yesterday: 'Yesterday',
    currentMonth: 'This Month',
    pastMonth: 'Last Month',
    // past: (period: number) => `Last ${period} days`,
    lastThreeMonth: {
      text: 'Last 3 months',
      period: {
        // start: '2023-11-13',
        // end: '2023-11-20',
        start: threeMonthsAgo,
        end: today,
      },
    },
  },
}
