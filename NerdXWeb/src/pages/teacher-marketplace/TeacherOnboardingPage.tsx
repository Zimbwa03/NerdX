import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileUploader } from '../../components/marketplace/FileUploader';
import { SubjectBadge } from '../../components/marketplace/SubjectBadge';
import { createTeacherProfile, uploadTeacherFile } from '../../services/api/teacherMarketplaceApi';
import {
  MARKETPLACE_SUBJECTS,
  ACADEMIC_LEVELS,
  LEVEL_FORM_MAP,
  CURRICULA,
  QUALIFICATION_TYPES,
} from '../../data/marketplaceConstants';
import type { TeacherOnboardingData, FormLevel, AcademicLevel, Curriculum } from '../../types';
import {
  ArrowLeft, ArrowRight, Check, User, Phone, Mail, Calendar,
  Award, Plus, Trash2, BookOpen, Briefcase, Camera, Loader2,
  CheckCircle, Clock
} from 'lucide-react';

type QualEntry = {
  title: string;
  institution: string;
  year: number;
  qualification_type: 'ZIMSEC' | 'Cambridge' | 'Diploma' | 'Degree' | 'Other';
  certificate_file?: File | null;
  certificate_url?: string;
};

type SubjectEntry = {
  subject_name: string;
  academic_level: AcademicLevel;
  form_levels: FormLevel[];
  curriculum: Curriculum;
};

const TOTAL_STEPS = 4;

