// @ts-check
const ua = process.env.npm_config_user_agent;
console.log('ua', ua);
const isPnpm = typeof ua === 'string' && ua.includes('pnpm');
if (!isPnpm) {
  console.error(
    '\n❌ 本项目仅支持使用 pnpm 管理依赖。' +
      '\n请使用：pnpm install 或 pnpm i' +
      `\n当前 user agent: ${ua ?? '未提供'}` +
      '\n',
  );
  process.exit(1);
}
