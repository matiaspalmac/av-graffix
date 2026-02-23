import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";

export default async function ErpLoginPage(props: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await auth();

  if (session?.user) {
    redirect("/erp");
  }

  const searchParams = await props.searchParams;
  const error = searchParams?.error;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-brand-600 font-semibold">AV GRAFFIX</p>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">ERP Login</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Acceso interno para ventas, producción y finanzas.</p>
        </div>

        <form
          action={async (formData) => {
            "use server";
            await signIn("credentials", {
              email: formData.get("email"),
              password: formData.get("password"),
              redirectTo: "/erp",
            });
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Correo</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
              placeholder="admin@avgraffix.cl"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Contraseña</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2.5 text-sm outline-none ring-brand-500 focus:ring-2"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-2 text-sm text-red-700 dark:text-red-300">
              Credenciales inválidas. Intenta nuevamente.
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 transition"
          >
            Ingresar al ERP
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/" className="text-brand-600 hover:underline font-medium">Volver al sitio AV GRAFFIX</Link>
        </div>
      </div>
    </div>
  );
}
