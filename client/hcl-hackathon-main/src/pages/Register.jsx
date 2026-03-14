import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ErrorAlert from '../components/ErrorAlert';
import { useAuth } from "../context/useAuth";
import { logError, logInfo } from '../utils/logger';

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || 'patient');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: selectedRole,
    consent_given: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [submissionError, setSubmissionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData((previousState) => ({ ...previousState, role: selectedRole }));
    setSearchParams({ role: selectedRole });
  }, [selectedRole, setSearchParams]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setFormData((previousState) => ({
      ...previousState,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setValidationErrors((previousErrors) => ({ ...previousErrors, [name]: '' }));
    setSubmissionError('');
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.role) {
      nextErrors.role = 'Please select a role.';
    }

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters long.';
    }

    if (!formData.consent_given) {
      nextErrors.consent_given = 'You must consent to healthcare data usage to continue.';
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    logInfo('Registration form submission started', formData.email);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionError('');

      const newUser = await register(formData);

// fallback if API doesn't return user
const userRole = newUser?.role || formData.role;

navigate(
  userRole === "provider"
    ? "/provider/dashboard"
    : "/patient/dashboard",
  { replace: true }
);

    } catch (error) {
      logError('Registration page submission failed', error);
      setSubmissionError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar title="Create a secure healthcare portal account" isPublic />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">

          <section className="panel-card mx-auto w-full max-w-xl p-8 lg:p-10 lg:order-2">

            <div className="grid grid-cols-2 gap-3 rounded-[22px] bg-slate-100 p-2">
              <Link to={`/login?role=${selectedRole}`} className="button-secondary">
                Login
              </Link>
              <button type="button" className="button-primary" disabled>
                Register
              </button>
            </div>

            <ErrorAlert title="Registration Failed" message={submissionError} />

            <form onSubmit={handleSubmit} className="mt-6 grid gap-5">

              {/* ROLE FIELD */}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">
                  Register As
                </p>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={formData.role === 'patient'}
                      onChange={(e) => {
                        setSelectedRole('patient');
                        handleChange(e);
                      }}
                    />
                    Patient
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="role"
                      value="provider"
                      checked={formData.role === 'provider'}
                      onChange={(e) => {
                        setSelectedRole('provider');
                        handleChange(e);
                      }}
                    />
                    Provider
                  </label>
                </div>

                {validationErrors.role ? (
                  <p className="mt-2 text-sm text-rose-600">{validationErrors.role}</p>
                ) : null}
              </div>

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                />

                {validationErrors.name && (
                  <p className="mt-2 text-sm text-rose-600">{validationErrors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="you@example.com"
                />

                {validationErrors.email && (
                  <p className="mt-2 text-sm text-rose-600">{validationErrors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a secure password"
                />

                {validationErrors.password && (
                  <p className="mt-2 text-sm text-rose-600">{validationErrors.password}</p>
                )}
              </div>

              {/* CONSENT */}
              <label className="rounded-[22px] border border-blue-100 bg-blue-50/70 px-4 py-4">
                <span className="flex items-start gap-3">
                  <input
                    name="consent_given"
                    type="checkbox"
                    checked={formData.consent_given}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4"
                  />

                  <span className="text-sm text-slate-700">
                    I consent to the collection and use of my health data for wellness tracking
                    and preventive care purposes.
                  </span>
                </span>
              </label>

              {validationErrors.consent_given && (
                <p className="-mt-2 text-sm text-rose-600">
                  {validationErrors.consent_given}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary w-full"
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </button>

            </form>
          </section>

          <section className="hero-mesh panel-card p-8 lg:p-10 lg:order-1">
            <h1 className="text-4xl font-extrabold text-slate-950">
              Register once and enter the right healthcare workspace.
            </h1>

            <p className="mt-5 text-base text-slate-600">
              Patients access their health records. Providers review patient records securely.
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}

export default Register;