import styles from "./TitlePage.module.css";

interface TitlePageProps {
  title: string;
}
const TitlePage = ({ title }: TitlePageProps) => {
  return (
    <>
      {/* ── TitlePage ── */}
      <section className={`${styles.TitlePage} py-5`}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold text-white mb-0">{title}</h1>
          <div className={`${styles.separator} mx-auto mt-3`}></div>
        </div>
      </section>
    </>
  );
};

export default TitlePage;
