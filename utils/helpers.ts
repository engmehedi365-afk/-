
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
};

export const getBengaliDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
