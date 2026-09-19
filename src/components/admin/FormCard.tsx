export function ErrorList({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <div className="errors" style={{ display: 'block' }}>
      <div className="errors-title">Mohon perbaiki kesalahan berikut:</div>
      <ul>
        {errors.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  );
}

export default function FormCard({
  icon,
  title,
  sub = 'Isi semua kolom yang bertanda bintang (*)',
  children,
  footer,
}: {
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="form-card">
      <div className="form-header">
        <div className="form-header-icon">{icon}</div>
        <div>
          <div className="form-header-title">{title}</div>
          <div className="form-header-sub">{sub}</div>
        </div>
      </div>
      <div className="form-body">{children}</div>
      <div className="form-footer">{footer}</div>
    </div>
  );
}
