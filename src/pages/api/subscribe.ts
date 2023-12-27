import type { APIRoute } from "astro";
import client from "@mailchimp/mailchimp_marketing";

const TAGS = {
  SEND_POST_MAIL: "SendPostMail",
  FROM_WEB_PAGE: "FromWebPage",
};

client.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_KEY.split("-")[1],
});

export type StatusCodeErrorAllowed = 419 | 420 | 500;
export type StatusCodeSuccessAllowed = 200 | 201;

const StatusCodeMap = new Map<
  StatusCodeErrorAllowed | StatusCodeSuccessAllowed,
  string
>([
  [419, "Los campos son requeridos."],
  [420, "El correo ya está registrado."],
  [500, "Error de comunicación, intente nuevamente más tarde."],
  [200, "Registro realizado con exito! ❤"],
]);

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  console.log("POST: ", { data });

  const name = data.get("name");
  const email = data.get("email");

  if (!email || !name) {
    return new Response(
      JSON.stringify({
        status: 419,
        message: StatusCodeMap.get(419),
      }),
      { status: 419 }
    );
  }

  try {
    const usersList = await client.lists.getListMembersInfo("62e64a93a5");
    if (usersList.members && usersList.members.length > 0) {
      if (usersList.members.some((member) => member.email_address === email)) {
        return new Response(
          JSON.stringify({
            status: 420,
            message: StatusCodeMap.get(420),
          }),
          { status: 420 }
        );
      } else {
        await client.lists.addListMember("62e64a93a5", {
          email_address: email,
          status: "subscribed",
          tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
          merge_fields: {
            FNAME: name,
          },
        });

        return new Response(
          JSON.stringify({
            status: 200,
            message: StatusCodeMap.get(200),
          }),
          { status: 200 }
        );
      }
    } else {
      await client.lists.addListMember("62e64a93a5", {
        email_address: email,
        status: "subscribed",
        tags: [TAGS.SEND_POST_MAIL, TAGS.FROM_WEB_PAGE],
        merge_fields: {
          FNAME: name,
        },
      });

      return new Response(
        JSON.stringify({
          status: 200,
          message: StatusCodeMap.get(200),
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: 500,
        message: StatusCodeMap.get(500),
      }),
      { status: 500 }
    );
  }
};
