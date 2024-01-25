import { State } from "../state";
import { StateConnection } from "./StateConnection";

export class EmptyStateConnection extends StateConnection {
    override path(source: State, destination: State): string {
        return ""
    }
}