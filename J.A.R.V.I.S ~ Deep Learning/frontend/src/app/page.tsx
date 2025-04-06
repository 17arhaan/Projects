import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="flex flex-col h-screen">
        <header className="bg-gray-800 p-4 text-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">J.A.R.V.I.S</h1>
            <p className="text-gray-400">Your Personal AI Assistant</p>
          </div>
        </header>
        <div className="flex-1">
          <Chat />
        </div>
      </div>
    </main>
  );
} 