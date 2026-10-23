import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { isAdminConfigured, isAuthenticated } from "@/lib/auth";

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/admin");

  const configured = isAdminConfigured();

  return (
    <section className="admin-card admin-login">
      <h1>Acesso restrito</h1>
      <p className="admin-muted">Entre com a senha do painel administrativo.</p>

      {!configured && (
        <p className="form-message form-error" role="alert">
          Painel não configurado. Defina <code>ADMIN_PASSWORD</code> (8+
          caracteres), <code>ADMIN_API_KEY</code> (24+) e{" "}
          <code>SESSION_SECRET</code> (32+) no arquivo <code>.env.local</code> e
          reinicie o servidor.
        </p>
      )}

      <LoginForm />
    </section>
  );
}
