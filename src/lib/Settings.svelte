<script>
    import { UserSettings } from "./types";

    export let settings = new UserSettings();
    let showSettings = false;

    const fixValues = () => {
        if (settings.columns < 7) {
            settings.columns = 7;
        } else if (settings.columns > 15) {
            settings.columns = 15;
        }
    };
    const toggleSettings = () => {
        showSettings = !showSettings;
    };
    const resetSettings = () => {
        settings = new UserSettings();
    };
</script>

<button class="settings-btn" on:click={toggleSettings}>⚙ Impostazioni</button>
<div class="settings-form {showSettings ? 'form-show' : 'form-hide'}">
    <div class="setting-input-div">
        <label for="author">Numero di colonne</label>
        <input
            bind:value={settings.columns}
            on:change={fixValues}
            type="number"
            name="columns"
            id="input-columns"
            min="7"
            max="15"
            step="1"
        />
    </div>
    <div class="setting-input-div">
        <label for="author">Spazio sui ritorni</label>
        <input
            bind:checked={settings.returnSpacing}
            type="checkbox"
            name="returnSpacing"
            id="input-returnSpacing"
        />
    </div>
    <div class="setting-input-div">
        <label for="author">Colori righe alternati</label>
        <input
            bind:checked={settings.bicolorRows}
            type="checkbox"
            name="bicolorRows"
            id="input-bicolorRows"
        />
    </div>
    <div class="setting-input-div">
        <label for="author">Colore ritorni</label>
        <input
            bind:value={settings.returnColor}
            type="color"
            name="returnColor"
            id="input-returnColor"
        />
    </div>
    <div class="setting-input-div">
        <label for="author">Colore pause</label>
        <input
            bind:value={settings.pauseColor}
            type="color"
            name="pauseColor"
            id="input-pauseColor"
        />
    </div>
    <button class="settings-btn" on:click={resetSettings}>⟲ Ripristina</button>
</div>

<style>
    .settings-btn {
        text-align: center;
        width: 100%;
        margin-bottom: 2em;
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
        padding: 0;
        color: var(--text-color);
        font-weight: bold;
    }
    .settings-form {
        display: flex;
        flex-direction: column;
        width: 100%;
        row-gap: 1em;
        overflow: hidden;
        transition: max-height 0.25s ease-in-out;
    }
    .setting-input-div {
        display: flex;
        justify-content: space-between;
    }
    input {
        outline: none;
        width: 5em;
    }
    .form-show {
        max-height: 100%;
    }
    .form-hide {
        max-height: 0;
    }
</style>
