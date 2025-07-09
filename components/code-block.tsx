'use client';

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';

  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        <pre
          {...props}
          className={`text-sm w-full overflow-x-auto p-4 border rounded-xl 
          border-zinc-200 text-zinc-900
          dark:bg-zinc-900
          dark:border-zinc-700 
          dark:text-zinc-100`}
        >
          <code className="whitespace-pre-wrap break-words">{children}</code>
        </pre>
      </div>
    );
  } else {
    return (
        <code
            className={`${
                className || ""
            } text-sm bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 py-0.5 px-1 rounded-md`}
            {...props}
        >
          {children}
        </code>
    );
  }
}
