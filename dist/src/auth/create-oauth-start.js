"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var errors_1 = tslib_1.__importDefault(require("./errors"));
var oauth_query_string_1 = tslib_1.__importDefault(require("./oauth-query-string"));
var cookie_options_1 = tslib_1.__importDefault(require("./cookie-options"));
var index_1 = require("./index");
var app_bridge_1 = tslib_1.__importDefault(require("@shopify/app-bridge"));
var actions_1 = require("@shopify/app-bridge/actions");
function createOAuthStart(options, callbackPath, apiKey) {
    return function oAuthStart(ctx) {
        var myShopifyDomain = options.myShopifyDomain;
        var query = ctx.query;
        var shop = query.shop;
        var shopRegex = new RegExp("^[a-z0-9][a-z0-9\\-]*[a-z0-9]\\." + myShopifyDomain + "$", 'i');
        var app = app_bridge_1.default({
            apiKey: apiKey,
            shopOrigin: shop,
        });
        var redirect = actions_1.Redirect.create(app);
        if (shop == null || !shopRegex.test(shop)) {
            ctx.throw(400, errors_1.default.ShopParamMissing);
            return;
        }
        ctx.cookies.set(index_1.TOP_LEVEL_OAUTH_COOKIE_NAME, '', cookie_options_1.default(ctx));
        var formattedQueryString = oauth_query_string_1.default(ctx, options, callbackPath);
        /*
        ctx.redirect(
          `https://${shop}/admin/oauth/authorize?${formattedQueryString}`,
        );
        */
        redirect.dispatch(actions_1.Redirect.Action.REMOTE, "https://" + shop + "/admin/oauth/authorize?" + formattedQueryString);
    };
}
exports.default = createOAuthStart;
