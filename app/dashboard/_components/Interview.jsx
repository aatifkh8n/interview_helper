import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';

const InterviewComponent = () => {
    const [responses, setResponses] = useState([]);

    async function handleTranscribedQuestion(questionText) {
        // Add the question to the responses
        setResponses(prev => [...prev, { type: 'question', text: questionText }]);
        try {
            // Make the API request
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${Math.ceil(Math.random() * 200)}`, {
              method: 'GET'/* ,
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ question: questionText }) */
            });
            
            const data = await response.json();
            
            // Append the answer to the responses
            setResponses(prev => [...prev, { type: 'answer', text: data.title }]);
            
        } catch (error) {
            console.error('Error fetching the answer:', error);
        }
    }

  return (
    <div>
      <div id="responses-container">
        {responses.map((item, index) => (
          <p key={index}>
            {item.type === 'question' ? 'Question: ' : 'Answer: '}
            {item.text}
          </p>
        ))}
      </div>
      {/* Imagine this button triggers a transcription event */}
      <Button onClick={() => handleTranscribedQuestion("What is your experience with project management?")}>
        Simulate New Question
      </Button>
    </div>
  );
}

export default InterviewComponent;