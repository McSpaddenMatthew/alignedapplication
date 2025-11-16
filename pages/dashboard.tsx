import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient, type User } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!isMounted) return;

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading your dashboard…</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-10 flex flex-col items-center">
      <section className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.email}</h1>
        <p className="text-slate-600">
          This is your personal Aligned dashboard. Only this login can see the summaries,
          hiring managers, and candidates you create here.
        </p>
      </section>

      <section className="w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">Choose your next action</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="border rounded-lg px-4 py-6 text-center hover:bg-slate-50">
            New Summary
          </button>
          <button className="border rounded-lg px-4 py-6 text-center hover:bg-slate-50">
            History
          </button>
          <button className="border rounded-lg px-4 py-6 text-center hover:bg-slate-50">
            Settings
          </button>
        </div>
      </section>
    </main>
  );
}
