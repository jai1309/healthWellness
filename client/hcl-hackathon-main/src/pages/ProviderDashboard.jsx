import { useEffect, useMemo, useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import PortalLayout from '../components/PortalLayout';
import { getProviderPatients } from '../services/api';
import { logError, logInfo } from '../utils/logger';

function ProviderDashboard() {
  // patients stores the assigned patient list that providers monitor.
  const [patients, setPatients] = useState([]);
  // selectedPatientId determines which record is open in the right-side detail panel.
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  // isLoading indicates whether provider data is still being requested.
  const [isLoading, setIsLoading] = useState(true);
  // errorMessage communicates provider dashboard failures to the user.
  const [errorMessage, setErrorMessage] = useState('');

  // selectedPatient gives providers a focused record review experience.
  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) || patients[0],
    [patients, selectedPatientId],
  );

  const dashboardStats = {
    totalPatients: patients.length,
    goalMetCount: patients.filter((patient) => patient.complianceStatus === 'Goal Met').length,
    attentionNeeded: patients.filter(
      (patient) =>
        patient.complianceStatus === 'Needs Attention' ||
        patient.reminderStatus === 'Missed Preventive Checkup',
    ).length,
  };

  // fetchPatients loads the provider view from the service layer.
  async function fetchPatients() {
    try {
      setIsLoading(true);
      setErrorMessage('');
      logInfo('Provider dashboard fetch started');
      const response = await getProviderPatients();
      setPatients(response);
      setSelectedPatientId(response[0]?.id ?? null);
    } catch (error) {
      logError('Provider dashboard fetch failed', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <PortalLayout
      title="Provider dashboard"
      intro="This provider workspace is designed for doctors to access multiple assigned patient records, review adherence trends, and identify preventive follow-up needs. The future backend will enforce this access with provider-only authorization rules."
    >
      <ErrorAlert title="Provider Dashboard Error" message={errorMessage} />

      {isLoading ? (
        <LoadingSpinner label="Loading assigned patient records..." />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-3">
            <article className="metric-card">
              <p className="text-sm font-semibold text-slate-500">Assigned Patients</p>
              <p className="mt-3 text-3xl font-extrabold text-slate-950">
                {dashboardStats.totalPatients}
              </p>
            </article>
            <article className="metric-card">
              <p className="text-sm font-semibold text-slate-500">Goals Met</p>
              <p className="mt-3 text-3xl font-extrabold text-emerald-600">
                {dashboardStats.goalMetCount}
              </p>
            </article>
            <article className="metric-card">
              <p className="text-sm font-semibold text-slate-500">Attention Needed</p>
              <p className="mt-3 text-3xl font-extrabold text-amber-600">
                {dashboardStats.attentionNeeded}
              </p>
            </article>
          </section>

          {patients.length === 0 ? (
            <EmptyState
              title="No patients assigned yet"
              description="Assigned patient records will appear here once the backend returns provider data."
            />
          ) : (
            <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
              <article className="panel-card p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="panel-heading">Patient roster</h2>
                  <button type="button" onClick={fetchPatients} className="button-secondary">
                    Refresh
                  </button>
                </div>

                <div className="space-y-3">
                  {patients.map((patient) => {
                    const isActive = patient.id === selectedPatient?.id;
                    return (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => setSelectedPatientId(patient.id)}
                        className={[
                          'w-full rounded-[24px] border p-4 text-left transition',
                          isActive
                            ? 'border-blue-500 bg-blue-50 shadow-[0_24px_40px_-34px_rgba(37,99,235,0.8)]'
                            : 'border-slate-200 bg-white hover:border-blue-200',
                        ].join(' ')}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-bold text-slate-950">{patient.name}</p>
                            <p className="mt-1 text-sm text-slate-500">Age {patient.age}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {patient.complianceStatus}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-slate-600">
                          Next visit: {patient.nextVisit}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </article>

              <article className="panel-card p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                  Patient record detail
                </p>
                <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-950">{selectedPatient?.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Providers can review multiple patient records from this workspace.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                    {selectedPatient?.reminderStatus}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="metric-card">
                    <p className="text-sm font-semibold text-slate-500">Steps</p>
                    <p className="mt-3 text-2xl font-extrabold text-slate-950">{selectedPatient?.steps}</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm font-semibold text-slate-500">Sleep</p>
                    <p className="mt-3 text-2xl font-extrabold text-slate-950">{selectedPatient?.sleep}h</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm font-semibold text-slate-500">Water</p>
                    <p className="mt-3 text-2xl font-extrabold text-slate-950">{selectedPatient?.water}L</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm font-semibold text-slate-500">Next visit</p>
                    <p className="mt-3 text-lg font-extrabold text-slate-950">{selectedPatient?.nextVisit}</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-sm font-semibold text-slate-500">Status</p>
                    <p className="mt-3 text-lg font-extrabold text-slate-950">
                      {selectedPatient?.complianceStatus}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">Allergies</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{selectedPatient?.allergies}</p>
                  </div>
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-500">Medications</p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">{selectedPatient?.medications}</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">Medical Conditions</p>
                  <p className="mt-3 text-sm leading-7 text-slate-700">{selectedPatient?.careNotes}</p>
                </div>
              </article>
            </section>
          )}
        </>
      )}
    </PortalLayout>
  );
}

export default ProviderDashboard;
