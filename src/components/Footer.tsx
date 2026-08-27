import footerImage from "../assets/footer-img.png";
import { BrandMark } from "./BrandMark";
import { SocialLinks } from "./SocialLinks";

const legalLinks = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of use", href: "/terms-of-use" },
  { label: "Cookies", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="footer-top">
        <div className="footer-block footer-block--brand">
          <BrandMark dark />
        </div>
        <div className="footer-block footer-block--links">
          <SocialLinks footer />
          <div className="footer-bottom">
            <div>
              {legalLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-block footer-block--image">
          <img className="footer-img" src={footerImage} alt="Як продати майже все" />
        </div>
      </div>
    </footer>
  );
}
