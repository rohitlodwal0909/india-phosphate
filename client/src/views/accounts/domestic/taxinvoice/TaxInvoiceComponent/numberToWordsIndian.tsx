export const numberToWordsIndian = (num) => {
  if (!num || num === 0) return 'Zero Rupees Only';

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const convertHundreds = (n) => {
    let str = '';

    if (n > 99) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }

    if (n > 19) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }

    if (n > 0) {
      str += ones[n] + ' ';
    }

    return str.trim();
  };

  let result = '';

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundred = num;

  if (crore) result += convertHundreds(crore) + ' Crore ';
  if (lakh) result += convertHundreds(lakh) + ' Lakh ';
  if (thousand) result += convertHundreds(thousand) + ' Thousand ';
  if (hundred) result += convertHundreds(hundred) + ' ';

  return result.trim() + ' Rupees Only';
};
