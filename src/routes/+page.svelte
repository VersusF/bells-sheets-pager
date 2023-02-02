<script>
    let rawInput = "";
</script>

<div class="background">
    <h1 class="title">Impaginatore Spartiti Campane a Sistema Veronese</h1>
    <div class="form">
        <!-- TODO: Title -->
        <!-- TODO: Author -->
        <textarea
            bind:value={rawInput}
            name="raw"
            id="input-raw"
            rows="10"
            class="textInput"
            placeholder="1,2,3/1,4/2,5/3/1,..."
        />
        <input type="button" value="Impagina" class="cta-button" />
    </div>
</div>

<style>
    .background {
        margin: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--bg-color);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 80vw;
        width: 100%;
    }
    .title {
        text-align: center;
    }
    .textInput {
        color: var(--bg-color);
        background-color: var(--text-color);
        outline: none;
        padding: 0.5em;
        width: 80%;
        max-width: 75vw;
    }
    .cta-button {
        color: var(--text-color);
        background-color: var(--primary-color);
        text-transform: uppercase;
        border-radius: 3px;
        outline: none;
        padding: 12px 30px;
        margin: 10px;
        font-weight: 500;
        cursor: pointer;
        font-size: 14px;
        font-family: var(--font);
        border: 0;
        box-shadow: 0px 2px 2px 0px var(--shadow-color);
        box-sizing: border-box;
        transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1);
    }
    .cta-button:hover {
        box-shadow: 0px 2px 6px 1px var(--shadow-color-hover);
    }
</style>
