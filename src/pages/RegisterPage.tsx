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

const MIN_PASSWORD = 6;

const RegisterPage: React.FC = () => {
  const { t } = useT();
  const navigate = useNavigate();
  const { register, signInWithGoogle, error, setError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  /** Field-level problems, shown under the control that caused them. */
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const message = error
    ? (() => {
        const key = authErrorKey(error);
        return key ? t(key) : error;
      })()
    : null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    /*
      Validated here rather than left to Firebase, so the visitor is told which
      field is wrong instead of getting one banner for the whole form.
    */
    const next: typeof fieldErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = t('auth.errEmail');
    }
    if (password.length < MIN_PASSWORD) {
      next.password = t('auth.errPasswordShort');
    }
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    if (!terms) {
      setError(t('auth.errTerms'));
      return;
    }

    setBusy(true);
    try {
      await register(email.trim(), password, name.trim());
      navigate('/dashboard');
    } catch {
      /* surfaced through `error` */
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
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

  return (
    <AuthLayout
      title={t('auth.signUpTitle')}
      lede={t('auth.signUpLede')}
      footer={
        <>
          {t('auth.hasAccount')}{' '}
          <Link
            to="/login"
            className="font-semibold text-hand-right no-underline hover:underline"
          >
            {t('nav.signIn')}
          </Link>
        </>
      }
    >
      {!isFirebaseConfigured && (
        <AuthNotice tone="error">{t('auth.errUnconfigured')}</AuthNotice>
      )}
      {message && (
        <AuthNotice tone="error" onDismiss={() => setError(null)}>
          {message}
        </AuthNotice>
      )}

      <form onSubmit={submit} noValidate>
        <Field
          label={t('auth.name')}
          autoComplete="name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Field
          className="mt-5"
          label={t('auth.email')}
          type="email"
          autoComplete="email"
          required
          error={fieldErrors.email}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (fieldErrors.email) {
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }
          }}
        />

        <Field
          className="mt-5"
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          error={fieldErrors.password}
          hint={t('auth.errPasswordShort')}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (fieldErrors.password) {
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }
          }}
          trailing={
            <PasswordToggle
              shown={showPassword}
              onToggle={() => setShowPassword((current) => !current)}
            />
          }
        />

        {/*
          The consent is a real gate: the form will not submit without it.
          The terms are plain text rather than links, because this project has
          no terms-of-service or privacy page to link to yet — a link to `#`
          is worse than none.
        */}
        <div className="mt-6">
          <AuthCheckbox id="terms" checked={terms} onChange={setTerms}>
            {t('auth.terms')}
          </AuthCheckbox>
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
          {t('auth.submitSignUp')}
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

export default RegisterPage;
