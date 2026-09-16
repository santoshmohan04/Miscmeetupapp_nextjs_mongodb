import Link from 'next/link';
import classes from './MainNavigation.module.css';

function MainNavigation() {
  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Link href='/' className={classes.brandBlock}>
          <span className={classes.kicker}>Community experiences</span>
          <div className={classes.logo}>Misc Meetups</div>
        </Link>

        <nav className={classes.nav}>
          <Link href='/'>Explore</Link>
          <Link href={{ pathname: '/', hash: 'discover' }}>Discover</Link>
          <Link href='/new-meetup' className={classes.cta}>
            Host a meetup
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default MainNavigation;
