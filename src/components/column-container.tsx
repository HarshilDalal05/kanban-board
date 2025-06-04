import { Trash2 } from "lucide-react";
import type { Column, Id } from "../types";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

export const ColumnContainer = ({ column, deleteColumn }: Props) => {
  return (
    <div className="bg-[#161C22] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col">
      <div className="flex items-center justify-between bg-[#0D1117] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-4">
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-[#161C22] px-2 text-sm">
            0
          </div>
          {column.title}
        </div>
        <button onClick={() => deleteColumn(column.id)}>
          <Trash2 className="stroke-gray-500 hover:stroke-white hover:bg-[#161C22]" />
        </button>
      </div>
      <div className="flex flex-grow">Content</div>
      <div>Footer</div>
    </div>
  );
};
