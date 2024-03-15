<script>
    import { setContext } from "svelte";
	import { writable } from "svelte/store";
    import {format} from 'date-fns';
    import {ru} from 'date-fns/locale';

    const dateFrom = writable();
    const dateTo = writable();
    const withoutLastDate = writable(true);


    const today = new Date();
    $dateFrom = format(today, "EEEEEE/dd/MM", {locale: ru});
    $dateTo = format(new Date(today.getTime() + (24 * 60 * 60 * 1000)), "EEEEEE/dd/MM", {locale: ru});


    setContext("store", {
        dateFrom: dateFrom,
        dateTo: dateTo,
        withoutLastDate: withoutLastDate,
    });
</script>

<div class="store">
    <slot />
</div>