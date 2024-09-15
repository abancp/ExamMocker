import useUserDetails from '../hooks/useUserDetails';

function MyApp({ Component, pageProps }) {
  useUserDetails();
  return <Component {...pageProps} />;
}

export default MyApp;

