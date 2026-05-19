import FaqPreview from "../components/dashboard/FaqPreview.jsx";

export default function FAQPage({ faqEntries = [] }) {
  return (
    <section className="faq-page" aria-labelledby="faq-page-heading">
      <p className="eyebrow">Student support</p>
      <h1 id="faq-page-heading">Debugging FAQ</h1>
      <p>Common debugging questions and answers for Techtonica students.</p>
      <FaqPreview faqEntries={faqEntries} />
    </section>
  );
}
