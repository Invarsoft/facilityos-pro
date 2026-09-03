import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Priority, TicketStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatStatusLabel(status: TicketStatus): string {
  switch (status) {
    case 'new':
      return 'New';
    case 'under_review':
      return 'Under Review';
    case 'assigned':
      return 'Assigned';
    case 'accepted':
      return 'Accepted';
    case 'in_progress':
      return 'In Progress';
    case 'on_hold':
      return 'On Hold';
    case 'completed':
      return 'Completed';
    case 'awaiting_verification':
      return 'Awaiting Verification';
    case 'resolved':
      return 'Resolved';
    case 'closed':
      return 'Closed';
    case 'reopened':
      return 'Reopened';
    case 'escalated':
      return 'Escalated';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export function getStatusColorClass(status: TicketStatus): {
  bg: string;
  text: string;
  border: string;
} {
  switch (status) {
    case 'new':
      return { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' };
    case 'under_review':
      return { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' };
    case 'assigned':
      return { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' };
    case 'accepted':
      return { bg: 'bg-cyan-50 dark:bg-cyan-950/40', text: 'text-cyan-700 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800' };
    case 'in_progress':
      return { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' };
    case 'on_hold':
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-300 dark:border-slate-700' };
    case 'completed':
      return { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' };
    case 'awaiting_verification':
      return { bg: 'bg-yellow-50 dark:bg-yellow-950/40', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-300 dark:border-yellow-800' };
    case 'resolved':
      return { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' };
    case 'closed':
      return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400', border: 'border-gray-300 dark:border-gray-700' };
    case 'reopened':
      return { bg: 'bg-orange-50 dark:bg-orange-950/40', text: 'text-orange-700 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' };
    case 'escalated':
      return { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-300 dark:border-rose-800' };
    case 'cancelled':
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' };
    default:
      return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
  }
}

export function getPriorityBadge(priority: Priority): {
  bg: string;
  text: string;
  label: string;
} {
  switch (priority) {
    case 'low':
      return { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300', label: 'Low' };
    case 'normal':
      return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-200', label: 'Normal' };
    case 'high':
      return { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-800 dark:text-orange-300', label: 'High' };
    case 'critical':
      return { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-300', label: 'Critical' };
    case 'emergency':
      return { bg: 'bg-rose-600 animate-pulse', text: 'text-white font-bold', label: '🚨 EMERGENCY' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800', label: priority };
  }
}

export function getRoleDisplayName(role: string, orgType?: string, orgName?: string): string {
  if (role === 'org_admin' || role === 'admin' || role === 'super_admin') return orgName ? `${orgName} Chief Operations Admin` : 'Chief Operations Admin';
  if (role === 'courier_manager') return 'Courier Desk Manager';
  if (role === 'sports_manager') return 'Sports Area Operations Manager';
  if (role === 'laundry_manager') return 'Hostel Laundry Operations Manager';
  if (role === 'food_manager') return 'Canteen & Food Court Manager';
  if (role === 'warden' || (role === 'manager' && orgType === 'university')) return 'Hostel Warden';
  if (role === 'manager' && orgType === 'apartment') return 'Community Manager';
  if (role === 'manager' && orgType === 'office') return 'Facility Manager';
  if (role === 'student') return 'Student Resident';
  if (role === 'resident') return 'Resident';
  if (role === 'worker' || role === 'technician') return 'Technician';
  return role.charAt(0).toUpperCase() + role.slice(1);
}
