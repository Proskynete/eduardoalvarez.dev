import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
  IconDefinition,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CONSTANTS, event } from "lib/gtag";
import { memo } from "react";

interface ShareSectionProps {
  slug: string;
}

interface ShareLink {
  icon: IconDefinition;
  url: string;
}

const baseLink = "https://eduardoalvarez.dev/articulos";
const shareLinks: ShareLink[] = [
  {
    icon: faFacebookF,
    url: `https://www.facebook.com/sharer/sharer.php?u=${baseLink}/`,
  },
  {
    icon: faTwitter,
    url: `https://twitter.com/intent/tweet?url=${baseLink}/`,
  },
  {
    icon: faLinkedinIn,
    url: `https://www.linkedin.com/shareArticle?mini=true&url=${baseLink}/`,
  },
];

const ShareSection = memo(({ slug }: ShareSectionProps) => {
  const handleClick = (shareLink: ShareLink) => {
    window.open(shareLink.url + slug, "_blank");

    event({
      action: "click_shared_button",
      category: CONSTANTS.BUTTON_ACTION.CATEGORY,
      label: "Shared button",
      value: `Se compartió el artículo ${slug} por ${shareLink}`,
    });
  };

  return (
    <div className="share_section">
      <div className="share_section__inner">
        <div className="share_section__inner__title">
          Compartir artículo en:
        </div>

        <div className="share_section__inner__icons">
          {shareLinks.map((shareLink) => (
            <button
              key={shareLink.icon.iconName}
              className="share_section__inner__icons__icon"
              onClick={() => handleClick(shareLink)}
            >
              <FontAwesomeIcon icon={shareLink.icon} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

export { ShareSection };
