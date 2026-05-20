import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAppSelector } from '../app/hooks';
import { supabase } from '../services/supabaseClient';
import './LoginPage.scss';

const LoginPage = () => {
  const { initialized, isAdmin, email } = useAppSelector((state) => state.auth);
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (initialized && isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.trim(),
      password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success('Signed in');
  };

  return (
    <div className="login-page">
      <section className="login-panel">
        <div className="login-heading">
          <LockKeyhole size={22} strokeWidth={2.25} aria-hidden="true" />
          <div>
            <h1>Admin login</h1>
            <p>Create and delete access is restricted.</p>
          </div>
        </div>

        {email && !isAdmin && (
          <p className="auth-warning">
            {email} is signed in, but this account is not the configured admin.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;