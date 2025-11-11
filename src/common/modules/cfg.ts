import { ConfigModule } from "@nestjs/config";
import { yamlConfigLoader } from "../../config/yaml.config";

export const MyCfgModule = ConfigModule.forRoot({
  isGlobal: true,
  ignoreEnvFile: true,
  load: [yamlConfigLoader],
})