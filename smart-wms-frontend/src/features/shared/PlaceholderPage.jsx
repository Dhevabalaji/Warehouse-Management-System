export default function PlaceholderPage({ title, subtitle, children }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      <div className="content-card p-6">
        {children || (
          <p className="text-slate-500">
            This page is created successfully. Next, we will add real table,
            form, chart, and CRUD functionality.
          </p>
        )}
      </div>
    </div>
  );
}