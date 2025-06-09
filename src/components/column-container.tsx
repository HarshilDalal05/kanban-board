import { useMemo, useState } from "react";

import { Plus, Trash2 } from "lucide-react";

import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable } from "@dnd-kit/sortable";

import { TaskCard } from "./task-card";
import type { Column, Id, Task } from "../types";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumnTitle: (id: Id, title: string) => void;
  tasks: Task[];
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, value: string) => void;
  columnIndex?: number;
}

export const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumnTitle,
  tasks,
  createTask,
  deleteTask,
  updateTaskContent,
  columnIndex,
}: Props) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const tasksId = useMemo(() => tasks.map((task: Task) => task.id), [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: { type: "Column", column },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-amber-50 opacity-60 w-[350px] border-2 border-rose-600 h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-amber-50 shadow-lg w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between bg-[#774F34] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-b-2"
      >
        <div
          className="flex gap-2"
          onClick={() => {
            setEditMode(true);
          }}
        >
          <div className="flex justify-center items-center bg-[#161C22] px-2 text-sm">
            {columnIndex}
          </div>
          {editMode ? (
            <input
              className="bg-[#774F34] border-2 focus:border-black rounded outline-none px-2"
              autoFocus
              value={column.title}
              onChange={(e) => updateColumnTitle(column.id, e.target.value)}
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          ) : (
            column.title
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              createTask(column.id);
            }}
          >
            <Plus className="hover:bg-[#161C22] rounded opacity-60 hover:opacity-100" />
          </button>
          <button onClick={() => deleteColumn(column.id)}>
            <Trash2 className="hover:bg-[#161C22] rounded opacity-60 hover:opacity-100" />
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-4 p-4 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksId}>
          {tasks.map((task) => (
            <TaskCard
              deleteTask={deleteTask}
              task={task}
              updateTaskContent={updateTaskContent}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
