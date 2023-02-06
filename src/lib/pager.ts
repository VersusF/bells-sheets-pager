import { base } from "$app/paths";
import jsPDF from "jspdf";
import type { UserInput } from "./types";

const ROW_NOTES = 13;

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

async function populateTemplate(userInput: UserInput, cells: string[]) {
    const res = await fetch(base + "/templates/sheet-template.html");
    const template = await res.text();
    let tableCells = "";
    let buffer = "";
    let oddRow = false;
    const printRow = () => {
        const color = oddRow ? "#fff" : "#eee";
        tableCells += `<tr style="background-color: ${color};">${buffer}</tr>`;
        buffer = "";
        oddRow = !oddRow;
    };
    let i = 0;
    for (const cell of cells) {
        if (i > 0 && i % ROW_NOTES === 0) {
            printRow();
        }
        if (cell === "P") {
            buffer += '<td style="background-color: #b5ffb5">P</td>';
        } else if (cell === "") {
            buffer += '<td style="background-color: #ff9d9d"></td>';
        } else if (cell.length > 5) {
            buffer += `<td colspan="2">${cell}</td>`;
            i++;
        } else {
            buffer += `<td>${cell}</td>`;
        }
        i++;
    }
    printRow();

    const sheet = template
        .replace(/%TITLE%/g, userInput.title)
        .replace("%AUTHOR%", userInput.author)
        .replace("%ROW_NUMBER%", Math.ceil(cells.length / ROW_NOTES).toString())
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

export async function sheetToPage(userInput: UserInput) {
    const cells = computeCells(userInput.raw);
    const html = await populateTemplate(userInput, cells);
    exportPdf(html);
}
