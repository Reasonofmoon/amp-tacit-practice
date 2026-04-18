export default function LogoMark({ size = 32, label = 'T' }) {
  return (
    <span
      className="logo-mark"
      style={{ width: size, height: size, fontSize: size * 0.7 }}
      aria-hidden="true"
    >
      {label}
    </span>
  );
}
