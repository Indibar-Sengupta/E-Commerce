// 6. For verify the email that's why it is a template
const verifyemailtemplate= ({name,url})=>
{
  return`
    <p> Dear ${name}</p>
    <p> Thank You for registering to Mudikhana </p>
    <a href=${url} style="color:black;background : #071263;margin-top : 10px,padding:20px ">
      verify Email
    </a>
  `
}

export default verifyemailtemplate