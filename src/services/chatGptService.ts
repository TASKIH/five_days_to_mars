import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from "openai";

const conf = new Configuration({
  organization: process.env.NEXT_PUBLIC_OPENAI_ORGANIZATION,
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(conf);

/**
 * ChatGPTにpromptを投げて、回答を得る
 * @param prompt
 */
const creatCompletion = async (prompt: string): Promise<string[]> => {
  try {
    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: prompt,
        },
      ],
      max_tokens: 2048,
    });
    return result.data.choices.map((item) => {
      return item.message?.content ?? "";
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const ChatGptService = {
  creatCompletion,
};
