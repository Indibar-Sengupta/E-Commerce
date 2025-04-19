// 6. Connect resend API 
import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

// 6. checking whether RESEND_API available or not
if(!process.env.RESEND_API){
  // 6. It is a function which is created to show the error
  throw new error(
    "Please provide RESEND_API in the .env file"
  ),
  console.log(
    "Please provide RESEND_API in the .env file"
  )
}

// pass the Api key here  
const resend = new Resend(process.env.RESEND_API);

// 6. Now put the body inside try-catch
const sendEmail= async({sendTo, subject, html})=>{
try{
  const { data, error } = await resend.emails.send({
    from: 'Mudikhana <onboarding@resend.dev>',
    to: sendTo,
    subject: subject,
    html: html,
  });

  if (error) {
    return console.error({ error });
  }
  return data
}
  catch (error) {
    return console.log(error)
  }
}

export  default sendEmail