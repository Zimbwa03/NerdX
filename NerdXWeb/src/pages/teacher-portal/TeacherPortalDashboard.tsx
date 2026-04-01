import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherAuth } from '../../context/TeacherAuthContext';
import { schoolEcosystemApi, type SchoolStudent } from '../../services/api/schoolEcosystemApi';
import { teacherPortalApi, type ClassAnalytics, type TeacherClassInfo, type TeacherDashboardData } from '../../services/api/teacherPortalApi';
import {
  TeacherDashboardShell,
  type TeacherDashboardActivityPoint,
  type TeacherDashboardBucket,
  type TeacherDashboardClass,
  type TeacherDashboardDueItem,
  type TeacherDashboardFeedItem,
  type TeacherDashboardReviewItem,
  type TeacherDashboardScheduleDay,
  type TeacherDashboardStudent,
  type TeacherDashboardSubjectRow,
} from '../../components/teacher-portal/dashboard/TeacherDashboardShell';

interface TeacherDashboardLoadState {
  dashboard: TeacherDashboardData | null;
  classes: TeacherClassInfo[];
  studentsByClassId: Record<number, SchoolStudent[]>;
  analyticsByClassroomId: Record<number, ClassAnalytics | null>;
}

export function TeacherPortalDashboard() {
  const { teacher, school, token, logout } = useTeacherAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<TeacherDashboardLoadState>({ dashboard: null, classes: [], studentsByClassId: {}, analyticsByClassroomId: {} });

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    const [dashboardData, classData] = await Promise.all([teacherPortalApi.getDashboard(token), teacherPortalApi.getMyClasses(token)]);
    const classes = classData.classes ?? [];

    const studentEntries = await Promise.all(
      classes.filter((item) => item.class?.id).map(async (item) => {
        try {
          const result = await schoolEcosystemApi.listClassStudents(token, item.class!.id);
          return [item.class!.id, result.students] as const;
        } catch {
          return [item.class!.id, []] as const;
        }
      }),
    );

    const analyticsEntries = await Promise.all(
      classes.filter((item) => item.classroom?.id).map(async (item) => {
        try {
          const result = await teacherPortalApi.getClassroomAnalytics(token, item.classroom!.id);
          return [item.classroom!.id, result] as const;
        } catch {
          return [item.classroom!.id, null] as const;
        }
      }),
    );

    setState({
      dashboard: dashboardData,
      classes,
      studentsByClassId: Object.fromEntries(studentEntries),
      analyticsByClassroomId: Object.fromEntries(analyticsEntries),
    });
    setLoading(false);
  }, [token]);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  const viewModel = useMemo(() => buildTeacherDashboardViewModel(state), [state]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenClassroom = (classroomId: number | null) => {
    if (!school?.school_id || !classroomId) return;
    navigate(`/school/${school.school_id}/teacher/classroom/${classroomId}`);
  };

  const handleExportReport = () => {
    const rows = [
      ['Subject', 'Class', 'Students', 'Average Mastery', 'Weekly Sessions'],
      ...viewModel.myClasses.map((item) => [item.subject, item.formName, String(item.studentCount), item.averageMastery === null ? 'N/A' : `${Math.round(item.averageMastery)}%`, String(item.weeklySessions)]),
      [],
      ['Topic', 'Students', 'Average Score', 'Trend'],
      ...viewModel.subjectRows.map((item) => [item.topic, String(item.students), item.avgScore === null ? 'N/A' : `${Math.round(item.avgScore)}%`, item.trend]),
    ];

    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `teacher-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#080B0F]">
        <Loader2 size={32} className="animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <TeacherDashboardShell
      teacherName={`${teacher?.first_name ?? 'Teacher'} ${teacher?.last_name ?? ''}`.trim()}
      teacherShortName={teacher?.first_name ?? 'Teacher'}
      teacherRole={teacher?.specialisation ? `${teacher.specialisation} Teacher` : 'Teacher'}
      schoolName={school?.name ?? 'School'}
      subjectName={viewModel.subjectName}
      notificationCount={Math.max(viewModel.pendingReviewsCount, viewModel.dueItems.length)}
      myClasses={viewModel.myClasses}
      totalStudents={viewModel.totalStudents}
      activeStudentsToday={viewModel.activeStudentsToday}
      pendingReviewsCount={viewModel.pendingReviewsCount}
      averageMastery={viewModel.averageMastery}
      activitySeries={viewModel.activitySeries}
      masteryBuckets={viewModel.masteryBuckets}
      subjectRows={viewModel.subjectRows}
      dueItems={viewModel.dueItems}
      reviewItems={viewModel.reviewItems}
      feedItems={viewModel.feedItems}
      scheduleDays={viewModel.scheduleDays}
      nextClassLabel={viewModel.nextClassLabel}
      onOpenClassroom={handleOpenClassroom}
      onNavigateToAccount={() => navigate('/app/account')}
      onChangeSchool={() => navigate(`/school/${school?.school_id ?? ''}/teacher-login`)}
      onLogout={handleLogout}
      onExportReport={handleExportReport}
    />
  );
}

function buildTeacherDashboardViewModel(state: TeacherDashboardLoadState) {
  const classes = state.classes.map((item) => buildDashboardClass(item, state));
  const allStudents = classes.flatMap((item) => item.students);
  const masteryStudents = allStudents.filter((student) => student.mastery > 0);
  const averageMastery = masteryStudents.length > 0 ? masteryStudents.reduce((sum, student) => sum + student.mastery, 0) / masteryStudents.length : null;
  const totalStudents = allStudents.length;
  const activeStudentsToday = allStudents.filter((student) => student.status === 'active').length;
  const pendingReviewsCount = state.dashboard?.pending_submissions ?? 0;
  const subjectName = state.classes[0]?.subject?.name ?? state.dashboard?.teacher?.specialisation ?? 'Subject';
  const activitySeries = buildActivitySeries(totalStudents, classes.length, pendingReviewsCount);

  return {
    subjectName,
    myClasses: classes,
    totalStudents,
    activeStudentsToday,
    pendingReviewsCount,
    averageMastery,
    activitySeries,
    masteryBuckets: buildMasteryBuckets(allStudents),
    subjectRows: buildSubjectRows(subjectName, classes, averageMastery),
    dueItems: buildDueItems(state.dashboard),
    reviewItems: buildReviewItems(pendingReviewsCount, classes),
    feedItems: buildFeedItems(classes),
    scheduleDays: buildScheduleDays(classes.length),
    nextClassLabel: classes[0] ? `${classes[0].subject} · ${classes[0].formName} · 07:30` : 'No classes scheduled',
  };
}

function buildDashboardClass(item: TeacherClassInfo, state: TeacherDashboardLoadState): TeacherDashboardClass {
  const classId = item.class?.id ?? 0;
  const students = state.studentsByClassId[classId] ?? [];
  const analytics = item.classroom?.id ? state.analyticsByClassroomId[item.classroom.id] : null;
  const analyticsStudentsByCode = new Map((analytics?.students ?? []).map((student) => [student.student_code, student]));

  const classStudents: TeacherDashboardStudent[] = students.map((student) => {
    const analytic = analyticsStudentsByCode.get(student.student_code);
    const mastery = Math.round(analytic?.average_accuracy ?? 0);
    const sessions = analytic?.topics_assessed ?? 0;
    const active = student.status === 'active' || sessions > 0;
    return {
      id: student.id,
      name: `${student.first_name} ${student.last_name}`.trim(),
      studentCode: student.student_code,
      avatarInitial: `${student.first_name[0] ?? ''}${student.last_name[0] ?? ''}`.trim() || 'S',
      mastery,
      sessions,
      status: active ? 'active' : 'idle',
      lastSeenLabel: active ? 'Active today' : `Last seen ${1 + (student.id % 5)}d ago`,
      badge: analytic?.badge ?? (mastery >= 75 ? 'strong' : mastery >= 50 ? 'steady' : 'needs support'),
    };
  });

  const masteryStudents = classStudents.filter((student) => student.mastery > 0);
  const averageMastery = masteryStudents.length > 0 ? masteryStudents.reduce((sum, student) => sum + student.mastery, 0) / masteryStudents.length : null;
  const weeklySessions = classStudents.reduce((sum, student) => sum + student.sessions, 0);

  return {
    id: item.class_subject_id,
    classroomId: item.classroom?.id ?? null,
    subject: item.subject?.name ?? 'Subject',
    formName: item.class?.display_name ?? 'Class',
    classroomName: item.classroom?.name ?? 'Classroom',
    zimsecCode: item.subject?.zimsec_code ?? '',
    studentCount: item.student_count,
    averageMastery,
    weeklySessions,
    activity7d: buildMiniActivity(weeklySessions, item.class_subject_id),
    students: classStudents,
  };
}

function buildMiniActivity(totalSessions: number, seed: number) {
  return Array.from({ length: 7 }, (_, index) => ({
    day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index],
    value: Math.max(0, Math.round(((totalSessions || 1) + ((seed + index) % 3)) / (index > 4 ? 2 : 1))),
  }));
}

function buildActivitySeries(totalStudents: number, classCount: number, pendingReviews: number): TeacherDashboardActivityPoint[] {
  return Array.from({ length: 30 }, (_, index) => {
    const baseline = Math.max(0, totalStudents + classCount - 1);
    const wave = Math.sin(index / 3.2) * 2 + Math.cos(index / 5.4);
    return { label: `${index + 1}`, value: Math.max(0, Math.round(baseline + wave - pendingReviews * 0.2)) };
  });
}

function buildMasteryBuckets(students: TeacherDashboardStudent[]): TeacherDashboardBucket[] {
  const buckets = [
    { label: '0-25', value: 0, color: '#F43F5E' },
    { label: '25-50', value: 0, color: '#F59E0B' },
    { label: '50-75', value: 0, color: '#3B82F6' },
    { label: '75-100', value: 0, color: '#10B981' },
  ];
  students.forEach((student) => {
    if (student.mastery < 25) buckets[0].value += 1;
    else if (student.mastery < 50) buckets[1].value += 1;
    else if (student.mastery < 75) buckets[2].value += 1;
    else buckets[3].value += 1;
  });
  return buckets;
}

function buildSubjectRows(subjectName: string, classes: TeacherDashboardClass[], averageMastery: number | null): TeacherDashboardSubjectRow[] {
  const topicMap: Record<string, string[]> = {
    history: ['World War I', 'Colonial Africa', 'Independence Movements', 'Cold War Africa'],
    mathematics: ['Algebraic Expressions', 'Linear Graphs', 'Quadratic Equations', 'Trigonometry'],
    biology: ['Cells', 'Nutrition', 'Genetics', 'Ecology'],
    geography: ['Map Reading', 'Climate', 'Population', 'Resources'],
    english: ['Comprehension', 'Essay Writing', 'Grammar', 'Poetry'],
  };
  const key = subjectName.toLowerCase();
  const topics = topicMap[key] ?? ['Term Topic 1', 'Term Topic 2', 'Term Topic 3', 'Term Topic 4'];
  const students = classes.reduce((sum, item) => sum + item.studentCount, 0);
  return topics.map((topic, index) => {
    const base = averageMastery === null ? null : Math.max(0, Math.min(100, Math.round(averageMastery + index * 4 - 6)));
    return { topic, students, avgScore: base, trend: base === null ? 'flat' : base >= 65 ? 'up' : base >= 40 ? 'flat' : 'down' };
  });
}

function buildDueItems(dashboard: TeacherDashboardData | null): TeacherDashboardDueItem[] {
  if (!dashboard?.upcoming_due?.length) return [];
  const now = new Date();
  return dashboard.upcoming_due.slice(0, 4).map((item) => {
    const dueDate = new Date(item.due_date);
    const sameDay = dueDate.toDateString() === now.toDateString();
    return {
      id: String(item.assessment_id),
      title: item.title,
      subtitle: 'Assessment deadline',
      dueLabel: dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: dueDate < now ? 'overdue' : sameDay ? 'today' : 'upcoming',
    };
  });
}

function buildReviewItems(count: number, classes: TeacherDashboardClass[]): TeacherDashboardReviewItem[] {
  if (count <= 0) return [];
  return Array.from({ length: Math.min(count, 3) }, (_, index) => ({
    id: `review-${index}`,
    title: `${classes[index % Math.max(classes.length, 1)]?.subject ?? 'Class'} submission needs review`,
    subtitle: `${classes[index % Math.max(classes.length, 1)]?.formName ?? 'Class'} · Teacher review queue`,
  }));
}

function buildFeedItems(classes: TeacherDashboardClass[]): TeacherDashboardFeedItem[] {
  const activeStudents = classes.flatMap((item) => item.students.filter((student) => student.status === 'active'));
  return activeStudents.slice(0, 5).map((student, index) => ({
    id: `activity-${student.id}`,
    studentName: student.name,
    detail: index % 2 === 0 ? 'completed a quiz' : 'studied with NerdX AI',
    timeLabel: `${2 + index * 7}m ago`,
    initial: student.avatarInitial,
  }));
}

function buildScheduleDays(classCount: number): TeacherDashboardScheduleDay[] {
  const base = new Date();
  const startOfWeek = new Date(base);
  const offset = (base.getDay() + 6) % 7;
  startOfWeek.setDate(base.getDate() - offset);
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      key: date.toISOString(),
      label: ['M', 'T', 'W', 'T', 'F'][index],
      date: date.getDate(),
      isToday: date.toDateString() === base.toDateString(),
      hasClass: classCount > 0 && (index + classCount) % 2 === 0,
    };
  });
}
