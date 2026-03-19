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

function toSafePdfFileName(title: string) {
    const normalized = title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .replace(/-+/g, "-")
        .replace(/_+/g, "_")
        .replace(/^[-_]+|[-_]+$/g, "");

    const baseName = normalized.length > 0 ? normalized : "sheet";
    return `${baseName}.pdf`;
}

async function generatePdf(userInput: UserInput, cells: string[], settings: UserSettings) {
    type RgbColor = [number, number, number];
    type RenderCell = {
        text: string;
        span: number;
        fontSize: number;
        bold: boolean;
        fillColor?: RgbColor;
    };

    const hexToRgb = (hex: string): RgbColor => {
        const clean = hex.replace("#", "");
        const value =
            clean.length === 3
                ? clean
                      .split("")
                      .map((v) => v + v)
                      .join("")
                : clean;
        const num = Number.parseInt(value, 16);
        return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff];
    };

    const countColumns = (row: RenderCell[]) => row.reduce((acc, item) => acc + item.span, 0);

    const rows: RenderCell[][] = [];

    let currentRow: RenderCell[] = [];
    const flushRow = () => {
        if (currentRow.length > 0) {
            rows.push(currentRow);
            currentRow = [];
        }
    };

    const pauseColor = settings.pauseColorTransparent ? undefined : hexToRgb(settings.pauseColor);
    const returnColor = settings.returnColorTransparent
        ? undefined
        : hexToRgb(settings.returnColor);

    cells.forEach((cell, i) => {
        if (cell === "P") {
            currentRow.push({
                text: "P",
                span: 1,
                fontSize: settings.fontSize,
                bold: false,
                fillColor: pauseColor,
            });
        } else if (cell === "") {
            if (settings.returnSpacing) {
                currentRow.push({
                    text: "",
                    span: 1,
                    fontSize: settings.fontSize,
                    bold: false,
                    fillColor: returnColor,
                });
            }
        } else {
            const span = cell.length > 5 ? 2 : 1;
            if (span === 2 && countColumns(currentRow) === settings.columns - 1) {
                // Avoid placing a two-column cell in the last available single column.
                currentRow.push({ text: "", span: 1, fontSize: settings.fontSize, bold: false });
                flushRow();
            }

            const isReturn = cells[i + 1] === "" || cells[i - 1] === "";
            let color = undefined;
            if (settings.colorReturningBells && isReturn) {
                color = hexToRgb(settings.returnColor);
            }
            currentRow.push({
                text: cell,
                span,
                fontSize: settings.fontSize,
                bold: settings.boldChords && cell.length > 2,
                fillColor: color,
            });
        }

        if (countColumns(currentRow) >= settings.columns) {
            flushRow();
        }
    });
    flushRow();

    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const left = 10;
    const top = 15;
    const contentWidth = 190;
    const contentHeight = 278;
    const centerX = pageWidth / 2;

    const rowCount = Math.max(1, rows.length);
    const titleY = top + 10;
    const subtitleY = top + 18;
    const tableY = top + 24;
    const footerY = top + contentHeight - 2;
    const tableBottom = footerY - 8;
    const tableHeight = Math.max(20, tableBottom - tableY);
    const rowHeight = Math.max(7, Math.min(14, tableHeight / rowCount));

    const fitText = (text: string, maxWidth: number, initialSize: number, bold: boolean) => {
        let size = initialSize;
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        while (size > 7 && doc.getTextWidth(text) > maxWidth) {
            size -= 0.5;
            doc.setFontSize(size);
        }
        return size;
    };

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(userInput.title || " ", centerX, titleY, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(userInput.author || " ", centerX, subtitleY, { align: "center" });

    const evenColor: RgbColor = [238, 238, 238];
    const oddColor: RgbColor = [255, 255, 255];
    rows.forEach((row, rowIndex) => {
        const defaultRowColor = settings.bicolorRows && rowIndex % 2 === 0 ? evenColor : oddColor;
        let x = left;
        const y = tableY + rowIndex * rowHeight;

        row.forEach((item) => {
            const cellWidth = (contentWidth / settings.columns) * item.span;
            const fill = item.fillColor ?? defaultRowColor;
            doc.setFillColor(fill[0], fill[1], fill[2]);
            doc.rect(x, y, cellWidth, rowHeight, "F");

            if (item.text) {
                const fontSize = fitText(item.text, cellWidth - 2, item.fontSize, item.bold);
                doc.setFont("helvetica", item.bold ? "bold" : "normal");
                doc.setFontSize(fontSize);
                doc.text(item.text, x + cellWidth / 2, y + rowHeight / 2 + fontSize * 0.16, {
                    align: "center",
                });
            }

            x += cellWidth;
        });
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Totale battute: ${cells.filter((c) => c && c !== "P").length}`, centerX, footerY, {
        align: "center",
    });

    doc.save(toSafePdfFileName(userInput.title));
}

export async function sheetToPage(userInput: UserInput, settings: UserSettings) {
    const cells = computeCells(userInput.raw);
    await generatePdf(userInput, cells, settings);
    return cells;
}
