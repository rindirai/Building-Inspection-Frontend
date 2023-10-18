// // sections
// import UserEditView from 'src/sections/user/view/user-edit-view';

// // ----------------------------------------------------------------------

// export const metadata = {
//   title: 'Dashboard: User Edit',
// };

// export default function UserEditPage() {
//   return <UserEditView />;
// }

// sections
import { AccountView } from 'src/sections/account/view';

// ----------------------------------------------------------------------
async function getData(id) {
  const res = await fetch(`http://localhost:8000/client/client-profiles/${id}`, {
    next: { revalidate: 16 },
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
  title: 'Dashboard: Account Settings',
};

export default async function AccountPage({ params }) {
  console.log('PARAMS', params.id);
  const id = params.id;
  const data = await getData(id);
  return <AccountView data={data} client_id={id} />;
}
