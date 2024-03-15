<script>
    import Store from "./Store/Store.svelte";
    import Form from "./Form/Form.svelte";
</script>
<Store>
    <Form />
</Store>

<style lang="scss">
    @import "./Fonts/Fonts.scss";
    @import "./Vars/Vars.scss";

    :global(body) {
        display: flex;
        font-family: 'Roboto', sans-serif;
        font-weight: 500;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0;
        padding: 0;
    }

    :global(body *) {
        box-sizing: border-box;
    }
</style>