import { useState } from "react";
import type { Column, Id } from "../types";
import { generateId } from "../utils";
import { ColumnContainer } from "./column-container";
import { Plus } from "lucide-react";

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    console.log({ id, columns });
    const filterColumns = columns.filter((column) => column.id !== id);
    setColumns(filterColumns);
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">
      <div className="m-auto flex gap-4">
        <div className="flex gap-4">
          {columns.map((column) => (
            <ColumnContainer
              key={column.id}
              column={column}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
        <button
          className="h-[60px] w-[200px] min-w-[200px] curson-pointer  rounded-lg bg-[#0D1117] border-2 border-[#161C22] p-4 ring-rose-500 hover:ring-2 flex gap-2 justify-center items-center"
          onClick={() => createNewColumn()}
        >
          <Plus /> Add Columns
        </button>
      </div>
    </div>
  );
};
