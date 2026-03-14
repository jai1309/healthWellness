import { useEffect, useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import PortalLayout from '../components/PortalLayout';
import { useAuth } from "../context/useAuth";
import { createGoalEntry, getGoals, formatDate } from '../services/api';
import { logError, logInfo } from '../utils/logger';

const goalSections = [
  { key: 'steps', label: 'Steps', unit: 'steps', placeholderTarget: '10000', placeholderValue: '8500' },
  { key: 'sleep', label: 'Sleep', unit: 'hours', placeholderTarget: '8', placeholderValue: '7.5' },
  { key: 'water', label: 'Water Intake', unit: 'liters', placeholderTarget: '3', placeholderValue: '2.5' },
];

function GoalTracker() {
  const { currentUser } = useAuth();

  const [goalForm, setGoalForm] = useState({
    steps_target_value: '',
    steps_value: '',
    sleep_target_value: '',
    sleep_value: '',
    water_target_value: '',
    water_value: '',
    log_date: new Date().toISOString().split('T')[0],
  });
  const [goalHistory, setGoalHistory] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchGoalHistory() {
    try {
      setIsLoading(true);
      setErrorMessage('');
      logInfo('Goal history fetch started', currentUser?.email);
      const response = await getGoals(currentUser.email);
      setGoalHistory(response);
      setGoalForm((previousState) => ({
        ...previousState,
        steps_target_value: String(response.find((entry) => entry.goal_type === 'steps')?.target_value ?? ''),
        steps_value: '',
        sleep_target_value: String(response.find((entry) => entry.goal_type === 'sleep')?.target_value ?? ''),
        sleep_value: '',
        water_target_value: String(response.find((entry) => entry.goal_type === 'water')?.target_value ?? ''),
        water_value: '',
      }));
    } catch (error) {
      logError('Goal history fetch failed', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGoalHistory();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setGoalForm((previousState) => ({ ...previousState, [name]: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, [name]: '' }));
    setSuccessMessage('');
    setErrorMessage('');
  }

  function validateForm() {
    const nextErrors = {};

    goalSections.forEach((section) => {
      const targetKey = `${section.key}_target_value`;
      const valueKey = `${section.key}_value`;

      if (!goalForm[targetKey] || Number(goalForm[targetKey]) <= 0) {
        nextErrors[targetKey] = `Enter a valid ${section.label.toLowerCase()} target.`;
      }

      if (!goalForm[valueKey] || Number(goalForm[valueKey]) <= 0) {
        nextErrors[valueKey] = `Enter a valid ${section.label.toLowerCase()} value.`;
      }
    });

    if (!goalForm.log_date) {
      nextErrors.log_date = 'Select a log date.';
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    logInfo('Goal tracker form submission started', goalForm);
    console.log('Submitting goal tracker form...');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const updatedGoals = await createGoalEntry(currentUser.email, goalForm);
      setGoalHistory(updatedGoals);
      setGoalForm((previousState) => ({
        ...previousState,
        steps_value: '',
        sleep_value: '',
        water_value: '',
      }));
      setSuccessMessage('Wellness goals and logs saved successfully.');
    } catch (error) {
      logError('Goal tracker submission failed', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PortalLayout
      title="Goal tracker"
      intro="This page now matches the backend wellnessGoal and wellnessLog models. Each submission updates target_value for every goal_type and stores a dated log with value and log_date."
    >
      {isLoading ? (
        <LoadingSpinner label="Loading your goal history..." />
      ) : (
        <>
          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <article className="panel-card p-6">
              <h2 className="panel-heading">Log Goal Targets and Values</h2>
              <ErrorAlert title="Goal Tracker Error" message={errorMessage} />
              {successMessage ? (
                <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                  {successMessage}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-6 grid gap-6">
                <div>
                  <label htmlFor="log_date" className="mb-2 block text-sm font-medium text-slate-700">
                    Log Date
                  </label>
                  <input
                    id="log_date"
                    name="log_date"
                    type="date"
                    value={goalForm.log_date}
                    onChange={handleChange}
                    className="form-input"
                  />
                  {validationErrors.log_date ? (
                    <p className="mt-2 text-sm text-rose-600">{validationErrors.log_date}</p>
                  ) : null}
                </div>

                {goalSections.map((section) => {
                  const targetKey = `${section.key}_target_value`;
                  const valueKey = `${section.key}_value`;

                  return (
                    <div key={section.key} className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">{section.label}</p>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor={targetKey} className="mb-2 block text-sm font-medium text-slate-700">
                            Target Value
                          </label>
                          <input
                            id={targetKey}
                            name={targetKey}
                            type="number"
                            step="0.1"
                            value={goalForm[targetKey]}
                            onChange={handleChange}
                            className="form-input"
                            placeholder={section.placeholderTarget}
                          />
                          {validationErrors[targetKey] ? (
                            <p className="mt-2 text-sm text-rose-600">{validationErrors[targetKey]}</p>
                          ) : null}
                        </div>

                        <div>
                          <label htmlFor={valueKey} className="mb-2 block text-sm font-medium text-slate-700">
                            Logged Value
                          </label>
                          <input
                            id={valueKey}
                            name={valueKey}
                            type="number"
                            step="0.1"
                            value={goalForm[valueKey]}
                            onChange={handleChange}
                            className="form-input"
                            placeholder={section.placeholderValue}
                          />
                          {validationErrors[valueKey] ? (
                            <p className="mt-2 text-sm text-rose-600">{validationErrors[valueKey]}</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button type="submit" disabled={isSubmitting} className="button-primary">
                  {isSubmitting ? 'Saving progress...' : 'Save Goals and Logs'}
                </button>
              </form>
            </article>

            <article className="panel-card p-6">
              <h2 className="panel-heading">Latest Snapshot</h2>
              {goalHistory.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  {goalHistory.map((entry) => (
                    <div key={entry.id} className="metric-card">
                      <p className="text-sm text-slate-500">{entry.goal_type}</p>
                      <p className="mt-2 text-2xl font-semibold capitalize text-slate-900">
                        {entry.latest_value}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">Target: {entry.target_value}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {entry.latest_log_date ? formatDate(entry.latest_log_date) : 'No log yet'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No goals recorded yet"
                  description="Start by saving target_value and value entries for steps, sleep, and water."
                />
              )}
            </article>
          </section>

          <section className="panel-card p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="panel-heading">Goal History</h2>
              <button type="button" onClick={fetchGoalHistory} className="button-secondary">
                Refresh
              </button>
            </div>

            {goalHistory.length === 0 ? (
              <EmptyState
                title="No goal history yet"
                description="Once entries are logged, each goal_type and its log history will appear here."
              />
            ) : (
              <div className="grid gap-4">
                {goalHistory.map((entry) => (
                  <article key={entry.id} className="rounded-[24px] border border-slate-200 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold capitalize text-slate-950">
                          {entry.goal_type}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          target_value: {entry.target_value}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {entry.logs.length} log entries
                      </span>
                    </div>

                    <div className="mt-4 overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="pb-3 font-medium">log_date</th>
                            <th className="pb-3 font-medium">value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {entry.logs.map((log) => (
                            <tr key={log.id} className="border-b border-slate-100 last:border-b-0">
                              <td className="py-4 text-slate-700">{log.log_date}</td>
                              <td className="py-4 text-slate-700">{log.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </PortalLayout>
  );
}

export default GoalTracker;
