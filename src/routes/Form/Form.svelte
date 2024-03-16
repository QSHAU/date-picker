<svelte:options customElement="date-form" />

<script>
    // Imports
    import {countries} from '../Store/countries';
    import DatePicker from '../DatePicker/DatePicker.svelte';
    import translate from './translate';
    import { fade } from 'svelte/transition';
    import {format} from 'date-fns';
    import {ru} from 'date-fns/locale';

    const today = new Date();
    // Vars
    let inputValue,
        fromInput,
        toInput,
        isCityFromError = false,
        isCityToError = false,
        showModal = false,
        returnedCountry = countries,
        dayFrom = today.getTime(),
        dayTo = today.getTime() + (24 * 60 * 60 * 1000),
        isChecked = false,
        fromOpened,
        toOpened,
        calendarOpened;

    // Result Form Var
    let result = {
        cityFrom: "",
        cityTo: "",
        dateFrom: "",
        dateTo: "",
    };

    const formatDay = (milliseconds) => {
        if(milliseconds) return format(new Date(milliseconds), "EEEEEE/dd/MM", {locale: ru}) || '';
    }

    const handleFromClick = (e) => {
        fromOpened = true;
        toOpened = false;
        calendarOpened = false;
    };

    const handleToClick = (e) => {
        fromOpened = false;
        toOpened = true;
        calendarOpened = false;
    };

    const handleCalendarClick = (e) => {
        fromOpened = false;
        toOpened = false;
        calendarOpened = true;
    };

    // Get input values if typing something
    const getInputValue = (e) => {
        inputValue = e.target.value;
    }

    // Set input value when country choosed
    const setValueToInput = (e) => {
        e.target.closest('label').querySelector('input').value = e.target.textContent.trim();
    }

    // result to objcet
    const getFormData = (e) => {
        if(!fromInput.value.length) {
            isCityFromError = true;
        } else {
            isCityFromError = false;
        }
        if(!toInput.value.length) {
            isCityToError = true;
        } else {
            isCityToError = false;
        }
        if(isCityToError || isCityFromError) return false;

        result.dateFrom = formatDay(dayFrom);
        result.dateTo = formatDay(dayTo);
        result.cityFrom = fromInput.value;
        result.cityTo = isChecked ? toInput.value : "Без обратного билета";
        showModal = true;
    }

    // modal outclick 
    const outModalClick = () => {
        showModal = false;
    }

    // Reactive
    $: if(inputValue) {
        returnedCountry = countries.filter((item) => {
            return item.toLowerCase().includes(inputValue.toLowerCase());
        })
    }
    $: if(isChecked) {
        dayTo = dayFrom
    }

    const getDays = (e) => {
        if(e.detail.startDate) {
            dayFrom = e.detail.startDate;
        } 
        if(e.detail.endDate) {
            dayTo = e.detail.endDate;
        }
    }

    const getCheck = (e) => {
        isChecked = e.detail.checked
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<form class="date-form">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <label class="date-form__from"
          class:isOpened={fromOpened}
          on:click={handleFromClick}
        >
        Откуда
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.48161 0.0561523C7.00223 0.0561523 8.30212 0.474642 9.38127 1.31162C10.4604 2.1486 11 3.16356 11 4.35649C11 4.95296 10.8099 5.64082 10.4298 6.42008C10.0496 7.19933 9.58974 7.92087 9.05017 8.58468C8.51059 9.24849 7.97101 9.87382 7.43144 10.4607C6.89186 11.0475 6.43813 11.5141 6.07023 11.8604L5.48161 12.3511C5.33445 12.2356 5.13824 12.0625 4.89298 11.8316C4.64771 11.6007 4.21237 11.1533 3.58696 10.4895C2.96154 9.82571 2.40357 9.18114 1.91304 8.55582C1.42252 7.93049 0.981048 7.22338 0.588629 6.43451C0.19621 5.64563 0 4.95296 0 4.35649C0 3.16356 0.533445 2.1486 1.60033 1.31162C2.66722 0.474642 3.96098 0.0561523 5.48161 0.0561523ZM5.48161 5.88614C6.02118 5.88614 6.48718 5.73702 6.8796 5.43879C7.27202 5.14056 7.46823 4.77979 7.46823 4.35649C7.46823 3.93319 7.27202 3.57242 6.8796 3.27419C6.48718 2.97596 6.02118 2.82684 5.48161 2.82684C4.94203 2.82684 4.48216 2.97596 4.10201 3.27419C3.72185 3.57242 3.53177 3.93319 3.53177 4.35649C3.53177 4.77979 3.72185 5.14056 4.10201 5.43879C4.48216 5.73702 4.94203 5.88614 5.48161 5.88614Z" fill="#333333"/>
        </svg>
        <input class="date-form__input" 
                class:error={isCityFromError}
                type="text" 
                on:input={getInputValue}
                bind:this={fromInput}
                required>
        <div class="date-form__box">
            <div class="date-form__cities">
                {#each returnedCountry as country}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div class="date-form__cities-item"
                         on:click={setValueToInput}>
                        {country}
                    </div>
                {/each}
            </div>
        </div>
    </label>
    <label class="date-form__to"
          class:isOpened={toOpened}
            on:click={handleToClick}>
        Куда
        <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.48161 0.0561523C7.00223 0.0561523 8.30212 0.474642 9.38127 1.31162C10.4604 2.1486 11 3.16356 11 4.35649C11 4.95296 10.8099 5.64082 10.4298 6.42008C10.0496 7.19933 9.58974 7.92087 9.05017 8.58468C8.51059 9.24849 7.97101 9.87382 7.43144 10.4607C6.89186 11.0475 6.43813 11.5141 6.07023 11.8604L5.48161 12.3511C5.33445 12.2356 5.13824 12.0625 4.89298 11.8316C4.64771 11.6007 4.21237 11.1533 3.58696 10.4895C2.96154 9.82571 2.40357 9.18114 1.91304 8.55582C1.42252 7.93049 0.981048 7.22338 0.588629 6.43451C0.19621 5.64563 0 4.95296 0 4.35649C0 3.16356 0.533445 2.1486 1.60033 1.31162C2.66722 0.474642 3.96098 0.0561523 5.48161 0.0561523ZM5.48161 5.88614C6.02118 5.88614 6.48718 5.73702 6.8796 5.43879C7.27202 5.14056 7.46823 4.77979 7.46823 4.35649C7.46823 3.93319 7.27202 3.57242 6.8796 3.27419C6.48718 2.97596 6.02118 2.82684 5.48161 2.82684C4.94203 2.82684 4.48216 2.97596 4.10201 3.27419C3.72185 3.57242 3.53177 3.93319 3.53177 4.35649C3.53177 4.77979 3.72185 5.14056 4.10201 5.43879C4.48216 5.73702 4.94203 5.88614 5.48161 5.88614Z" fill="#333333"/>
        </svg>
        <input class="date-form__input"
                class:error={isCityToError}
                type="text"
                on:input={getInputValue}
                bind:this={toInput}
                required>
        <div class="date-form__box">
            <div class="date-form__cities">
                {#each returnedCountry as country}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
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
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="date-form__wrapper"
            class:calendarOpened={calendarOpened}
            on:click={handleCalendarClick}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="date-form__dates">                   
                {#if !isChecked}
                    <button class="date-form__when-left">
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4707 2.61278C11.389 2.53206 11.2909 2.46794 11.1822 2.42433C11.0735 2.38071 10.9565 2.35852 10.8384 2.3591H9.93274V1.71778C9.93482 1.57713 9.90643 1.43756 9.84934 1.3077C9.79225 1.17784 9.70767 1.06043 9.60081 0.96271C9.49754 0.861661 9.37352 0.781709 9.23637 0.727783C9.09922 0.673856 8.95186 0.647098 8.80338 0.649158H8.3521C8.20356 0.647195 8.05617 0.674071 7.91902 0.728127C7.78187 0.782183 7.65787 0.862274 7.55467 0.963458C7.44777 1.06115 7.36317 1.17855 7.30607 1.30842C7.24898 1.43829 7.22062 1.57787 7.22274 1.71853V2.35985H4.51274V1.71778C4.51481 1.57713 4.48643 1.43756 4.42934 1.3077C4.37225 1.17784 4.28766 1.06043 4.1808 0.96271C4.07763 0.861753 3.95373 0.781855 3.81672 0.727932C3.67972 0.674009 3.53251 0.647201 3.38416 0.649158H2.93289C2.78434 0.647195 2.63695 0.674071 2.4998 0.728127C2.36265 0.782183 2.23865 0.862274 2.13545 0.963458C2.02859 1.06117 1.94401 1.17858 1.88692 1.30845C1.82983 1.43831 1.80145 1.57787 1.80352 1.71853V2.35985H0.900184C0.782128 2.35927 0.665186 2.38146 0.556485 2.42508C0.447783 2.46869 0.349602 2.53281 0.267929 2.61353C0.182682 2.69087 0.114961 2.78383 0.0688993 2.88676C0.0228373 2.98968 -0.000601975 3.10041 1.05193e-05 3.2122V11.7664C0.00305796 11.9919 0.0987552 12.2074 0.266805 12.3672C0.434854 12.5271 0.662039 12.6186 0.900184 12.6225H10.8353C11.0739 12.6194 11.3017 12.5283 11.4704 12.3685C11.6391 12.2088 11.7354 11.993 11.7386 11.7671V3.21444C11.7397 3.10215 11.7164 2.99085 11.6704 2.88738C11.6243 2.78391 11.5563 2.69046 11.4707 2.61278ZM2.93526 11.7664H0.900184V9.84242H2.9321L2.93526 11.7664ZM2.93526 9.41438H0.900184V7.27639H2.9321L2.93526 9.41438ZM2.93526 6.84835H0.900184V4.92438H2.9321L2.93526 6.84835ZM2.77719 3.79141C2.75581 3.77212 2.73882 3.74889 2.72726 3.72315C2.71571 3.69741 2.70984 3.66971 2.71002 3.64174V1.71778C2.71083 1.66126 2.73491 1.60727 2.77712 1.5673C2.81934 1.52733 2.87635 1.50453 2.93605 1.50375H3.38416C3.44385 1.50453 3.50087 1.52733 3.54308 1.5673C3.5853 1.60727 3.60937 1.66126 3.61019 1.71778V3.64249C3.60937 3.69901 3.5853 3.753 3.54308 3.79297C3.50087 3.83294 3.44385 3.85574 3.38416 3.85651H2.93289C2.90304 3.85674 2.87345 3.85115 2.84599 3.84007C2.81852 3.829 2.79376 3.81269 2.77324 3.79215L2.77719 3.79141ZM5.64526 11.7656H3.38416V9.84242H5.6421L5.64526 11.7656ZM5.64526 9.41363H3.38416V7.27639H5.6421L5.64526 9.41363ZM5.64526 6.8476H3.38416V4.92438H5.6421L5.64526 6.8476ZM8.35527 11.7649H6.09337V9.84242H8.35131L8.35527 11.7649ZM8.35527 9.41288H6.09337V7.27639H8.35131L8.35527 9.41288ZM8.35527 6.84685H6.09337V4.92438H8.35131L8.35527 6.84685ZM8.1972 3.78991C8.17543 3.77118 8.15789 3.74845 8.14566 3.72311C8.13344 3.69777 8.12677 3.67034 8.12607 3.64249V1.71778C8.12669 1.6612 8.1507 1.6071 8.19296 1.56709C8.23521 1.52707 8.29235 1.50434 8.3521 1.50375H8.80338C8.86313 1.50434 8.92027 1.52707 8.96252 1.56709C9.00478 1.6071 9.02879 1.6612 9.02941 1.71778V3.64249C9.02879 3.69907 9.00478 3.75317 8.96252 3.79318C8.92027 3.83319 8.86313 3.85593 8.80338 3.85651H8.3521C8.32225 3.85679 8.29265 3.85121 8.26518 3.84014C8.2377 3.82906 8.21295 3.81272 8.19246 3.79215L8.1972 3.78991ZM10.84 11.7641H8.80338V9.84242H10.8353L10.84 11.7641ZM10.84 9.41213H8.80338V7.27639H10.8353L10.84 9.41213ZM10.84 6.8461H8.80338V4.92438H10.8353L10.84 6.8461Z" fill="#333333"/>
                        </svg>
                        {#if dayFrom}
                            {formatDay(dayFrom)}
                        {/if}
                    </button>
                    <span class="date-form__when-line"></span>
                    <button class="date-form__when-right">
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4707 2.61278C11.389 2.53206 11.2909 2.46794 11.1822 2.42433C11.0735 2.38071 10.9565 2.35852 10.8384 2.3591H9.93274V1.71778C9.93482 1.57713 9.90643 1.43756 9.84934 1.3077C9.79225 1.17784 9.70767 1.06043 9.60081 0.96271C9.49754 0.861661 9.37352 0.781709 9.23637 0.727783C9.09922 0.673856 8.95186 0.647098 8.80338 0.649158H8.3521C8.20356 0.647195 8.05617 0.674071 7.91902 0.728127C7.78187 0.782183 7.65787 0.862274 7.55467 0.963458C7.44777 1.06115 7.36317 1.17855 7.30607 1.30842C7.24898 1.43829 7.22062 1.57787 7.22274 1.71853V2.35985H4.51274V1.71778C4.51481 1.57713 4.48643 1.43756 4.42934 1.3077C4.37225 1.17784 4.28766 1.06043 4.1808 0.96271C4.07763 0.861753 3.95373 0.781855 3.81672 0.727932C3.67972 0.674009 3.53251 0.647201 3.38416 0.649158H2.93289C2.78434 0.647195 2.63695 0.674071 2.4998 0.728127C2.36265 0.782183 2.23865 0.862274 2.13545 0.963458C2.02859 1.06117 1.94401 1.17858 1.88692 1.30845C1.82983 1.43831 1.80145 1.57787 1.80352 1.71853V2.35985H0.900184C0.782128 2.35927 0.665186 2.38146 0.556485 2.42508C0.447783 2.46869 0.349602 2.53281 0.267929 2.61353C0.182682 2.69087 0.114961 2.78383 0.0688993 2.88676C0.0228373 2.98968 -0.000601975 3.10041 1.05193e-05 3.2122V11.7664C0.00305796 11.9919 0.0987552 12.2074 0.266805 12.3672C0.434854 12.5271 0.662039 12.6186 0.900184 12.6225H10.8353C11.0739 12.6194 11.3017 12.5283 11.4704 12.3685C11.6391 12.2088 11.7354 11.993 11.7386 11.7671V3.21444C11.7397 3.10215 11.7164 2.99085 11.6704 2.88738C11.6243 2.78391 11.5563 2.69046 11.4707 2.61278ZM2.93526 11.7664H0.900184V9.84242H2.9321L2.93526 11.7664ZM2.93526 9.41438H0.900184V7.27639H2.9321L2.93526 9.41438ZM2.93526 6.84835H0.900184V4.92438H2.9321L2.93526 6.84835ZM2.77719 3.79141C2.75581 3.77212 2.73882 3.74889 2.72726 3.72315C2.71571 3.69741 2.70984 3.66971 2.71002 3.64174V1.71778C2.71083 1.66126 2.73491 1.60727 2.77712 1.5673C2.81934 1.52733 2.87635 1.50453 2.93605 1.50375H3.38416C3.44385 1.50453 3.50087 1.52733 3.54308 1.5673C3.5853 1.60727 3.60937 1.66126 3.61019 1.71778V3.64249C3.60937 3.69901 3.5853 3.753 3.54308 3.79297C3.50087 3.83294 3.44385 3.85574 3.38416 3.85651H2.93289C2.90304 3.85674 2.87345 3.85115 2.84599 3.84007C2.81852 3.829 2.79376 3.81269 2.77324 3.79215L2.77719 3.79141ZM5.64526 11.7656H3.38416V9.84242H5.6421L5.64526 11.7656ZM5.64526 9.41363H3.38416V7.27639H5.6421L5.64526 9.41363ZM5.64526 6.8476H3.38416V4.92438H5.6421L5.64526 6.8476ZM8.35527 11.7649H6.09337V9.84242H8.35131L8.35527 11.7649ZM8.35527 9.41288H6.09337V7.27639H8.35131L8.35527 9.41288ZM8.35527 6.84685H6.09337V4.92438H8.35131L8.35527 6.84685ZM8.1972 3.78991C8.17543 3.77118 8.15789 3.74845 8.14566 3.72311C8.13344 3.69777 8.12677 3.67034 8.12607 3.64249V1.71778C8.12669 1.6612 8.1507 1.6071 8.19296 1.56709C8.23521 1.52707 8.29235 1.50434 8.3521 1.50375H8.80338C8.86313 1.50434 8.92027 1.52707 8.96252 1.56709C9.00478 1.6071 9.02879 1.6612 9.02941 1.71778V3.64249C9.02879 3.69907 9.00478 3.75317 8.96252 3.79318C8.92027 3.83319 8.86313 3.85593 8.80338 3.85651H8.3521C8.32225 3.85679 8.29265 3.85121 8.26518 3.84014C8.2377 3.82906 8.21295 3.81272 8.19246 3.79215L8.1972 3.78991ZM10.84 11.7641H8.80338V9.84242H10.8353L10.84 11.7641ZM10.84 9.41213H8.80338V7.27639H10.8353L10.84 9.41213ZM10.84 6.8461H8.80338V4.92438H10.8353L10.84 6.8461Z" fill="#333333"/>
                        </svg>
                        {#if dayTo}
                            {formatDay(dayTo)}
                        {/if}
                    </button>
                {:else}
                    <button class="date-form__when-left">
                        <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.4707 2.61278C11.389 2.53206 11.2909 2.46794 11.1822 2.42433C11.0735 2.38071 10.9565 2.35852 10.8384 2.3591H9.93274V1.71778C9.93482 1.57713 9.90643 1.43756 9.84934 1.3077C9.79225 1.17784 9.70767 1.06043 9.60081 0.96271C9.49754 0.861661 9.37352 0.781709 9.23637 0.727783C9.09922 0.673856 8.95186 0.647098 8.80338 0.649158H8.3521C8.20356 0.647195 8.05617 0.674071 7.91902 0.728127C7.78187 0.782183 7.65787 0.862274 7.55467 0.963458C7.44777 1.06115 7.36317 1.17855 7.30607 1.30842C7.24898 1.43829 7.22062 1.57787 7.22274 1.71853V2.35985H4.51274V1.71778C4.51481 1.57713 4.48643 1.43756 4.42934 1.3077C4.37225 1.17784 4.28766 1.06043 4.1808 0.96271C4.07763 0.861753 3.95373 0.781855 3.81672 0.727932C3.67972 0.674009 3.53251 0.647201 3.38416 0.649158H2.93289C2.78434 0.647195 2.63695 0.674071 2.4998 0.728127C2.36265 0.782183 2.23865 0.862274 2.13545 0.963458C2.02859 1.06117 1.94401 1.17858 1.88692 1.30845C1.82983 1.43831 1.80145 1.57787 1.80352 1.71853V2.35985H0.900184C0.782128 2.35927 0.665186 2.38146 0.556485 2.42508C0.447783 2.46869 0.349602 2.53281 0.267929 2.61353C0.182682 2.69087 0.114961 2.78383 0.0688993 2.88676C0.0228373 2.98968 -0.000601975 3.10041 1.05193e-05 3.2122V11.7664C0.00305796 11.9919 0.0987552 12.2074 0.266805 12.3672C0.434854 12.5271 0.662039 12.6186 0.900184 12.6225H10.8353C11.0739 12.6194 11.3017 12.5283 11.4704 12.3685C11.6391 12.2088 11.7354 11.993 11.7386 11.7671V3.21444C11.7397 3.10215 11.7164 2.99085 11.6704 2.88738C11.6243 2.78391 11.5563 2.69046 11.4707 2.61278ZM2.93526 11.7664H0.900184V9.84242H2.9321L2.93526 11.7664ZM2.93526 9.41438H0.900184V7.27639H2.9321L2.93526 9.41438ZM2.93526 6.84835H0.900184V4.92438H2.9321L2.93526 6.84835ZM2.77719 3.79141C2.75581 3.77212 2.73882 3.74889 2.72726 3.72315C2.71571 3.69741 2.70984 3.66971 2.71002 3.64174V1.71778C2.71083 1.66126 2.73491 1.60727 2.77712 1.5673C2.81934 1.52733 2.87635 1.50453 2.93605 1.50375H3.38416C3.44385 1.50453 3.50087 1.52733 3.54308 1.5673C3.5853 1.60727 3.60937 1.66126 3.61019 1.71778V3.64249C3.60937 3.69901 3.5853 3.753 3.54308 3.79297C3.50087 3.83294 3.44385 3.85574 3.38416 3.85651H2.93289C2.90304 3.85674 2.87345 3.85115 2.84599 3.84007C2.81852 3.829 2.79376 3.81269 2.77324 3.79215L2.77719 3.79141ZM5.64526 11.7656H3.38416V9.84242H5.6421L5.64526 11.7656ZM5.64526 9.41363H3.38416V7.27639H5.6421L5.64526 9.41363ZM5.64526 6.8476H3.38416V4.92438H5.6421L5.64526 6.8476ZM8.35527 11.7649H6.09337V9.84242H8.35131L8.35527 11.7649ZM8.35527 9.41288H6.09337V7.27639H8.35131L8.35527 9.41288ZM8.35527 6.84685H6.09337V4.92438H8.35131L8.35527 6.84685ZM8.1972 3.78991C8.17543 3.77118 8.15789 3.74845 8.14566 3.72311C8.13344 3.69777 8.12677 3.67034 8.12607 3.64249V1.71778C8.12669 1.6612 8.1507 1.6071 8.19296 1.56709C8.23521 1.52707 8.29235 1.50434 8.3521 1.50375H8.80338C8.86313 1.50434 8.92027 1.52707 8.96252 1.56709C9.00478 1.6071 9.02879 1.6612 9.02941 1.71778V3.64249C9.02879 3.69907 9.00478 3.75317 8.96252 3.79318C8.92027 3.83319 8.86313 3.85593 8.80338 3.85651H8.3521C8.32225 3.85679 8.29265 3.85121 8.26518 3.84014C8.2377 3.82906 8.21295 3.81272 8.19246 3.79215L8.1972 3.78991ZM10.84 11.7641H8.80338V9.84242H10.8353L10.84 11.7641ZM10.84 9.41213H8.80338V7.27639H10.8353L10.84 9.41213ZM10.84 6.8461H8.80338V4.92438H10.8353L10.84 6.8461Z" fill="#333333"/>
                        </svg>
                        {#if dayFrom}
                            {formatDay(dayFrom)}
                        {/if}
                    </button>
                {/if}
            </div>
            <div class="date-form__datePicker">
                <DatePicker on:getDays={getDays} on:getInputCheck={getCheck} />
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
{#if showModal}
    <div class="modal"
        transition:fade>
        <div class="modal__wrapper">
            <h3 class="modal__title">
                Спасибо за покупку :)
            </h3>
            {#each Object.entries(result) as key}
                <div class="modal__result">
                    <span class="modal__result-left">
                        {translate?.[key[0]]}: 
                    </span>
                    <span class="modal__result-right">
                        {key[1]}
                    </span>
                </div>
            {/each}
        </div>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-bg" on:click={outModalClick}/>
{/if}
<style lang="scss">

    .date-form {
        display: flex;
        align-items: flex-end;
        gap: 15px;
        background-color: #F2F2F2;
        box-shadow: 20px 20px 120px 15px rgba(0, 0, 0, 5%);
        border-radius: 10px;
        padding: 5px 23px 14px;
        color: #333;

        & > label {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            line-height: 32px;
            position: relative;

            svg {
                pointer-events: none;
                bottom: 14px;
                left: 18px;
                position: absolute;
            }
        }

        &__input {
            display: inline-block;
            font-size: 14px;
            line-height: 32px;
            background-color: #E0E0E0;
            padding: 5px 18px 5px 37px;
            border-radius: 5px;
            width: 200px;
            border: 1px solid transparent;
            transition: all .3s;

            &.error {
                border-color: red;
                box-shadow: 0 0 8px 2px red;
            }
        }

        &__box {
            opacity: 0;
            pointer-events: none;
            border: 1px solid #E0E0E0;
            border-radius: 5px;
            transition: opacity .3s;
            top: calc(100% + 25px);
            z-index: 2;
            min-width: 415px;
            position: absolute;

            &::before {
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
        }
        
        label.isOpened .date-form__box {
            opacity: 1;
            pointer-events: unset;
        }

        &__cities {
            display: flex;
            flex-direction: column;
            max-height: 300px;
            padding: 10px;
            background-color: #F2F2F2;  
            overflow: auto;
            z-index: 2;
            position: relative;

            &-item {
                font-size: 14px;
                line-height: 1;
                font-weight: 400;
                white-space: nowrap;
                color: #333;
                border-radius: 5px;
                padding: 8px 10px;
                transition: background-color .3s;
                cursor: pointer;

                &:hover {
                    background-color: #E0E0E0;
                }
            }
        }

        &__when {
            display: inline-block;

            &-title {
                font-size: 14px;
                line-height: 32px;
                color: #333;
            }

            button {
                display: inline-block;
                font-family: 'Roboto', sans-serif;
                font-weight: 400;
                font-size: 14px;
                line-height: 1;
                border: none;
                border-radius: 0;
                background-color: transparent;
                position: relative;
            }

            &-line {
                display: inline-block;
                width: 20px;
                height: 1px;
                pointer-events: none;
                background-color: #BDBDBD;
            }

            &-left {
                text-transform: capitalize;
                pointer-events: none;
                padding: 14px 50px 14px 64px;
                
            }

            &-right {
                text-transform: capitalize;
                pointer-events: none;
                padding: 14px 44px 14px 70px;
            }
        }

        &__dates {
            display: flex;
            align-items: center;

            & > button svg {
                width: 12px;
                height: 12px;
                bottom: 15px;
                left: 44px;
                position: absolute;
            }
        }

        &__wrapper {
            display: flex;
            align-items: center;
            background-color: #E0E0E0;
            border-radius: 5px;
            cursor: pointer;
            position: relative;
        }

        &__submit {
            display: inline-block;
            font-family: 'Roboto', sans-serif;
            font-weight: 700;
            font-size: 16px;
            line-height: 1;
            color: #F2F2F2;
            background-color: #333;
            padding: 14px 53px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color .3s;

            &:hover {
                background-color: #565555;
            }
        }

        &__datePicker {
            opacity: 0;
            pointer-events: none;
            transition: opacity .3s;
            z-index: 5;
            left: 0;
            top: calc(100% + 25px);
            position: absolute;
        }
    }

    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 350px;
        min-height: 350px;
        background-color: #F2F2F2;
        border-radius: 10px;
        padding: 30px;
        box-shadow: 0 0 15px #000;
        transform: translate(-50%, -50%);
        z-index: 2;
        top: 50%;
        left: 50%;
        position: absolute;

        &__title {
            text-align: center;
            margin: 0 0 25px;
        }

        &__result {
            display: flex;

            &:not(:last-child) {
                margin-bottom: 10px;
            }

            &-left,
            &-right {
                text-transform: capitalize;
            }

            &-right {
                margin-left: 5px;
            }
        }

        &-bg {
            width: 100%;
            height: 100%;
            background-color: rgba(51, 51, 51, 0.3);
            z-index: 1;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            position: fixed;
        }
    }
    :global(.date-form__wrapper.calendarOpened .date-form__datePicker) {
        opacity: 1;
        pointer-events: unset;
    }
</style>