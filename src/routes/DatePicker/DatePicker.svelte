<script>
    import { DatePicker } from "@bib/datepicker";
    import {defaultConfig} from "./cfg";
	import { getContext } from "svelte";
    import { createEventDispatcher } from "svelte";
    
    let startDate,
        endDate,
        isRange,
        isChecked;

    const emit = createEventDispatcher();
    const test = createEventDispatcher();
    const choiseDay = (e) => {
        emit('getDays', {
            startDate: e.startDate,
            endDate: e.endDate,
        });
    }
    const clickCheckbox = (e) => {
        test('getInputCheck', {
            checked: e.detail.checked,
        })
    }
    const getInfoCheckbox = (e) => {
        isChecked = e.detail.checked
    }
$: isRange = !isChecked;
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
            onDayClick={choiseDay}
            on:isChecked={getInfoCheckbox}
            on:checkboxClick={clickCheckbox}
/>