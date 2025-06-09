import { useState } from "react";

import { Check, Trash } from "lucide-react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import type { Id, Task } from "../types";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, value: string) => void;
}

export const TaskCard = ({ task, deleteTask, updateTaskContent }: Props) => {
  const [hover, setHover] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "Task", task },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setHover(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white border-1 border-black rounded shadow-lg p-2.5 h-[100px]  opacity-30 min-h-[100px] flex text-left items-center cursor-grab relative"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-white border-1 rounded shadow-lg p-2.5 h-[100px]  min-h-[100px] flex text-left items-center hover:ring-2 hover:ring-inset  cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none  text-black bg-transparent focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Enter task content here ....."
          onBlur={toggleEditMode}
          onChange={(e) => updateTaskContent(task.id, e.target.value)}
        />
        <button
          onClick={toggleEditMode}
          className=" bg-[#161C22] absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded opacity-60 hover:opacity-100"
        >
          <Check className="p-1"/>
        </button>
      </div>
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-container rounded bg-white border-1  p-2.5 h-[100px] min-h-[100px] flex text-left items-center hover:ring-2 hover:ring-inset  shadow-lg cursor-grab relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={toggleEditMode}
    >
      <p className="my-auto h-[90%] w-full text-black overflow-x-hidden overflow-y-auto whitespace-pre-wrap ">
        {task.content}
      </p>

      {hover && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-[#161C22] p-1 rounded opacity-60 hover:opacity-100"
        >
          <Trash className="p-1"/>
        </button>
      )}
    </div>
  );
};
