import { notes } from '../lib/db';
export const dynamic = 'force-dynamic';
export default async function Page() {
  const rows = await notes();
  return <main><h1>Inferra Notes</h1><p>Add rows to the notes table to see them here.</p>
    <ul>{rows.map(row => <li key={row.id}>{row.body}</li>)}</ul>
    {!rows.length && <p>No notes yet.</p>}</main>;
}
