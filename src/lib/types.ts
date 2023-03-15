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
    public fontSize: number;
    public bicolorRows: boolean;
    public returnSpacing: boolean;
    public returnColor: string;
    public returnColorTransparent: boolean;
    public colorReturningBells: boolean;
    public pauseColor: string;
    public pauseColorTransparent: boolean;
    public boldChords: boolean;

    constructor() {
        this.columns = 13;
        this.fontSize = 14;
        this.bicolorRows = true;
        this.returnSpacing = true;
        this.returnColor = "#ff9d9d";
        this.returnColorTransparent = false;
        this.colorReturningBells = false;
        this.pauseColor = "#b5ffb5";
        this.pauseColorTransparent = false;
        this.boldChords = false;
    }

    public static fromStorage(src: string) {
        const res = new UserSettings();
        const obj: Partial<UserSettings> = JSON.parse(src);
        const columns = Number(obj.columns);
        if (columns >= 7 && columns <= 15) {
            res.columns = columns;
        }
        const fontSize = Number(obj.fontSize);
        if (fontSize >= 7 && fontSize <= 20) {
            res.fontSize = fontSize;
        }
        res.bicolorRows = Boolean(obj.bicolorRows);
        res.returnSpacing = Boolean(obj.returnSpacing);
        res.returnColorTransparent = Boolean(obj.returnColorTransparent);
        res.pauseColorTransparent = Boolean(obj.pauseColorTransparent);
        res.colorReturningBells = Boolean(obj.colorReturningBells);
        const colorRE = /^#[0-9a-d]{6}$/;
        if (obj.returnColor?.match(colorRE)) {
            res.returnColor = obj.returnColor;
        }
        if (obj.pauseColor?.match(colorRE)) {
            res.pauseColor = obj.pauseColor;
        }
        res.boldChords = Boolean(obj.boldChords);
        return res;
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

type StyleKey = "background-color" | "font-size";
export class Style {
    private readonly props: Partial<Record<string, string>> = {};

    public set(key: StyleKey, value: string) {
        this.props[key] = value;
    }

    public get html() {
        if (Object.keys(this.props).length === 0) {
            return "";
        } else {
            const str = Object.keys(this.props)
                .map((key) => key + ": " + this.props[key])
                .join(";");
            return `style="${str}"`;
        }
    }
}
