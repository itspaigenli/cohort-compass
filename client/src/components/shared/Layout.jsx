export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <main className="content-shell">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p>© Techtonica 2026</p>
          <p>Designed by Paige Li</p>
        </div>
      </footer>
    </div>
  );
}
