const Supports = ({ status, used, insured, onPreview, onInsure, onHint }) => (
  <div className="row">
    <button disabled={used.preview || status !== 'betting'} onClick={onPreview}>Xem trước</button>
    <button
      disabled={used.insure || (status !== 'betting' && status !== 'answering')}
      onClick={onInsure}
    >
      {insured ? 'Đã bảo hiểm' : used.insure ? 'Bảo hiểm (đã dùng)' : 'Bảo hiểm'}
    </button>
    <button disabled={used.hint || status !== 'answering'} onClick={onHint}>Gợi ý</button>
  </div>
);

export default Supports;