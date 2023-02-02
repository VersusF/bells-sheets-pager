/**
 * Converts the user input into an array of cells, each one representing a musical stroke
 * @param raw
 * @returns
 */
function parseRawInput(raw: string) {
    const filtered = raw
        .toUpperCase()
        .trim()
        .replace(/[ \n\t]/g, ",") // Replace all kind of space with a comma
        .replace(/[,]*\/[,]*/g, "/") // trim spaces around slashes
        .replace(/[,]+/g, ",") // Replace all repeated commas
        .replace(/[^0-9ABCP,/]/g, ""); // Keep only valid characters
    const notes = filtered.split(",");
    const cells: string[] = [notes[0]];
    for (let i = 1; i < notes.length; i++) {
        const note = notes[i];

        let returnWritten = false;
        const currentBells = note.replace(/\//g, "");
        const previousBells = cells[cells.length - 1].replace(/\//g, "");
        for (let j = 0; j < currentBells.length && !returnWritten; j++) {
            if (previousBells.includes(currentBells[j])) {
                cells.push("");
                returnWritten = true;
            }
        }

        cells.push(note);
    }
    return cells;
}

export function sheetToPage(raw: string) {
    const cells = parseRawInput(raw);
    console.log(cells);
}
