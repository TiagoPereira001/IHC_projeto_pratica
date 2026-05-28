import "./SmartphoneFrame.css";
import { Iphone15Pro } from "./ui/iphone-15-pro";

function SmartphoneFrame({ children }) {
  return (
    <div className="phone-wrapper">
      <div style={{ width: 320 }}>
        <Iphone15Pro>
          {children}
        </Iphone15Pro>
      </div>
    </div>
  );
}

export default SmartphoneFrame;