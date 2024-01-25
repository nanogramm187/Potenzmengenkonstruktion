import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { State } from '../state';
import { Label } from './Label';
import { StateConnection } from './StateConnection';
import { SelfStateConnection } from './SelfStateConnection';
import { BidirectionalStateConnection } from './BidirectionalStateConnection';
import { UnidirectionalStateConnection } from './UnidirectionalStateConnection';
import { EmptyStateConnection } from './EmptyStateConnection';

export abstract class Transition {

    source: State;
    destination: State;
    
    constructor(source: State, destination: State) {
        this.source = source;
        this.destination = destination;
    }

    private get connection(): StateConnection {
        if (this.source.hasConnectionTo(this.destination)) {
            if (this.source === this.destination) {
                return new SelfStateConnection();
            } else if (this.destination.hasConnectionTo(this.source)) {
                return new BidirectionalStateConnection();
            }
            return new UnidirectionalStateConnection();
        }
        return new EmptyStateConnection();
    }

    path(): string {
        return this.connection.path(this.source, this.destination);
    }

    abstract isEmpty(): boolean;

    abstract labels(): Label[];

    abstract openTransitionDialog(dialog: MatDialog): MatDialogRef<any, any>;
}