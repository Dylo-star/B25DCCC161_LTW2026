const Timer = ({ timeLeft }) => (
  <p className={timeLeft <= 5 ? 'timer low' : 'timer'}>Còn {Math.max(timeLeft, 0)} giây</p>
);

export default Timer;