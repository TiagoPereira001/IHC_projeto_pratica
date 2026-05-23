import "./SmartphoneFrame.css";

function SmartphoneFrame({ children }) {
  return (
    <div className="phone-wrapper">
      <div className="phone">
        <div className="notch"></div>
        <div className="screen">{children}</div>
      </div>
    </div>
  );
}

export default SmartphoneFrame;