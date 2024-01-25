import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { State } from '../state';
import { Label } from './Label';
import { StateConnection } from './StateConnection';
import { SelfStateConnection } from './SelfStateConnection';
import { BidirectionalStateConnection } from './BidirectionalStateConnection';
import { UnidirectionalStateConnection } from './UnidirectionalStateConnection';
import { EmptyStateConnection } from './EmptyStateConnection';
import { Size } from '../drawingprimitives/Size';

export abstract class Transition {

    private canvas: HTMLCanvasElement = document.createElement('canvas');
    private ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    public fontSize: number = 16; 
    public fontFamily: string = 'Arial';

    source: State;
    destination: State;
    
    constructor(source: State, destination: State) {
        this.source = source;
        this.destination = destination;
    }

    get connection(): StateConnection {
        if (this.source.hasConnectionTo(this.destination)) {
            if (this.source === this.destination) {
                return new SelfStateConnection(this.source, this.destination);
            } else if (this.destination.hasConnectionTo(this.source)) {
                return new BidirectionalStateConnection(this.source, this.destination);
            }
            return new UnidirectionalStateConnection(this.source, this.destination);
        }
        return new EmptyStateConnection(this.source, this.destination);
    }

    path(): string {
        return this.connection.path();
    }

    labels(): Label[] {
        let boundingBox = new Size(0, this.fontSize * this.displayText().length);

        this.displayText().forEach((text) => {
            const width = this.ctx.measureText(text).width;
            boundingBox.width = Math.max(boundingBox.width, width);
        });

        const centerPoint = this.connection.calculateRectanglePlacementAbovePath(boundingBox.width, boundingBox.height);

        // Move rectangleCenterY to the top of the rectangle
        const yPos = centerPoint.y - boundingBox.height / 2

        return this.displayText().map((text, index) => {
            return new Label(text, centerPoint.x, yPos + index * this.fontSize + this.fontSize / 2)
        });
    }

    abstract displayText(): string[];

    abstract isEmpty(): boolean;

    abstract openTransitionDialog(dialog: MatDialog): MatDialogRef<any, any>;
}