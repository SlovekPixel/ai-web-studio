import { type FormEvent, useState } from 'react';

import { useAsync } from '~/shared/hooks/useAsync';
import { login } from '~/shared/api/auth.api';
import { Button } from '~/shared/ui/Button';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { data, error, isLoading, execute } = useAsync<Awaited<ReturnType<typeof login>>>();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await execute(login({ username, password }));
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        Username
        <input
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
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
          autoComplete="current-password"
          required
        />
      </label>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>

      {data && <p className="success">Token: {data.accessToken}</p>}
      {error && <p className="error">{error.message}</p>}
    </form>
  );
}
