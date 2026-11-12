const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button className={`ans ${state}`} disabled={disabled} onClick={onClick}>
    {letter}. {text}
  </button>
);

export default AnswerButton;