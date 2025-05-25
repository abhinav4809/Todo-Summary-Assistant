"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(1, { message: "Task description cannot be empty." }).max(200, {message: "Task description cannot exceed 200 characters."}),
});

type AddTaskFormProps = {
  onAddTask: (description: string) => void;
};

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onAddTask(values.description);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-end">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel className="sr-only">New Task Description</FormLabel>
              <FormControl>
                <Input placeholder="E.g., Buy groceries for the week" {...field} className="text-base"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" aria-label="Add new task">
          <Plus className="h-5 w-5 md:mr-2" /> <span className="hidden md:inline">Add Task</span>
        </Button>
      </form>
    </Form>
  );
}
