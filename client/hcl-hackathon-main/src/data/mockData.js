// This file holds all mock content required to make the frontend usable before
// the Node.js + Express + MongoDB backend is connected by teammates.

export const storageKeys = {
  token: 'healthcarePortalToken',
  authUser: 'healthcarePortalAuthUser',
  users: 'healthcarePortalUsers',
  patientProfiles: 'healthcarePortalPatientProfiles',
  wellnessGoals: 'healthcarePortalWellnessGoals',
  wellnessLogs: 'healthcarePortalWellnessLogs',
};

// These mock accounts let reviewers log in immediately without needing a backend.
// The backend schema stores password_hash and consent_given, so the frontend now
// mirrors those names even in mock mode.
export const mockUsers = [
  {
    id: 'user-patient-1',
    name: 'Aarav Mehta',
    email: 'patient@wellness.test',
    password_hash: 'patient123',
    role: 'patient',
    consent_given: true,
  },
  {
    id: 'user-provider-1',
    name: 'Dr. Neha Sharma',
    email: 'provider@wellness.test',
    password_hash: 'provider123',
    role: 'provider',
    consent_given: true,
  },
];

// Landing stats create immediate value on the public portal before login.
export const landingHighlights = [
  {
    id: 'highlight-1',
    value: '24/7',
    label: 'Wellness visibility',
    description: 'Patients and providers can stay aligned on goals and preventive reminders.',
  },
  {
    id: 'highlight-2',
    value: '12+',
    label: 'Care touchpoints',
    description: 'Track screenings, hydration, sleep, and lifestyle progress from one portal.',
  },
  {
    id: 'highlight-3',
    value: '100%',
    label: 'Role-based access',
    description: 'Patients see only their own records while providers review multiple patients.',
  },
];

// Service cards explain what the healthcare portal offers on the landing page.
export const portalServices = [
  {
    id: 'service-1',
    title: 'Preventive care scheduling',
    description:
      'Track blood work, eye exams, vaccinations, and routine screenings before they become overdue.',
  },
  {
    id: 'service-2',
    title: 'Wellness goal monitoring',
    description:
      'Capture daily steps, hydration, and sleep trends in a structure that is easy to review with clinicians.',
  },
  {
    id: 'service-3',
    title: 'Provider collaboration',
    description:
      'Doctors can review multiple patient summaries, compare adherence, and respond to follow-up needs quickly.',
  },
];

// Contact cards provide a clear destination for support or outreach on the portal.
export const contactCards = [
  {
    id: 'contact-1',
    title: 'Portal support',
    value: 'support@healthtrack.test',
    description: 'For login help, account support, and navigation issues.',
  },
  {
    id: 'contact-2',
    title: 'Care coordination',
    value: '+91 1800-000-2244',
    description: 'For appointment reminders, care plans, and follow-up questions.',
  },
  {
    id: 'contact-3',
    title: 'Clinic address',
    value: 'Wellness Tower, Sector 18, Noida',
    description: 'Weekdays 8:00 AM to 7:00 PM for preventive and chronic care programs.',
  },
];

// Patient profiles now follow the backend patientProfile schema.
export const mockPatientProfiles = [
  {
    user_id: 'user-patient-1',
    age: 34,
    gender: 'Male',
    allergies: 'Peanuts',
    medications: 'Vitamin D supplement',
    medical_conditions: 'Working on improving sleep consistency and hydration.',
  },
];

// Goals follow the wellnessGoal schema and are separated by goal_type.
export const mockWellnessGoals = [
  {
    id: 'wellness-goal-1',
    patient_id: 'user-patient-1',
    goal_type: 'steps',
    target_value: 10000,
  },
  {
    id: 'wellness-goal-2',
    patient_id: 'user-patient-1',
    goal_type: 'sleep',
    target_value: 8,
  },
  {
    id: 'wellness-goal-3',
    patient_id: 'user-patient-1',
    goal_type: 'water',
    target_value: 3,
  },
];

// Daily progress follows the wellnessLog schema and is linked to a goal record.
export const mockWellnessLogs = [
  {
    id: 'wellness-log-1',
    goal_id: 'wellness-goal-1',
    patient_id: 'user-patient-1',
    value: 7500,
    log_date: '2026-03-12',
  },
  {
    id: 'wellness-log-2',
    goal_id: 'wellness-goal-2',
    patient_id: 'user-patient-1',
    value: 7.2,
    log_date: '2026-03-12',
  },
  {
    id: 'wellness-log-3',
    goal_id: 'wellness-goal-3',
    patient_id: 'user-patient-1',
    value: 2.4,
    log_date: '2026-03-12',
  },
  {
    id: 'wellness-log-4',
    goal_id: 'wellness-goal-1',
    patient_id: 'user-patient-1',
    value: 9100,
    log_date: '2026-03-13',
  },
  {
    id: 'wellness-log-5',
    goal_id: 'wellness-goal-2',
    patient_id: 'user-patient-1',
    value: 7.8,
    log_date: '2026-03-13',
  },
  {
    id: 'wellness-log-6',
    goal_id: 'wellness-goal-3',
    patient_id: 'user-patient-1',
    value: 2.8,
    log_date: '2026-03-13',
  },
  {
    id: 'wellness-log-7',
    goal_id: 'wellness-goal-1',
    patient_id: 'user-patient-1',
    value: 10200,
    log_date: '2026-03-14',
  },
  {
    id: 'wellness-log-8',
    goal_id: 'wellness-goal-2',
    patient_id: 'user-patient-1',
    value: 8.1,
    log_date: '2026-03-14',
  },
  {
    id: 'wellness-log-9',
    goal_id: 'wellness-goal-3',
    patient_id: 'user-patient-1',
    value: 3,
    log_date: '2026-03-14',
  },
];

