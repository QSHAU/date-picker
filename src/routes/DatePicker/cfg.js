const today = new Date();

export const defaultConfig = {
  startDate: today,
  endDate: today,
  startDateTime: '00:00',
  endDateTime: '00:00',
  today,
  defaultYear: today.getFullYear(),
  defaultMonth: today.getMonth(),
  startOfWeek: 1,
  isMultipane: false,
  isRange: false,
  isOpen: true,
  align: 'left',
  theme: '',
  disabledDates: [],
  onDayClick: () => { },
  showYearControls: true,
  showPresets: false,
  showTimePicker: false,
  enableFutureDates: false,
  enablePastDates: true,
  dowLabels: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  monthLabels: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрб',
    'Ноябрь',
    'Декабрь'
  ]
};
