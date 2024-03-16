<script>
  // @ts-nocheck
  import { tick, getContext, createEventDispatcher } from 'svelte';
  import { clickOutside } from './actions';

  /**
   * Represents the start date for a date picker.
   * @type {any}
   */
  export let startDate = null;

  /**
   * Represents the end date for a date picker.
   * @type {any}
   */
  export let endDate = null;

  /**
   * Represents the start time for the date picker (in HH:mm format).
   * @type {string}
   */
  export let startDateTime = '00:00';

  /**
   * Represents the end time for the date picker (in HH:mm format).
   * @type {string}
   */
  export let endDateTime = '00:00';

  /**
   * Represents the current date.
   * @type {Date}
   */
  export let today = new Date();

  /**
   * Represents the default year for the date picker.
   * @type {number}
   */
  export let defaultYear = today.getFullYear();

  /**
   * Represents the default month for the date picker.
   * @type {number}
   */
  export let defaultMonth = today.getMonth();

  /**
   * Represents the start day of the week (0 for Sunday, 1 for Monday, etc.).
   * @type {number}
   */
  export let startOfWeek = 0;

  /**
   * Indicates whether the date picker has multiple panes.
   * @type {boolean}
   */
  export let isMultipane = false;

  /**
   * Indicates whether the date picker is in range mode.
   * @type {boolean}
   */
  export let isRange = false;

  /**
   * Indicates whether the date picker is open.
   * @type {boolean}
   */
  export let isOpen = false;

  /**
   * Specifies the alignment of the date picker (e.g., 'left', 'center', 'right').
   * @type {string}
   */
  export let align = 'left';

  /**
   * Represents the theme of the date picker.
   * @type {string}
   */
  export let theme = '';

  /**
   * An array of disabled dates.
   * @type {Date[]}
   */
  export let disabledDates = [];

  /**
   * An array of enabled dates.
   * @type {Date[]}
   */
  export let enabledDates = [];

  /**
   * Callback function to handle day click events.
   * @type {(event: Object) => void}
   */
  export let onDayClick = () => {};

  /**
   * Callback function to handle the navigation click event for months and years
   * @type {(event: Object) => void}
   */
  export let onNavigationChange = () => {};

  /**
   * Indicates whether the date picker should always be shown.
   * @type {boolean}
   */
  export let alwaysShow = false;

  /**
   * Indicates whether year controls are displayed in the date picker.
   * @type {boolean}
   */
  export let showYearControls = true;

  /**
   * Indicates whether preset options are displayed in the date picker.
   * @type {boolean}
   */
  export let showPresets = false;

  /**
   * Indicates whether the time picker is shown in the date picker.
   * @type {boolean}
   */
  export let showTimePicker = false;

  /**
   * Indicates whether future dates are enabled.
   * @type {boolean}
   */
  export let enableFutureDates = false;

  /**
   * Indicates whether past dates are enabled.
   * @type {boolean}
   */
  export let enablePastDates = true;

  /**
   * An array of preset date range labels.
   * @type {string[]}
   */
  export let presetLabels = ['Today', 'Last 7 Days', 'Last 30 Days', 'Last 60 Days', 'Last 90 Days', 'Last Year'];

  /**
   * An array of day-of-week labels.
   * @type {string[]}
   */
  export let dowLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  /**
   * An array of month labels.
   * @type {string[]}
   */
  export let monthLabels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  /**
   * Determines if the default font "Rubik" should be loaded.
   * @type {boolean}
   */
  export let includeFont = true;

  /**
   * The number of milliseconds in a day.
   * @type {number}
   */
  export const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

  /**
   * Calculates a date based on the number of days from today.
   *
   * @param {number} days - The number of days to subtract from today.
   * @returns {number} - The timestamp of the calculated date.
   */
  export const getDateFromToday = (days) => {
    return Date.now() - days * MILLISECONDS_IN_DAY;
  };

  /**
   * An array of preset date ranges with labels and start/end timestamps.
   * @type {Object[]}
   */
  export let presetRanges = [
    {
      label: presetLabels[0],
      start: getDateFromToday(0),
      end: getDateFromToday(0)
    },
    {
      label: presetLabels[1],
      start: getDateFromToday(6),
      end: getDateFromToday(0)
    },
    {
      label: presetLabels[2],
      start: getDateFromToday(29),
      end: getDateFromToday(0)
    },
    {
      label: presetLabels[3],
      start: getDateFromToday(59),
      end: getDateFromToday(0)
    },
    {
      label: presetLabels[4],
      start: getDateFromToday(89),
      end: getDateFromToday(0)
    },
    {
      label: presetLabels[5],
      start: getDateFromToday(364),
      end: getDateFromToday(0)
    }
  ];

  /**
   * Initialization flag to delay some actions
   * @type {any}
   */

  /**
   * Initialization flag to delay some actions
   * @type {boolean}
   */
  let initialize = false;

  /**
   * Stores the possible end date for a date range.
   * @type {any}
   */
  let tempEndDate;

  /**
   * Stores the start date for any revert operation.
   * @type {any}
   */
  let prevStartDate;

  /**
   * Stores the end date for any revert operation.
   * @type {any}
   */
  let prevEndDate;

  /**
   * Generates a calendar representation as a two-dimensional array. (Pulled from github.com/lukeed/calendarize)
   *
   * @param {Date} target - The target date for the calendar (defaults to the current date if not provided).
   * @param {number} offset - The offset for the first day of the week (0 for Sunday, 1 for Monday, etc.).
   * @returns {Array<Array<number>>} A two-dimensional array representing the calendar.
   */
  const calendarize = (target, offset) => {
    const out = [];
    const date = new Date(target || new Date());
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();

    let first = new Date(year, month, 1 - (offset | 0)).getDay();
    let i = 0;
    let j = 0;
    let week;

    while (i < days) {
      for (j = 0, week = Array(7); j < 7; ) {
        while (j < first) {
          week[j++] = 0;
        }

        week[j++] = ++i > days ? 0 : i;

        first = 0;
      }

      out.push(week);
    }

    return out;
  };

  /**
   * Creates a timestamp for a given year, month, and day.
   *
   * @param {number} year - The year.
   * @param {number} month - The month (0-11, where 0 is January and 11 is December).
   * @param {number} day - The day of the month.
   * @returns {number} - The timestamp representing the specified date.
   */
  const createTimestamp = (year, month, day) => new Date(year, month, day).getTime();

  /**
   * Gets the timestamp for a given date.
   *
   * @param {Date} date - The date.
   * @returns {number} - The timestamp of the date.
   */
  const getTimestamp = (date) => new Date(date).getTime();

  /**
   * Normalizes a timestamp by setting the time to midnight (00:00:00.000).
   *
   * @param {any} timestamp - The timestamp to normalize.
   * @returns {number} - The normalized timestamp.
   */
  const normalizeTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  };

  /**
   * Handles the click outside event of the date picker.
   */
  const onClickOutside = () => {
    if (alwaysShow) {
      return;
    }

    if (prevStartDate && prevEndDate && startDate && !endDate) {
      startDate = prevStartDate;
      endDate = prevEndDate;
      prevStartDate = null;
      prevEndDate = null;
    }

    isOpen = false;
  };

  let startDateYear = Number(defaultYear);
  let startDateMonth = Number(defaultMonth);

  const updateCalendars = () => {
    startDateCalendar = startDateCalendar;
    endDateCalendar = endDateCalendar;
  };

  /**
   * Handles the navigation click event for months and years
   * @param {string} direction - The direction of the navigation (previous or next).
   * @param {string} type - The type of navigation (month or year).
   */
  const onNavigation = async (direction, type) => {
    await tick();

    const initial = new Date(defaultYear, defaultMonth);
    const initialDayOffMonth = '01';

    let current = new Date(startDateYear, startDateMonth);
    let month = startDateMonth + 1;

    const calendar = isMultipane ? endDateCalendar : startDateCalendar;
    const lastWeekOfMonth = calendar[calendar.length - 1].filter(Boolean);
    const lastDayOfMonth = lastWeekOfMonth[lastWeekOfMonth.length - 1];

    const currentPeriod = {
      start: `${startDateYear}-${month >= 10 ? month : `0${month}`}-${initialDayOffMonth}`,
      end: `${startDateYear}-${month >= 10 ? month : `0${month}`}-${lastDayOfMonth}`
    };

    if (isMultipane) {
      month += 1;

      if (month > 11) {
        month = 1;
      }

      currentPeriod.end = `${endDateYear}-${month >= 10 ? month : `0${month}`}-${lastDayOfMonth}`;
      current = new Date(endDateYear, endDateMonth);
    }

    onNavigationChange({
      direction,
      type,
      currentPeriod,
      isPastPeriod: current < initial
    });
  };

  /**
   * Handles the "to previous month" action in the date picker.
   */
  const toPrev = () => {
    [startDateCalendar, next] = [prev, startDateCalendar];

    if (--startDateMonth < 0) {
      startDateMonth = 11;
      startDateYear--;
    }

    onNavigation('previous', 'month');
  };

  /**
   * Handles the "to previous year" action in the date picker.
   */
  const toPrevYear = () => {
    startDateYear--;
    onNavigation('previous', 'year');
  };

  /**
   * Handles the "to next month" action in the date picker.
   */
  const toNext = () => {
    [prev, startDateCalendar] = [startDateCalendar, next];

    if (++startDateMonth > 11) {
      startDateMonth = 0;
      startDateYear++;
    }
    onNavigation('next', 'month');
  };

  /**
   * Handles the "to next year" action in the date picker.
   */
  const toNextYear = () => {
    startDateYear++;
    onNavigation('next', 'year');
  };

  /**
   * Checks if a given date is today.
   *
   * @param {number} day - The day of the date.
   * @param {number} month - The month of the date (0-11).
   * @param {number} year - The year of the date.
   * @returns {boolean} - True if the date is today; otherwise, false.
   */
  const isToday = (day, month, year) => {
    return today && todayMonth === month && todayDay === day && todayYear === year;
  };

  /**
   * Handles the selection of a single date in the date picker.
   *
   * @param {number} timestamp - The timestamp of the selected date.
   */
  const handleSingleDate = (timestamp) => {
    startDate = updateTime('start', timestamp);

    if (!alwaysShow) {
      isOpen = false;
    }
  };

  /**
   * Handles the selection of a date range in the date picker.
   *
   * @param {number} timestamp - The timestamp of the selected date.
   */
  const handleDateRange = (timestamp) => {
    if (startDate === null || (startDate !== null && endDate !== null)) {
      startDate = updateTime('start', timestamp);
      endDate = null;
    } else {
      endDate = updateTime('end', timestamp);
      if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
      }

      if (!alwaysShow) {
        isOpen = false;
      }
    }
  };

  /**
   * Gets an array of dates within a specified range.
   *
   * @param {number} startDate - The timestamp of the start date.
   * @param {number} endDate - The timestamp of the end date.
   * @param {string[]} disabled - An array of disabled dates.
   * @returns {string[]} - An array of dates within the specified range.
   */
  const getDatesInRange = (startDate, endDate) => {
    const dateRangeStart = new Date(startDate);
    const dateRangeEnd = new Date(endDate);
    const datesInRange = [];

    for (; dateRangeStart <= dateRangeEnd; dateRangeStart.setDate(dateRangeStart.getDate() + 1)) {
      const formattedDate = `${
        dateRangeStart.getMonth() + 1
      }/${dateRangeStart.getDate()}/${dateRangeStart.getFullYear()}`;
      if (
        (!enabled && !disabled) ||
        (enabled.length && enabled.includes(formattedDate)) ||
        (disabled.length && !disabled.includes(formattedDate))
      ) {
        datesInRange.push(formattedDate);
      }
    }

    return datesInRange;
  };

  /**
   * Handles the click event on a day in the date picker.
   *
   * @param {Event} e - The click event.
   * @param {number} day - The day of the clicked date.
   * @param {number} month - The month of the clicked date.
   * @param {number} year - The year of the clicked date.
   */
  const onClick = function (e, day, month, year) {
    const classes = e.target?.closest('.date').className;

    if (classes.includes('future') || classes.includes('past') || classes.includes('disabled')) {
      e.preventDefault();
      return false;
    }

    const timestamp = createTimestamp(year, month, day);

    if (isRange) {
      prevStartDate = startDate;
      prevEndDate = endDate;

      handleDateRange(timestamp);
    } else {
      handleSingleDate(timestamp);
    }

    const event = {
      startDate,
      startDateTime,
      ...(isRange && {
        endDate,
        endDateTime,
        rangeDates: getDatesInRange(startDate, endDate)
      })
    };

    onDayClick(event);
  };

  /**
   * Checks if a date is within a specified range.
   *
   * @param {any} start - The start date of the range.
   * @param {any} end - The end date of the range.
   * @param {any} selected - The date to check.
   * @returns {boolean} - True if the date is within the range, false otherwise.
   */
  const isDateInRange = (start, end, selected) => {
    const startCompare = normalizeTimestamp(start);
    const endCompare = normalizeTimestamp(end);
    const selectedCompare = normalizeTimestamp(selected);

    return selectedCompare >= startCompare && selectedCompare <= endCompare;
  };

  /**
   * Checks if a given date is in the selected date range.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @returns {boolean} - True if the date is in the selected range, false otherwise.
   */
  const inRange = (day, month, year) => {
    const selectedDateTimestamp = createTimestamp(year, month, day);

    if (normalizeTimestamp(startDate) === selectedDateTimestamp) {
      return true;
    }

    return isRange ? isDateInRange(startDate, endDate, selectedDateTimestamp) : startDate === selectedDateTimestamp;
  };

  /**
   * Checks if a given date is the first date in the selected range.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @returns {boolean} - True if the date is the first date in the selected range, false otherwise.
   */
  const isFirstInRange = (day, month, year) => {
    const currentTimestamp = createTimestamp(year, month, day);
    const startCompare = normalizeTimestamp(startDate);
    const tempEndCompare = normalizeTimestamp(tempEndDate);
    const currentCompare = normalizeTimestamp(currentTimestamp);

    if ((!isRange && startCompare) || (isRange && !endDate && tempEndDate)) {
      return startCompare === currentCompare;
    }

    return isRange ? startCompare === currentCompare : tempEndCompare === currentCompare;
  };

  /**
   * Checks if a given date is the last date in the selected range.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @returns {boolean} - True if the date is the last date in the selected range, false otherwise.
   */
  const isLastInRange = (day, month, year) => {
    const currentTimestamp = createTimestamp(year, month, day);
    const endCompare = normalizeTimestamp(endDate);
    const startCompare = normalizeTimestamp(startDate);
    const currentCompare = normalizeTimestamp(currentTimestamp);
    const tempEndCompare = normalizeTimestamp(tempEndDate);

    if (isRange && startDate && !endDate && tempEndDate) {
      return tempEndCompare === startCompare;
    }

    return isRange ? endCompare === currentCompare : startCompare === currentCompare;
  };

  /**
   * Checks if a given date is disabled.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @returns {boolean} - True if the date is disabled, false otherwise.
   */
  const isDisabled = (day, month, year) => {
    const selectedDateTimestamp = createTimestamp(year, month, day);
    return (
      (!enabled && !disabled) ||
      (enabled.length && !enabled.map((d) => new Date(d).getTime()).includes(selectedDateTimestamp)) ||
      (disabled.length && disabled.map((d) => new Date(d).getTime()).includes(selectedDateTimestamp))
    );
  };

  /**
   * Checks if a given date is in the future.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @returns {boolean} - True if the date is in the future, false otherwise.
   */
  const isFutureDate = (day, month, year) => {
    if (enableFutureDates) {
      return false;
    }

    const selectedDateTimestamp = createTimestamp(year, month, day);
    const todayCompare = normalizeTimestamp(new Date());
    const selectedCompare = normalizeTimestamp(selectedDateTimestamp);

    return todayCompare < selectedCompare;
  };

  /**
   * Checks if a given date is in the past.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @returns {boolean} - True if the date is in the past, false otherwise.
   */
  const isPastDate = (day, month, year) => {
    if (enablePastDates) {
      return false;
    }

    const selectedDateTimestamp = createTimestamp(year, month, day);
    const todayCompare = normalizeTimestamp(new Date());
    const selectedCompare = normalizeTimestamp(selectedDateTimestamp);

    return todayCompare > selectedCompare;
  };

  /**
   * Checks if a given day is the first day of the month.
   *
   * @param {number} day - The day of the month.
   * @returns {boolean} - True if it's the first day of the month, false otherwise.
   */
  const isFirstDayOfMonth = (day) => {
    return day === 1;
  };

  /**
   * Checks if a given day is the last day of the month.
   *
   * @param {number} day - The day of the month.
   * @param {Array<number>} calendar - The calendar array.
   * @returns {boolean} - True if it's the last day of the month, false otherwise.
   */
  const isLastDayOfMonth = (day, calendar) => {
    return day === Math.max(...calendar.flat(10));
  };

  /**
   * Handles the mouse enter event for a day in the date picker.
   *
   * @param {Event} e - The mouse enter event.
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   */
  const onMouseEnter = function (e, day, month, year) {
    if (startDate && endDate) {
      tempEndDate = null;
      return;
    }

    const { className: classes } = e.target || {};

    if (classes.includes('future') || classes.includes('past') || classes.includes('disabled')) {
      return;
    }

    tempEndDate = createTimestamp(year, month, day);
  };

  /**
   * Handles the mouse leave event for a day in the date picker.
   */
  const onMouseLeave = () => {
    if (startDate && endDate) {
      tempEndDate = null;
      return;
    }

    tempEndDate = normalizeTimestamp(startDate);
  };

  /**
   * Checks if a given date is in the range during hover.
   *
   * @param {number} day - The day of the month.
   * @param {number} month - The month (0-11).
   * @param {number} year - The year.
   * @returns {boolean} - True if the date is in the range during hover, false otherwise.
   */
  const inRangeHover = (day, month, year) => {
    if (!isRange || endDate || !startDate || !tempEndDate) {
      return false;
    }

    const dateString = createTimestamp(year, month, day);
    const startCompare = normalizeTimestamp(startDate);
    const tempEndCompare = normalizeTimestamp(tempEndDate);
    const selectedCompare = normalizeTimestamp(dateString);

    const minDate = startCompare < tempEndCompare ? startCompare : tempEndCompare;
    const maxDate = startCompare > tempEndCompare ? startCompare : tempEndCompare;

    return selectedCompare >= minDate && selectedCompare <= maxDate;
  };

  /**
   * Handles a click event on a preset date range.
   *
   * @param {Object} preset - The preset date range object with start and end dates.
   * @param {number} preset.start - The start date of the preset range.
   * @param {number} preset.end - The end date of the preset range.
   */
  const onPresetClick = ({ start, end }) => {
    startDate = start;
    endDate = end;

    if (!alwaysShow) {
      isOpen = false;
    }
  };

  /**
   * Updates the time for a date and returns the timestamp.
   *
   * @param {string} which - 'start' or 'end' to indicate which date to update.
   * @param {number} timestamp - The timestamp to set.
   * @returns {number} - The updated timestamp.
   */
  const updateTime = (which, timestamp) => {
    const date = new Date(timestamp);

    if (!showTimePicker) {
      return date.getTime();
    }

    const [hours = 0, minutes = 0, seconds = 0] = (which === 'start' ? startDateTime : endDateTime).split(':');

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);

    return date.getTime();
  };

  /**
   * Gets the hours and minutes from a given date.
   *
   * @param {Date} date - The date to extract hours and minutes from.
   * @returns {string} - A string in HH:mm format representing hours and minutes.
   */
  const getHoursAndMinutes = (date) => {
    date = new Date(date);

    if (!date) {
      return '00:00';
    }

    let hours = date.getHours();
    let minutes = date.getMinutes();

    if (hours < 10) {
      hours = `0${hours}`;
    }

    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  };

  /**
   * Returns an array of timestamps from an array of date strings.
   * @param {string[]} collection - An array of date strings.
   * @returns {number[]} - An array of timestamps.
   */
  const getDatesFromArray = (collection) => {
    return collection.reduce((acc, date) => {
      let newDates = [];

      if (date instanceof Date) {
        newDates = [date.getTime()];
      } else if (typeof date === 'string' && date.includes(':')) {
        const [rangeStart, rangeEnd] = date.split(':');
        let dateRangeStart = new Date(rangeStart).getTime();
        let dateRangeEnd = new Date(rangeEnd).getTime();

        for (; dateRangeStart <= dateRangeEnd; dateRangeStart += MILLISECONDS_IN_DAY) {
          newDates = [...newDates, dateRangeStart];
        }
      } else {
        newDates = [new Date(date).getTime()];
      }

      return [...acc, ...newDates];
    }, []);
  };

  $: startDate = startDate ? getTimestamp(startDate) : null;
  $: endDate = endDate ? getTimestamp(endDate) : null;

  $: if (startDate || endDate) {
    updateCalendars();
  }

  $: todayMonth = today && today.getMonth();
  $: todayDay = today && today.getDate();
  $: todayYear = today && today.getFullYear();
  $: prev = calendarize(new Date(startDateYear, startDateMonth - 1), startOfWeek);
  $: startDateCalendar = calendarize(new Date(startDateYear, startDateMonth), startOfWeek);
  $: next = calendarize(new Date(startDateYear, startDateMonth + 1), startOfWeek);
  $: endDateMonth = startDateMonth === 11 ? 0 : startDateMonth + 1;
  $: endDateYear = endDateMonth === 0 ? startDateYear + 1 : startDateYear;
  $: endDateCalendar = calendarize(new Date(endDateYear, endDateMonth), startOfWeek);
  $: !isRange && (endDate = null);
  $: theme !== null && globalThis.document?.documentElement.setAttribute('data-picker-theme', theme);
  $: disabled = getDatesFromArray(disabledDates);
  $: enabled = getDatesFromArray(enabledDates);

  $: if (!startDate && !endDate) {
    startDateYear = Number(defaultYear);
    startDateMonth = Number(defaultMonth);
  }

  $: if (isRange !== null || (startDate && tempEndDate !== null) || !isOpen) {
    updateCalendars();
  }

  $: if (isOpen) {
    if ((!isRange && startDate) || (isRange && startDate && endDate)) {
      const date = new Date(startDate);
      startDateYear = date.getFullYear();
      startDateMonth = date.getMonth();
    }
  }

  $: if (startDate && showTimePicker && !initialize) {
    startDateTime = getHoursAndMinutes(startDate);
    endDateTime = getHoursAndMinutes(endDate);
    initialize = true;
  }

  const closeCalendar = (e) => {
    e.target.closest('.date-form__wrapper').classList.remove('calendarOpened');
  }

  const rangeCheckbox = createEventDispatcher();
  const testCheck = createEventDispatcher();
  const calendarIsRange = (e) => {
        rangeCheckbox('isChecked', {
          checked: e.target.checked
        });
    }
  const getCheckbox = (e) => {
    testCheck('checkboxClick', {
      checked: e.target.checked
    })
  }
