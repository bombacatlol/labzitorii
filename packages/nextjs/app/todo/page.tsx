"use client";

import { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function TodoPage() {
  const [taskText, setTaskText] = useState("");
  const [taskIndex, setTaskIndex] = useState("");

  const { data: tasksCount } = useScaffoldReadContract({
    contractName: "TodoList",
    functionName: "getTasksCount",
  });

  const { writeContractAsync: writeTodoAsync, isMining } = useScaffoldWriteContract({
    contractName: "TodoList",
  });

  const handleAddTask = async () => {
    if (!taskText.trim()) return;

    try {
      await writeTodoAsync({
        functionName: "addTask",
        args: [taskText],
      });
      setTaskText("");
    } catch (error) {
      console.error("Error while adding task:", error);
    }
  };

  const handleCompleteTask = async () => {
    if (taskIndex === "") return;

    try {
      await writeTodoAsync({
        functionName: "completeTask",
        args: [BigInt(taskIndex)],
      });
      setTaskIndex("");
    } catch (error) {
      console.error("Error while completing task:", error);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">TODO-лист</h1>

      <div className="p-4 border rounded-xl bg-base-200">
        <p className="font-semibold mb-2">Количество задач:</p>
        <p>{tasksCount !== undefined ? tasksCount.toString() : "Загрузка..."}</p>
      </div>

      <div className="p-4 border rounded-xl bg-base-200 flex flex-col gap-3">
        <p className="font-semibold">Добавить новую задачу</p>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Введите текст задачи"
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
        />
        <button className="btn btn-primary" disabled={isMining || !taskText.trim()} onClick={handleAddTask}>
          {isMining ? "Отправка транзакции..." : "Добавить задачу"}
        </button>
      </div>

      <div className="p-4 border rounded-xl bg-base-200 flex flex-col gap-3">
        <p className="font-semibold">Отметить задачу выполненной</p>
        <input
          type="number"
          className="input input-bordered w-full"
          placeholder="Введите индекс задачи"
          value={taskIndex}
          onChange={e => setTaskIndex(e.target.value)}
        />
        <button className="btn btn-secondary" disabled={isMining || taskIndex === ""} onClick={handleCompleteTask}>
          {isMining ? "Отправка транзакции..." : "Завершить задачу"}
        </button>
      </div>
    </div>
  );
}
