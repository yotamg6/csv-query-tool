import { SqlQuery } from '../components/SqlQuery';

const HomePage = () => {
  return (
    <main className="flex justify-center items-center min-h-screen p-8">
      <div className="w-full max-w-2xl rounded-xl p-8 shadow-all-sides bg-white">
        <SqlQuery />
      </div>
    </main>
  );
};

export default HomePage;
