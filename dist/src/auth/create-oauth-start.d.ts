import { Context } from 'koa';
import { OAuthStartOptions } from '../types';
export default function createOAuthStart(options: OAuthStartOptions, callbackPath: string, apiKey: string): (ctx: Context) => ((ctx: Context) => void) | undefined;
//# sourceMappingURL=create-oauth-start.d.ts.map