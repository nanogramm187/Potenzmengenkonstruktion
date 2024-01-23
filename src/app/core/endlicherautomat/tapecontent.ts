import { Direction } from "./turingedges";

export class Tapecontent {
    private _tapecontent: string[];
    private _reference: number;
    private _headIndex: number;
    private _direction: Direction = Direction.None;

    constructor(tapecontent: string = '') {
        this._tapecontent = tapecontent.split('');
        this._reference = 0;
        this._headIndex = 0;
    }

    public get contentStartingFromHead(): string {
        return this._tapecontent.slice(this._headIndex).join('');
    }

    public get tapecontent(): string[] {
        return this._tapecontent;
    }

    public get headIndex(): number {
        return this._headIndex;
    }

    public get direction(): Direction {
        return this._direction;
    }

    public get headOffset(): number {
        return this._headIndex - this._reference;
    }

    // 0 should always be the head
    public itemAt(index: number): string {
        const item = this._tapecontent[index + this._headIndex];
        if (item) {
            return item;
        }
        return '#'
    }

    public get headSymbol(): string {
        let result = this._tapecontent[this._headIndex]
        if (result) {
            return result;
        } else {
            this._tapecontent[this._headIndex] = '#';
            return '#';
        }
    }

    public set headSymbol(s: string) {
        this._tapecontent[this._headIndex] = s;
    }

    public moveHeadLeft() {
        if (this._headIndex == 0) {
            this._tapecontent.unshift('#');
            this._reference++;
        } else {
            this._headIndex--;
        }
        this._direction = Direction.Left;
    }

    public moveHeadRight() {
        this._headIndex++;
        if (this._headIndex == this._tapecontent.length) {
            this._tapecontent.push('#');
        }
        this._direction = Direction.Right;
    }

    public copy(): Tapecontent {
        const copy = new Tapecontent();
        copy._tapecontent = [...this._tapecontent];
        copy._reference = this._reference;
        copy._headIndex = this._headIndex;
        return copy;
    }
}