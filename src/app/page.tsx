import Link from "next/link";

export default function Home() {
  return (
    <main>
      <img
        id="big-santa"
        style={{ maxWidth: "60%" }}
        src="/santa.webp"
        alt="Santa"
      />
      <Link href="/create">
        <button>Start picking the Secret Santas</button>
      </Link>
      <Link href="/help">
        <button>How does it work?</button>
      </Link>
    </main>
  );
}
