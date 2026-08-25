export const GRADES = ['Nursery', 'LKG', 'UKG', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
export const SECTIONS = ['A', 'B'];

export const getAcademicMonth = () => {
  const currentMonth = new Date().getMonth() + 1;
  return currentMonth >= 4 ? currentMonth - 3 : currentMonth + 9;
};

export const calculateCurrentlyDue = (student) => {
  const totalPaid = Number(student.totalFee) - Number(student.pendingFee);
  const monthlyFee = Number(student.totalFee) / 12;
  const expectedPayment = monthlyFee * getAcademicMonth();
  
  const baseTuitionDue = Math.max(0, expectedPayment - totalPaid);
  const previousBalance = Number(student.previousBalance || 0);
  const transportFee = Number(student.transportFee || 0);
  
  return baseTuitionDue + previousBalance + transportFee;
};