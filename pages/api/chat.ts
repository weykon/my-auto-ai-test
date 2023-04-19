import type { NextRequest } from "next/server"
import { ChatCompletionRequestMessage, CreateChatCompletionRequest } from "openai-edge/types/types/chat"
import { Configuration, OpenAIApi } from "openai-edge"

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)


export const HEADERS_STREAM = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "text/event-stream;charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  "X-Accel-Buffering": "no",
}

const handler = async (req: NextRequest) => {
  const body: CreateChatCompletionRequest = await req.json()
  console.log('body', body, typeof body)
  try {
    const completion = await openai.createChatCompletion({
      ...body,
      max_tokens: 1024,
      stream: true,
    })
    console.log('completion', completion)
    return new Response(completion.body, {
      headers: HEADERS_STREAM,
    })
  } catch (error: any) {
    console.error(error)
    if (error.response) {
      console.error(error.response.status)
      console.error(error.response.data)
    } else {
      console.error(error.message)
    }
    return new Response(JSON.stringify(error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    })
  }
}

export const config = {
  runtime: "edge",
}

export default handler
