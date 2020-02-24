import { IDataProviderFactory } from "sosi_components_database_interfaces/lib/interfaces/IDataProviderFactory";
import { EnumDataProviders } from "sosi_components_database_interfaces/lib/enum/EnumDataProviders";
import { IDataProvider } from "sosi_components_database_interfaces/lib/interfaces/IDataProvider";
import { Redis } from "./providers/Redis"
import { MsSql } from "./providers/MsSql";
import { Firebase } from "./providers/Firebase";

export class DataBaseFactory implements IDataProviderFactory {
    GetDataProvider(provider: EnumDataProviders): IDataProvider {
        let dataProvider: IDataProvider;
        
        switch (provider) {
            case EnumDataProviders.Redis:
                dataProvider = new Redis();
            case EnumDataProviders.MSSQL:
                dataProvider = new MsSql();
            case EnumDataProviders.Firebase:
                dataProvider = new Firebase();
            default:
                throw Error("Provider Not Implemented");
        }

        return dataProvider;
    }

    public static create<T>(type: (new () => T)): T {
        return new type();
    }
}