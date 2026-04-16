import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

/**
 * Shared email sender helper (optional but cleaner)
 */
async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  return resend.emails.send({
    from: 'Clinic <no-reply@yourapp.com>',
    to,
    subject,
    html,
  });
}

/**
 * Rejection Email
 */
export async function sendRejectionEmail({
  email,
  first_name,
  pet_name,
  rejection_reason,
}: {
  email: string;
  first_name: string;
  pet_name: string;
  rejection_reason: string;
}) {
  return sendEmail({
    to: email,
    subject: 'Pet Examination Result',
    html: `
      <p>Hi ${first_name},</p>
      <p>Your pet <b>${pet_name}</b> was not accepted.</p>
      <p><b>Reason:</b> ${rejection_reason}</p>
    `,
  });
}

/**
 * Pre-operation Email
 */
export async function sendPreOpEmail({
  email,
  first_name,
  pet_name,
  schedule_date,
}: {
  email: string;
  first_name: string;
  pet_name: string;
  schedule_date: string;
}) {
  return sendEmail({
    to: email,
    subject: 'Pre-Operation Instructions',
    html: `
      <p>Hi ${first_name},</p>
      <p>Your can go with your pet <b>${pet_name}</b> to the scheduled event on <b>${schedule_date}</b>.</p>
      <p>Please follow fasting and preparation instructions provided by the clinic.</p>
    `,
  });
}

/**
 * Post-operation Email
 */
export async function sendPostOpEmail({
  email,
  first_name,
  pet,
  procedure_type,
  medications_given,
  post_op_message,
  chatbot_token,
}: {
  email: string;
  first_name: string;
  pet: { pet_name: string };
  procedure_type: string;
  medications_given: string[];
  post_op_message: string;
  chatbot_token: string;
}) {
  return sendEmail({
    to: email,
    subject: 'Post-Operation Care Instructions',
    html: `
      <p>Hi ${first_name},</p>

      <p>Your pet <b>${pet.pet_name}</b> has successfully undergone <b>${procedure_type}</b>.</p>

      <p><b>Medications:</b> ${
        medications_given?.length ? medications_given.join(', ') : 'None'
      }</p>

      <p>${post_op_message}</p>

      <p>
        You can chat with our clinic assistant using your token: 
        <b>${chatbot_token}</b>
      </p>
    `,
  });
}

/**
 * Receipt / Billing Email
 */
export async function sendReceiptEmail({
  email,
  first_name,
  event_name,
  pet_names,
  service_items,
  total_amount,
  payment_method,
  receipt_sent_at,
}: {
  email: string;
  first_name: string;
  event_name: string;
  pet_names: string[];
  service_items: { label: string; amount: number }[];
  total_amount: number;
  payment_method: string;
  receipt_sent_at: string;
}) {
  return sendEmail({
    to: email,
    subject: `Receipt - ${event_name}`,
    html: `
      <p>Hi ${first_name},</p>

      <p><b>Event:</b> ${event_name}</p>
      <p><b>Pets:</b> ${pet_names.join(', ')}</p>

      <p><b>Services:</b></p>
      <ul>
        ${service_items
          .map((i) => `<li>${i.label}: ₱${i.amount}</li>`)
          .join('')}
      </ul>

      <p><b>Total:</b> ₱${total_amount}</p>
      <p><b>Payment Method:</b> ${payment_method}</p>
      <p><b>Receipt Sent:</b> ${receipt_sent_at}</p>
    `,
  });
}