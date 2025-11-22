"use server";

import config from "@/config/env";
import applicationTemplate from "@/templates/application";
import transporter from "./transporter";

// URL to the CV
// const cvUrl =
//   config.env === "production"
//     ? `${config.urls.productionAppUrl}/AMR_KHALED_CV_2.pdf`
//     : `${config.urls.localAppUrl}/AMR_KHALED_CV_2.pdf`;

const cvUrl = `${config.urls.productionAppUrl}/resume.pdf`;

export async function sendEmail(formData: FormData) {
  try {
    // Extract form data
    const data = {
      applicantName: formData.get("applicantName") as string,
      currentTitle: formData.get("currentTitle") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      roleTitle: formData.get("roleTitle") as string,
      companyName: formData.get("companyName") as string,
      companyEmail: formData.get("companyEmail") as string,
      hrName: formData.get("hrName") as string,
      hrTitle: formData.get("hrTitle") as string,
      yearsExperience: formData.get("yearsExperience") as string,
      field: formData.get("field") as string,
      mainParagraph: formData.get("mainParagraph") as string,
      companyAttraction: formData.get("companyAttraction") as string,
      companyAchievement: formData.get("companyAchievement") as string,
      previousRole: formData.get("previousRole") as string,
      previousCompany: formData.get("previousCompany") as string,
      achievement1: formData.get("achievement1") as string,
      achievement2: formData.get("achievement2") as string,
    };

    const cvFile = formData.get("cvFile") as File;
    
    let fileBuffer: Buffer;
    let filename: string;


      // Use uploaded file
      const arrayBuffer = await cvFile.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      filename = cvFile.name;
    
    const mailOptions = {
      from: data.email,
      to: data.companyEmail || "amrkh.business@gmail.com",
      subject: `Cover Letter for ${data.roleTitle}`,
      attachments: [
        {
          filename: filename,
          content: fileBuffer,
          contentType: "application/pdf",
        },
      ],
      html: applicationTemplate({
        APPLICANT_NAME: data.applicantName,
        CURRENT_TITLE: data.currentTitle,
        EMAIL: data.email,
        PHONE: data.phone,
        LOCATION: data.location,
        HR_NAME: data.hrName,
        HR_TITLE: data.hrTitle,
        COMPANY_NAME: data.companyName,
        ROLE_TITLE: data.roleTitle,
        YEARS_EXPERIENCE: data.yearsExperience,
        FIELD: data.field,
        MAIN_PARAGRAPH: data.mainParagraph,
        COMPANY_ATTRACTION: data.companyAttraction,
        COMPANY_ACHIEVEMENT: data.companyAchievement,
        PREVIOUS_ROLE: data.previousRole,
        PREVIOUS_COMPANY: data.previousCompany,
        ACHIEVEMENT_1: data.achievement1,
        ACHIEVEMENT_2: data.achievement2,
        LINKEDIN_URL: config.links.linkedinUrl as string,
        GITHUB_URL: config.links.githubUrl as string,
        WEBSITE_URL: config.links.portfolioUrl as string,
        CV_URL: cvUrl,
        PORTFOLIO_URL: config.links.portfolioUrl as string,
      }),
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Email sent successfully!",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again.",
      error: JSON.stringify(error),
    };
  }
}
