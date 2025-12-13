import { getCookieApp } from "../lib/cookies";

export default async function Home() {
  await getCookieApp()

  return (
    <h1>Aguarde</h1>
  );
}