// Reminders now match the backend preventiveReminder model.
export const mockReminders = [
  {
    id: 'reminder-1',
    patient_id: 'user-patient-1',
    reminder_title: 'Annual Blood Test',
    description: 'Lab screening',
    due_date: '2026-05-20',
    status: 'pending',
  },
  {
    id: 'reminder-2',
    patient_id: 'user-patient-1',
    reminder_title: 'Dental Cleaning',
    description: 'Preventive visit',
    due_date: '2026-06-04',
    status: 'completed',
  },
  {
    id: 'reminder-3',
    patient_id: 'user-patient-1',
    reminder_title: 'Eye Examination',
    description: 'Vision care',
    due_date: '2026-07-11',
    status: 'missed',
  },
];

// Tips now follow the backend healthTip schema.
export const mockHealthTips = [
  {
    tip_id: 'tip-1',
    title: 'Hydration Matters',
    content:
      'Aim for steady hydration across the day instead of drinking most of your water late in the evening.',
  },
  {
    tip_id: 'tip-2',
    title: 'Protect Sleep Quality',
    content:
      'A consistent bedtime can improve recovery, mood, and long-term preventive health outcomes.',
  },
  {
    tip_id: 'tip-3',
    title: 'Build Short Walk Breaks',
    content:
      'Three 10-minute walks can be as useful as one long session for keeping activity levels on track.',
  },
];

// Provider cards include richer medical context while keeping backend-linked ids.
export const mockPatients = [
  {
    id: 'assigned-patient-1',
    provider_id: 'user-provider-1',
    patient_id: 'user-patient-1',
    assigned_at: '2026-03-01',
    name: 'Aarav Mehta',
    age: 34,
    gender: 'Male',
    complianceStatus: 'Goal Met',
    reminderStatus: 'On Track',
    nextVisit: '2026-03-28',
    allergies: 'Peanuts',
    medications: 'Vitamin D supplement',
    medical_conditions: 'Working on improving sleep consistency and hydration.',
    latestMetrics: {
      steps: 10200,
      sleep: 8.1,
      water: 3,
    },
  },
  {
    id: 'assigned-patient-2',
    provider_id: 'user-provider-1',
    patient_id: 'user-patient-2',
    assigned_at: '2026-02-19',
    name: 'Priya Nair',
    age: 41,
    gender: 'Female',
    complianceStatus: 'Needs Attention',
    reminderStatus: 'Missed Preventive Checkup',
    nextVisit: '2026-03-19',
    allergies: 'None reported',
    medications: 'Iron supplement',
    medical_conditions: 'Needs follow-up on annual screening adherence and sleep consistency.',
    latestMetrics: {
      steps: 6200,
      sleep: 6.4,
      water: 1.8,
    },
  },
  {
    id: 'assigned-patient-3',
    provider_id: 'user-provider-1',
    patient_id: 'user-patient-3',
    assigned_at: '2026-01-08',
    name: 'Rohan Kapoor',
    age: 29,
    gender: 'Male',
    complianceStatus: 'Near Goal',
    reminderStatus: 'Follow-up Due',
    nextVisit: '2026-03-24',
    allergies: 'Dust sensitivity',
    medications: 'None',
    medical_conditions: 'Moderate adherence. Encourage weekly review of hydration and activity habits.',
    latestMetrics: {
      steps: 8800,
      sleep: 7,
      water: 2.2,
    },
  },
];

// Static public health content supports both the landing page and the dedicated
// health-topics page without needing a CMS or backend API yet.
export const publicHealthSections = [
  {
    id: 'public-health-1',
    title: 'COVID-19 Updates',
    description:
      'Stay current with vaccination guidance, home isolation rules when symptomatic, and mask use in crowded high-risk settings.',
  },
  {
    id: 'public-health-2',
    title: 'Seasonal Flu Prevention',
    description:
      'Annual flu shots, proper hand hygiene, and early rest when symptoms start remain key preventive actions during flu season.',
  },
  {
    id: 'public-health-3',
    title: 'Mental Health Awareness',
    description:
      'Preventive care includes mental wellbeing. Early support for stress, anxiety, and burnout improves overall health outcomes.',
  },
];
