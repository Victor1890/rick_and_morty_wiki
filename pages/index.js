import Head from "next/head";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const defaultEndpoint = `https://rickandmortyapi.com/api/character`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;

  const [results, updateResults] = useState(defaultResults);

  const [page, updatePage] = useState({
    ...info,
    current: `https://rickandmortyapi.com/api/character`,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    const request = async () => {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    };

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "query");

    const value = fieldQuery.value || "";
    const point = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: point,
    });
  }

  return (
    <div className="container">
      <Head>
        <title>Rick and Morty Wiki</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"/>
      </Head>

      <main>
        <motion.div initial='hidden' animate='visible' variants={{
          hidden:{
            scale: .8,
            opacity: 0
          },
          visible:{
            scale: 1,
            opacity: 1,
            transition: {
              delay: .4
            }
          }
        }}>
          <h1 className="title">Rick and Morty Wiki</h1>
        </motion.div>

        <p className="description">This is a sample app of Rick and Morty</p>

        <form className="search form-group" onSubmit={handleOnSubmitSearch}>
          <input className='form-control' name="query" type="search" />
          <button className='btn btn-light btn-lg btn-block'>Search</button>
        </form>

        <ul className="grid">
          {results.map((e) => {
            const { id, name, image } = e;
            return (
              <motion.li key={id} className="card" whileHover={{
                position: 'relative',
                zIndex: 1,
                background: 'white',
                scale: [1, 1.4, 1.2],
                rotate: [0, 2, -2, 0],
                filter: [
                  'hue-rotate(0)',
                  'hue-rotate(360deg)',
                  'hue-rotate(45deg)',
                  'hue-rotate(0)',
                ],
                transition:{
                  duration: .2
                }
              }}>
                <Link href="/character/[id]" as={`/character/${id}`}>
                  <a href={`${id}`}>
                    <img src={image} alt={`${name} Thumbnail`} />
                    <h3 className='text-center'>{name}</h3>
                  </a>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <p>
          <button className='btn btn-light' onClick={handleLoadMore}>Load More</button>
        </p>
      </main>

      <style>{`
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
        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 800px;
          margin-top: 3rem;
          list-style:none;
          margin-left: 0;
          padding-left: 0;
        }
        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }
        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }
        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }
        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
        .logo {
          height: 1em;
        }
        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
        .search {
          margin-top: 2em;
        }
        .search input {
          padding: .3em .6em;
          margin-right: 1em;
        }
        @media (max-width: 600px) {
          .search input {
            margin-right: 0;
            margin-bottom: .5em;
          }
        }
        .search input,
        .search button {
          font-size: 1.4em;
        }
        @media (max-width: 600px) {
          .search input,
          .search button {
            width: 100%;
          }
        }
        .card .char-name {
          margin-top: .4em;
          margin-bottom: 0;
        }
        .button {
          color: white;
          font-size: inherit;
          background: blueviolet;
          border: none;
          border-radius: .2em;
          padding: .4em .6em;
        }
        .load-more {
          font-size: 1.4em;
        }
      `}</style>

    

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
