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
}

export const ColumnContainer = ({
  column,
  deleteColumn,
  updateColumnTitle,
  tasks,
  createTask,
  deleteTask,
  updateTaskContent,
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
        className="bg-[#161C22] opacity-60 w-[350px] border-2 border-rose-600 h-[500px] max-h-[500px] rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[#161C22] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onDoubleClick={() => {
          setEditMode(true);
        }}
        className="flex items-center justify-between bg-[#0D1117] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-4"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-[#161C22] px-2 text-sm">
            0
          </div>
          {editMode ? (
            <input
              className="bg-black border-2 focus:border-rose-500 rounded outline-none px-2"
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
        <button onClick={() => deleteColumn(column.id)}>
          <Trash2 className="stroke-gray-500 hover:stroke-white hover:bg-[#161C22]" />
        </button>
      </div>
      <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto">
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
      <button
        className="flex gap-2 justify-end-safe items-center border-[#161C22] border-2 rounded-md p-4 border-x-[#161C22] hover:bg-[#0D1117] active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <Plus />
        Add Task
      </button>
    </div>
  );
};
