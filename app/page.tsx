"use client";

import { useEffect, useState } from "react";
import NamePicker from "@/components/NamePicker";
import TeamBoard from "@/components/TeamBoard";

const STORAGE_KEY = "papan-status-tim:my-id";

export default function Home() {
  const [myId, setMyId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMyId(localStorage.getItem(STORAGE_KEY));
    setLoaded(true);
  }, []);

  const pickName = (id: string) => {
    localStorage.setItem(STORAGE_KEY, id);
    setMyId(id);
  };

  const changeName = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMyId(null);
  };

  if (!loaded) {
    return null;
  }

  return myId ? (
    <TeamBoard myId={myId} onChangeName={changeName} />
  ) : (
    <NamePicker onPick={pickName} />
  );
}
