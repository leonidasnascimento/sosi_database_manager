import { DataProvider } from "../base/DataProvider";
import { Input } from "sosi_components_database_interfaces/lib/classes/Input";
import { Output } from "sosi_components_database_interfaces/lib/classes/Output";
import { EnumConnectionState } from "sosi_components_database_interfaces/lib/enum/EnumConnectionState"
import { Tedis } from "tedis";
import { redis } from "../../dbconfig.json";

export class Redis extends DataProvider<Tedis> {
    private redisCli?: Tedis;
    private connectionState: EnumConnectionState

    constructor() {
        super();

        this.connectionState = EnumConnectionState.Disconnected
        this.redisCli = undefined;
    }

    protected ExecuteSelect<TOutput>(command: Input): Output<TOutput> | undefined {
        if (command === undefined ||
            command === null ||
            this.redisCli === null ||
            this.redisCli === undefined ||
            this.connectionState !== EnumConnectionState.Connected) {
            throw new Error("Error on trying to execute reading process. Please, connect to the data repo");
        }

        let output: Output<any>;
        output = new Output<any>();

        if (this.redisCli.exists(String(command.ObjectKey))) {
            this.redisCli.hgetall(String(command.ObjectKey))
                .then((value) => {
                    output.ExecutionMessage = "";
                    output.ExecutionResult = value;
                    output.KeyFound = true;
                    output.RepositoryFound = true;
                    output.WasQuerySuccessfullyExecuted = true;
                }).catch((reason) => {
                    output.ExecutionMessage = reason;
                    output.ExecutionResult = null;
                    output.KeyFound = false;
                    output.RepositoryFound = false;
                    output.WasQuerySuccessfullyExecuted = false;
                });
        }

        return output;
    }

    protected ExecuteScriptedCommand<TOutput>(command: Input): Output<TOutput> | undefined {
        throw new Error("Not implemented");
    }

    protected ExecuteAdd(command: Input): Output<boolean> | undefined {
        if (command === undefined ||
            command === null ||
            this.redisCli === null ||
            this.redisCli === undefined ||
            this.connectionState !== EnumConnectionState.Connected) {
            throw new Error("Error on trying to execute the process. Please, connect to the data repo");
        }

        let output: Output<boolean>;
        output = new Output<boolean>();

        this.redisCli
            .set(String(command.ObjectKey), JSON.stringify(command.ListOfObjects))
            .then((value) => {
                output.ExecutionMessage = String(value);
                output.ExecutionResult = true;
                output.KeyFound = true;
                output.RepositoryFound = true;
                output.WasQuerySuccessfullyExecuted = true;
            })
            .catch((reason) =>{
                output.ExecutionMessage = reason;
                output.ExecutionResult = false;
                output.KeyFound = false;
                output.RepositoryFound = false;
                output.WasQuerySuccessfullyExecuted = false;
            });

        return output;
    }

    public GetConnectionState(): EnumConnectionState {
        return this.connectionState;
    }

    public Connect(): boolean {
        if (this.connectionState === EnumConnectionState.Connected) {
            return true;
        }

        this.redisCli = new Tedis(redis);
        this.connectionState = EnumConnectionState.Connected;
        this.Client = this.redisCli

        return true;
    }

    public Disconnect(): boolean {
        if (this.redisCli === null || this.redisCli === undefined) {
            return true;
        } else {
            this.redisCli.close();
            this.connectionState = EnumConnectionState.Disconnected;

            return true;
        }
    }
}