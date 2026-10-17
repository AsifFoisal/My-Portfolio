import ProjectForm from "../project-form";

export const metadata = { title: "New project · Admin" };

export default function NewProjectPage() {
  return (
    <>
      <h1>New project</h1>
      <p className="admin-sub">fill in the details — the card goes live immediately</p>
      <div className="admin-card">
        <ProjectForm />
      </div>
    </>
  );
}
