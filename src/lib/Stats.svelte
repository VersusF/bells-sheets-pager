<script>
    import Histogram from "./Histogram.svelte";
    import { SheetStats } from "./types";

    export let stats = new SheetStats();
</script>

<h4>Battute per campana</h4>
<div class="notes-count">
    <Histogram data={stats.noteCount} />
</div>

<style>
    .notes-count {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 90%;
        max-width: 300px;
    }
</style>
