import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { FiInbox } from "react-icons/fi";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(() => {
    try {
      const stored = localStorage.getItem('todos');
      return stored ? JSON.parse(stored) : [];
    } catch {
      localStorage.removeItem('todos');
      return [];
    }
  });
  const [showFinished, setShowFinished] = useState(true);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const toggleFinished = () => setShowFinished(f => !f);
  const handleEdit = id => {
    const t = todos.find(i => i.id === id);
    setTodo(t.todo);
    setTodos(ts => ts.filter(item => item.id !== id));
  };
  const handleDelete = id =>
    setTodos(ts => ts.filter(item => item.id !== id));
  const handleAdd = () => {
    if (todo.trim().length > 3) {
      setTodos(ts => [...ts, { id: uuidv4(), todo: todo.trim(), isCompleted: false }]);
      setTodo("");
    }
  };
  const handleChange = e => setTodo(e.target.value);
  const handleCheckbox = e => {
    const id = e.target.name;
    setTodos(ts =>
      ts.map(item =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const total = todos.length;
  const remaining = todos.filter(t => !t.isCompleted).length;

  return (
    <>
      <Navbar />

      <div className="mx-3 md:container md:mx-auto my-8 rounded-2xl p-8 bg-gradient-to-br from-violet-100 via-violet-200 to-violet-300 shadow-xl min-h-[80vh] md:w-2/3">
        {/* Header with counts */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="font-extrabold text-center text-3xl text-violet-900 tracking-tight drop-shadow">
            iTask
          </h1>
          <div className="flex gap-4 mt-4 md:mt-0">
            <div className="text-sm font-medium text-violet-800">
              Total: <span className="font-bold">{total}</span>
            </div>
            <div className="text-sm font-medium text-green-700">
              Remaining: <span className="font-bold">{remaining}</span>
            </div>
          </div>
        </header>

        {/* Add Todo */}
        <section className="addTodo my-8 flex flex-col gap-4 bg-white/90 rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-semibold text-violet-800">Add a Todo</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              placeholder="What needs to be done?"
              className="flex-1 rounded-full px-5 py-3 border-2 border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
            <button
              onClick={handleAdd}
              disabled={todo.trim().length <= 3}
              className="bg-violet-700 hover:bg-violet-900 disabled:bg-violet-300 p-3 text-base font-bold text-white rounded-full shadow transition"
            >
              Save
            </button>
          </div>
          <p className="text-xs text-red-500 ml-2 min-h-[1rem]">
            {todo && todo.trim().length <= 3 && "Todo must be at least 4 characters."}
          </p>
        </section>

        {/* Toggle finished */}
        <div className="flex items-center gap-2 my-6">
          <input
            id="showFinished"
            type="checkbox"
            checked={showFinished}
            onChange={toggleFinished}
            className="accent-violet-700 scale-125"
          />
          <label htmlFor="showFinished" className="text-violet-800 font-medium cursor-pointer">
            Show Finished
          </label>
        </div>

        {/* Todos list */}
        <h2 className="text-xl font-semibold text-violet-800 mb-4">Your Todos</h2>
        {todos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <FiInbox size={48} />
            <p className="mt-4 italic">No todos yet — add something!</p>
          </div>
        ) : (
          <div className="todos flex flex-col gap-4">
            <AnimatePresence>
              {todos.map(item => (
                (showFinished || !item.isCompleted) && (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    layout
                    className={
                      "todo flex flex-col md:flex-row items-center md:items-stretch md:w-full bg-white rounded-lg shadow hover:shadow-xl p-4 justify-between gap-3 border-l-4 transition-all " +
                      (item.isCompleted ? "border-green-400" : "border-violet-400")
                    }
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        name={item.id}
                        onChange={handleCheckbox}
                        type="checkbox"
                        checked={item.isCompleted}
                        className="accent-violet-700 scale-125"
                      />
                      <span className={
                        "text-lg transition-all " +
                        (item.isCompleted
                          ? "line-through text-gray-400"
                          : "text-violet-900 font-medium")
                      }>
                        {item.todo}
                      </span>
                    </div>
                    <div className="buttons flex gap-2">
                      <button
                        onClick={() => handleEdit(item.id)}
                        title="Edit"
                        className="bg-violet-600 hover:bg-violet-800 p-2 text-white rounded-full shadow transition-transform hover:scale-110"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                        className="bg-red-500 hover:bg-red-700 p-2 text-white rounded-full shadow transition-transform hover:scale-110"
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
