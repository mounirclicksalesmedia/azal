'use client';

import { useActionState } from 'react';
import { signIn, type SignInState } from '../actions';

export default function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(
    signIn,
    undefined,
  );

  return (
    <form action={action} className="login-card">
      <div>
        <div className="dash-eyebrow">Azal admin</div>
        <h1 className="login-title">Sign in</h1>
        <p className="login-sub">Use your admin email and password.</p>
      </div>

      {state?.error ? <div className="login-error">{state.error}</div> : null}

      {next ? <input type="hidden" name="next" value={next} /> : null}

      <label
        htmlFor="email"
        style={{
          fontSize: '.7rem',
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: 'rgba(27,19,13,0.55)',
        }}
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="dash-input"
        style={{ width: '100%', height: 44 }}
      />

      <label
        htmlFor="password"
        style={{
          fontSize: '.7rem',
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: 'rgba(27,19,13,0.55)',
        }}
      >
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="dash-input"
        style={{ width: '100%', height: 44 }}
      />

      <button
        type="submit"
        disabled={pending}
        className="dash-btn dash-btn-primary"
        style={{ height: 44, marginTop: '.5rem', opacity: pending ? 0.7 : 1 }}
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
