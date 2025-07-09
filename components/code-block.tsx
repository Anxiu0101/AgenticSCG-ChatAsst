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

  if (!inline) {
    return match ? (
      <pre
        {...props}
        className="text-sm w-full overflow-x-auto p-4 border rounded-xl
        border-zinc-200 text-zinc-900
        bg-zinc-100
        dark:bg-zinc-900
        dark:border-zinc-700
        dark:text-zinc-100
        group-data-[role=user]/message:bg-zinc-900
        group-data-[role=user]/message:text-zinc-50
        group-data-[role=user]/message:border-zinc-700"
      >
        <code
          className={`whitespace-pre-wrap break-words language-${match[1]}`}
        >
          {children}
        </code>
      </pre>
    ) : (
      <code className="whitespace-pre-wrap break-words px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-md">
        {children}
      </code>
    );
  } else {
    return (
      <code
        className={`${
          className || ''
        } text-sm bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 py-0.5 px-1 rounded-md
        group-data-[role=user]/message:bg-zinc-900
        group-data-[role=user]/message:text-zinc-50
        group-data-[role=user]/message:border-zinc-700`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
