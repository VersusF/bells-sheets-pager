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
    public pauseColor: string;

    constructor() {
        this.columns = 13;
        this.bicolorRows = true;
        this.returnSpacing = true;
        this.returnColor = "#ff9d9d";
        this.pauseColor = "#b5ffb5";
    }
}
