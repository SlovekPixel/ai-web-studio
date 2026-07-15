import { Link } from 'react-router-dom';

export function DashboardPage() {
  return (
    <section className="page">
      <h1>Admin Dashboard</h1>
      <p>Protected admin area.</p>
      <nav className="page-nav">
        <Link to="/">Back to user area</Link>
      </nav>
    </section>
  );
}
