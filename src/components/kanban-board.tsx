import { useMemo, useState } from "react";

import { Plus } from "lucide-react";
import { createPortal } from "react-dom";

import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { generateId } from "../utils";
import { TaskCard } from "./task-card";
import type { Column, Id, Task } from "../types";
import { ColumnContainer } from "./column-container";

export const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

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
  const [activeTask, setActiveTask] = useState<Task | null>();

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filterColumns = columns.filter((column) => column.id !== id);
    setColumns(filterColumns);

    const newTasks = tasks.filter((task) => task.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumnTitle(id: Id, title: string) {
    const updatedColumns = columns.map((column) => {
      if (column.id !== id) return column;
      return { ...column, title };
    });

    setColumns(updatedColumns);
  }

  function updateTaskContent(id: Id, content: string) {
    const updatedTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(updatedTasks);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1} `,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const filterTasks = tasks.filter((task) => task.id !== id);
    setTasks(filterTasks);
  }

  function onDragStart(event: DragStartEvent) {
    if (
      event.active.data.current &&
      event.active.data.current.type === "Column"
    ) {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (
      event.active.data.current &&
      event.active.data.current.type === "Task"
    ) {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

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

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (activeColumnId === overColumnId) return;

    if (!isActiveATask) return;

    //* Changing order of task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeColumnIndex = tasks.findIndex(
          (task: Task) => task.id === activeColumnId
        );

        const overColumnIndex = tasks.findIndex(
          (task: Task) => task.id === overColumnId
        );

        tasks[activeColumnIndex].columnId = tasks[overColumnIndex].columnId;

        return arrayMove(tasks, activeColumnIndex, overColumnIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeColumnIndex = tasks.findIndex(
          (task: Task) => task.id === activeColumnId
        );

        tasks[activeColumnIndex].columnId = overColumnId;

        return arrayMove(tasks, activeColumnIndex, activeColumnIndex);
      });
    }
  }

  return (
    <div className="min-h-screen w-full">
      <div className="m-auto flex shadow-lg  border-gray-400 min-h-[5vh] p-4 w-full items-center justify-between">
        <div className="flex items-center">
          <img src="/kanban.png" className="h-[40px] mr-2" />
          <div className="text-black text-2xl mb-3 font-bold">KanbanBoard</div>
        </div>
        <div>
          <button
            className="h-[60px] w-[200px] min-w-[200px] curson-pointer rounded-lg bg-[#774F34] p-4 flex gap-2 justify-center items-center text-lg hover:bg-[#4a3425]"
            onClick={() => createNewColumn()}
          >
            <Plus /> Add Columns
          </button>
        </div>
      </div>
      <div className="m-auto bg-gray-100 flex min-h-[90vh] w-full items-center overflow-x-auto overflow-y-hidden">
        <DndContext
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
          sensors={sensors}
        >
          <div className="m-auto flex gap-4">
            <div className="flex gap-4">
              <SortableContext items={columnsId}>
                {columns.map((column, i) => (
                  <ColumnContainer
                    deleteTask={deleteTask}
                    tasks={tasks.filter((task) => task.columnId === column.id)}
                    key={column.id}
                    column={column}
                    columnIndex={i + 1}
                    deleteColumn={deleteColumn}
                    updateColumnTitle={updateColumnTitle}
                    createTask={createTask}
                    updateTaskContent={updateTaskContent}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  updateTaskContent={updateTaskContent}
                  deleteTask={deleteTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumnTitle={updateColumnTitle}
                  createTask={createTask}
                />
              )}
              {activeTask && (
                <TaskCard
                  deleteTask={deleteTask}
                  task={activeTask}
                  updateTaskContent={updateTaskContent}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
    </div>
  );
};
