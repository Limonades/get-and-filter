import { ChangeEvent, useEffect, useState } from 'react';

const JOKES_NUMBER = 3;
const JOKE_URL = 'https://api.chucknorris.io/jokes/random';

function App() {
  const [jokes, setJokes] = useState<Jokes>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchJokes = async (): Promise<void> => {
      try {
        const jokesData = await getJokes(JOKES_NUMBER);

        setJokes(jokesData);
        setLoading(false);
      }catch (error) {
        console.error("Error fetching jokes:", error);
        setLoading(false);
        setError(true);
      }
    };

    fetchJokes();
  }, [])

  const handleFilter = (e: ChangeEvent<HTMLInputElement>): void => {
    setFilter(e.target.value)
  };

  const filteredJokes: Jokes = jokes.filter(joke => (
    joke.value.toLowerCase()
      .includes(filter.toLowerCase()))
  );

  const isSuccess = !loading && !error;

  console.log(jokes);

  return (
    <div>
      {loading && 'Loading...'}

      {error && 'Something went wrong...'}

      {isSuccess && (
        <>
          <h1>Chuck Norris Jokes</h1>

          <input
            type="text"
            placeholder="Jokes filter..."
            value={filter}
            onChange={handleFilter}
          />

          {filteredJokes.length > 0 && (
            <JokesTable jokes={filteredJokes}/>
          )}
        </>
      )}
    </div>
  )
}

function JokesTable({ jokes }: JokesTableProps) {
  return (
    <table>
      <thead>
      <tr>
        <th>№</th>
        <th>Photo</th>
        <th>Joke</th>
      </tr>
      </thead>
      <tbody>
      {jokes.map((joke, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>
            <img src={joke.icon_url} alt="Chuck Norris Joke"/>
          </td>
          <td>{joke.value}</td>
        </tr>
      ))}
      </tbody>
    </table>
  );
}

async function getJoke(): Promise<Joke> {
  const res = await fetch(JOKE_URL);

  return res.json();
}

async function getJokes(count: number): Promise<Jokes> {
  const promises = Array.from({ length: count }, getJoke);

  return Promise.all(promises);
}

interface Joke {
  categories: string[]
  created_at: string
  icon_url: string
  id: string
  updated_at: string
  url: string
  value: string
}

type Jokes = Array<Joke>;

interface JokesTableProps {
  jokes: Jokes
}

export default App
