import type { Todo } from "@/types";
import { TaskItem } from "./TaskItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ListChecks } from "lucide-react";

type TaskListProps = {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export function TaskList({ todos, onToggleComplete, onDeleteTask }: TaskListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10 border-2 border-dashed border-muted-foreground/30 rounded-lg">
        <ListChecks className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <p className="text-xl font-semibold">Your task list is empty!</p>
        <p className="text-sm">Add some tasks above to get started.</p>
      </div>
    );
  }

  const pendingTasks = todos.filter(todo => !todo.completed);
  const completedTasks = todos.filter(todo => todo.completed);

  return (
    <div className="space-y-6">
      {pendingTasks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center text-primary">
            <ListChecks className="mr-2 h-5 w-5" />
            Pending Tasks ({pendingTasks.length})
          </h3>
          <ul className="space-y-3">
            {pendingTasks.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </ul>
        </div>
      )}

      {pendingTasks.length > 0 && completedTasks.length > 0 && (
        <Separator className="my-6" />
      )}

      {completedTasks.length > 0 && (
         <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center text-muted-foreground">
            <CheckCircle className="mr-2 h-5 w-5" />
            Completed Tasks ({completedTasks.length})
          </h3>
          <ul className="space-y-3">
            {completedTasks.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
