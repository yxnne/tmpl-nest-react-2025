import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'yaml';

export function yamlConfigLoader() {
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
  const file = env === 'prod' ? '.prod.yaml' : '.dev.yaml';
  const filePath = path.join(process.cwd(), 'config', file);

  if (!fs.existsSync(filePath)) {
    // 返回一个空配置以避免应用启动失败
    return {};
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const cfg = parse(raw) || {};

  // console.log('load cfg :', cfg);

  return { 
    ...cfg, 
    database: cfg.MY_SQL,
    auth: cfg.AUTH,
  };
}