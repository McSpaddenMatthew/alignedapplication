import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";
import { createServerClient } from "../../lib/supabaseClient";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const supabase = createServerClient(accessToken);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    redirect("/login");
  }

  const fullName = profile?.full_name || (user.user_metadata as Record<string, string | undefined>)?.full_name;
  const email = profile?.email || user.email;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 flex flex-col items-center">
      <section className="w-full max-w-4xl mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Welcome, {fullName || "there"}</h1>
            {email && <p className="text-slate-600">Signed in as {email}</p>}
          </div>
          <LogoutButton />
        </div>
        <p className="text-slate-600 mt-4">
          This is your personal Aligned dashboard. Your summaries and settings will live here soon.
        </p>
      </section>

      <section className="w-full max-w-4xl bg-white border border-slate-200 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-3">Your workspace</h2>
        <div className="text-slate-600">
          <p className="mb-2">Future summaries will be listed here.</p>
          <p className="text-sm text-slate-500">
            We&apos;ll use your Supabase profile to filter content to your account only.
          </p>
        </div>
      </section>
    </main>
  );
}
