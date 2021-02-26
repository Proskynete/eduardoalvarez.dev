import {
	ErrorResponseInterface,
	MemberInterface,
	StatusCodeErrorAllowed,
	StatusCodeSuccessAllowed,
	SuccessResponseInterface,
} from 'models/subscribe.model';
import { NextApiRequest, NextApiResponse } from 'next';
const client = require('@mailchimp/mailchimp_marketing');

const TAGS = {
	SEND_POST_MAIL: 'SendPostMail',
	FROM_WEB_PAGE: 'FromWebPage',
};

client.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_API_KEY.split('-')[1],
});

const StatusCodeMap = new Map<
	StatusCodeErrorAllowed | StatusCodeSuccessAllowed,
	string
>([
	[419, 'Los campos son requeridos.'],
	[420, 'El correo ya fue registrado.'],
	[500, 'Error de comunicación, intenete nuevamente más tarde.'],
	[200, 'Registro realizado con exito! ❤'],
]);

export default async (
	req: NextApiRequest,
	res: NextApiResponse<SuccessResponseInterface | ErrorResponseInterface>,
) => {
	const { email, name } = req.body;

	if (!email || !name) {
		return res.status(419).json({
			code: 419,
			error: StatusCodeMap.get(419),
		});
	}

	try {
		const usersList = await client.lists.getListMembersInfo('62e64a93a5');

		if (usersList.members && usersList.members !== []) {
			if (
				usersList.members.some(
					(member: MemberInterface) => member.email_address === email,
				)
			) {
				return res.status(420).json({
					code: 420,
					error: StatusCodeMap.get(420),
				});
			} else {
				await client.lists.addListMember('62e64a93a5', {
					email_address: email,
					status: 'subscribed',
					tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
					merge_fields: {
						FNAME: name,
					},
				});

				return res
					.status(200)
					.json({ code: 200, message: StatusCodeMap.get(200) });
			}
		} else {
			await client.lists.addListMember('62e64a93a5', {
				email_address: email,
				status: 'subscribed',
				tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
				merge_fields: {
					FNAME: name,
				},
			});

			return res
				.status(200)
				.json({ code: 200, message: StatusCodeMap.get(200) });
		}
	} catch (error) {
		return res.status(500).json({
			code: 500,
			error: error.message || error.toString(),
			message: StatusCodeMap.get(500),
		});
	}
};
