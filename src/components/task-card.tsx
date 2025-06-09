import { Check, Trash } from "lucide-react";
import type { Id, Task } from "../types";
import { useState } from "react";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTaskContent: (id: Id, value: string) => void;
}

export const TaskCard = ({ task, deleteTask, updateTaskContent }: Props) => {
  const [hover, setHover] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setHover(false);
  };

  if (editMode) {
    return (
      <div className="bg-[#0D1117] p-2.5 h-[100px] min-h-[100px] flex text-left items-center hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative">
        <textarea
          className="h-[90%] w-full resize-none border-none bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Enter task content here ....."
          onBlur={toggleEditMode}
          onChange={(e) => updateTaskContent(task.id, e.target.value)}
        />
        <button
          onClick={toggleEditMode}
          className=" bg-[#161C22] p-2 rounded opacity-60 hover:opacity-100"
        >
          <Check />
        </button>
      </div>
    );
  }
  return (
    <div
      className="task-container bg-[#0D1117] p-2.5 h-[100px] min-h-[100px] flex text-left items-center hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDoubleClick={toggleEditMode}
    >
      <p className="my-auto h-[90%] w-full overflow-x-hidden overflow-y-auto whitespace-pre-wrap ">
        {task.content}
      </p>

      {hover && (
        <button
          onClick={() => deleteTask(task.id)}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-[#161C22] p-2 rounded opacity-60 hover:opacity-100"
        >
          <Trash />
        </button>
      )}
    </div>
  );
};
