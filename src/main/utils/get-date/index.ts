interface getDateBetweenProps {
  biggerThen: Date;
  lessThan: Date;
}

export const getDateBetween = ({ biggerThen, lessThan }: getDateBetweenProps): string => {
  const biggerTime = biggerThen.getTime();
  const lessTime = lessThan.getTime();

  const randomTime = Math.floor(Math.random() * (lessTime - biggerTime)) + biggerTime;

  const randomDate = new Date(randomTime);

  const formattedDate =
    `${randomDate.getDate().toString().padStart(2, '0')}/` +
    `${(randomDate.getMonth() + 1).toString().padStart(2, '0')}/` +
    `${randomDate.getFullYear()}`;

  return formattedDate;
};

interface getDateAddYearsProps {
  date: Date;
  addYears: number;
}

export const getDateAddYears = ({ date, addYears }: getDateAddYearsProps): string => {
  const currentYear = date.getFullYear();

  const targetYear = currentYear + addYears;

  const targetDate = new Date(date);

  targetDate.setFullYear(targetYear);

  const randomMonth = Math.floor(Math.random() * 12);
  const randomDay = Math.floor(Math.random() * 31) + 1;

  targetDate.setMonth(randomMonth);
  targetDate.setDate(randomDay);

  const formattedDate =
    `${targetDate.getDate().toString().padStart(2, '0')}/` +
    `${(targetDate.getMonth() + 1).toString().padStart(2, '0')}/` +
    `${targetDate.getFullYear()}`;

  return formattedDate;
};

interface getDateSubtractYearsProps {
  date: Date;
  subtractYears: number;
}

export const getDateSubtractYears = ({
  date,
  subtractYears
}: getDateSubtractYearsProps): string => {
  const currentYear = date.getFullYear();

  const targetYear = currentYear - subtractYears;

  const targetDate = new Date(date);

  targetDate.setFullYear(targetYear);

  const randomMonth = Math.floor(Math.random() * 12);
  const randomDay = Math.floor(Math.random() * 31) + 1;

  targetDate.setMonth(randomMonth);
  targetDate.setDate(randomDay);

  const formattedDate =
    `${targetDate.getDate().toString().padStart(2, '0')}/` +
    `${(targetDate.getMonth() + 1).toString().padStart(2, '0')}/` +
    `${targetDate.getFullYear()}`;

  return formattedDate;
};

export const convertToDate = (date: string): Date => {
  const [day, month, year] = date.split('/').map((part) => parseInt(part, 10));

  return new Date(year, month - 1, day);
};

export const isValidDate = (dateString: string): boolean => {
  const [day, month, year] = dateString.split('/').map(Number);
  const max = new Date().getFullYear() - 18;

  if (year < 1900 || year > max || month === 0 || month > 12) return false;

  const lastDayOfMonth = new Date(year, month, 0).getDate();

  if (day < 1 || day > lastDayOfMonth) return false;

  return true;
};
