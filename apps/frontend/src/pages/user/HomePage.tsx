import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="page">
      <h1>User Area</h1>
      <p>Welcome to the public part of the application.</p>
      <nav className="page-nav">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </section>
  );
}
