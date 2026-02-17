// utils/analyticsAggregator.js
import { APPOINTMENT_STATUS } from '../data/constants';

const DAY_MS = 86400000;

const startOfDay = d => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const endOfDay = d => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function aggregateDoctorAnalytics({
  appointments,
  doctorId,
  period,
  startDate,
  endDate,
}) {
  const now = new Date();

  const doctorAppointments = appointments.filter(
    a => a.doctorId === doctorId
  );

  let rangeStart;
  let rangeEnd;

  switch (period) {
    case 'today':
      rangeStart = startOfDay(now);
      rangeEnd = endOfDay(now);
      break;

    case 'week':
      rangeStart = startOfDay(new Date(now.getTime() - 6 * DAY_MS));
      rangeEnd = endOfDay(now);
      break;

    case 'month':
      rangeStart = startOfDay(new Date(now.getTime() - 29 * DAY_MS));
      rangeEnd = endOfDay(now);
      break;

    case 'year':
      rangeStart = startOfDay(new Date(now.getFullYear(), 0, 1));
      rangeEnd = endOfDay(now);
      break;

    case 'custom':
      if (startDate && endDate) {
        rangeStart = startOfDay(new Date(startDate));
        rangeEnd = endOfDay(new Date(endDate));
      }
      break;
  }

  const filtered =
    rangeStart && rangeEnd
      ? doctorAppointments.filter(
          a => a.date >= rangeStart && a.date <= rangeEnd
        )
      : [];

  // =========================
  // SUMMARY
  // =========================
  const summary = {
    appointments: filtered.length,
    revenue: filtered.reduce(
      (sum, a) =>
        a.status === APPOINTMENT_STATUS.COMPLETED
          ? sum + a.fee
          : sum,
      0
    ),
    patients: new Set(filtered.map(a => a.patientId)).size,
  };

  // =========================
  // CHART DATA
  // =========================
  let revenue = [];
  let appointmentsChart = [];

  // TODAY — time buckets
  if (period === 'today') {
    const buckets = [
      { label: '9–11', from: 9, to: 11 },
      { label: '11–1', from: 11, to: 13 },
      { label: '1–3', from: 13, to: 15 },
      { label: '3–5', from: 15, to: 17 },
      { label: '5–7', from: 17, to: 19 },
      { label: '7–9', from: 19, to: 21 },
    ];

    revenue = buckets.map(b => ({
      day: b.label,
      amount: filtered
        .filter(
          a =>
            a.status === APPOINTMENT_STATUS.COMPLETED &&
            a.date.getHours() >= b.from &&
            a.date.getHours() < b.to
        )
        .reduce((s, a) => s + a.fee, 0),
    }));

    appointmentsChart = buckets.map(b => ({
      day: b.label,
      count: filtered.filter(
        a =>
          a.date.getHours() >= b.from &&
          a.date.getHours() < b.to
      ).length,
    }));
  }

  // WEEK / MONTH / CUSTOM — daily buckets
  if (period === 'week' || period === 'month' || period === 'custom') {
    const days = [];
    let cursor = new Date(rangeStart);

    while (cursor <= rangeEnd) {
      const d = new Date(cursor);
      days.push({
        date: d,
        label:
          period === 'month' || period === 'custom'
            ? d.getDate().toString()
            : WEEK_DAYS[d.getDay()],
      });
      cursor = new Date(cursor.getTime() + DAY_MS);
    }

    revenue = days.map(d => ({
      day: d.label,
      amount: filtered
        .filter(
          a =>
            a.status === APPOINTMENT_STATUS.COMPLETED &&
            startOfDay(a.date).getTime() === startOfDay(d.date).getTime()
        )
        .reduce((s, a) => s + a.fee, 0),
    }));

    appointmentsChart = days.map(d => ({
      day: d.label,
      count: filtered.filter(
        a =>
          startOfDay(a.date).getTime() === startOfDay(d.date).getTime()
      ).length,
    }));
  }

  // YEAR — monthly buckets
  if (period === 'year') {
    const year = now.getFullYear();

    revenue = MONTHS.map((m, i) => ({
      day: m,
      amount: filtered
        .filter(
          a =>
            a.date.getFullYear() === year &&
            a.date.getMonth() === i &&
            a.status === APPOINTMENT_STATUS.COMPLETED
        )
        .reduce((s, a) => s + a.fee, 0),
    }));

    appointmentsChart = MONTHS.map((m, i) => ({
      day: m,
      count: filtered.filter(
        a =>
          a.date.getFullYear() === year &&
          a.date.getMonth() === i
      ).length,
    }));
  }

  return {
    summary,
    chartData: {
      revenue,
      appointments: appointmentsChart,
    },
  };
}
