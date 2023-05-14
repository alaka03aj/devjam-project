import React from 'react'

const Result = ({ choice, data }) => {
    return (
        <div>
            {console.log(data)}
            {data &&
                <div>
                    {choice === 0 &&
                        <ul>
                            {data.map((res, index) => (
                                <li key={index}>{res}</li>
                            ))}
                        </ul>
                    }
                    {choice === 1 &&
                        <p>{data}</p>
                    }
                    {choice === 2 &&
                        <ul>
                            {data.map((res, index) => (
                                <li key={index}>
                                    <p>Question: {res.question}</p>
                                    <p>Answer: {res.answer}</p>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            }
        </div>
    )
}

export default Result