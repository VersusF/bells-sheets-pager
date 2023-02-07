export class UserInput {
    public title: string;
    public author: string;
    public raw: string;

    constructor() {
        this.title = "";
        this.author = "";
        this.raw = "";
    }
}

export class UserSettings {
    public columns: number;
    public bicolorRows: boolean;
    public returnSpacing: boolean;
    public returnColor: string;
    public returnColorTransparent: boolean;
    public pauseColor: string;
    public pauseColorTransparent: boolean;

    constructor() {
        this.columns = 13;
        this.bicolorRows = true;
        this.returnSpacing = true;
        this.returnColor = "#ff9d9d";
        this.returnColorTransparent = false;
        this.pauseColor = "#b5ffb5";
        this.pauseColorTransparent = false;
    }
}

export class SheetStats {
    public noteCount: Record<string, number>;

    constructor() {
        this.noteCount = {};
    }

    public static from(cells: string[]) {
        const stats = new SheetStats();
        for (const cell of cells) {
            for (const note of cell.split("/")) {
                if (note && note != "P") {
                    if (!stats.noteCount[note]) {
                        stats.noteCount[note] = 0;
                    }
                    stats.noteCount[note]++;
                }
            }
        }
        return stats;
    }
}
