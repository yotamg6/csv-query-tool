import { SqlQuery } from '../components/SqlQuery';

const HomePage = () => {
  return (
    <main className="flex justify-center items-center min-h-screen p-8 bg-red-50">
      <div className="w-full max-w-2xl bg-red rounded-xl shadow-md p-8">
        <SqlQuery />
      </div>
    </main>
  );
};

export default HomePage;
