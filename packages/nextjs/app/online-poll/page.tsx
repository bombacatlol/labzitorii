"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export default function OnlinePollPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // текущий подключённый адрес кошелька
  const { address } = useAccount();

  // Читаем вопрос
  const { data: question } = useScaffoldReadContract({
    contractName: "OnlinePoll",
    functionName: "question",
  });

  // Читаем варианты ответа
  const { data: options } = useScaffoldReadContract({
    contractName: "OnlinePoll",
    functionName: "getOptions",
  });

  // Проверяем, голосовал ли уже текущий адрес
  const { data: hasVotedRaw } = useScaffoldReadContract({
    contractName: "OnlinePoll",
    functionName: "hasVoted",
    args: [address], // <─ важное дополнение: передаём адрес
  });
  const hasVoted = Boolean(hasVotedRaw);

  // Хук для записи (отправки транзакций)
  const { writeContractAsync: writeOnlinePollAsync, isMining } = useScaffoldWriteContract({
    contractName: "OnlinePoll",
  });

  const handleVote = async () => {
    if (selectedIndex === null) return;

    try {
      await writeOnlinePollAsync({
        functionName: "vote",
        args: [BigInt(selectedIndex)],
      });
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const optionsArray = Array.isArray(options) ? options : [];

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold">Онлайн-опрос</h1>

      <div className="p-4 border rounded-xl bg-base-200">
        <p className="font-semibold mb-2">Вопрос:</p>
        <p>{(question as string) ?? "Загрузка вопроса..."}</p>
      </div>

      <div className="p-4 border rounded-xl bg-base-200">
        <p className="font-semibold mb-2">Варианты ответа:</p>

        {optionsArray.length > 0 ? (
          optionsArray.map((opt, idx) => (
            <label
              key={idx}
              className={`flex items-center gap-2 mb-2 cursor-pointer ${selectedIndex === idx ? "font-semibold" : ""}`}
            >
              <input type="radio" name="poll" checked={selectedIndex === idx} onChange={() => setSelectedIndex(idx)} />
              {idx}. {opt as string}
            </label>
          ))
        ) : (
          <p>Загрузка вариантов…</p>
        )}
      </div>

      <button
        className="btn btn-primary"
        disabled={hasVoted || isMining || selectedIndex === null}
        onClick={handleVote}
      >
        {hasVoted ? "Вы уже голосовали" : isMining ? "Отправка транзакции…" : "Голосовать"}
      </button>
    </div>
  );
}
