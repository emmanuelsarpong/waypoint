import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";

function SocialMediaBar() {
  return (
    <div
      className="w-full border-t"
      style={{
        backgroundColor: "black",
        borderTop: "1px solid #3F3F3F",
        height: "70px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="flex ">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-[5px] text-[#3F3F3F] hover:text-white transition-colors"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-[5px] text-[#3F3F3F] hover:text-white transition-colors"
        >
          <FaFacebook size={20} />
        </a>
        <a
          href="https://www.x.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-[5px] text-[#3F3F3F] hover:text-white transition-colors"
        >
          <FaXTwitter size={20} />
        </a>
      </div>
    </div>
  );
}

export default SocialMediaBar;
