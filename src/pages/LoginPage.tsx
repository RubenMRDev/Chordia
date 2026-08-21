import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isFirebaseConfigured } from '@/firebase/env';
import { useT } from '@/i18n';
import { Button, Field } from '@/ui';
import AuthLayout from '@/components/auth/AuthLayout';
import {
  AuthCheckbox,
  AuthDivider,
  AuthNotice,
  GoogleButton,
} from '@/components/auth/AuthParts';
import { authErrorKey } from '@/components/auth/authErrors';
import PasswordToggle from '@/components/auth/PasswordToggle';

const LoginPage: React.FC = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { login, resetPassword, signInWithGoogle, error, setError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /** Firebase's own wording never reaches the visitor. */
  const message = error
    ? (() => {
        const key = authErrorKey(error);
        return key ? t(key) : error;
      })()
    : null;

  const clear = () => {
    setError(null);
    setSentTo(null);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    clear();
    setBusy(true);
    try {
      await login(email, password, remember);
      navigate('/dashboard');
    } catch {
      // `error` on the context carries it; nothing to add here.
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    clear();
    setBusy(true);
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch {
      /* surfaced through `error` */
    } finally {
      setBusy(false);
    }
  };

  /**
   * Password reset, which used to be a link to `#`. It reuses the email already
   * typed into the form rather than opening a second screen for one field.
   */
  const forgot = async () => {
    clear();
    if (!email.trim()) {
      setError(t('auth.forgotNeedEmail'));
      return;
    }
    setBusy(true);
    try {
      await resetPassword(email.trim());
      setSentTo(email.trim());
    } catch {
      /* surfaced through `error` */
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title={t('auth.signInTitle')}
      lede={t('auth.signInLede')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            className="font-semibold text-hand-right no-underline hover:underline"
          >
            {t('nav.signUp')}
          </Link>
        </>
      }
    >
      {!isFirebaseConfigured && (
        <AuthNotice tone="error">{t('auth.errUnconfigured')}</AuthNotice>
      )}
      {message && (
        <AuthNotice tone="error" onDismiss={clear}>
          {message}
        </AuthNotice>
      )}
      {sentTo && (
        <AuthNotice tone="ok" onDismiss={clear}>
          {t('auth.forgotSent', { email: sentTo })}
        </AuthNotice>
      )}

      <form onSubmit={submit} noValidate>
        <Field
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Field
          className="mt-5"
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          trailing={
            <PasswordToggle
              shown={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
            />
          }
        />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <AuthCheckbox
            id="remember"
            checked={remember}
            onChange={setRemember}
          >
            {t('auth.rememberMe')}
          </AuthCheckbox>
          <button
            type="button"
            onClick={() => void forgot()}
            disabled={busy}
            className="text-[13px] font-medium text-hand-right hover:underline disabled:opacity-50"
          >
            {t('auth.forgot')}
          </button>
        </div>

        <Button
          type="submit"
          tone="right"
          size="lg"
          block
          className="mt-7"
          busy={busy}
          busyLabel={t('auth.working')}
        >
          {t('auth.submitSignIn')}
        </Button>
      </form>

      <AuthDivider />
      <GoogleButton onClick={() => void google()} disabled={busy} />

      <Link
        to="/midi"
        className="mt-5 block text-center text-[13px] text-ink-low no-underline hover:text-ink-mid"
      >
        {t('auth.orPlay')}
      </Link>
    </AuthLayout>
  );
};

export default LoginPage;
