import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

type OrderConfirmationProps = {
  orderId: string;
  orderDateTime: string;
  totals: {
    subtotal: string;
    serviceFee: string;
    total: string;
  };
  items: { name: string; quantity: number; price: string }[];
  links: {
    order: string;
  };
};

export const sendOrderConfirmationMail =
  makeSendTemplateEmail<OrderConfirmationProps>(
    "d-b3de55fc91944d3e87ca61e7616b01e8",
    "admin@turbocart.co.za",
    "Order Confirmation"
  );

function makeSendTemplateEmail<T>(
  templateId: string,
  from: string,
  subject: string
) {
  return async function sendTemplateMail(to: string, dynamicTemplateData: T) {
    try {
      await sgMail.send({
        to: to,
        from: {
          email: from,
          name: "Turbocart",
        },
        subject: subject,
        templateId: templateId,
        dynamicTemplateData: dynamicTemplateData as any,
      });
    } catch (err) {
      console.log("An error occured while sending an email", err);
    }
  };
}
