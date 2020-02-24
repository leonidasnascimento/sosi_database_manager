import { DataProvider } from "../base/DataProvider";
import { Input } from "sosi_components_database_interfaces/lib/classes/Input";
import { Output } from "sosi_components_database_interfaces/lib/classes/Output";
import { EnumConnectionState } from "sosi_components_database_interfaces/lib/enum/EnumConnectionState"
import { mssql } from "../../dbconfig.json";
import * as sqlserver from "tedious";

export class MsSql extends DataProvider<sqlserver.Connection> {
    protected ExecuteSelect<TOutput>(command: Input): Output<TOutput> | undefined {
        throw new Error("Not implemented");
    }

    protected ExecuteScriptedCommand<TOutput>(command: Input): Output<TOutput> | undefined {
        throw new Error("Not implemented");
    }

    protected ExecuteAdd(command: Input): Output<boolean> | undefined {
        throw new Error("Not implemented");
    }

    public GetConnectionState(): EnumConnectionState {
        throw new Error("Not implemented");
    }

    public Connect(): boolean {
        throw new Error("Not implemented");
    }

    public Disconnect(): boolean {
        throw new Error("Not implemented");
    }
}