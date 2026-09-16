import Link from 'next/link';
import { useRouter } from 'next/router';
import classes from './MainNavigation.module.css';

function MainNavigation() {
  const router = useRouter();
  const isHomeRoute = router.pathname === '/';
  const isDiscoverRoute = router.asPath === '/#discover';
  const isNewMeetupRoute = router.pathname === '/new-meetup';

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Link href='/' className={classes.brandBlock}>
          <span className={classes.kicker}>Community experiences</span>
          <div className={classes.logo}>Misc Meetups</div>
        </Link>

        <nav className={classes.nav}>
          <Link href='/' aria-current={isHomeRoute ? 'page' : undefined}>
            Explore
          </Link>
          <Link
            href={{ pathname: '/', hash: 'discover' }}
            aria-current={isDiscoverRoute ? 'page' : undefined}
          >
            Discover
          </Link>
          <Link
            href='/new-meetup'
            className={classes.cta}
            aria-current={isNewMeetupRoute ? 'page' : undefined}
          >
            Host a meetup
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default MainNavigation;
