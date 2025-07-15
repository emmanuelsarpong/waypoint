import { FaInstagram, FaFacebook, FaXTwitter } from "react-icons/fa6";

function SocialMediaBar() {
  return (
    <div className="flex justify-center">
      <a
        href="https://www.instagram.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-[8px] text-gray-500 hover:text-white transition-colors"
      >
        <FaInstagram size={20} />
      </a>
      <a
        href="https://www.facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-[8px] text-gray-500 hover:text-white transition-colors"
      >
        <FaFacebook size={20} />
      </a>
      <a
        href="https://www.x.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-[8px] text-gray-500 hover:text-white transition-colors"
      >
        <FaXTwitter size={20} />
      </a>
    </div>
  );
}

export default SocialMediaBar;
