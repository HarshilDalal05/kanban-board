import { useMemo, useState } from "react";
import type { Column, Id } from "../types";
import { generateId } from "../utils";
import { ColumnContainer } from "./column-container";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  const columnsId = useMemo(
    () => columns.map((col: Column) => col.id),
    [columns]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, //3px
      },
    })
  );

  const [activeColumn, setActiveColumn] = useState<Column | null>();

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

  function updateColumnTitle(id: Id, title: string) {
    const updatedColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return { ...column, title };
    });

    setColumns(updatedColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (
      event.active.data.current &&
      event.active.data.current.type === "Column"
    ) {
      setActiveColumn(event.active.data.current.column);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col: Column) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col: Column) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((column) => (
                <ColumnContainer
                  key={column.id}
                  column={column}
                  deleteColumn={deleteColumn}
                  updateColumnTitle={updateColumnTitle}
                />
              ))}
            </SortableContext>
          </div>
          <button
            className="h-[60px] w-[200px] min-w-[200px] curson-pointer  rounded-lg bg-[#0D1117] border-2 border-[#161C22] p-4 ring-rose-500 hover:ring-2 flex gap-2 justify-center items-center"
            onClick={() => createNewColumn()}
          >
            <Plus /> Add Columns
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumnTitle={updateColumnTitle}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
};
