import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { MyDatabaseModule  } from './common/modules/db';
import { MyCfgModule  } from './common/modules/cfg';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/modules/auth/jwt-auth.guard';

@Module({
  imports: [
    /**
     * 静态服务模块
     * @reference https://docs.nestjs.com/recipes/serve-static
     * @reason 以前的方式莫名不能用了: app.useStaticAssets(join(__dirname, '..', 'public'));
     */
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
    }),
    /** 通用模块 */
    // 全局配置，按环境加载 config/.dev.yaml 或 .prod.yaml
    MyCfgModule,
    // 数据库连接，基于配置中的 database 段
    MyDatabaseModule,

    /** 业务模块 */
    RoleModule,
    UserModule,
    AuthModule,
  ],
  // controllers: [AppController],
  providers: [
    // AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