export function TeacherOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Personal Details
  const [fullName, setFullName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [dob, setDob] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [emailAddr, setEmailAddr] = useState(user?.email || '');
  const [altPhone, setAltPhone] = useState('');

  // Step 2: Qualifications
  const [qualifications, setQualifications] = useState<QualEntry[]>([
    { title: '', institution: '', year: new Date().getFullYear(), qualification_type: 'ZIMSEC', certificate_file: null },
  ]);

  // Step 3: Experience & Skills
  const [yearsExp, setYearsExp] = useState(1);
  const [expDescription, setExpDescription] = useState('');
  const [subjects, setSubjects] = useState<SubjectEntry[]>([]);
  const [addSubjectName, setAddSubjectName] = useState('');
  const [addAcademicLevel, setAddAcademicLevel] = useState<AcademicLevel>('O-Level');
  const [addFormLevels, setAddFormLevels] = useState<FormLevel[]>([]);
  const [addCurriculum, setAddCurriculum] = useState<Curriculum>('ZIMSEC');

  // Step 4: Profile Media
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [introVideo, setIntroVideo] = useState<File | null>(null);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return !!(fullName.trim() && surname.trim() && whatsapp.trim() && emailAddr.trim());
      case 2:
        return qualifications.some((q) => q.title.trim() && q.institution.trim());
      case 3:
        return subjects.length > 0 && expDescription.trim().length > 20;
      case 4:
        return bio.trim().length > 20;
      default:
        return false;
    }
  }, [step, fullName, surname, whatsapp, emailAddr, qualifications, subjects, expDescription, bio]);

  const handleAddQualification = () => {
    setQualifications([
      ...qualifications,
      { title: '', institution: '', year: new Date().getFullYear(), qualification_type: 'ZIMSEC', certificate_file: null },
    ]);
  };

  const handleRemoveQualification = (idx: number) => {
    setQualifications(qualifications.filter((_, i) => i !== idx));
  };

  const handleQualChange = (idx: number, field: keyof QualEntry, value: unknown) => {
    setQualifications(qualifications.map((q, i) => (i === idx ? { ...q, [field]: value } : q)));
  };

  const handleAddSubject = () => {
    if (!addSubjectName) return;
    const exists = subjects.some(
      (s) => s.subject_name === addSubjectName && s.academic_level === addAcademicLevel,
    );
    if (exists) return;

    setSubjects([
      ...subjects,
      {
        subject_name: addSubjectName,
        academic_level: addAcademicLevel,
        form_levels: addFormLevels.length > 0 ? addFormLevels : (LEVEL_FORM_MAP[addAcademicLevel] as FormLevel[]),
        curriculum: addCurriculum,
      },
    ]);
    setAddSubjectName('');
    setAddFormLevels([]);
  };

  const handleRemoveSubject = (idx: number) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  const toggleFormLevel = (level: FormLevel) => {
    setAddFormLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level],
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError('');

    try {
      // Upload qualification certificates first
      const processedQuals = [];
      for (const q of qualifications) {
        if (!q.title.trim() || !q.institution.trim()) continue;
        let certUrl: string | undefined;
        if (q.certificate_file) {
          const url = await uploadTeacherFile('teacher-certificates', q.certificate_file, user.id);
          if (url) certUrl = url;
        }
        processedQuals.push({
          title: q.title,
          institution: q.institution,
          year: q.year,
          qualification_type: q.qualification_type,
          certificate_url: certUrl,
        });
      }

      const onboardingData: TeacherOnboardingData = {
        full_name: fullName.trim(),
        surname: surname.trim(),
        date_of_birth: dob,
        whatsapp: whatsapp.trim(),
        email: emailAddr.trim(),
        phone: altPhone.trim() || undefined,
        qualifications: processedQuals,
        years_of_experience: yearsExp,
        experience_description: expDescription.trim(),
        subjects: subjects.map((s) => ({
          subject_name: s.subject_name,
          academic_level: s.academic_level,
          form_levels: s.form_levels,
          curriculum: s.curriculum,
        })),
        bio: bio.trim(),
        profile_image: profileImage || undefined,
        intro_video: introVideo || undefined,
      };

      const profile = await createTeacherProfile(user.id, onboardingData);
      if (profile) {
        setSubmitted(true);
      } else {
        setError('Failed to create teacher profile. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="teacher-onboarding">
        <div className="teacher-onboarding__success">
          <div className="teacher-onboarding__success-icon">
            <CheckCircle size={64} />
          </div>
          <h1>Application Submitted!</h1>
          <p>
            Your teacher profile has been submitted for verification. Our team will review
            your qualifications and credentials. This typically takes 1-3 business days.
          </p>
          <div className="teacher-onboarding__success-status">
            <Clock size={20} />
            <span>Verification Status: <strong>Pending Review</strong></span>
          </div>
          <div className="teacher-onboarding__success-actions">
            <button
              type="button"
              className="to-btn to-btn--primary"
              onClick={() => navigate('/app')}
            >
              Go to Dashboard
            </button>
            <button
              type="button"
              className="to-btn to-btn--outline"
              onClick={() => navigate('/app/teacher-dashboard')}
            >
              View Teacher Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-onboarding">
      <div className="teacher-onboarding__header">
        <button
          type="button"
          className="teacher-onboarding__back"
          onClick={() => (step > 1 ? setStep(step - 1) : navigate('/app'))}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="teacher-onboarding__title-area">
          <h1 className="teacher-onboarding__title">Teacher Registration</h1>
          <p className="teacher-onboarding__subtitle">Step {step} of {TOTAL_STEPS}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="teacher-onboarding__progress">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`teacher-onboarding__progress-step${i + 1 <= step ? ' teacher-onboarding__progress-step--active' : ''}${i + 1 < step ? ' teacher-onboarding__progress-step--done' : ''}`}
          >
            <div className="teacher-onboarding__progress-dot">
              {i + 1 < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="teacher-onboarding__progress-label">
              {['Personal', 'Qualifications', 'Experience', 'Profile'][i]}
            </span>
          </div>
        ))}
        <div
          className="teacher-onboarding__progress-bar"
          style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
        />
      </div>

      {error && <div className="teacher-onboarding__error">{error}</div>}

      <div className="teacher-onboarding__body">
        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="to-step">
            <div className="to-step__header">
              <User size={24} />
              <div>
                <h2>Personal Details</h2>
                <p>Tell us about yourself</p>
              </div>
            </div>
            <div className="to-form">
              <div className="to-row">
                <div className="to-field">
                  <label>Full Name *</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Tendai" />
                </div>
                <div className="to-field">
                  <label>Surname *</label>
                  <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="e.g. Moyo" />
                </div>
              </div>
              <div className="to-field">
                <label>Date of Birth</label>
                <div className="to-field__icon-wrap">
                  <Calendar size={16} />
                  <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
              </div>
              <div className="to-field">
                <label>WhatsApp Number *</label>
                <div className="to-field__icon-wrap">
                  <Phone size={16} />
                  <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+263 7X XXX XXXX" />
                </div>
              </div>
              <div className="to-field">
                <label>Email Address *</label>
                <div className="to-field__icon-wrap">
                  <Mail size={16} />
                  <input type="email" value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)} placeholder="you@example.com" />
                </div>
              </div>
              <div className="to-field">
                <label>Alternative Phone (optional)</label>
                <div className="to-field__icon-wrap">
                  <Phone size={16} />
                  <input type="tel" value={altPhone} onChange={(e) => setAltPhone(e.target.value)} placeholder="+263 ..." />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Qualifications */}
        {step === 2 && (
          <div className="to-step">
            <div className="to-step__header">
              <Award size={24} />
              <div>
                <h2>Qualifications</h2>
                <p>Upload your academic certificates and credentials</p>
              </div>
            </div>
            <div className="to-form">
              {qualifications.map((q, idx) => (
                <div key={idx} className="to-qual-card">
                  <div className="to-qual-card__header">
                    <span>Qualification {idx + 1}</span>
                    {qualifications.length > 1 && (
                      <button type="button" onClick={() => handleRemoveQualification(idx)} className="to-qual-card__remove">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="to-row">
                    <div className="to-field">
                      <label>Qualification Title *</label>
                      <input
                        type="text"
                        value={q.title}
                        onChange={(e) => handleQualChange(idx, 'title', e.target.value)}
                        placeholder="e.g. O-Level Mathematics A"
                      />
                    </div>
                    <div className="to-field">
                      <label>Type</label>
                      <select
                        value={q.qualification_type}
                        onChange={(e) => handleQualChange(idx, 'qualification_type', e.target.value)}
                      >
                        {QUALIFICATION_TYPES.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="to-row">
                    <div className="to-field">
                      <label>Institution *</label>
                      <input
                        type="text"
                        value={q.institution}
                        onChange={(e) => handleQualChange(idx, 'institution', e.target.value)}
                        placeholder="e.g. University of Zimbabwe"
                      />
                    </div>
                    <div className="to-field">
                      <label>Year</label>
                      <input
                        type="number"
                        min={1970}
                        max={new Date().getFullYear()}
                        value={q.year}
                        onChange={(e) => handleQualChange(idx, 'year', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <FileUploader
                    accept=".pdf,.jpg,.jpeg,.png"
                    label="Upload Certificate (PDF or Image)"
                    hint="Max 10MB, PDF or image"
                    maxSizeMB={10}
                    onFile={(f) => handleQualChange(idx, 'certificate_file', f)}
                    currentFile={q.certificate_file}
                  />
                </div>
              ))}
              <button type="button" className="to-btn to-btn--outline to-btn--sm" onClick={handleAddQualification}>
                <Plus size={16} /> Add Another Qualification
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Experience & Skills */}
        {step === 3 && (
          <div className="to-step">
            <div className="to-step__header">
              <Briefcase size={24} />
              <div>
                <h2>Experience & Skills</h2>
                <p>Tell students about your teaching background and select subjects you teach</p>
              </div>
            </div>
            <div className="to-form">
              <div className="to-row">
                <div className="to-field">
                  <label>Years of Teaching Experience</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={yearsExp}
                    onChange={(e) => setYearsExp(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="to-field">
                <label>Describe Your Teaching Experience *</label>
                <textarea
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  placeholder="Describe your teaching experience, institutions you've worked at, achievements, and teaching style..."
                  rows={5}
                />
                <span className="to-field__hint">{expDescription.length}/500 characters (min 20)</span>
              </div>

              <div className="to-divider" />

              <h3 className="to-section-title">
                <BookOpen size={18} /> Subjects You Teach
              </h3>

              {subjects.length > 0 && (
                <div className="to-subject-list">
                  {subjects.map((s, idx) => (
                    <div key={idx} className="to-subject-item">
                      <SubjectBadge subject={s.subject_name} level={s.academic_level} size="md" />
                      <span className="to-subject-item__curriculum">{s.curriculum}</span>
                      <span className="to-subject-item__forms">{s.form_levels.join(', ')}</span>
                      <button type="button" onClick={() => handleRemoveSubject(idx)} className="to-subject-item__remove">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="to-add-subject">
                <div className="to-row">
                  <div className="to-field">
                    <label>Subject</label>
                    <select value={addSubjectName} onChange={(e) => setAddSubjectName(e.target.value)}>
                      <option value="">Select a subject</option>
                      {MARKETPLACE_SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="to-field">
                    <label>Academic Level</label>
                    <select value={addAcademicLevel} onChange={(e) => { setAddAcademicLevel(e.target.value as AcademicLevel); setAddFormLevels([]); }}>
                      {ACADEMIC_LEVELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div className="to-field">
                    <label>Curriculum</label>
                    <select value={addCurriculum} onChange={(e) => setAddCurriculum(e.target.value as Curriculum)}>
                      {CURRICULA.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="to-field">
                  <label>Form Levels</label>
                  <div className="to-form-levels">
                    {(LEVEL_FORM_MAP[addAcademicLevel] || []).map((fl) => (
                      <button
                        key={fl}
                        type="button"
                        className={`to-form-level-btn${addFormLevels.includes(fl as FormLevel) ? ' to-form-level-btn--active' : ''}`}
                        onClick={() => toggleFormLevel(fl as FormLevel)}
                      >
                        {fl}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  className="to-btn to-btn--outline to-btn--sm"
                  onClick={handleAddSubject}
                  disabled={!addSubjectName}
                >
                  <Plus size={16} /> Add Subject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Profile Media */}
        {step === 4 && (
          <div className="to-step">
            <div className="to-step__header">
              <Camera size={24} />
              <div>
                <h2>Profile & Media</h2>
                <p>Make a great first impression with students</p>
              </div>
            </div>
            <div className="to-form">
              <div className="to-field">
                <label>Bio / Teaching Philosophy *</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell students about your teaching philosophy, what makes you unique, and why they should learn from you..."
                  rows={5}
                />
                <span className="to-field__hint">{bio.length}/800 characters (min 20)</span>
              </div>
              <FileUploader
                accept="image/jpeg,image/png,image/webp"
                label="Profile Photo"
                hint="Professional headshot, max 5MB"
                maxSizeMB={5}
                onFile={setProfileImage}
                currentFile={profileImage}
              />
              <FileUploader
                accept="video/mp4,video/webm"
                label="Introductory Video (optional)"
                hint="30-60 second intro video, max 50MB"
                maxSizeMB={50}
                onFile={setIntroVideo}
                currentFile={introVideo}
              />
            </div>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="teacher-onboarding__nav">
        {step > 1 && (
          <button
            type="button"
            className="to-btn to-btn--outline"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <div className="teacher-onboarding__nav-spacer" />
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            className="to-btn to-btn--primary"
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
          >
            Next <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className="to-btn to-btn--primary"
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
          >
            {isSubmitting ? (
              <><Loader2 size={16} className="to-spinner" /> Submitting...</>
            ) : (
              <>Submit Application <Check size={16} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
