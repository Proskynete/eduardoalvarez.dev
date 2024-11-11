import client from "@mailchimp/mailchimp_marketing";
import type { APIRoute } from "astro";

const TAGS = {
  SEND_POST_MAIL: "SendPostMail",
  FROM_WEB_PAGE: "FromWebPage",
};

client.setConfig({
  apiKey: import.meta.env.MAILCHIMP_API_KEY,
  server: import.meta.env.MAILCHIMP_API_KEY.split("-")[1],
});

const StatusCodeMap = new Map<number, string>([
  [419, "Los campos son requeridos. 😅"],
  [420, "Este correo ya está registrado. 🙄"],
  [500, "Error de comunicación, intenta nuevamente más tarde. 😢"],
  [200, "Registro realizado con éxito! 🎉"],
]);

const res = (status: number) =>
  new Response(JSON.stringify({ message: StatusCodeMap.get(status), status }), { status });

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { email, name } = body;

  if (!email || !name) return res(419);

  try {
    const usersList = await client.lists.getListMembersInfo(import.meta.env.MAILCHIMP_LIST_ID);

    if (usersList.members && usersList.members.length > 0) {
      if (usersList.members.some((member) => member.email_address === email)) {
        return res(420);
      } else {
        await client.lists.addListMember(import.meta.env.MAILCHIMP_LIST_ID, {
          email_address: email,
          status: "subscribed",
          tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
          merge_fields: {
            FNAME: name,
          },
        });

        return res(200);
      }
    } else {
      await client.lists.addListMember(import.meta.env.MAILCHIMP_LIST_ID, {
        email_address: email,
        status: "subscribed",
        tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
        merge_fields: {
          FNAME: name,
        },
      });

      return res(200);
    }
  } catch (error) {
    return res(500);
  }
};
