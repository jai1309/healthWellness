import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import { useAuth } from "../context/useAuth";
import { logError, logInfo } from "../utils/logger";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, logout } = useAuth();

  const [selectedRole, setSelectedRole] = useState(
    searchParams.get("role") || "patient"
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setSearchParams({ role: selectedRole });
  }, [selectedRole, setSearchParams]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousState) => ({
      ...previousState,
      [name]: value,
    }));

    setValidationErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));

    setSubmissionError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    logInfo("Login form submission started", {
      role: selectedRole,
      email: formData.email,
    });

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setSubmissionError("");

      const authenticatedUser = await login(formData);

      console.log("LOGIN USER:", authenticatedUser);

      const userRole = authenticatedUser?.role;

      if (!userRole) {
        throw new Error("User role not found in login response");
      }

      if (userRole !== selectedRole) {
        logout();
        throw new Error(
          `This account is registered as ${userRole}. Please use the correct login option.`
        );
      }

      const redirectPath =
        location.state?.from?.pathname ||
        (userRole === "provider"
          ? "/provider/dashboard"
          : "/patient/dashboard");

      navigate(redirectPath, { replace: true });
    } catch (error) {
      logError("Login page submission failed", error);

      setSubmissionError(
        error?.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar title="Secure role-based portal access" isPublic />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">

          <section className="hero-mesh panel-card p-8 lg:p-10">
            <h1 className="mt-6 text-4xl font-extrabold text-slate-950 lg:text-5xl">
              Sign in to the right workspace for your healthcare role.
            </h1>
          </section>

          <section className="panel-card mx-auto w-full max-w-xl p-8 lg:p-10">

            <div className="grid grid-cols-2 gap-3 rounded-[22px] bg-slate-100 p-2">
              <button type="button" className="button-primary" disabled>
                Login
              </button>

              <Link
                to={`/register?role=${selectedRole}`}
                className="button-secondary"
              >
                Register
              </Link>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-slate-800">
                Select role
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {["patient", "provider"].map((role) => {
                  const isActive = role === selectedRole;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={[
                        "rounded-[22px] border p-4 text-left transition",
                        isActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white",
                      ].join(" ")}
                    >
                      <p className="text-sm font-semibold capitalize">
                        {role}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <ErrorAlert title="Login Failed" message={submissionError} />

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm font-medium">
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
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                />

                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary w-full"
              >
                {isSubmitting
                  ? "Signing in..."
                  : `Login as ${selectedRole}`}
              </button>
            </form>

          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;