import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { State } from '../state';
import { Label } from './Label';
import { StateConnection } from './StateConnection';

export abstract class Transition {

    source: State;
    destination: State;
    connectionStrategy: StateConnection
    
    constructor(source: State, destination: State, connection: StateConnection) {
        this.source = source;
        this.destination = destination;
        this.connectionStrategy = connection;
    }

    path(): string {
        return this.connectionStrategy.path(this.source, this.destination);
    }

    abstract labels(): Label[];

    abstract delete(): void;

    abstract openTransitionDialog(dialog: MatDialog): MatDialogRef<any, any>;
}