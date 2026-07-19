import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { register } from '~/shared/api/auth.api';
import { useAsync } from '~/shared/hooks/useAsync';
import { Button } from '~/shared/ui/Button';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { data, error, isLoading, execute } =
    useAsync<Awaited<ReturnType<typeof register>>>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await execute(
      register({
        email,
        password,
        firstName,
        lastName,
      }),
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label>
        First name
        <input
          name="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          autoComplete="given-name"
          required
        />
      </label>

      <label>
        Last name
        <input
          name="lastName"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          autoComplete="family-name"
          required
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </label>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Create account'}
      </Button>

      <p className="auth-form-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>

      {data && (
        <div className="success">
          <p>
            Registered as {data.user.firstName} {data.user.lastName} (
            {data.user.email})
          </p>
          <p>Access token: {data.accessToken}</p>
          <p>Refresh token: {data.refreshToken}</p>
        </div>
      )}
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
