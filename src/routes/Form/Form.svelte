<script>
    import {cities} from '../Store/cities';
    import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte";

    let selected;
</script>

<form class="date-form" action="">
    <label class="date-form__from">
        Откуда
        <input class="date-form__input" type="text">
        <div class="date-form__box">
            <div class="date-form__cities">
                {#each cities as city}
                    <div class="date-form__cities-item">
                        {city.label}
                    </div>
                {/each}
            </div>
        </div>
    </label>
    <label class="date-form__to">
        Куда
        <input class="date-form__input" type="text">
        <div class="date-form__box">
            <div class="date-form__cities">
                {#each cities as city}
                    <div class="date-form__cities-item">
                        {city.label}
                    </div>
                {/each}
            </div>
        </div>
    </label>
    <div class="date-form__when">
        <span class="date-form__when-title">
            Даты
        </span>
        <div class="date-form__wrapper">
            <div class="date-form__dates">
                <button class="date-form__when-left">Пн 05/12</button>
                <span class="date-form__when-line"></span>
                <button class="date-form__when-right">Вт 06/12</button>
            </div>
            <div class="date-form__box">
                <div class="date-form__caledar">
                    
                </div>
            </div>
        </div>
    </div>
    <button class="date-form__submit" type="button">
        Найти
    </button>
</form>

<style lang="scss">
    @import "Form.scss";
</style>