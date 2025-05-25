# TaskFlow - Todo Summary Assistant

TaskFlow is a Next.js application that helps you manage your to-do items and leverage AI to summarize your pending tasks. You can also send these summaries directly to a configured Slack channel.

Built with Next.js, React, Tailwind CSS, ShadCN UI, and Genkit for AI integration.

![TaskFlow Screenshot](https://placehold.co/800x600.png?text=TaskFlow+App+Interface)
*<p align="center" data-ai-hint="application user interface">A placeholder image of the TaskFlow application interface.</p>*

## Core Features

- **Add Tasks**: Easily add new tasks with descriptions.
- **View Tasks**: See all your pending and completed tasks in a clean list.
- **Manage Tasks**: Mark tasks as complete or delete them.
- **AI-Powered Summaries**: Generate meaningful summaries of your pending to-dos using a Large Language Model.
- **Send to Slack**: Send the AI-generated summary to a designated Slack channel.
- **Notifications**: Get success/failure messages for Slack operations.
- **Local Persistence**: Tasks are saved in your browser's local storage.

## Tech Stack

- **Framework**: Next.js (App Router, Server Components), React, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI
- **AI Integration**: Genkit (using Google Gemini by default, configurable via `src/ai/genkit.ts`)
- **State Management**: React Hooks (client-side for todos, leveraging `localStorage`)
- **Server Logic**: Next.js Server Actions for AI summarization and Slack notification.
- **Form Handling**: React Hook Form with Zod for validation.

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn or pnpm

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd taskflow 
    ```
    (Replace `<your-repo-url>` with the actual URL of this repository if you've forked it)

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to a new file named `.env.local` in the root of your project:
    ```bash
    cp .env.example .env.local
    ```
    Open `.env.local` and fill in the required values:

    *   `GOOGLE_API_KEY`: Your API key for Google AI Studio (Gemini). You can get one [here](https://aistudio.google.com/app/apikey). Ensure your Genkit configuration in `src/ai/genkit.ts` matches the model provider if you choose a different one.
    *   `SLACK_WEBHOOK_URL`: Your Slack Incoming Webhook URL. See instructions below on how to obtain this.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```
    The application will be available at `http://localhost:9002` (or the port specified in your `package.json` script).

### Slack Integration Setup

To send summaries to Slack, you need to create an Incoming Webhook for your Slack workspace:

1.  Go to the [Slack App Directory](https://api.slack.com/apps) and click "Create New App".
2.  Choose "From scratch".
3.  Enter an "App Name" (e.g., "TaskFlow Notifier") and select the "Workspace" you want to add it to. Click "Create App".
4.  From your new app's settings page, navigate to **Features > Incoming Webhooks**.
5.  Toggle **Activate Incoming Webhooks** to "On".
6.  Click the **Add New Webhook to Workspace** button.
7.  Choose the channel where the app will post messages and click **Allow**.
8.  Slack will generate a Webhook URL. Copy this URL.
9.  Paste the copied Webhook URL into your `.env.local` file for the `SLACK_WEBHOOK_URL` variable.

    Example: `SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"`

### LLM (GenAI) Setup

This project uses Genkit to interact with Large Language Models. By default, it's configured to use Google Gemini (`googleai/gemini-2.0-flash`) as specified in `src/ai/genkit.ts`.

- You'll need a `GOOGLE_API_KEY` in your `.env.local` file. This key enables the application to make calls to the Gemini API for generating task summaries.
- If you wish to use a different model or provider supported by Genkit (e.g., OpenAI, Anthropic):
    1.  Install the corresponding Genkit plugin (e.g., `npm install @genkit-ai/openai`).
    2.  Update `src/ai/genkit.ts` to configure the new plugin and specify the desired model.
    3.  Add any necessary API keys or environment variables for the new provider to your `.env.local` file (e.g., `OPENAI_API_KEY`).

## Design and Architecture Decisions

- **Framework**: Next.js with the App Router was chosen for its modern React features, server-side capabilities (Server Components, Server Actions), file-system routing, and overall development experience.
- **Styling**: Tailwind CSS provides a utility-first approach for rapid and consistent UI development. ShadCN UI is used for its collection of beautifully designed, accessible, and customizable React components that integrate seamlessly with Tailwind CSS.
- **AI Integration**: Genkit is utilized to abstract LLM interactions, facilitating features like task summarization. This allows for flexibility in choosing LLM providers and models. The `summarizeTodos` flow is a server-side Genkit flow, ensuring API keys and complex logic are not exposed to the client.
- **Backend Logic**: Next.js Server Actions handle server-side logic such as generating AI summaries and dispatching notifications to Slack. This approach keeps the frontend and backend tightly coupled within the Next.js ecosystem, simplifying development and deployment.
- **Todo State Management**: For this version, to-do items are managed on the client-side using React's `useState` hook. Data persistence across browser sessions is achieved by leveraging the browser's `localStorage`. While suitable for a personal tool, a production application with multiple users would typically employ a dedicated database (e.g., Firebase Firestore, Supabase PostgreSQL) managed via Server Actions.
- **User Experience (UX)**: The UI is designed to be clean, minimalist, and intuitive, focusing on ease of task management. Clear visual hierarchy, responsive design, and subtle animations contribute to a smooth user experience. Notifications for asynchronous operations (like sending to Slack) are provided using `react-hot-toast` (integrated via ShadCN's `useToast` hook).

## Future Enhancements (Potential)

- **Database Integration**: Implement a robust backend database (e.g., Firebase Firestore, Supabase) for persistent and shareable to-do lists.
- **User Authentication**: Add user accounts to allow multiple users to manage their own private to-do lists.
- **Task Editing**: Allow users to edit the description of existing tasks.
- **Drag-and-Drop Reordering**: Implement functionality to reorder tasks.
- **Due Dates & Reminders**: Add support for setting due dates and receiving reminders.
- **Advanced AI Features**: Explore more sophisticated AI capabilities, such as task prioritization, breaking down large tasks, or suggesting task categories.
- **Customizable Slack Messages**: Allow users to customize the format or content of Slack notifications.
- **Offline Support**: Enhance offline capabilities using Service Workers.
