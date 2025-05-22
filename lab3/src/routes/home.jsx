import { Welcome } from "../welcome/welcome";
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>New React Router App</title>
        <meta name="description" content="Welcome to React Router!" />
      </Helmet>
      <Welcome />
    </>
  );
}
