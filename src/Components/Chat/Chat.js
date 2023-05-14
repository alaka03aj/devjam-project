import React, { useEffect, useRef, useState } from 'react'
import { BsSend } from "react-icons/bs";
import useAutosizeTextArea from '../../utils/useAutoTextArea';
import './Chat.css'
import ChatMessage from './ChatMessage';
import Result from '../Result';

const API_KEY = "";

const Chat = () => {
    const [result, setResult] = useState([])
    const [inputMsg, setInputMsg] = useState("")
    const [choice, setChoice] = useState(0)
    const [loadingMsg, setLoadingMsg] = useState(false)

    const textAreaRef = useRef(null);

    useAutosizeTextArea(textAreaRef.current, inputMsg);

    useEffect(() => {
        async function fetchData() {
            // getQuestionData()
            // getQuestionTitle()
            // await chrome.storage.local.get(`${tabId}messages`, result => {
            //     if (result[`${tabId}messages`]) {
            //         setMessages(JSON.parse(result[`${tabId}messages`]))
            //     }
            // })
        }
        // fetchData()
        // eslint-disable-next-line
    }, [])

    const parseResult = (ures) => {
        console.log(ures)
        if (choice === 0) {
            let res = ures.split('*')
            setResult(res)
        } else if (choice == 2) {
            const regex = /Question: (.+?)[\r\n]+Answer: (.+?)(?=(?:[\r\n]+Question: )|$)/gs;
            const matches = [...ures.matchAll(regex)];
            const res = matches.map(match => {
                return {
                    question: match[1].trim(),
                    answer: match[2].trim()
                }
            });
            console.log("Array", res)
            setResult(res)
        } else {
            setResult(ures)
        }
    }

    async function processMessageChatgpt(ch) {
        // const systemMessage = {
        //     role: "system",
        //     content: "Be a summarizer. Try to give answers in concise points if possible"
        // }

        // const userMessage = {
        //     role: "user",
        //     content: inputMsg
        // }
        let systemContent = ""
        switch (ch) {
            case 0:
                systemContent = "Be a summarizer. Give the summary of the text I enter in bullet points. Each bullet point must begin with a '*'"
                break;
            case 1:
                systemContent = "Be a summarizer. Give the summary of the text I enter in sentences"
                break;
            case 2:
                systemContent = "Be a summarizer. Make some questions and answers for the text I enter. Each answer must not be more than 3 sentences. The format must be 'Question:' followed by the question and 'Answer:' followed by the answer. Don't add newlines for each question or answer"
                break;
        }

        const apiRequestBody = {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: systemContent
            }, {
                role: "user",
                content: inputMsg
            }]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json()
        }).then(async (data) => {
            parseResult(data.choices[0].message.content)

            // await chrome.storage.local.set({
            //     [`${tabId}messages`]: JSON.stringify(msgs)
            // })
        })
    }

    const handleSend = async (ch) => {
        setResult([])
        if (inputMsg === '')
            return;
        setChoice(ch)
        setLoadingMsg(true)
        await processMessageChatgpt(ch);
        setLoadingMsg(false)
    }


    return (
        <div >
            <h2>Tiger - Your summarizer</h2>
            <div className='main-container'>
                <div className='user-input-section'>
                    <h3>Enter your text</h3>
                    <div>
                        <textarea
                            className="chat-input"
                            value={inputMsg}
                            onChange={e => setInputMsg(e.target.value)}
                            rows={1}
                            ref={textAreaRef}
                            required
                        ></textarea>
                        <button onClick={() => handleSend(0)}>SUMMARIZE in points</button>
                        <button onClick={() => handleSend(1)}>SUMMARIZE in sentences</button>
                        <button onClick={() => handleSend(2)}>Make QA</button>
                    </div>
                </div>
                <div className='result-section'>
                    <h3>Result</h3>
                    <div className='result'>
                        {loadingMsg && <div>tiger IS THINKING ...</div>}
                        <Result choice={choice} data={result} />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Chat