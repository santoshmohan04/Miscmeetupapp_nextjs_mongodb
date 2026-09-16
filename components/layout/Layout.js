import MainNavigation from './MainNavigation';
import classes from './Layout.module.css';

function Layout(props) {
  return (
    <div className={classes.shell}>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
      <footer className={classes.footer}>
        <div>
          <strong>Misc Meetups</strong>
          <p>Discover, host, and grow memorable community experiences.</p>
        </div>
        <span>Built for modern event discovery.</span>
      </footer>
    </div>
  );
}

export default Layout;
