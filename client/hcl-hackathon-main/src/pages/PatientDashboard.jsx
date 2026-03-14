import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import GoalCard from '../components/GoalCard';
import ReminderCard from '../components/ReminderCard';
import HealthTip from '../components/HealthTip';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import PortalLayout from '../components/PortalLayout';
import { useAuth } from "../context/useAuth";
import { getDashboardData, getProfile } from '../services/api';
import { logError, logInfo } from '../utils/logger';

function PatientDashboard() {
  const { currentUser } = useAuth();

  // dashboardData stores the patient-facing metrics, reminders, and tip content.
  const [dashboardData, setDashboardData] = useState(null);
  // profileSummary gives the patient quick visibility into their editable record.
  const [profileSummary, setProfileSummary] = useState(null);
  // isLoading drives the loading spinner while dashboard data is requested.
  const [isLoading, setIsLoading] = useState(true);
  // errorMessage surfaces any failed dashboard request in a friendly way.
  const [errorMessage, setErrorMessage] = useState('');

  // fetchDashboard loads the patient's dashboard widgets and profile summary.
  async function fetchDashboard() {
    try {
      setIsLoading(true);
      setErrorMessage('');
      logInfo('Patient dashboard fetch started', currentUser?.email);
      const [dashboardResponse, profileResponse] = await Promise.all([
        getDashboardData(currentUser.email),
        getProfile(currentUser.email),
      ]);
      setDashboardData(dashboardResponse);
      setProfileSummary(profileResponse);
    } catch (error) {
      logError('Patient dashboard fetch failed', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <PortalLayout
      title={`Welcome back, ${currentUser?.name}`}
      intro="Your patient workspace is limited to your own record, goals, reminders, and personal health notes. This is where the future backend will enforce patient-only record access with JWT-protected APIs."
    >
      <ErrorAlert title="Dashboard Error" message={errorMessage} />

      {isLoading ? (
        <LoadingSpinner label="Loading your personal care dashboard..." />
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-3">
            {dashboardData?.goalSummary?.map((goal) => (
              <GoalCard key={goal.title} {...goal} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="panel-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                    My record access
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">Personal record summary</h2>
                </div>
                <Link to="/profile" className="button-secondary">
                  Edit My Record
                </Link>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="metric-card">
                  <p className="text-sm font-semibold text-slate-500">Age</p>
                  <p className="mt-3 text-lg font-bold text-slate-950">
                    {profileSummary?.age ?? 'Not recorded'}
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm font-semibold text-slate-500">Gender</p>
                  <p className="mt-3 text-lg font-bold text-slate-950">
                    {profileSummary?.gender || 'Not recorded'}
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm font-semibold text-slate-500">Allergies</p>
                  <p className="mt-3 text-lg font-bold text-slate-950">
                    {profileSummary?.allergies || 'No allergies recorded'}
                  </p>
                </div>
                <div className="metric-card">
                  <p className="text-sm font-semibold text-slate-500">Medications</p>
                  <p className="mt-3 text-lg font-bold text-slate-950">
                    {profileSummary?.medications || 'No medications listed'}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">Medical Conditions</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {profileSummary?.medical_conditions || 'Add medical conditions in the profile page.'}
                </p>
              </div>
            </article>

            <HealthTip {...dashboardData?.healthTip} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="panel-card p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="panel-heading">Preventive Care Reminders</h2>
                <button type="button" onClick={fetchDashboard} className="button-secondary">
                  Refresh
                </button>
              </div>
              <div className="grid gap-4">
                {dashboardData?.reminders?.map((reminder) => (
                  <ReminderCard key={reminder.id} {...reminder} />
                ))}
              </div>
            </article>

            <article className="panel-card p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                Quick actions
              </p>
              <h2 className="mt-3 text-2xl font-bold text-slate-950">Stay on top of your progress</h2>
              <div className="mt-6 grid gap-4">
                <Link to="/goal-tracker" className="metric-card transition hover:-translate-y-0.5">
                  <p className="text-sm font-semibold text-slate-900">Update wellness goals</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Log steps, sleep, and hydration for today.
                  </p>
                </Link>
                <Link to="/health-topics" className="metric-card transition hover:-translate-y-0.5">
                  <p className="text-sm font-semibold text-slate-900">Review health topics</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Read public guidance on flu prevention, COVID-19, and mental health.
                  </p>
                </Link>
              </div>
            </article>
          </section>
        </>
      )}
    </PortalLayout>
  );
}

export default PatientDashboard;
