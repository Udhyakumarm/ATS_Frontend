import { Configuration, OpenAIApi } from "openai";
console.log(process.env.OPENAI_API);
const openAI = new OpenAIApi(
	new Configuration({
		apiKey: process.env.OPENAI_API
	})
);

export default async function FetchHelper(prePrompt, postPrompt) {
	const res = await openAI.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [{ role: "user", content: `${prePrompt}: ${postPrompt}` }]
	});
	const result = res.data.choices[0].message.content;
	return result;
}
