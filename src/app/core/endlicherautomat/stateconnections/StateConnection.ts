import { State } from "../state";

export abstract class StateConnection {
    abstract path(source: State, destination: State): string;
}