import {Context} from 'koa';

import {OAuthStartOptions} from '../types';

import Error from './errors';
import oAuthQueryString from './oauth-query-string';
import getCookieOptions from './cookie-options';

import {TOP_LEVEL_OAUTH_COOKIE_NAME} from './index';

import createApp from '@shopify/app-bridge';
import {Redirect} from '@shopify/app-bridge/actions';

export default function createOAuthStart(
  options: OAuthStartOptions,
  callbackPath: string,
  apiKey: string
) {
  return function oAuthStart(ctx: Context) {
    const {myShopifyDomain} = options;
    const {query} = ctx;
    const {shop} = query;

    const shopRegex = new RegExp(
      `^[a-z0-9][a-z0-9\\-]*[a-z0-9]\\.${myShopifyDomain}$`,
      'i',
    );

    const app = createApp({
      apiKey: apiKey,
      shopOrigin: shop,
    });

    const redirect = Redirect.create(app);

    if (shop == null || !shopRegex.test(shop)) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '', getCookieOptions(ctx));

    const formattedQueryString = oAuthQueryString(ctx, options, callbackPath);

    /*
    ctx.redirect(
      `https://${shop}/admin/oauth/authorize?${formattedQueryString}`,
    );
    */

    redirect.dispatch(Redirect.Action.REMOTE, `https://${shop}/admin/oauth/authorize?${formattedQueryString}`);

  };
}
