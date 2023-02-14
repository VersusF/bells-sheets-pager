<script lang="ts">
    import Settings from "$lib/Settings.svelte";
    import Stats from "$lib/Stats.svelte";
    import { SheetStats, UserInput, UserSettings } from "$lib/types";
    import { onMount } from "svelte";
    import { sheetToPage } from "../lib/pager";
    const SETTINGS_KEY = "BSP-USER-SETTINGS";

    const userInput = new UserInput();
    let settings = new UserSettings();
    let stats: SheetStats;
    let headingHidden = false;
    const click = async () => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
        const cells = await sheetToPage(userInput, settings);
        stats = SheetStats.from(cells);
    };
    onMount(() => {
        const cached = localStorage.getItem(SETTINGS_KEY);
        if (cached) {
            settings = UserSettings.fromStorage(cached);
        }
        const urlParams = new URLSearchParams(window.location.search);
        const headingParam = urlParams.get("heading");
        headingHidden = headingParam != null && ["false", "none", "0"].includes(headingParam);
    });
</script>

<div class="background">
    <a
        href="https://www.campanesistemaveronese.it"
        class="heading {headingHidden ? 'hidden' : null}"
    >
        <img
            src="https://www.campanesistemaveronese.it/wp-content/uploads/2020/12/cropped-ascsv_white-300x209.png"
            height="50px"
            alt="Logo ASCSV"
        />
        <h3>Associazione Suonatori di Campane a Sistema Veronese</h3>
    </a>
    <h1 class="title">Impaginatore Spartiti</h1>
    <div class="form">
        <div class="bsp-input">
            <label for="title">Titolo</label>
            <input
                bind:value={userInput.title}
                type="text"
                name="title"
                id="input-title"
                class="text-input"
            />
        </div>
        <div class="bsp-input">
            <label for="author">Autore/sottotitolo</label>
            <input
                bind:value={userInput.author}
                type="text"
                name="author"
                id="input-author"
                class="text-input"
            />
        </div>
        <textarea
            bind:value={userInput.raw}
            name="raw"
            id="input-raw"
            rows="10"
            class="raw-textarea"
            placeholder="1,2,3/1,4/2,5/3/1,..."
        />
        <input on:click={click} type="button" value="Impagina" class="cta-button" />
        <div class="bsp-input settings">
            <Settings {settings} />
        </div>
    </div>
    {#if stats}
        <Stats {stats} />
    {/if}
</div>

<style>
    .heading {
        color: var(--font-color);
        display: flex;
        align-items: center;
        text-decoration: none;
        font-size: 1em;
    }
    .hidden {
        display: none;
    }
    .background {
        margin: 0;
        width: 100vw;
        height: 100vh;
        background-color: var(--bg-color);
        overflow: scroll;
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
        row-gap: 1em;
    }
    .bsp-input {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .settings {
        width: 80%;
        max-width: 500px;
    }
    .title {
        text-align: center;
    }
    .text-input {
        outline: none;
    }
    .raw-textarea {
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
