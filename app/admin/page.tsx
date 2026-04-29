import { redirect } from 'next/navigation';

// /admin is a bare shell - the real overview lives at /admin/dashboard.
// Keeps URLs explicit and the sidebar's active-state logic simple.
export default function AdminRootPage() {
  redirect('/admin/dashboard');
}
