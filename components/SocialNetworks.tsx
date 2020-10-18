import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import config from 'data/config.json';
import {
	SocialNetworkInterface,
	socialNetworkMap,
} from 'models/social-network.model';

const SocialNetworks = () => {
	return (
		<div className='social-netwoks'>
			<h1 className='social-netwoks-title'>Síguenos en redes sociales</h1>
			<div className='social-netwoks-container'>
				{config.social_network.map((sn: SocialNetworkInterface) => (
					<span key={sn.name} className='social-netwoks-icon'>
						<a
							href={sn.link}
							title={sn.name}
							className='social-netwoks-link'
							target='_blank'
							rel='noreferrer noopener'
						>
							<FontAwesomeIcon icon={socialNetworkMap.get(sn.name)} />
						</a>
					</span>
				))}
			</div>
		</div>
	);
};

export default SocialNetworks;
