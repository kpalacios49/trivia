import React from 'react'
import 'animate.css'


const TriviaQuestion = (props) => {

    const checkAnswer = (event) => {
        const answer_selected = event.target.getAttribute('data-answer')
        const question = event.target.getAttribute('data-question')

        if (!props.question.answer_selected) {
            // props.question.answer_selected = {
            //     correct: false,
            //     answer: answer_selected
            // }
            event.target.classList.remove('bg-indigo-200')

            if (answer_selected == props.question.correct_answer) {
                props.question.answer_selected = {
                    is_correct: true,
                    answer: answer_selected
                }
                event.target.classList.add('bg-green-400')

            }
            else {
                props.question.answer_selected = {
                    correct: false,
                    answer: answer_selected
                }

                event.target.classList.add('bg-red-400')
            }

            props.onAnswerSelected(props.question_id, props.question)

        }

    }

    function unescape(s) {
        return s.replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&#39;/g, "'")
                .replace(/&quot;/g, '"');
      }

    return (
        <div className={`${props.question.show ? 'animate__animated animate__fadeIn' : 'hidden'}`}>

            <p className={`pt-4 mb-2 text-xl text-left`}>{unescape(props.question.question)}</p>

            {props.question.answers.map((answer, index) => (
                <div className="p-2 ">
                    <div key={index} data-question={props.question_id} data-answer={answer} onClick={checkAnswer} className={`flex items-center p-4  rounded-lg shadow-xs cursor-pointer hover:bg-indigo-500 hover:text-gray-100 ${answer == props.question.correct_answer ? 'bg-green-400' : 'bg-indigo-200'} `}>
                        <div>
                            <p className=" text-xs font-medium ml-2 text-center">
                                {unescape(answer)}
                            </p>
                        </div>
                    </div>
                </div>

            ))}


        </div>
    )

}

export default TriviaQuestion

