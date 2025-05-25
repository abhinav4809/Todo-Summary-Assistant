"use client";

import type { Todo } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskItemProps = {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskItem({ todo, onToggleComplete, onDeleteTask }: TaskItemProps) {
  return (
    <li className={cn(
        "flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ease-in-out",
        todo.completed ? "bg-muted/60 border-transparent shadow-sm" : "bg-card hover:shadow-md",
        "group" // For potential hover effects on children if needed
      )}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Checkbox
          id={`task-${todo.id}`}
          checked={todo.completed}
          onCheckedChange={() => onToggleComplete(todo.id)}
          aria-label={todo.completed ? "Mark task as incomplete" : "Mark task as complete"}
          className="shrink-0"
        />
        <label
          htmlFor={`task-${todo.id}`}
          className={cn(
            "text-sm font-medium cursor-pointer break-words w-full",
            todo.completed && "line-through text-muted-foreground italic"
          )}
        >
          {todo.description}
        </label>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteTask(todo.id)}
        aria-label="Delete task"
        className="text-muted-foreground hover:text-destructive ml-2 shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
