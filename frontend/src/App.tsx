// frontend/src/App.tsx
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoStats } from './components/TodoStats';
import { Navbar } from './components/Navbar';

function App() {
  const { todos, loading, error, createTodo, toggleTodo, deleteTodo } = useTodos();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Meine Aufgaben
            </h1>
            <p className="text-gray-600">
              Organisiere deine Aufgaben
            </p>
          </div>

          <ErrorMessage message={error} />
          <TodoForm onSubmit={createTodo} />
          <TodoList
            todos={todos}
            loading={loading}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
          <TodoStats todos={todos} />
        </div>
      </div>
    </>
  );
}

export default App;