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
    columns: number;
    bicolorRows: boolean;
    returnSpacing: boolean;
    returnColor: string;
    pauseColor: string;

    constructor() {
        this.columns = 13;
        this.bicolorRows = true;
        this.returnSpacing = true;
        this.returnColor = "#ff9d9d";
        this.pauseColor = "#b5ffb5";
    }
}
