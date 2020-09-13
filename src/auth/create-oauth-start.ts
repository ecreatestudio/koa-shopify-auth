import {Context} from 'koa';

import {OAuthStartOptions} from '../types';

import Error from './errors';
import oAuthQueryString from './oauth-query-string';
import getCookieOptions from './cookie-options';

import {TOP_LEVEL_OAUTH_COOKIE_NAME} from './index';
import redirectionPage from "./redirection-page";

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

    if (shop == null || !shopRegex.test(shop)) {
      ctx.throw(400, Error.ShopParamMissing);
      return;
    }

    const formattedQueryString = oAuthQueryString(ctx, options, callbackPath);

    const redirectString = `https://${shop}/admin/oauth/authorize?${formattedQueryString}`;

    const shopRedirect = function topLevelShopRedirect (ctx: Context) {
      ctx.body = redirectionPage({
        origin: 'https://shiplash.herokuapp.com',
        redirectTo: redirectString,
        apiKey,
      });
    };

    ctx.cookies.set(TOP_LEVEL_OAUTH_COOKIE_NAME, '1', getCookieOptions(ctx));
    shopRedirect(ctx);

    /*
    ctx.redirect(
      `https://${shop}/admin/oauth/authorize?${formattedQueryString}`,
    );
    */
  };
}
