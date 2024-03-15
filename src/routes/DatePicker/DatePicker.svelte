<script>
    import { DatePicker } from "@bib/datepicker";
    // import { format } from 'date-fns';
    import {defaultConfig} from "./cfg";
    import {format} from 'date-fns';
    import {ru} from 'date-fns/locale';
	import { getContext } from "svelte";

    const {dateFrom, dateTo, withoutLastDate} = getContext('store');
    let startDate,
        endDate,
        isRange;

$: if(startDate) {
        $dateFrom = format(new Date(startDate), "EEEEEE/dd/MM", {locale: ru})
    }
$: if (endDate) {
        $dateTo = format(new Date(endDate), "EEEEEE/dd/MM", {locale: ru})
    }
$: isRange = $withoutLastDate;
</script>

<DatePicker showYearControls={false} 
            isMultipane={true} 
            isRange={isRange}
            isOpen 
            alwaysShow
            enablePastDates={false} 
            enableFutureDates 
            includeFont={false}
            dowLabels={defaultConfig.dowLabels}
            monthLabels={defaultConfig.monthLabels}
            startOfWeek={defaultConfig.startOfWeek}
            bind:startDate
            bind:endDate
/>