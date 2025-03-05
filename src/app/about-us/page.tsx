import React from "react";

/* eslint-disable @typescript-eslint/naming-convention */
const AboutUsPage = () => {
  return (
    <div style={{ padding: "2rem", max_width: "800px", margin: "auto" }}>
      <h1>About Us</h1>
      <p>Welcome to Match4Good! We are dedicated to connecting people with meaningful volunteering opportunities.</p>

      <h2>Our Mission</h2>
      <p>Our goal is to create a platform that empowers individuals and organizations to collaborate and make a positive impact in their communities.</p>

      <h2>What We Do</h2>
      <ul>
        <li>Connect volunteers with organizations</li>
        <li>Provide an easy-to-use platform for managing volunteer work</li>
        <li>Encourage social responsibility and community engagement</li>
      </ul>

      <h2>Our Team</h2>
      <p>We are a passionate group of developers, designers, and social impact advocates committed to making a difference.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions, feel free to reach out at <a href="mailto:support@match4good.com">support@match4good.com</a>.</p>
    </div>
  );
};
/* eslint-enable @typescript-eslint/naming-convention */

export default AboutUsPage;
