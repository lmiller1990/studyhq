import { e as eventHandler, f as defu, u as useRuntimeConfig, h as getQuery, i as createError, j as getRequestURL, c as sendRedirect, w as withQuery, o as ofetch, p as parsePath, k as parseURL, l as stringifyParsedURL } from '../runtime.mjs';
import { randomUUID } from 'node:crypto';

function githubEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.github, {
      authorizationURL: "https://github.com/login/oauth/authorize",
      tokenURL: "https://github.com/login/oauth/access_token",
      authorizationParams: {}
    });
    const query = getQuery(event);
    if (query.error) {
      const error = createError({
        statusCode: 401,
        message: `GitHub login failed: ${query.error || "Unknown error"}`,
        data: query
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    if (!config.clientId || !config.clientSecret) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_GITHUB_CLIENT_ID or NUXT_OAUTH_GITHUB_CLIENT_SECRET env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    if (!query.code) {
      config.scope = config.scope || [];
      if (config.emailRequired && !config.scope.includes("user:email")) {
        config.scope.push("user:email");
      }
      const redirectUrl = getRequestURL(event).href;
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const tokens = await $fetch(
      config.tokenURL,
      {
        method: "POST",
        body: {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: query.code
        }
      }
    );
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `GitHub login failed: ${tokens.error || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const user = await ofetch("https://api.github.com/user", {
      headers: {
        "User-Agent": `Github-OAuth-${config.clientId}`,
        "Authorization": `token ${accessToken}`
      }
    });
    if (!user.email && config.emailRequired) {
      const emails = await ofetch("https://api.github.com/user/emails", {
        headers: {
          "User-Agent": `Github-OAuth-${config.clientId}`,
          "Authorization": `token ${accessToken}`
        }
      });
      const primaryEmail = emails.find((email) => email.primary);
      if (!primaryEmail) {
        throw new Error("GitHub login failed: no user email found");
      }
      user.email = primaryEmail.email;
    }
    return onSuccess(event, {
      user,
      tokens
    });
  });
}

function googleEventHandler({
  config,
  onSuccess,
  onError
}) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.google, {
      authorizationURL: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenURL: "https://oauth2.googleapis.com/token",
      userURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_GOOGLE_CLIENT_ID env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || ["email", "profile"];
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const body = {
      grant_type: "authorization_code",
      redirect_uri: parsePath(redirectUrl).pathname,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code
    };
    const tokens = await ofetch(config.tokenURL, {
      method: "POST",
      body
    }).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Google login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const user = await ofetch(
      config.userURL,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function spotifyEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.spotify, {
      authorizationURL: "https://accounts.spotify.com/authorize",
      tokenURL: "https://accounts.spotify.com/api/token",
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId || !config.clientSecret) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_SPOTIFY_CLIENT_ID or NUXT_OAUTH_SPOTIFY_CLIENT_SECRET env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || [];
      if (config.emailRequired && !config.scope.includes("user-read-email")) {
        config.scope.push("user-read-email");
      }
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const authCode = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
    const tokens = await ofetch(
      config.tokenURL,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${authCode}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        params: {
          grant_type: "authorization_code",
          redirect_uri: parsePath(redirectUrl).pathname,
          code
        }
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Spotify login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const user = await ofetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function twitchEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.twitch, {
      authorizationURL: "https://id.twitch.tv/oauth2/authorize",
      tokenURL: "https://id.twitch.tv/oauth2/token",
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_TWITCH_CLIENT_ID env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || [];
      if (config.emailRequired && !config.scope.includes("user:read:email")) {
        config.scope.push("user:read:email");
      }
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const tokens = await ofetch(
      config.tokenURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        params: {
          grant_type: "authorization_code",
          redirect_uri: parsePath(redirectUrl).pathname,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code
        }
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Twitch login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const users = await ofetch("https://api.twitch.tv/helix/users", {
      headers: {
        "Client-ID": config.clientId,
        "Authorization": `Bearer ${accessToken}`
      }
    });
    const user = users.data?.[0];
    if (!user) {
      const error = createError({
        statusCode: 500,
        message: "Could not get Twitch user",
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function auth0EventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.auth0, {
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId || !config.clientSecret || !config.domain) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_AUTH0_CLIENT_ID or NUXT_OAUTH_AUTH0_CLIENT_SECRET or NUXT_OAUTH_AUTH0_DOMAIN env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const authorizationURL = `https://${config.domain}/authorize`;
    const tokenURL = `https://${config.domain}/oauth/token`;
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || ["openid", "offline_access"];
      if (config.emailRequired && !config.scope.includes("email")) {
        config.scope.push("email");
      }
      return sendRedirect(
        event,
        withQuery(authorizationURL, {
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          audience: config.audience || "",
          max_age: config.maxAge || 0,
          connection: config.connection || "",
          ...config.authorizationParams
        })
      );
    }
    const tokens = await ofetch(
      tokenURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: {
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: parsePath(redirectUrl).pathname,
          code
        }
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Auth0 login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const tokenType = tokens.token_type;
    const accessToken = tokens.access_token;
    const user = await ofetch(`https://${config.domain}/userinfo`, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`
      }
    });
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function microsoftEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.microsoft, {
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId || !config.clientSecret || !config.tenant) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_MICROSOFT_CLIENT_ID or NUXT_OAUTH_MICROSOFT_CLIENT_SECRET or NUXT_OAUTH_MICROSOFT_TENANT env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const authorizationURL = config.authorizationURL || `https://login.microsoftonline.com/${config.tenant}/oauth2/v2.0/authorize`;
    const tokenURL = config.tokenURL || `https://login.microsoftonline.com/${config.tenant}/oauth2/v2.0/token`;
    const redirectUrl = config.redirectUrl || getRequestURL(event).href;
    if (!code) {
      const scope = config.scope && config.scope.length > 0 ? config.scope : ["User.Read"];
      return sendRedirect(
        event,
        withQuery(authorizationURL, {
          client_id: config.clientId,
          response_type: "code",
          redirect_uri: redirectUrl,
          scope: scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("client_id", config.clientId);
    data.append("client_secret", config.clientSecret);
    data.append("redirect_uri", parsePath(redirectUrl).pathname);
    data.append("code", String(code));
    const tokens = await ofetch(
      tokenURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Microsoft login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const tokenType = tokens.token_type;
    const accessToken = tokens.access_token;
    const userURL = config.userURL || "https://graph.microsoft.com/v1.0/me";
    const user = await ofetch(userURL, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`
      }
    }).catch((error) => {
      return { error };
    });
    if (user.error) {
      const error = createError({
        statusCode: 401,
        message: `Microsoft login failed: ${user.error || "Unknown error"}`,
        data: user
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function discordEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.discord, {
      authorizationURL: "https://discord.com/oauth2/authorize",
      tokenURL: "https://discord.com/api/oauth2/token",
      profileRequired: true,
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId || !config.clientSecret) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_DISCORD_CLIENT_ID or NUXT_OAUTH_DISCORD_CLIENT_SECRET env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || [];
      if (config.emailRequired && !config.scope.includes("email")) {
        config.scope.push("email");
      }
      if (config.profileRequired && !config.scope.includes("identify")) {
        config.scope.push("identify");
      }
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const parsedRedirectUrl = parseURL(redirectUrl);
    parsedRedirectUrl.search = "";
    const tokens = await ofetch(
      config.tokenURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          grant_type: "authorization_code",
          redirect_uri: stringifyParsedURL(parsedRedirectUrl),
          code
        }).toString()
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Discord login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const user = await ofetch("https://discord.com/api/users/@me", {
      headers: {
        "user-agent": "Nuxt Auth Utils",
        "Authorization": `Bearer ${accessToken}`
      }
    });
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function battledotnetEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.battledotnet, {
      authorizationURL: "https://oauth.battle.net/authorize",
      tokenURL: "https://oauth.battle.net/token",
      authorizationParams: {}
    });
    const query = getQuery(event);
    const { code } = query;
    if (query.error) {
      const error = createError({
        statusCode: 401,
        message: `Battle.net login failed: ${query.error || "Unknown error"}`,
        data: query
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    if (!config.clientId || !config.clientSecret) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_BATTLEDOTNET_CLIENT_ID or NUXT_OAUTH_BATTLEDOTNET_CLIENT_SECRET env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    if (!code) {
      config.scope = config.scope || ["openid"];
      config.region = config.region || "EU";
      if (config.region === "CN") {
        config.authorizationURL = "https://oauth.battlenet.com.cn/authorize";
        config.tokenURL = "https://oauth.battlenet.com.cn/token";
      }
      const redirectUrl2 = getRequestURL(event).href;
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          client_id: config.clientId,
          redirect_uri: redirectUrl2,
          scope: config.scope.join(" "),
          state: randomUUID(),
          // Todo: handle PKCE flow
          response_type: "code",
          ...config.authorizationParams
        })
      );
    }
    const redirectUrl = getRequestURL(event).href;
    config.scope = config.scope || [];
    if (!config.scope.includes("openid")) {
      config.scope.push("openid");
    }
    const authCode = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
    const tokens = await $fetch(
      config.tokenURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${authCode}`
        },
        params: {
          code,
          grant_type: "authorization_code",
          scope: config.scope.join(" "),
          redirect_uri: parsePath(redirectUrl).pathname
        }
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Battle.net login failed: ${tokens.error || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const user = await ofetch("https://oauth.battle.net/userinfo", {
      headers: {
        "User-Agent": `Battledotnet-OAuth-${config.clientId}`,
        "Authorization": `Bearer ${accessToken}`
      }
    });
    if (!user) {
      const error = createError({
        statusCode: 500,
        message: "Could not get Battle.net user",
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    return onSuccess(event, {
      user,
      tokens
    });
  });
}

function keycloakEventHandler({
  config,
  onSuccess,
  onError
}) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.keycloak, {
      authorizationParams: {}
    });
    const query = getQuery(event);
    const { code } = query;
    if (query.error) {
      const error = createError({
        statusCode: 401,
        message: `Keycloak login failed: ${query.error || "Unknown error"}`,
        data: query
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    if (!config.clientId || !config.clientSecret || !config.serverUrl || !config.realm) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_KEYCLOAK_CLIENT_ID or NUXT_OAUTH_KEYCLOAK_CLIENT_SECRET or NUXT_OAUTH_KEYCLOAK_SERVER_URL or NUXT_OAUTH_KEYCLOAK_REALM env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const realmURL = `${config.serverUrl}/realms/${config.realm}`;
    const authorizationURL = `${realmURL}/protocol/openid-connect/auth`;
    const tokenURL = `${realmURL}/protocol/openid-connect/token`;
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || ["openid"];
      return sendRedirect(
        event,
        withQuery(authorizationURL, {
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          response_type: "code",
          ...config.authorizationParams
        })
      );
    }
    config.scope = config.scope || [];
    if (!config.scope.includes("openid")) {
      config.scope.push("openid");
    }
    const tokens = await ofetch(tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: "authorization_code",
        redirect_uri: parsePath(redirectUrl).pathname,
        code
      }).toString()
    }).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Keycloak login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const user = await ofetch(
      `${realmURL}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json"
        }
      }
    );
    if (!user) {
      const error = createError({
        statusCode: 500,
        message: "Could not get Keycloak user",
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    return onSuccess(event, {
      user,
      tokens
    });
  });
}

function linkedinEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.linkedin, {
      authorizationURL: "https://www.linkedin.com/oauth/v2/authorization",
      tokenURL: "https://www.linkedin.com/oauth/v2/accessToken",
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId || !config.clientSecret) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_LINKEDIN_CLIENT_ID or NUXT_OAUTH_LINKEDIN_CLIENT_SECRET env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || [];
      if (!config.scope.length) {
        config.scope.push("profile", "openid", "email");
      }
      if (config.emailRequired && !config.scope.includes("email")) {
        config.scope.push("email");
      }
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          response_type: "code",
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const parsedRedirectUrl = parseURL(redirectUrl);
    parsedRedirectUrl.search = "";
    const tokens = await ofetch(
      config.tokenURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: config.clientId,
          client_secret: config.clientSecret,
          redirect_uri: stringifyParsedURL(parsedRedirectUrl)
        }).toString()
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `LinkedIn login failed: ${tokens.error?.data?.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    const user = await ofetch("https://api.linkedin.com/v2/userinfo", {
      headers: {
        "user-agent": "Nuxt Auth Utils",
        "Authorization": `Bearer ${accessToken}`
      }
    });
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function cognitoEventHandler({ config, onSuccess, onError }) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.cognito, {
      authorizationParams: {}
    });
    const { code } = getQuery(event);
    if (!config.clientId || !config.clientSecret || !config.userPoolId || !config.region) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_COGNITO_CLIENT_ID, NUXT_OAUTH_COGNITO_CLIENT_SECRET, NUXT_OAUTH_COGNITO_USER_POOL_ID, or NUXT_OAUTH_COGNITO_REGION env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const authorizationURL = `https://${config.userPoolId}.auth.${config.region}.amazoncognito.com/oauth2/authorize`;
    const tokenURL = `https://${config.userPoolId}.auth.${config.region}.amazoncognito.com/oauth2/token`;
    const redirectUrl = getRequestURL(event).href;
    if (!code) {
      config.scope = config.scope || ["openid", "profile"];
      return sendRedirect(
        event,
        withQuery(authorizationURL, {
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          response_type: "code",
          scope: config.scope.join(" "),
          ...config.authorizationParams
        })
      );
    }
    const tokens = await ofetch(
      tokenURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `grant_type=authorization_code&client_id=${config.clientId}&client_secret=${config.clientSecret}&redirect_uri=${parsePath(redirectUrl).pathname}&code=${code}`
      }
    ).catch((error) => {
      return { error };
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Cognito login failed: ${tokens.error_description || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const tokenType = tokens.token_type;
    const accessToken = tokens.access_token;
    const user = await ofetch(`https://${config.userPoolId}.auth.${config.region}.amazoncognito.com/oauth2/userInfo`, {
      headers: {
        Authorization: `${tokenType} ${accessToken}`
      }
    });
    return onSuccess(event, {
      tokens,
      user
    });
  });
}

function facebookEventHandler({
  config,
  onSuccess,
  onError
}) {
  return eventHandler(async (event) => {
    config = defu(config, useRuntimeConfig(event).oauth?.facebook, {
      authorizationURL: "https://www.facebook.com/v19.0/dialog/oauth",
      tokenURL: "https://graph.facebook.com/v19.0/oauth/access_token",
      authorizationParams: {}
    });
    const query = getQuery(event);
    if (query.error) {
      const error = createError({
        statusCode: 401,
        message: `Facebook login failed: ${query.error || "Unknown error"}`,
        data: query
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    if (!config.clientId) {
      const error = createError({
        statusCode: 500,
        message: "Missing NUXT_OAUTH_FACEBOOK_CLIENT_ID or NUXT_OAUTH_FACEBOOK_CLIENT_SECRET env variables."
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const redirectUrl = getRequestURL(event).href;
    if (!query.code) {
      config.scope = config.scope || [];
      return sendRedirect(
        event,
        withQuery(config.authorizationURL, {
          client_id: config.clientId,
          redirect_uri: redirectUrl,
          scope: config.scope.join(" ")
        })
      );
    }
    const tokens = await $fetch(config.tokenURL, {
      method: "POST",
      body: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: redirectUrl,
        code: query.code
      }
    });
    if (tokens.error) {
      const error = createError({
        statusCode: 401,
        message: `Facebook login failed: ${tokens.error || "Unknown error"}`,
        data: tokens
      });
      if (!onError)
        throw error;
      return onError(event, error);
    }
    const accessToken = tokens.access_token;
    config.fields = config.fields || ["id", "name"];
    const fields = config.fields.join(",");
    const user = await ofetch(
      `https://graph.facebook.com/v19.0/me?fields=${fields}&access_token=${accessToken}`
    );
    if (!user) {
      throw new Error("Facebook login failed: no user found");
    }
    return onSuccess(event, {
      user,
      tokens
    });
  });
}

const oauth = {
  githubEventHandler,
  spotifyEventHandler,
  googleEventHandler,
  twitchEventHandler,
  auth0EventHandler,
  microsoftEventHandler,
  discordEventHandler,
  battledotnetEventHandler,
  keycloakEventHandler,
  linkedinEventHandler,
  cognitoEventHandler,
  facebookEventHandler
};

export { oauth as o };
//# sourceMappingURL=oauth.mjs.map
