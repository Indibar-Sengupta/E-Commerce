// 15. For verify the otp for forgott password email that's why it is a template
const forgotpasswordemailtemplate= ({name,otp})=>
  {
    return`
      <p> Dear ${name}</p>
      <p> Please use the following otp to reset your password </p>
      <div>
      ${otp}
      </div>
      <p>This otp is valid for only 1 hour</p
    `
  }
  
  export default forgotpasswordemailtemplate