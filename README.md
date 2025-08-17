# AgenticSCG: Secure Code Generation by Multi-agent System

AgenticSCG is an intelligence multi-agent system for code generation task, which focusing on secure of generated code.

There are three roles in AgenticSCG, the planner writing the Chain of Thought (CoT) for the code generation; the coder write the code by the requirement from planner; the auditor receive the source code from coder, and combine the function calling feature get the CWE vulnerabilities, return back to coder a security report.

There are two major techniques used in AgenticSCG are: [AI SDK](https://sdk.vercel.ai/docs) and [Next.js](https://nextjs.org/).

![cover.png](public/images/cover.png)

## Get Started



### Prerequisites

To successfully run the full system, each component must be set up with its respective environment and dependencies. The following table outlines the required services and their runtime environments.

| Facilities           | Description                                                  | Key Dependencies                        | Link                                                        |
| -------------------- | ------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------- |
| AgenticSCG-ChatAsst  | The main component of chatbot web page.                      | `nodejs v20.15.1`<br /> `yarn v1.22.22` |                                                             |
| AgenticSCG-PyAPI     | The web server export python service to AgenticSCG-ChatAsst. | `python v3.12.4`                        | [Link](https://github.com/Anxiu0101/AgenticSCG-PyAPI)       |
| AgenticSCG-Telemetry | The telemetry component for request monitor and analysis.    | `Docker v28.3.2`                        | [Link](https://github.com/Anxiu0101/AgenticSCG-Telemetry) |
| PostgreSQL Database  | Provide persistence capabilities.                            | `PostgreSQL v17.4`                      | [Link](https://www.postgresql.org/download/)                |

The dependency versions listed in the table are recommended but not strictly required. However, alternative versions have not been tested and may result in incomplete or unstable functionality.

> [!tip]
>
> Ensure that *AgenticSCG-PyAPI* and *AgenticSCG-Telemetry* are running before starting the web service to guarantee full functionality. For more details, refer to the link provided in the table. 
>
> For minimal functionality, please ensure that PostgreSQL is installed and running, as it provides persistence for user sessions.

### Environment Variables

For **AgenticSCG-ChatAsst**, both `.env` and `.env.local` files are necessary. Make sure to prepare the appropriate API keys for your chosen model provider. AgenticSCG currently supports GPT models from OpenAI, Gemini from Google, and Deepseek.

An example `.env` file is shown below:

```ini
# .env

# [Required] Model API
OPENAI_API_KEY=<Fill your OpenAI API Key, see it in https://platform.openai.com/api-keys>
GEMINI_API_KEY=<Fill your Google API Key, see it in https://aistudio.google.com/apikey>
DEEPSEEK_API_KEY=<Fill your Deepseek API Key, see it in https://platform.deepseek.com/api_key>

# [Required] Database ORM
AUTH_DRIZZLE_URL=postgres://<username>:<password>@<address>:<port>/<database_name>
	# For example, postgres://postgres:password@localhost:5432/postgres
```

The `.env.local` file defines the configuration for Next.js. To set up authentication, run `npx auth` to generate a secret key and assign it to the `AUTH_SECRET` environment variable.

```ini
# .env.local

# [Required] Server Mode
NODE_ENV=production

# [Required] Database
POSTGRES_URL=postgres://<username>:<password>@<address>:<port>/<database_name>
	# For example, postgres://postgres:password@localhost:5432/postgres

# [Optional] Serveless Storage
BLOB_READ_WRITE_TOKEN="<fill your blob key here.>"

# [Required] Authentication(Next-Auth)
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
AUTH_SECRET="xxxx" # Get it by `npx auth`. Read more: https://cli.authjs.dev

# [Required] Observability(TraceLoop)
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318/v1/traces
OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT=true
NEXT_OTEL_VERBOSE=1
```

After all environment variables applied, install the dependencies and start the server,

[//]: # (Install Dependencies & Server Running.)

```shell
yarn install    # dependencies install.
yarn db:push    # database storage initialization.
yarn dev        # server running.
```

The AgenticSCG-ChatAsst should now be running on [localhost:3000](http://localhost:3000).
