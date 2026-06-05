import { useState } from "react";

// 1. تحديد هيكل البيانات لتجنب تكرار كود HTML
interface TermSection {
  title: string;
  points: string[];
}

const TermsConditions = () => {
  // تفعيل خاصية "اقرأ المزيد" لإخفاء وإظهار الأقسام
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 2. مصفوفة البيانات التي تحتوي على النصوص
  const termsData: TermSection[] = [
    {
      title: "Overview:",
      points: [
        "This website is operated by SereneMeds. Throughout the site, the terms we, us and our refer to SereneMeds. SereneMeds offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.",
        "By visiting our site and/ or purchasing something from us, you engage in our service and agree to be bound by the following terms and conditions, including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content.",
        "Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.",
        "You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.",
      ],
    },
    {
      title: "SECTION 1 - ONLINE STORE TERMS:",
      points: [
        "By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.",
        "You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).",
        "You must not transmit any worms or viruses or any code of a destructive nature.",
        "A breach or violation of any of the Terms will result in an immediate termination of your Services.",
      ],
    },
    {
      title: "SECTION 2 - GENERAL CONDITIONS",
      points: [
        "We reserve the right to refuse service to anyone for any reason at any time.",
        "You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.",
        "You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.",
        "The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.",
      ],
    },
    {
      title: "SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION",
      points: [
        "We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.",
        "This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.",
      ],
    },
  ];

  // إذا كانت الحالة false، اعرض أول قسمين فقط. وإذا كانت true اعرض الكل.
  const visibleSections = isExpanded ? termsData : termsData.slice(0, 2);

  return (
    <section className="terms-conditions py-4 mt-4">
      <div className="container">
        <div className="row">
          {/* عمل Loop لعرض الأقسام بناءً على المصفوفة أعلاه */}
          {visibleSections.map((section, index) => (
            <div className="col-12" key={index}>
              <h6>{section.title}</h6>
              <ul>
                {section.points.map((point, pointIndex) => (
                  <li key={pointIndex}>{point}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* زر التحكم في القراءة والمحاذاة */}
          <div className="col-12 d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary px-5 py-2 fw-bold rounded-pill"
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "Read More"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsConditions;