</script>

<div class="datepicker" data-picker-theme={theme} use:clickOutside={{ onClickOutside }}>
  <div class="datepicker__wrapper">
    <slot />
    <div
      class="calendars-container"
      class:right={align === 'right'}
      class:range={isMultipane}
      class:presets={isRange && showPresets}
      class:show={isOpen}
    >
      {#if isRange && showPresets}
        <div class="calendar-presets">
          {#each presetRanges as option}
            <button
              class:active={normalizeTimestamp(startDate) === normalizeTimestamp(option.start) &&
                normalizeTimestamp(endDate) === normalizeTimestamp(option.end)}
              on:click={() => onPresetClick({ ...option })}
            >
              {option.label}
            </button>
          {/each}
        </div>
      {/if}
      <div class="calendar">
        <header class:timepicker={showTimePicker}>
          <button on:click={toPrev}>
            <div class="icon-previous-month" aria-label="Previous month"></div>
          </button>
          <span>
            <div>{monthLabels[startDateMonth]}</div>

            {#if showYearControls}
              <div class="years">
                <button on:click={toNextYear}>
                  <i class="icon-next-year" aria-label="Next year" />
                </button>
                <button on:click={toPrevYear}>
                  <i class="icon-previous-year" aria-label="Previous year" />
                </button>
              </div>
            {/if}
          </span>
          <button on:click={toNext}>
            <div class="icon-next-month" aria-label="Next month"></div>
          </button>
        </header>

        {#if showTimePicker}
          <div class="timepicker" class:show={isRange && !isMultipane}>
            <input type="time" bind:value={startDateTime} on:input={() => (startDate = updateTime('start', startDate))} />

            {#if isRange}
              <input
                type="time"
                class="end-time"
                bind:value={endDateTime}
                on:input={() => (endDate = updateTime('end', endDate))}
              />
            {/if}
          </div>
        {/if}

        <div class="month">
          {#each dowLabels as text, labelIndex (text)}
            <span class="dow">{dowLabels[(labelIndex + startOfWeek) % 7]}</span>
          {/each}

          {#each { length: 6 } as week, weekIndex (weekIndex)}
            {#if startDateCalendar[weekIndex]}
              {#each { length: 7 } as d, dayIndex (dayIndex)}
                {#if startDateCalendar[weekIndex][dayIndex] !== 0}
                  <button
                    class="date"
                    class:today={isToday(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:start={isFirstInRange(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:end={isLastInRange(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:range={inRange(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:rangehover={inRangeHover(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:past={isPastDate(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:future={isFutureDate(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:first={isFirstDayOfMonth(startDateCalendar[weekIndex][dayIndex])}
                    class:last={isLastDayOfMonth(startDateCalendar[weekIndex][dayIndex], startDateCalendar)}
                    class:disabled={isDisabled(startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    on:mouseenter={(e) =>
                      onMouseEnter(e, startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    on:mouseleave={onMouseLeave}
                    on:click={(e) => onClick(e, startDateCalendar[weekIndex][dayIndex], startDateMonth, startDateYear)}
                    class:norange={isRange && tempEndDate === startDate}
                    type="button"
                  >
                    <span>{startDateCalendar[weekIndex][dayIndex]}</span>
                  </button>
                {:else}
                  <div class="date other">&nbsp;</div>
                {/if}
              {/each}
            {/if}
          {/each}
        </div>
      </div>

      {#if isMultipane}
        <div class="calendar">
          <header class:timepicker={showTimePicker}>
            <button on:click={toPrev}>
              <div class="icon-previous-month" aria-label="Previous month"></div>
            </button>
            <span>
              <div>{monthLabels[endDateMonth]}</div>

              {#if showYearControls}
                <div class="years">
                  <button on:click={toNextYear}>
                    <i class="icon-next-year" aria-label="Next year" />
                  </button>
                  <button on:click={toPrevYear}>
                    <i class="icon-previous-year" aria-label="Previous year" />
                  </button>
                </div>
              {/if}
            </span>
            <button on:click={toNext}>
              <div class="icon-next-month" aria-label="Next month"></div>
            </button>
          </header>

          {#if showTimePicker}
            <div class="timepicker">
              <input type="time" bind:value={endDateTime} on:input={() => (endDate = updateTime('end', endDate))} />
            </div>
          {/if}

          <div class="month">
            {#each dowLabels as text, labelIndex (text)}
              <span class="dow">{dowLabels[(labelIndex + startOfWeek) % 7]}</span>
            {/each}

            {#each { length: 6 } as week, weekIndex (weekIndex)}
              {#if endDateCalendar[weekIndex]}
                {#each { length: 7 } as d, dayIndex (dayIndex)}
                  {#if endDateCalendar[weekIndex][dayIndex] !== 0}
                    <button
                      class="date"
                      class:today={isToday(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:range={inRange(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:rangehover={inRangeHover(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:start={isFirstInRange(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:end={isLastInRange(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:past={isPastDate(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:future={isFutureDate(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:first={isFirstDayOfMonth(endDateCalendar[weekIndex][dayIndex])}
                      class:last={isLastDayOfMonth(endDateCalendar[weekIndex][dayIndex], endDateCalendar)}
                      class:disabled={isDisabled(endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      on:mouseenter={(e) =>
                        onMouseEnter(e, endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      on:mouseleave={onMouseLeave}
                      on:click={(e) => onClick(e, endDateCalendar[weekIndex][dayIndex], endDateMonth, endDateYear)}
                      class:norange={isRange && tempEndDate === startDate}
                      type="button"
                    >
                      <span>{endDateCalendar[weekIndex][dayIndex]}</span>
                    </button>
                  {:else}
                    <div class="date other">&nbsp;</div>
                  {/if}
                {/each}
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
    <div class="datepicker__bottom">
      <label class="datepicker__bottom-withoutEnd">
        <input class="datepicker__bottom-check" type="checkbox" on:change={(e) => {calendarIsRange(e), getCheckbox(e)}}/>
        <span class="datepicker__bottom-checkbox">
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.63221 2.13051L4.10493 5.63429C3.85942 5.87868 3.53803 6 3.21638 6C2.89499 6 2.57335 5.87868 2.32809 5.63429L0.36807 3.68744C-0.12269 3.20042 -0.12269 2.4101 0.36807 1.92257C0.858829 1.43505 1.65415 1.43505 2.14491 1.92257L3.21613 2.98699L5.85462 0.365643C6.34538 -0.121881 7.1407 -0.121881 7.63146 0.365643C8.12272 0.852418 8.12272 1.64274 7.63221 2.13051Z" fill="#333333"/>
          </svg>            
        </span>
        Без конечной даты
      </label>
      <button class="datepicker__bottom-submit" type="button" on:click={closeCalendar}>
        Готово
      </button>
    </div>
  </div>
</div>

<svelte:head>
  {#if includeFont}
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap"
    />
  {/if}
</svelte:head>

<style>
  .datepicker button {
    border: none;
  }
  .datepicker {
    border: 1px solid #e0e0e0;
    z-index: 2;
    position: relative;
  }

  .datepicker::before {
      content: '';
      width: 25px;
      height: 25px;
      border-radius: 5px;
      border: 1px solid #E0E0E0;
      background-color: #F2F2F2;
      transform: rotate(45deg);
      z-index: 1;
      left: 20px;
      top: -8px;
      position: absolute;
  }

  .datepicker__wrapper {
    padding: 33px 57px;
    background-color: #f2f2f2;
    border-radius: 5px;
    z-index: 2;
    position: relative;
  }

  .calendars-container {
    display: flex;
    padding-bottom: 15px;
    border-bottom: 1px solid #bdbdbd;
    margin-bottom: 29px;
  }

  .calendar:first-child {
    margin-right: 92px;
  }

  .calendar header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .calendar header button {
    display: inline-block;
    width: 20px;
    height: 20px;
    padding: 0;
    cursor: pointer;
    position: relative;
  }

  .calendar header .icon-previous-month,
  .calendar header .icon-next-month {
    width: 15px;
    height: 13px;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    position: absolute;
  }

  .calendar header .icon-previous-month::after,
  .calendar header .icon-previous-month::before,
  .calendar header .icon-next-month::after,
  .calendar header .icon-next-month::before {
    content: '';
    width: 10px;
    height: 2px;
    border-radius: 2px;
    background-color: #333;
    transform: rotate(-45deg);
    top: 2px;
    left: 0;
    position: absolute;
  }

  .calendar header .icon-previous-month::before {
    transform: rotate(45deg);
    top: unset;
    bottom: 2px;
  }

  .calendar header .icon-next-month::after,
  .calendar header .icon-next-month::before {
    left: unset;
    right: 0;
  }

  .calendar header .icon-next-month::after {
    transform: rotate(45deg);
  }

  .calendar header .icon-next-month::before {
    top: unset;
    bottom: 2px;
    transform: rotate(-45deg);
  }

  .calendar header > span div {
    font-size: 18px;
    line-height: 21px;
    font-weight: 700;
    color: #333;
  }

  .calendar .month {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-row-gap: 1px;
  }

  .calendar .month .dow {
    font-size: 15px;
    line-height: 17.5px;
    color: #333;
    text-align: center;
  }

  .calendar .month .date {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 3px;
    padding: 0;
    margin: 0;
    width: 41px;
    height: 27px;
    cursor: pointer;
  }

  .calendar .month .date:hover {
    background-color: #333;
  }

  .calendar .month .date span {
    font-size: 15px;
    line-height: 1;
    font-weight: 500;
    text-align: center;
  }

  .calendar .month .date:hover span {
    color: #f2f2f2;
  }

  .calendar .month .date.past,
  .calendar .month .date.other {
    pointer-events: none;
    cursor: unset;
  }

  .calendar .month .date.past span {
    color: #e0e0e0;
  }

  .calendar .month .date.today {
    border: 1px solid #333;
  }

  .calendar .month .date.today.norange,
  .calendar .month .date .norange {
    background-color: transparent;
  }

  .calendar .month .date.today.norange span {
    color: #333;
  }

  .calendar .month .date.start.range {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .calendar .month .date.end.range {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  .calendar .month .date.start.end.range {
    border-radius: 3px;
  }

  .calendar .month .date.rangehover {
    color: #f2f2f2;
    background-color: #333;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .calendar .month .date.range,
  .calendar .month .date.rangehover + .rangehover {
    border-radius: 0;
    background-color: #333;
    color: #f2f2f2;
  }

  .calendar .month .date.range span {
    color: #f2f2f2;
  }

  .datepicker__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .datepicker__bottom-withoutEnd {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #333;
    line-height: 15px;
    font-weight: 400;
    padding-left: 24px;
    cursor: pointer;
    position: relative;
  }

  .datepicker__bottom-check {
    width: 14px;
    height: 14px;
    padding: 0;
    margin: 0;
    appearance: none;
    border: none;
    transform: translateY(-50%);
    left: 0;
    top: 50%;
    position: absolute;
  }

  .datepicker__bottom-checkbox {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 1px solid #333;
    border-radius: 3px;
    transform: translateY(-50%);
    left: 0;
    top: 50%;
    position: absolute;
  }

  .datepicker__bottom-checkbox svg {
    width: 8px;
    height: 6px;
    opacity: 0;
    transition: opacity .3s;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
    position: absolute;
  }

  .datepicker__bottom-check:checked + .datepicker__bottom-checkbox svg{
    opacity: 1;
  }

  .datepicker__bottom-submit {
    display: inline-block;
    padding: 16px 40px;
    font-size: 16px;
    line-height: 19px;
    font-weight: 700;
    color: #f2f2f2;
    background-color: #333;
    border-radius: 5px;
    transition: all .3s;
    cursor: pointer;
  }

  .datepicker__bottom-submit:hover {
    background-color: #565555;
  }
</style>