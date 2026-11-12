import { LETTERS } from '../data';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ head, question, options, status, selected, answer, onPick }) => (
  <div className="card">
    <p>{head}</p>
    <h3>{question}</h3>
    <div className="grid">
      {options.map((opt, i) => {
        let state = '';
        if (status === 'revealed') {
          if (i === answer) state = 'correct';
          else if (i === selected) state = 'wrong';
        }
        return (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={opt}
            state={state}
            disabled={status !== 'answering'}
            onClick={() => onPick(i)}
          />
        );
      })}
    </div>
  </div>
);

export default QuestionCard;