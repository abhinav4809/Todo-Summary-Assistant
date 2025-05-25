"use client";

import { useState, useEffect, useTransition } from "react";
import type { Todo } from "@/types";
import { AddTaskForm } from "@/components/AddTaskForm";
import { TaskList } from "@/components/TaskList";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateSummaryAndSendToSlackAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Sparkles, Send, Loader2, Edit3, ListTodo } from "lucide-react"; // Added Edit3, ListTodo

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, startSummaryTransition] = useTransition();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensures localStorage is accessed only on the client
    const storedTodos = localStorage.getItem("taskflow-todos");
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (error) {
        console.error("Error parsing todos from localStorage:", error);
        localStorage.removeItem("taskflow-todos"); // Clear corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("taskflow-todos", JSON.stringify(todos));
    }
  }, [todos, isClient]);

  const handleAddTask = (description: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      description,
      completed: false,
    };
    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  };

  const handleToggleComplete = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const handleSummarizeAndSend = () => {
    startSummaryTransition(async () => {
      setSummary(null); // Clear previous summary
      const pendingTodos = todos.filter(todo => !todo.completed);
      if (pendingTodos.length === 0) {
        toast({
          title: "No Pending Tasks",
          description: "There are no pending tasks to summarize or send.",
        });
        setSummary("No pending tasks to summarize.");
        return;
      }

      const result = await generateSummaryAndSendToSlackAction(todos); // Pass all todos for context, action filters
      if (result.summary) {
        setSummary(result.summary);
      }
      toast({
        title: result.status === "success" ? "Success!" : "Operation Status",
        description: result.message,
        variant: result.status === "success" ? "default" : "destructive",
        duration: result.status === "success" ? 5000 : 9000,
      });
    });
  };

  const pendingTaskCount = todos.filter(t => !t.completed).length;

  if (!isClient) {
    // Render a loading state or null until the client is mounted
    // This helps avoid hydration mismatches with localStorage
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8 flex flex-col items-center selection:bg-primary/20">
        <header className="my-8 md:my-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4 shadow-sm">
             <Edit3 className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-primary">
            TaskFlow
          </h1>
          <p className="text-muted-foreground mt-2 text-md sm:text-lg max-w-md mx-auto">
            Organize your tasks, get AI-powered summaries, and stay on top of your goals.
          </p>
        </header>

        <main className="w-full max-w-2xl space-y-8">
          <Card className="shadow-lg border-t-4 border-primary rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl">Add New Task</CardTitle>
              <CardDescription>What needs to be done today?</CardDescription>
            </CardHeader>
            <CardContent>
              <AddTaskForm onAddTask={handleAddTask} />
            </CardContent>
          </Card>
          
          <Card className="shadow-lg rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <ListTodo className="mr-3 h-6 w-6 text-primary/80" />
                Your Tasks
              </CardTitle>
              <CardDescription>Manage your current to-do items. {todos.length} total task{todos.length !== 1 ? 's' : ''}.</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskList
                todos={todos}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg border-t-4 border-accent rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Sparkles className="mr-3 h-6 w-6 text-accent" />
                AI Summary & Slack
              </CardTitle>
              <CardDescription>
                Generate an AI summary of your {pendingTaskCount} pending task{pendingTaskCount !== 1 ? 's' : ''} and send it to Slack.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {summary && (
                <div>
                  <label htmlFor="summary-output" className="block text-sm font-medium text-muted-foreground mb-1">Generated Summary:</label>
                  <Textarea
                    id="summary-output"
                    value={summary}
                    readOnly
                    rows={6}
                    className="bg-muted/30 border-muted-foreground/30 focus:ring-accent text-sm"
                    aria-label="Generated AI summary of tasks"
                  />
                </div>
              )}
              <Button
                onClick={handleSummarizeAndSend}
                disabled={isSummarizing || pendingTaskCount === 0}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-base py-6"
                size="lg"
                aria-live="polite"
              >
                {isSummarizing ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSummarizing ? "Processing..." : "Summarize & Send to Slack"}
              </Button>
            </CardContent>
             <CardFooter>
              <p className="text-xs text-muted-foreground text-center w-full">
                Ensure your Slack webhook URL is configured in environment variables for notifications.
              </p>
            </CardFooter>
          </Card>
        </main>
        <footer className="mt-12 py-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </footer>
      </div>
      <Toaster />
    </>
  );
}
