import { supabase } from './supabaseClient';

const DEMO_EMAIL = 'patient@meditrail.org';
const DEMO_PASSWORD = 'demo1234';
const DEMO_USER_ID = 'demo-patient-local';
const LOCAL_ACCOUNTS_KEY = 'meditrail_local_accounts';

const getLocalAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || '{}');
  } catch (error) {
    console.error('Unable to read local accounts:', error);
    return {};
  }
};

const hashPassword = async (password, salt) => {
  const material = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100000, hash: 'SHA-256' },
    material,
    256
  );
  return Array.from(new Uint8Array(bits), byte => byte.toString(16).padStart(2, '0')).join('');
};

const createLocalUser = (account) => ({
  id: account.id,
  email: account.email,
  name: account.name,
  isLoggedIn: true,
  isLocal: true,
});

export const authService = {
  signup: async (name, email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = getLocalAccounts();
    if (accounts[normalizedEmail]) {
      return { user: null, error: 'An account with this email already exists in this browser.' };
    }

    const salt = crypto.randomUUID();
    const account = {
      id: `local-${crypto.randomUUID()}`,
      email: normalizedEmail,
      name: name.trim(),
      salt,
      passwordHash: await hashPassword(password, salt),
    };
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify({
      ...accounts,
      [normalizedEmail]: account,
    }));
    return { user: createLocalUser(account), error: null };
  },

  login: async (email, password) => {
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      return {
        user: {
          id: DEMO_USER_ID,
          email: DEMO_EMAIL,
          name: 'Alex Mercer',
          isLoggedIn: true,
          isDemo: true,
        },
        error: null,
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const localAccount = getLocalAccounts()[normalizedEmail];
    if (localAccount) {
      const passwordHash = await hashPassword(password, localAccount.salt);
      if (passwordHash !== localAccount.passwordHash) {
        return { user: null, error: 'Invalid email or password.' };
      }
      return { user: createLocalUser(localAccount), error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        console.error('Supabase login failed:', error.message);
        return { user: null, error: error.message };
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          name:
            data.user.user_metadata?.full_name ||
            email.split('@')[0],
          isLoggedIn: true,
          isLocal: false,
        },
        error: null,
      };
    } catch (err) {
      console.error('Login error:', err);

      return {
        user: null,
        error: err.message || 'Login failed.',
      };
    }
  },
};