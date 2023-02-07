<script lang="ts">
    export let data: Record<string, number> = {};
    export let barWidth = 10;
    export let spacing = 2;

    // Dynamic variables, recomputed when data changes
    $: length = Object.keys(data).length;
    $: max = Math.max(...Object.values(data));
    $: dimensions = {
        width: length * barWidth + (length - 1) * spacing,
    };
</script>

<svg viewBox="0 0 {dimensions.width} {120}" width="100%" height="10em">
    {#each Object.keys(data) as item, i}
        <rect
            x={i * (barWidth + spacing)}
            y={100 - (data[item] / max) * 100}
            width={barWidth}
            height={(data[item] / max) * 100}
        >
            <title>{data[item] + " battut" + (data[item] === 1 ? "a" : "e")}</title>
        </rect>
        <text
            x={i * (barWidth + spacing) + barWidth / 2}
            y={115}
            dominant-baseline="middle"
            text-anchor="middle"
        >
            {item}
        </text>
    {/each}
</svg>

<style>
    svg {
        padding: 1em 2em;
        border-radius: 0.75rem;
        overflow: hidden;
    }
    rect {
        fill: var(--primary-color);
        stroke: var(--shadow-color-hover);
        stroke-linejoin: round;
        stroke-linecap: round;
        stroke-width: 0.5px;
    }
    text {
        fill: var(--text-color);
        font-size: 0.75em;
    }
</style>
