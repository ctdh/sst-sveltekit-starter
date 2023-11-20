import { RDSData } from '@aws-sdk/client-rds-data';
import { Kysely, type Selectable } from 'kysely';
import { DataApiDialect } from 'kysely-data-api';
import { RDS } from 'sst/node/rds';
import type { Database } from './sql.generated';

export const DB = new Kysely<Database>({
	dialect: new DataApiDialect({
		mode: 'postgres',
		driver: {
			secretArn: RDS.Cluster.secretArn,
			resourceArn: RDS.Cluster.clusterArn,
      database: RDS.Cluster.defaultDatabaseName,
			client: new RDSData({})
		}
	})
});

console.log(RDS.Cluster.clusterArn, RDS.Cluster.defaultDatabaseName);

export type Row = {
	[Key in keyof Database]: Selectable<Database[Key]>;
};

export * as SQL from './sql';