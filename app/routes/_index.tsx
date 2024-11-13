import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { getTasks, updateTask, Task, Tasks } from "~/lib/task-api";

import Checkbox from "~/components/checkbox";
export const meta: MetaFunction = () => {
  return [
    { title: "Todo App" },
    {
      name: "description",
      content: "A todo app built with Remix.",
    },
  ];
};

export const loader: LoaderFunction = async () => {
  const tasks = await getTasks();
  return json(tasks);
};

export default function Home() {
  const initialTasks = useLoaderData<Tasks>();
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(true);

  const calcIncompleteTasks = () => {
    return tasks.reduce((acc, task) => {
      if (!task.isComplete) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  const isTaskOverdue = (task: Task) => {
    if (task.dueDate) {
      return new Date(task.dueDate) < new Date();
    }
    return false;
  };

  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    taskId: string
  ) => {
    const isComplete = event.target.checked;
    // Optimistically Update the task state locally
    setTasks((prevTasks: Tasks) =>
      prevTasks.map((task: Task) =>
        task.id === taskId ? { ...task, isComplete: isComplete } : task
      )
    );
    const res = await updateTask(taskId, isComplete);
    if (!res?.success) {
      // Revert the task state if the update fails
      setTasks((prevTasks: Tasks) =>
        prevTasks.map((task: Task) =>
          task.id === taskId ? { ...task, isComplete: !isComplete } : task
        )
      );
    }
  };
  const completedTasks = () => {
    return tasks.filter((task: Task) => task.isComplete);
  };
  const clearCompletedTasks = async () => {
    const completed = completedTasks();

    if (completed.length === 0) {
      return;
    }

    setTasks((prevTasks: Tasks) =>
      prevTasks.filter((task: Task) => !task.isComplete)
    );
  };

  const deleteAllTasks = async () => {
    if (tasks.length === 0) {
      return;
    }

    setTasks([]);
  };

  useEffect(() => {
    if (tasks) {
      setLoading(false);
      const sortTasks = (tasks: Tasks) => {
        return tasks.sort((a, b) => {
          if (isTaskOverdue(a) && !isTaskOverdue(b)) {
            return -1;
          }
          if (!isTaskOverdue(a) && isTaskOverdue(b)) {
            return 1;
          }
          if (a.dueDate && b.dueDate) {
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          }
          if (a.isComplete && !b.isComplete) {
            return 1;
          }
          if (!a.isComplete && b.isComplete) {
            return -1;
          }
          return 0;
        });
      };
      setTasks(sortTasks(tasks));
    }
  }, [tasks, setTasks]);

  return (
    <div className="flex flex-1 flex-col md:mx-auto md:w-[720px]">
      <header className="my-12 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          TODO
        </h1>
      </header>

      <main className="flex-1 space-y-8">
        <div className="rounded-xl border border-gray-200 bg-white/90 px-5 py-7 dark:border-gray-700 dark:bg-gray-900 relative">
          {loading ? <p className="text-center leading-6">Loading...</p> : null}
          {tasks?.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {tasks.map((task: Task) => (
                <li
                  className="flex items-center gap-4 justify-between group border border-gray-200 rounded-full px-4 py-2 h-12 data-[complete=true]:border-green-700 data-[overdue=true]:border-red-500"
                  data-complete={task.isComplete}
                  data-overdue={isTaskOverdue(task)}
                  key={task.id}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      className="group-data-[overdue=true]:checked:[&>[data-slot=control]]:!bg-red-500 group-data-[overdue=true]:focus:[&>[data-slot=control]]:ring-red-500/30"
                      id={`todo-checkbox-${task.id}`}
                      aria-label={task.description}
                      checked={task?.isComplete ?? false}
                      onChange={(event) => handleCheckboxChange(event, task.id)}
                    />
                    <p className="text-sm leading-none group-data-[complete=true]:line-through">
                      {task.description}
                    </p>
                  </div>
                  {task.dueDate && (
                    <time className="text-xs text-gray-500 dark:text-gray-200 border border-gray-500 dark:border-gray-200 border-solid rounded-full w-20 h-6 px-1.5 py-1 flex items-center justify-center group-data-[overdue=true]:border-red-500 group-data-[overdue=true]:text-red-500">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </time>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center leading-6">No tasks available</p>
          )}
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white/90 px-4 py-2 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-4 text-sm">
            <p className="text-center leading-7">
              {calcIncompleteTasks()}{" "}
              {calcIncompleteTasks() === 1 ? "item" : "items"} left
            </p>
            <div className="flex items-center gap-4">
              <button
                className="text-red-400 transition hover:text-red-600 disabled:opacity-60 disabled:pointer-events-none"
                disabled={completedTasks().length === 0}
                onClick={() => clearCompletedTasks()}
              >
                Clear Completed
              </button>
              <button
                className="text-red-400 transition hover:text-red-600"
                onClick={() => deleteAllTasks()}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-12">
        <p className="text-center text-sm leading-loose">
          Built with ❤️ by Sean McQuaid
        </p>
      </footer>
    </div>
  );
}
