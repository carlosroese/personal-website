import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';
import { User } from '../types';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID ?? '';
const FACEBOOK_APP_ID = Constants.expoConfig?.extra?.FACEBOOK_APP_ID ?? '';

export async function signInWithGoogle(): Promise<Partial<User>> {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
  };

  const request = new AuthSession.AuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['openid', 'profile', 'email'],
    redirectUri,
    responseType: AuthSession.ResponseType.Token,
    extraParams: { access_type: 'offline' },
  });

  const result = await request.promptAsync(discovery);

  if (result.type !== 'success') {
    throw new Error('Login com Google cancelado ou falhou.');
  }

  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${result.authentication?.accessToken}` },
  });

  const userInfo = await userInfoResponse.json();

  return {
    id: userInfo.sub,
    email: userInfo.email,
    name: userInfo.name,
    photoURL: userInfo.picture,
    provider: 'google',
  };
}

export async function signInWithFacebook(): Promise<Partial<User>> {
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

  const request = new AuthSession.AuthRequest({
    clientId: FACEBOOK_APP_ID,
    scopes: ['public_profile', 'email'],
    redirectUri,
    responseType: AuthSession.ResponseType.Token,
    extraParams: { display: 'popup' },
  });

  const discovery = {
    authorizationEndpoint: 'https://www.facebook.com/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/oauth/access_token',
  };

  const result = await request.promptAsync(discovery);

  if (result.type !== 'success') {
    throw new Error('Login com Facebook cancelado ou falhou.');
  }

  const userInfoResponse = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${result.authentication?.accessToken}`
  );

  const userInfo = await userInfoResponse.json();

  return {
    id: userInfo.id,
    email: userInfo.email ?? '',
    name: userInfo.name,
    photoURL: userInfo.picture?.data?.url,
    provider: 'facebook',
  };
}

export async function createEmailUser(email: string, password: string, name: string): Promise<User> {
  const id = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    email + password + Date.now()
  );

  return {
    id: id.substring(0, 16),
    email,
    name,
    provider: 'email',
  };
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string): string | null {
  if (password.length < 6) return 'A senha deve ter pelo menos 6 caracteres.';
  return null;
}
