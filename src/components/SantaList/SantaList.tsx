"use client";
import { useState } from "react";
import styles from "./SantaList.module.css";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

type ListItem = {
  name: string;
  email: string;
  isPicked: boolean;
};

export default function SantaList() {
  const [list, setList] = useState<ListItem[]>([
    { name: "", email: "", isPicked: false },
    { name: "", email: "", isPicked: false },
    { name: "", email: "", isPicked: false },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    idx: number,
    field: Exclude<keyof ListItem, "isPicked">,
    value: string,
  ) => {
    const newList = [...list];
    newList[idx][field] = value;
    setList(newList);
  };

  const addListItem = () => {
    setList([...list, { name: "", email: "", isPicked: false }]);
  };

  const handleRemoveItem = (idx: number) => {
    const newList = list.filter((_, i) => i !== idx);
    setList(newList);
  };

  const handleSecretSanta = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participants: list }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(data.error || "Something went wrong");
      }

      setIsLoading(false);

      if (confirm(data.message + "\nClick OK to go to homepage")) {
        window.location.href = "/";
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingScreen />}
      {list.map((item, idx) => (
        <div key={idx} className={styles.formContainer}>
          <form className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Name:</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleInputChange(idx, "name", e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Email:</label>
              <input
                type="email"
                value={item.email}
                onChange={(e) =>
                  handleInputChange(idx, "email", e.target.value)
                }
                className={styles.input}
              />
            </div>
          </form>
          {idx >= 3 && (
            <button
              type="button"
              onClick={() => handleRemoveItem(idx)}
              className={styles.removeButton}
            >
              X
            </button>
          )}
        </div>
      ))}
      <button type="button" onClick={addListItem} className={styles.addButton}>
        Add Another Person
      </button>
      <button type="button" onClick={handleSecretSanta}>
        Submit
      </button>
    </div>
  );
}
