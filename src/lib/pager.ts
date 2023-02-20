import { base } from "$app/paths";
import jsPDF from "jspdf";
import type { UserInput, UserSettings } from "./types";

/**
 * Converts the user input into an array of cells, each one representing a musical stroke
 * @param raw
 * @returns
 */
function computeCells(raw: string) {
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

async function populateTemplate(userInput: UserInput, cells: string[], settings: UserSettings) {
    const res = await fetch(base + "/templates/sheet-template.html");
    const template = await res.text();
    let tableCells = "";
    let buffer: string[] = [];
    let oddRow = true;
    const printRow = () => {
        const color = oddRow && settings.bicolorRows ? "#eee" : "#fff";
        tableCells += `<tr style="background-color: ${color};">${buffer.join("")}</tr>`;
        buffer = [];
        oddRow = !oddRow;
    };
    const returnStyle = settings.returnColorTransparent
        ? ""
        : `style="background-color: ${settings.returnColor}"`;
    const pauseStyle = settings.pauseColorTransparent
        ? ""
        : `style="background-color: ${settings.pauseColor}"`;
    cells.forEach((cell, i) => {
        if (cell === "P") {
            buffer.push(`<td ${pauseStyle}>P</td>`);
        } else if (cell === "") {
            if (settings.returnSpacing) {
                buffer.push(`<td ${returnStyle}></td>`);
            }
        } else {
            let colspan = "";
            if (cell.length > 5) {
                colspan = 'colspan="2"';
                if (buffer.length === settings.columns - 1) {
                    // Avoid colspan 2 on the last cell of the row
                    buffer.push("<td></td>");
                    printRow();
                }
            }
            let style = "";
            const isReturn = cells[i + 1] === "" || cells[i - 1] === "";
            if (settings.colorReturningBells && isReturn) {
                style = returnStyle;
            }
            let content = cell;
            if (settings.boldChords && cell.length > 2) {
                content = `<strong>${cell}</strong>`;
            }
            buffer.push(`<td ${colspan} ${style}>${content}</td>`);
        }
        if (buffer.length === settings.columns) {
            printRow();
        }
    });
    printRow();

    const sheet = template
        .replace(/%TITLE%/g, userInput.title)
        .replace("%AUTHOR%", userInput.author)
        .replace("%ROW_NUMBER%", Math.ceil(cells.length / settings.columns).toString())
        .replace("%NOTES_COUNT%", cells.filter((c) => c && c != "P").length.toString())
        .replace("%CELLS%", tableCells);

    return sheet;
}

function exportPdf(html: string) {
    const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
    });
    doc.html(html, {
        callback: () => {
            doc.save("sheet.pdf");
        },
        width: 211,
        windowWidth: 800,
        margin: [15, 10, 10, 10],
    });
}

export async function sheetToPage(userInput: UserInput, settings: UserSettings) {
    const cells = computeCells(userInput.raw);
    const html = await populateTemplate(userInput, cells, settings);
    exportPdf(html);
    return cells;
}
