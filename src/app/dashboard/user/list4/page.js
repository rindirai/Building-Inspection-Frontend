// sections
import { UserListViewPassed } from 'src/sections/user/view';

// ----------------------------------------------------------------------
async function getData() {
  const res = await fetch('http://localhost:8000/client/status-client-profiles/passed', {
    next: { revalidate: 36 },
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }

  return res.json();
}
export const metadata = {
  title: 'Dashboard: User List',
};

export default async function UserListPage() {
  const data = await getData();
  return <UserListViewPassed data={data} />;
}
