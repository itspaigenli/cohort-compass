export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <main className="content-shell">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <p className="site-footer-left">© Techtonica 2026</p>
          <p className="site-footer-right">
            Designed by <span className="site-footer-cat" aria-label="Cat art">ᓚᘏᗢ</span>Paige Li
          </p>
        </div>
      </footer>
    </div>
  );
}
