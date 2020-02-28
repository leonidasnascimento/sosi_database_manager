import { IDataProvider } from "sosi_components_database_interfaces/lib/interfaces/IDataProvider";
import { Input } from "sosi_components_database_interfaces/lib/classes/Input";
import { Output } from "sosi_components_database_interfaces/lib/classes/Output";
import { EnumConnectionState } from "sosi_components_database_interfaces/lib/enum/EnumConnectionState";

export abstract class DataProvider<TClient> implements IDataProvider {
  Client?: TClient;

  // Template Methods
  protected abstract ExecuteSelect<TOutput>(
    command: Input
  ): Output<TOutput> | undefined;
  protected abstract ExecuteScriptedCommand<TOutput>(
    command: Input
  ): Output<TOutput> | undefined;
  protected abstract ExecuteAdd(command: Input): Output<boolean> | undefined;
  public abstract GetConnectionState(): EnumConnectionState;
  public abstract Connect(): boolean;
  public abstract Disconnect(): boolean;

  public Select<TOutput>(command: Input): Output<TOutput> | undefined {
    if (this.Connect()) {
      let returnList: Output<TOutput> | undefined;
      returnList = this.ExecuteSelect(command);

      if (!this.Disconnect()) {
        throw new Error("ERROR trying to disconnect the data repository");
      }

      return returnList;
    }

    return;
  }

  public Add(command: Input): Output<boolean> | undefined {
    if (this.Connect()) {
      let returnObj: Output<boolean> | undefined;
      returnObj = this.ExecuteAdd(command);

      if (!this.Disconnect()) {
        throw new Error("ERROR trying to disconnect the data repository");
      }

      return returnObj;
    } else {
      return;
    }
  }

  public CustomFunctionCommand<TOutput>(
    _inputFunction: (dbClient?: any) => Output<TOutput> | undefined
  ): Output<TOutput> | undefined {
    if (this.Connect()) {
      let output: Output<TOutput> | undefined;
      output = _inputFunction(this.Client);

      if (!this.Disconnect()) {
        throw new Error("ERROR trying to disconnect the data repository");
      }

      return output;
    } else {
      return;
    }
  }

  public CustomScriptedCommand<TOutput>(
    command: Input
  ): Output<TOutput> | undefined {
    if (this.Connect()) {
      let output: Output<TOutput> | undefined;
      output = this.ExecuteScriptedCommand(command);

      if (!this.Disconnect()) {
        throw new Error("ERROR trying to disconnect the data repository");
      }

      return output;
    } else {
      return;
    }
  }
}
