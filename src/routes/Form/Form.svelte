<script>
    import {countries} from '../Store/countries';
    import DatePicker from '../DatePicker/DatePicker.svelte';
	import { getContext } from 'svelte';

    const {dateFrom, dateTo, withoutLastDate} = getContext("store");

    $: if(!$withoutLastDate) {
        $dateTo = $dateFrom
    }

    let inputValue;
    let result = {
        from: "",
        to: "",
        dateFrom: "",
        dateTo: "",
    };

    const countryNames = countries.map((i) => i.label);

    let returnedCountry = countryNames;

    const clickOutsideInput = (node) => {
		const handleClick = (event) => {
			if (!node.contains(event.target)) {
				node.closest('label').classList.remove('isOpened');
			} else {
                node.closest('label').classList.add('isOpened')
            }
		};
		document.addEventListener("click", handleClick, true);
    }

    const clickOutsideDates = (node) => {
		const handleClick = (event) => {
			if (!node.contains(event.target)) {
				node.closest('.date-form__wrapper').classList.remove('calendarOpened');
			} else {
                node.closest('.date-form__wrapper').classList.add('calendarOpened');
            }
		};
		document.addEventListener("click", handleClick, true);
    }

    $: if(inputValue) {
        returnedCountry = countryNames.filter((item) => {
            return item.toLowerCase().includes(inputValue.toLowerCase());
        })
    }

    const getInputValue = (e) => {
        inputValue = e.target.value;
    }

    const setValueToInput = (e) => {
        e.target.closest('label').querySelector('input').value = e.target.textContent.trim();
    }

    const getFormData = (e) => {
        result.dateFrom = $dateFrom;
        result.dateTo = $dateTo;

        console.log(result);
    }
</script>

<form class="date-form" action="#">
    <label class="date-form__from">
        Откуда
        <input class="date-form__input" 
                type="text" 
                use:clickOutsideInput
                on:input={getInputValue}
                required>
        <div class="date-form__box">
            <div class="date-form__cities">
                {#each returnedCountry as country}
                    <div class="date-form__cities-item"
                         on:click={setValueToInput}>
                        {country}
                    </div>
                {/each}
            </div>
        </div>
    </label>
    <label class="date-form__to">
        Куда
        <input class="date-form__input" 
                type="text" 
                use:clickOutsideInput
                on:input={getInputValue}
                required>
        <div class="date-form__box">
            <div class="date-form__cities">
                {#each returnedCountry as country}
                    <div class="date-form__cities-item"
                         on:click={setValueToInput}>
                        {country}
                    </div>
                {/each}
            </div>
        </div>
    </label>
    <div class="date-form__when">
        <span class="date-form__when-title">
            Даты
        </span>
        <div class="date-form__wrapper"
             use:clickOutsideDates>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="date-form__dates">
                {#if $withoutLastDate}
                    <button class="date-form__when-left">{$dateFrom}</button>
                    <span class="date-form__when-line"></span>
                    <button class="date-form__when-right">{$dateTo}</button>
                {:else}
                    <button class="date-form__when-left">{$dateFrom}</button>
                {/if}
            </div>
            <div class="date-form__datePicker">
                <DatePicker />
            </div>
        </div>
    </div>
    <button class="date-form__submit" 
            type="button"
            on:click={getFormData}
            >
        Найти
    </button>
</form>

<style lang="scss">
    @import "Form.scss";
</style>