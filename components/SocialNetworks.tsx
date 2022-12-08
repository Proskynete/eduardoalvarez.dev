import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from "data/config.json";
import {
  SocialNetworkInterface,
  socialNetworkMap,
} from "models/social-network.model";
import { memo } from "react";

const SocialNetworks = () => {
  return (
    <div className="social-netwoks">
      <h1 className="social-netwoks-title">Síguenos en redes sociales</h1>
      <div className="social-netwoks-container">
        {config.social_network.map((sn: SocialNetworkInterface) =>
          sn.show ? (
            <span key={sn.name} className="social-netwoks-icon">
              <a
                href={sn.link}
                title={sn.name}
                className="social-netwoks-link"
                target="_blank"
                rel="noreferrer noopener"
              >
                <FontAwesomeIcon icon={socialNetworkMap.get(sn.name)} />
              </a>
            </span>
          ) : null
        )}
      </div>
    </div>
  );
};
export default memo(SocialNetworks);
