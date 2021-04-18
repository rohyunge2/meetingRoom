export default function Header(props) {
  
  const propsOpenCreationPopup = () => {
    props.openCreationPopup();
  }

  return (
    <div className="header">
        <span className="header-name">BNS 회의실 캘린더</span>
        <img src="images/btn_reserv@3x.png" className="btn-reserv" onClick={propsOpenCreationPopup}  />
    </div>
  );
}
