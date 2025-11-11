import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

export const MyDatabaseModule =  TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const db = config.get('database') as {
      type?: 'mysql';
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      synchronize?: boolean;
      logging?: boolean;
    };
    return {
      type: 'mysql',
      host: db?.host,
      port: db?.port ?? 3306,
      username: db?.username,
      password: db?.password,
      database: db?.database,
      synchronize: db?.synchronize ?? process.env.NODE_ENV !== 'production',
      logging: db?.logging ?? false,
      autoLoadEntities: true,
    };
  },
})