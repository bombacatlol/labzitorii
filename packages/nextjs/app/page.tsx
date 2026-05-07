"use client";

import Link from "next/link";
import { Address } from "@scaffold-ui/components";
import type { NextPage } from "next";
import { hardhat } from "viem/chains";
import { useAccount } from "wagmi";
import { useTargetNetwork } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { targetNetwork } = useTargetNetwork();

  return (
    <div className="flex items-center flex-col grow pt-10 px-5">
      <h1 className="text-center mb-6">
        <span className="block text-2xl mb-2">Децентрализованное приложение</span>
        <span className="block text-4xl font-bold">TODO-лист</span>
      </h1>

      <p className="text-center text-lg max-w-2xl mb-6">
        Приложение позволяет добавлять задачи в блокчейн и отмечать их как выполненные. Все действия фиксируются через
        смарт-контракт.
      </p>

      <div className="flex justify-center items-center space-x-2 flex-col mb-8">
        <p className="my-2 font-medium">Подключенный адрес:</p>
        <Address
          address={connectedAddress}
          chain={targetNetwork}
          blockExplorerAddressLink={
            targetNetwork.id === hardhat.id ? `/blockexplorer/address/${connectedAddress}` : undefined
          }
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <Link href="/todo" className="btn btn-primary">
          Перейти к TODO-листу
        </Link>

        <Link href="/blockexplorer" className="btn btn-outline">
          Открыть Block Explorer
        </Link>
      </div>
    </div>
  );
};

export default Home;
