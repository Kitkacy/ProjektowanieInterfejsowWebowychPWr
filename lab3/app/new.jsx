import { BookProvider } from './context/BookContext';

export default function NewPage() {
  return (
    <BookProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 text-center">Add New Book</h1>
          <div className="max-w-2xl mx-auto">
            <BookForm />
          </div>
        </main>
        <Footer />
      </div>
    </BookProvider>
  );
}
