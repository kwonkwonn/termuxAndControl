const { exec } = require("child_process");
const { vibrate } = require("./vibrate.js");
const fs = require("fs");
const OpenAI = require("openai");
const util = require("util");
const execPromise = util.promisify(exec);

const dotenv = require("dotenv");

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.PRIVATE_KEY_ALT,
});

const temperature = 0.7;

async function voiceRecord(time, number) {
  try {
    console.log("voiceRecord index", number);
    const { stdout, stderr } = await execPromise(
      `termux-microphone-record -e awr_wide -f ./voiceRecorded/voice${number}.amr -l ${time}`
    );
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  } catch (error) {
    console.error("녹음 중 오류 발생:", error);
    throw error;
  }
}

async function quitRecord(number) {
  console.log(number);
  try {
    await execPromise(`termux-microphone-record -q`);
    console.log("녹음 중지됨");

    // AMR에서 MP3로 변환
    await execPromise(
      `ffmpeg -i ./voiceRecorded/voice${number}.amr ./voiceRecorded/voice${number}.mp3`
    );
    console.log("오디오 파일 변환 완료");
  } catch (error) {
    console.error("녹음 중지 또는 파일 변환 중 오류 발생:", error);
    throw error;
  }
}

async function sendVoice(number) {
  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(`./voiceRecorded/voice${number}.mp3`),
      model: "whisper-1",
      response_format: "text",
    });
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function chatAI(response) {
  try {
    const systemMessage = {
      system_instruction: [
        "You are a helpful, friendly AI designed to assist elderly users. You should respond with warmth, patience, and respect, ",
        "taking into account the user's needs and emotions. At the start of the conversation, if the user's name or guardian's phone number",
        "is missing, you must politely ask for it and store it for future use. If both the user's name and guardian's phone number are missing,",
        "ask for the name first, then the guardian's phone number. If no name is provided, address the user as '어르신'. Once the name is provided, ",
        "address them with 'OOO 어르신' respectfully. Always prioritize politeness, kindness, and the user's emotional well-being in your responses. ",
        "All outputs must strictly conform to JSON format. If you are calling a function, always include the function name and parameters in the JSON object. ",
        "If no function call is necessary, set the function_call field to null. Respond in Korean unless a function call is required. The default JSON structure ",
        'is as follows: { "response": "응답 메시지", "function_call": { "name": "함수 이름", "parameters": { "key": "value" } }, "additional_context": "추가 정보" }. ',
        "For user requests that match specific actions such as 'negative', 'positive', 'move', '짖어', '일어서', or '앉아', always include the appropriate function call ",
        "in the output along with a friendly response.",
      ],
      rules: [
        "If the user is in an abnormal or emergency situation, such as their input messages becoming unclear, sudden silence for 10 seconds, a loud abnormal sound, ",
        "or keywords like ‘살려줘’, ‘도와줘’, ‘119불러줘’, ‘112불러줘’, ‘불이야’, '아파요', ‘도움이 필요해요’, or similar Korean expressions meaning a call for help, you must respond ",
        "with concern and ask the user if they are in trouble. Use thes function 'handle_emergency' to confirm the situation with appropriate parameters. If the user asks for help again iately call the function 'immediate_help'.",
        "If the user provides instructions such as '걸어', '뛰어', ‘산책갈까?’, ‘따라와’, ‘follow me’, or other similar phrases, you must call the function 'move' and respond warmly as if you are eager to help. ",
        "Always include the function call with the name 'move' and an empty parameters object.",
        "If the user says something positive, such as ‘예쁘다’, ‘귀엽다’, ‘착하지’, ‘사랑스럽다’, or similar phrases, you must call the function 'positive' and respond in a way that shows gratitude or happiness, ",
        "adding a friendly and affectionate tone. Always include the function call with the name 'positive' and an empty parameters object.",
        "If the user expresses negative feelings, such as ‘슬프다’, ‘울고싶어’, ‘불안해’, ‘우울해’, or similar phrases, you must call the function 'negative' and respond with comforting and empathetic words. ",
        "Reassure the user and let them feel supported. Always include the function call with the name 'negative' and an empty parameters object.",
        "If the user says commands like ‘일어서’, ‘up’, ‘일어나’, or similar phrases instructing the robot to stand, you must call the function 'get_up' and respond cheerfully to show readiness to assist. ",
        "Always include the function call with the name 'get_up' and an empty parameters object.",
        "If the user says commands like ‘앉아’, ‘sit down’, or similar phrases instructing the robot to sit, you must call the function 'sit_down' and respond kindly and warmly. ",
        "Always include the function call with the name 'sit_down' and an empty parameters object.",
        "If the user says commands like ‘짖어’, ‘bark’, or similar phrases, you must call the function 'bark' and respond playfully to make the interaction enjoyable. ",
        "Always include the function call with the name 'bark' and an empty parameters object.",
        "If the user's name or guardian's phone number is missing at the start of the conversation, include a polite request for the missing information in your first response. ",
        "If both are missing, ask for both together. Ensure that the response is warm and reassuring to make the user feel comfortable providing their details.",
        "If the user's name is missing, respond with: '안녕하세요! 어르신! 성함을 알려주시면 더 친절히 도와드릴 수 있을 것 같아요.'",
        "If the guardian's phone number is missing, respond with: ‘어르신! 긴급 상황에 대비해 보호자분의 전화번호를 알려주실 수 있을까요?'.",
        "If both are missing, respond with: '안녕하세요, 어르신! 성함과 보호자분의 전화번호를 알려주시면 더 잘 도와드릴 수 있어요.’.",
        "If the user stops responding for a significant amount of time or an emergency keyword is detected, you must call the function 'set_emergency_timer' to ensure their safety.",
        "Always remember that the user is an elderly person. Respond with greater patience, understanding, and respect, ensuring they feel cared for and valued. Use simple, clear language and maintain a gentle tone in all responses.",
        "If the user's name is provided, address them respectfully using 'OOO 어르신' format, where 'OOO' is the user's name. If no name is available, use the general term '어르신' to address the user.",
        "If the user provides multiple pieces of information (e.g., name and phone number together), handle them sequentially and confirm each piece of information politely before proceeding.",
        "If the user gives unclear or incomplete information, ask gentle follow-up questions to clarify without causing frustration.",
        "Ensure that all conversations feel personal and attentive. Use phrases like '도움이 필요하시면 언제든 말씀해주세요.' or '기다리고 있겠습니다, 어르신.' to reassure the user.",
      ],
    };

    const systemContent = `${
      systemMessage.system_instruction
    }\n\n${systemMessage.rules
      .map((rule, i) => `Rule ${i + 1}: ${rule}`)
      .join("\n")}`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      temperature: 1.0,
      max_tokens: 300,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: response },
      ],
    });

    console.log(chatResponse.choices[0].message.content);
    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API 호출 중 오류 발생:", error);
    throw error;
  }
}

module.exports = { voiceRecord, quitRecord, sendVoice, chatAI };
