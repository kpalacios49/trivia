import React from 'react'

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

    return (
        <div className={`${props.question.show ? '' : 'hidden'}`}>

            <p className={`pt-4 mb-2 text-xl text-left`}>{props.question.question}</p>
            {/* <li style={{ color: 'red' }}>{props.question.correct_answer}</li> */}

            {props.question.answers.map((answer, index) => (
                <div className="p-2 ">
                    <div key={index} data-question={props.question_id} data-answer={answer} onClick={checkAnswer} className={`flex items-center p-4  rounded-lg shadow-xs cursor-pointer hover:bg-indigo-500 hover:text-gray-100 ${answer == props.question.correct_answer ? 'bg-green-400' : 'bg-indigo-200'} `}>

                        {/* <svg class="h-6 fill-current hover:text-gray-100" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>CSS3 icon</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" /></svg> */}
                        <div>
                            <p className=" text-xs font-medium ml-2 text-center">
                                {answer}
                            </p>
                        </div>
                    </div>
                </div>

            ))}


        </div>
    )

}

export default TriviaQuestion

