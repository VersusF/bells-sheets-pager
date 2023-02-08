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
<div class="settings-form">
    <div class="settings-form {showSettings ? 'form-show' : 'form-hide'}">
        <div class="setting-input-div">
            <label for="input-columns">Numero di colonne</label>
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
            <label for="input-returnSpacing">Spazio sui ritorni</label>
            <input
                bind:checked={settings.returnSpacing}
                type="checkbox"
                name="returnSpacing"
                id="input-returnSpacing"
            />
        </div>
        <div class="setting-input-div">
            <label for="input-bicolorRows">Colori righe alternati</label>
            <input
                bind:checked={settings.bicolorRows}
                type="checkbox"
                name="bicolorRows"
                id="input-bicolorRows"
            />
        </div>
        <div class="setting-input-div">
            <label for="input-returnColor">Colore ritorni</label>
            <div class="color-input">
                <input
                    bind:value={settings.returnColor}
                    type="color"
                    name="returnColor"
                    id="input-returnColor"
                />
                <div class="color-input">
                    <input
                        bind:checked={settings.returnColorTransparent}
                        type="checkbox"
                        name="returnColorTransparent"
                        id="input-returnColorTransparent"
                    />
                    <label for="input-returnColorTransparent">Trasparente</label>
                </div>
            </div>
        </div>
        <div class="setting-input-div">
            <label for="input-pauseColor">Colore pause</label>
            <div class="color-input">
                <input
                    bind:value={settings.pauseColor}
                    type="color"
                    name="pauseColor"
                    id="input-pauseColor"
                />
                <div class="color-input">
                    <input
                        bind:checked={settings.pauseColorTransparent}
                        type="checkbox"
                        name="pauseColorTransparent"
                        id="input-pauseColorTransparent"
                    />
                    <label for="input-pauseColorTransparent">Trasparente</label>
                </div>
            </div>
        </div>
        <button class="settings-btn" on:click={resetSettings}>⟲ Ripristina</button>
    </div>
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
        transition: margin-top 0.25s ease-in-out;
    }
    .setting-input-div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    input {
        outline: none;
        width: 5em;
    }
    input[type="color"] {
        background: none;
        border: none;
        border-radius: 5px;
    }
    @supports (-webkit-appearance: none) or (-moz-appearance: none) {
        input[type="checkbox"] {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            width: 18px;
            margin: 0 5px;
        }
        input[type="checkbox"]:after {
            border: 1px solid white;
            border-radius: 5px;
            display: inline-block;
            height: 18px;
            width: 18px;
            color: var(--text-color);
            display: flex;
            align-items: center;
            justify-content: space-around;
            font-weight: bolder;
            cursor: pointer;
            content: "";
            background-color: var(--bg-color);
        }
        input[type="checkbox"]:checked::after {
            content: "✓";
            background-color: var(--primary-color);
        }
    }
    .color-input {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
    }
    .form-show {
        margin-top: 0;
    }
    .form-hide {
        margin-top: -100%;
    }
</style>
