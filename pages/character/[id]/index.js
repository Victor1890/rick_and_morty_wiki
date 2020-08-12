import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";

const defaultEndpoint = `https://rickandmortyapi.com/api/character`;

export async function getServerSideProps({ query }) {
  const { id } = query;
  const res = await fetch(`${defaultEndpoint}/${id}`);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Character({ data }) {
  const { name, image, gender, location, origin, species, status } = data;

  const variants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.4,
      },
    },
  };

  return (
    <div className="container">
      <Head>
        <title>{name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={variants}
          className="title"
        >
          {name}
        </motion.h1>
        <div className="profile">
          <div className="profile-image">
            <motion.img
              src={image}
              alt={name}
              initial="hidden"
              animate="visible"
              variants={variants}
            />
          </div>
          <motion.div
            className="profile-details"
            initial="hidden"
            animate="visible"
            variants={variants}
          >
            <h2>Character Details</h2>
            <ul>
              <li>
                <strong>Name:</strong> {name}
              </li>
              <li>
                <strong>Status:</strong> {status}
              </li>
              <li>
                <strong>Gender:</strong> {gender}
              </li>
              <li>
                <strong>Species:</strong> {species}
              </li>
              <li>
                <strong>Location:</strong> {location?.name}
              </li>
              <li>
                <strong>Originally From:</strong> {origin?.name}
              </li>
            </ul>
          </motion.div>
        </div>

        <p className="back">
          <Link href="/">
            <a>Back to All Character</a>
          </Link>
        </p>
      </main>

      <style jsx>{
        `.back a {
            color: blue;
            text-decoretion: underline;
        }
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;

          list-style: none;
          margin-left: 0;
          padding-left: 0;
        }

        .profile {
        display: flex;
        margin-top: 2em;
        }
        
        @media (max-width: 600px) {
        .profile {
            flex-direction: column;
        }
        }
        
        .profile-image {
        margin-right: 2em;
        }
        
        @media (max-width: 600px) {
        .profile-image {
            max-width: 100%;
            margin: 0 auto;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }`}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
