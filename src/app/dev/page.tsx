import { redirect } from 'next/navigation';

export default function DevRedirectPage() {
  redirect('/exchange-rates/dev');
}
