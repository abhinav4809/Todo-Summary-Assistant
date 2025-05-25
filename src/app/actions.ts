'use server';

import { summarizeTodos as summarizeTodosFlow, type SummarizeTodosInput } from '@/ai/flows/summarize-todos';
import type { Todo } from '@/types';

export async function generateSummaryAndSendToSlackAction(
  todos: Todo[]
): Promise<{ status: 'success' | 'error'; message: string; summary?: string }> {
  // Filter for pending todos to be summarized
  const pendingTodosForSummary = todos.filter(todo => !todo.completed);

  if (pendingTodosForSummary.length === 0) {
    return { status: 'success', message: 'No pending tasks to summarize.', summary: 'No pending tasks.' };
  }

  try {
    const summarizeInput: SummarizeTodosInput = {
      // Pass all todos to the AI, as it might find context in completed tasks too,
      // but the prompt guides it to focus on pending. The current AI prompt might not use this distinction well
      // so we primarily pass pending ones, but the AI flow `summarizeTodos` itself uses `completed` field.
      // Let's use the user's requirement: "summarize all pending to-dos"
      todos: pendingTodosForSummary.map(todo => ({
        id: todo.id,
        description: todo.description,
        completed: todo.completed, // This will be false for all items here
      })),
    };
    const summaryResult = await summarizeTodosFlow(summarizeInput);
    const summaryText = summaryResult.summary;

    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
    if (!slackWebhookUrl) {
      console.warn('SLACK_WEBHOOK_URL is not set. Summary generated but not sent to Slack.');
      // Return success for summary generation, but indicate Slack issue.
      return {
        status: 'success', // Changed to success as summary was generated
        message: 'Summary generated. Slack integration is not configured (Webhook URL missing).',
        summary: summaryText,
      };
    }

    const slackResponse = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: `Task Summary:\n${summaryText}` }),
    });

    if (!slackResponse.ok) {
      let slackError = `Slack API returned ${slackResponse.status}`;
      try {
        const errorBody = await slackResponse.text(); // Slack often returns plain text errors
        slackError += `: ${errorBody}`;
      } catch (e) { /* ignore if can't parse body */ }
      
      console.error('Failed to send summary to Slack:', slackError);
      return {
        status: 'error',
        message: `Summary generated, but failed to send to Slack: ${slackError}`,
        summary: summaryText,
      };
    }

    return { status: 'success', message: 'Summary generated and sent to Slack!', summary: summaryText };
  } catch (error) {
    console.error('Error generating summary or sending to Slack:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred processing the summary or Slack notification.';
    return { status: 'error', message: `Error: ${errorMessage}` };
  }
}
