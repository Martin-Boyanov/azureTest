import { supabase } from "@/lib/supabase";
import { addTodo, deleteTodo, toggleTodo } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: todos, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Todos
        </h1>

        <form action={addTodo} className="flex gap-2">
          <input
            type="text"
            name="task"
            placeholder="Add a todo..."
            required
            className="flex-1 rounded-md border border-black/10 bg-white px-3 py-2 text-black dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-md bg-foreground px-4 py-2 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-600">
            Failed to load todos: {error.message}
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {todos?.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between gap-3 rounded-md border border-black/8 bg-white px-3 py-2 dark:border-white/[.145] dark:bg-zinc-900"
            >
              <form
                action={toggleTodo.bind(null, todo.id, !todo.is_complete)}
                className="flex flex-1 items-center gap-3"
              >
                <button
                  type="submit"
                  aria-label="Toggle complete"
                  className={`h-5 w-5 shrink-0 rounded border border-black/20 dark:border-white/30 ${
                    todo.is_complete ? "bg-green-500" : "bg-transparent"
                  }`}
                />
                <span
                  className={`text-black dark:text-zinc-50 ${
                    todo.is_complete ? "text-zinc-400 line-through dark:text-zinc-500" : ""
                  }`}
                >
                  {todo.task}
                </span>
              </form>
              <form action={deleteTodo.bind(null, todo.id)}>
                <button
                  type="submit"
                  className="text-sm text-zinc-500 hover:text-red-600"
                >
                  Delete
                </button>
              </form>
            </li>
          ))}
          {todos?.length === 0 && (
            <p className="text-sm text-zinc-500">No todos yet — add one above.</p>
          )}
        </ul>
      </main>
    </div>
  );
}
