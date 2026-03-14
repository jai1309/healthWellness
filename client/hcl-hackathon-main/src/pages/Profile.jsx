import { useEffect, useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import LoadingSpinner from '../components/LoadingSpinner';
import PortalLayout from '../components/PortalLayout';
import { useAuth } from "../context/useAuth";
import { getProfile, updateProfile } from '../services/api';
import { logError, logInfo } from '../utils/logger';

function Profile() {
  const { currentUser, role } = useAuth();

  const [profileForm, setProfileForm] = useState({
    age: '',
    gender: '',
    allergies: '',
    medications: '',
    medical_conditions: '',
  });
  const [providerProfile, setProviderProfile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function fetchProfile() {
    try {
      setIsLoading(true);
      setErrorMessage('');
      logInfo('Profile fetch started', currentUser?.email);
      const response = await getProfile(currentUser.email);

      if (role === 'provider') {
        setProviderProfile(response);
      } else {
        setProfileForm({
          age: response.age ?? '',
          gender: response.gender ?? '',
          allergies: response.allergies ?? '',
          medications: response.medications ?? '',
          medical_conditions: response.medical_conditions ?? '',
        });
      }
    } catch (error) {
      logError('Profile fetch failed', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setProfileForm((previousState) => ({ ...previousState, [name]: value }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, [name]: '' }));
    setSuccessMessage('');
    setErrorMessage('');
  }

  function validateForm() {
    const nextErrors = {};

    if (profileForm.age !== '' && Number(profileForm.age) < 0) {
      nextErrors.age = 'Age must be zero or greater.';
    }

    setValidationErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    logInfo('Profile form submission started', currentUser?.email);
    console.log('Submitting profile form...');

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      const response = await updateProfile(currentUser.email, profileForm);
      setProfileForm({
        age: response.age ?? '',
        gender: response.gender ?? '',
        allergies: response.allergies ?? '',
        medications: response.medications ?? '',
        medical_conditions: response.medical_conditions ?? '',
      });
      setSuccessMessage('Profile updated successfully.');
    } catch (error) {
      logError('Profile update failed', error);
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <PortalLayout
      title="Profile and record details"
      intro={
        role === 'provider'
          ? 'The current backend schema includes account fields for providers and a dedicated patientProfile model for patients. This page reflects that split.'
          : 'This patient form now follows the backend patientProfile schema with age, gender, allergies, medications, and medical_conditions.'
      }
    >
      {isLoading ? (
        <LoadingSpinner label="Loading your profile..." />
      ) : (
        <section className="panel-card p-6 lg:p-8">
          <div className="mt-2 space-y-4">
            <ErrorAlert title="Profile Error" message={errorMessage} />
            {successMessage ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            ) : null}
          </div>

          {role === 'provider' ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="metric-card">
                <p className="text-sm font-semibold text-slate-500">Name</p>
                <p className="mt-3 text-lg font-bold text-slate-950">{providerProfile?.name}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm font-semibold text-slate-500">Email</p>
                <p className="mt-3 text-lg font-bold text-slate-950">{providerProfile?.email}</p>
              </div>
              <div className="metric-card">
                <p className="text-sm font-semibold text-slate-500">Role</p>
                <p className="mt-3 text-lg font-bold capitalize text-slate-950">
                  {providerProfile?.role}
                </p>
              </div>
              <div className="metric-card">
                <p className="text-sm font-semibold text-slate-500">Consent Given</p>
                <p className="mt-3 text-lg font-bold text-slate-950">
                  {providerProfile?.consent_given ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div>
                <label htmlFor="age" className="mb-2 block text-sm font-medium text-slate-700">
                  Age
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  value={profileForm.age}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter patient age"
                />
                {validationErrors.age ? (
                  <p className="mt-2 text-sm text-rose-600">{validationErrors.age}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="gender" className="mb-2 block text-sm font-medium text-slate-700">
                  Gender
                </label>
                <input
                  id="gender"
                  name="gender"
                  value={profileForm.gender}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter gender"
                />
              </div>

              <div>
                <label htmlFor="allergies" className="mb-2 block text-sm font-medium text-slate-700">
                  Allergies
                </label>
                <input
                  id="allergies"
                  name="allergies"
                  value={profileForm.allergies}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="List known allergies"
                />
              </div>

              <div>
                <label htmlFor="medications" className="mb-2 block text-sm font-medium text-slate-700">
                  Medications
                </label>
                <input
                  id="medications"
                  name="medications"
                  value={profileForm.medications}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="List active medications"
                />
              </div>

              <div>
                <label
                  htmlFor="medical_conditions"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Medical Conditions
                </label>
                <textarea
                  id="medical_conditions"
                  name="medical_conditions"
                  rows="5"
                  value={profileForm.medical_conditions}
                  onChange={handleChange}
                  className="form-input resize-none"
                  placeholder="Capture medical conditions or preventive notes"
                />
              </div>

              <button type="submit" disabled={isSaving} className="button-primary w-full sm:w-fit">
                {isSaving ? 'Saving changes...' : 'Save Profile'}
              </button>
            </form>
          )}
        </section>
      )}
    </PortalLayout>
  );
}

export default Profile;
