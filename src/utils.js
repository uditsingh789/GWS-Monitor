export const GRADES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
export const SECTIONS = ['A', 'B'];

export const getAcademicMonth = () => {
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth >= 4 ? currentMonth - 3 : currentMonth + 9;
};

export const calculateCurrentlyDue = (student) => {
  const prevBal = Number(student.previousBalance || 0);
  const monthlyFee = Number(student.monthlyFee || 0);
  const transportFee = Number(student.transportFee || 0);
  const pendingFee = Number(student.pendingFee || 0);

  // Total Expected General Tuition for the entire year
  const totalYearlyGeneral = prevBal + (monthlyFee * 12) + transportFee;
  const totalPaidGeneral = totalYearlyGeneral - pendingFee;

  const currentMonth = getAcademicMonth();
  
  // Transport is divided across 11 months
  const transportMonthsToCharge = Math.min(currentMonth, 11);
  const transportDueToDate = (transportFee / 11) * transportMonthsToCharge;

  // Expected payment to this point in the year
  const expectedToDate = prevBal + (monthlyFee * currentMonth) + transportDueToDate;
  
  return Math.max(0, expectedToDate - totalPaidGeneral);
};