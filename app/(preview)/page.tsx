"use client";

import { useRef } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { GitIcon, MasonryIcon, VercelIcon } from "@/components/icons";
import Link from "next/link";
import { useChat } from "ai/react";
import { toast } from "sonner";

export default function Home() {
  const { messages, handleSubmit, input, setInput, append, isLoading } =
    useChat({
      onError: () => {
        toast.error("You've been rate limited, please try again later!");
      },
    });
  const lastUserMessage = messages.filter((m) => m.role === "user").pop();

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const suggestedActions = [
    {
      title: "How many 'r's",
      label: "are in the word strawberry?",
      action: "How many 'r's are in the word strawberry?",
    },
  ];

  return (
    <div className="flex flex-row justify-center pb-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">
        <div
          ref={messagesContainerRef}
          className="flex flex-col gap-6 h-full w-dvw items-center overflow-y-scroll"
        >
          {messages.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
              <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <VercelIcon size={16} />
                  <span>+</span>
                  <MasonryIcon />
                </p>
                <p className="text-center">
                  Multi-step generations with gpt-4o-mini (
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://openai.com"
                    target="_blank"
                  >
                    OpenAI
                  </Link>
                  ) and the{" "}
                  <Link
                    className="text-blue-500 dark:text-blue-400"
                    href="https://sdk.vercel.ai"
                    target="_blank"
                  >
                    AI SDK
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((message, i) => {
            return (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                toolInvocations={message.toolInvocations}
                reasoningMessages={[]}
                queryPending={
                  isLoading && lastUserMessage
                    ? lastUserMessage.id === message.id
                    : false
                }
              ></Message>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-1 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            suggestedActions.map((suggestedAction, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={async () => {
                    append({
                      role: "user",
                      content: suggestedAction.action,
                    });
                  }}
                  className="w-full text-left border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 rounded-lg p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex flex-col"
                >
                  <span className="font-medium">{suggestedAction.title}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {suggestedAction.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            disabled={isLoading}
            className="bg-zinc-100 disabled:opacity-50 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)]"
            placeholder="Send a message..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
        </form>
      </div>
      <motion.div
        className="flex flex-row gap-4 items-center justify-between fixed bottom-6 text-xs "
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Link
          target="_blank"
          href="https://github.com/vercel-labs/ai-sdk-preview-steps-reasoning"
          className="flex flex-row gap-2 items-center border px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          <GitIcon />
          View Source Code
        </Link>

        <Link
          target="_blank"
          href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-steps-reasoning&env=OPENAI_API_KEY&envDescription=OpenAI%20API%20Key%20Needed&envLink=https%3A%2F%2Fplatform.openai.com"
          className="flex flex-row gap-2 items-center bg-zinc-900 px-2 py-1.5 rounded-md text-zinc-50 hover:bg-zinc-950 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-50"
        >
          <VercelIcon size={14} />
          Deploy with Vercel
        </Link>
      </motion.div>
    </div>
  );
}
