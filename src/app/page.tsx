import ParticlePortrait from "@/components/ParticlePortrait";
import Cursor from "@/components/Cursor";
import Navigation from "@/components/Navigation";
import Motion from "@/components/Motion";
import ContactForm from "@/components/ContactForm";
import { projects, skills } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Motion />
      <Cursor />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Navigation />
      <main>
        <section className="hero" id="home" aria-labelledby="hero-name">
          <ParticlePortrait />
          <div className="hero-copy hero-name">
            <p className="eyebrow">A WORK IN CURIOSITY</p>
            <h1 id="hero-name">Sai Madhav</h1>
          </div>
          <div className="hero-copy hero-role">
            <p>
              Computer Science student.
              <br />
              <span>Fascinated by data & numbers.</span>
            </p>
          </div>
          <div className="hero-bottom">
            <p>LEARNING. EXPLORING. BUILDING.</p>
            <a href="#about">
              SCROLL TO EXPLORE <span>↓</span>
            </a>
            <p className="hero-location">
              KERALA, INDIA <span>↗</span>
            </p>
          </div>
          <span className="hero-coordinate" aria-hidden="true">
            DATA / NUMBERS / POSSIBILITIES
          </span>
        </section>
        <section
          className="about section"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="section-label">
            <span>01 / ABOUT</span>
            <span>THE PERSON BEHIND THE PROJECTS</span>
          </div>
          <h2 id="about-title" className="statement" data-reveal>
            I find meaning in numbers.
            <br />
            <span>
              And possibility in what
              <br className="desktop-break" /> I can build with them.
            </span>
          </h2>
          <div className="about-bottom" data-reveal>
            <p className="small-note">
              A CURIOUS MIND.
              <br />
              AN OPEN NOTEBOOK.
            </p>
            <div>
              <p>
                I’m Sai, a B.Tech Computer Science student specializing in Data
                Science at Mar Athanasius College of Engineering, Kothamangalam.
              </p>
              <p>
                I’m fascinated by the patterns hiding in data and the ideas that
                become useful software. From exploring a dataset to building a
                game with friends in mind, I learn best by making things.
              </p>
              <a className="text-link" href="#projects">
                A few things I’ve made <span>↘</span>
              </a>
            </div>
          </div>
          <div className="education-line">
            <span>MAR ATHANASIUS COLLEGE OF ENGINEERING</span>
            <span>B.TECH · CS & DATA SCIENCE</span>
            <span>CLASS OF 2029</span>
          </div>
        </section>
        <section
          className="projects section"
          id="projects"
          aria-labelledby="projects-title"
        >
          <div className="section-label">
            <span>02 / SELECTED WORK</span>
            <span>IDEAS, TURNED INTO SOMETHING REAL</span>
          </div>
          <div className="section-heading">
            <h2 id="projects-title" data-reveal>
              Built out of
              <br />
              <em>curiosity.</em>
            </h2>
            <p>
              Two projects. Different worlds.
              <br />
              The same urge to figure things out.
            </p>
          </div>
          {projects.map((project) => (
            <article className="project" key={project.id}>
              <a
                className={`project-visual ${project.type}`}
                href={project.link}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.action}: ${project.title}`}
              >
                <div className="visual-top">
                  <span>{project.year}</span>
                  <span>EXPLORE PROJECT ↗</span>
                </div>
                {project.type === "pookalam" ? (
                  <div className="flower-scene">
                    <div className="flower" aria-hidden="true">
                      {Array.from({ length: 12 }, (_, i) => (
                        <i
                          key={i}
                          style={{ "--i": i } as React.CSSProperties}
                        />
                      ))}
                      <b />
                      <b />
                    </div>
                    <span className="flower-title">
                      pookalam<span>.io</span>
                    </span>
                    <p>A LITTLE TRADITION. A LITTLE COMPETITION.</p>
                  </div>
                ) : (
                  <div className="coc-scene">
                    <div className="coc-caption">
                      <span>
                        YOUR VILLAGES.
                        <br />
                        YOUR UPGRADES.
                      </span>
                      <strong>
                        One quiet
                        <br />
                        dashboard.
                      </strong>
                      <small>COCTracker / ANDROID</small>
                    </div>
                    <div className="phone">
                      <div className="phone-speaker" />
                      <img
                        src="/images/coc-dashboard.png"
                        alt="COCTracker village dashboard showing progress and upgrades"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
                <div className="visual-bottom">
                  <span>{project.id} / 02</span>
                  <span className="circle-arrow">↗</span>
                </div>
              </a>
              <div className="project-details" data-reveal>
                <div>
                  <p className="eyebrow">{project.category}</p>
                  <h3>{project.title}</h3>
                  <div className="tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p>{project.description}</p>
                  <div className="project-links">
                    <a
                      className="text-link"
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {project.action} ↗
                    </a>
                    <a
                      className="text-link muted"
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View source ↗
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
          <p className="more-work">
            STILL LEARNING. STILL BUILDING. MORE TO COME. <span>↗</span>
          </p>
        </section>
        <section
          className="skills section"
          id="skills"
          aria-labelledby="skills-title"
        >
          <div className="section-label">
            <span>03 / MY TOOLKIT</span>
            <span>ALWAYS A STUDENT</span>
          </div>
          <div className="skills-layout">
            <h2 id="skills-title" data-reveal>
              Things I<br />
              work with<span className="dot">.</span>
            </h2>
            <div className="skill-rows">
              {skills.map(([id, title, items]) => (
                <div className="skill-row" key={id} data-reveal>
                  <span>{id}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{items}</p>
                  </div>
                  <span>↗</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="resume section"
          id="resume"
          aria-labelledby="resume-title"
        >
          <div className="section-label">
            <span>04 / RÉSUMÉ</span>
            <span>THE STORY SO FAR</span>
          </div>
          <div className="resume-content" data-reveal>
            <div>
              <p className="eyebrow">SAI_MADHAV / RÉSUMÉ.PDF</p>
              <h2 id="resume-title">
                The story
                <br />
                <em>so far.</em>
              </h2>
              <p>
                My education, skills, and selected projects.
                <br />
                One page. Room to grow.
              </p>
              <div className="resume-facts">
                <span>01 PAGE</span>
                <span>02 PROJECTS</span>
                <span>CLASS OF ’29</span>
              </div>
            </div>
            <div className="resume-document">
              <a
                className="resume-sheet"
                href="/Sai-Madhav-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                aria-label="Preview Sai Madhav’s résumé"
              >
                <div className="sheet-top">
                  <span>SM / 01</span>
                  <span>↗</span>
                </div>
                <img
                  src="/images/resume-preview.png"
                  alt="One-page résumé preview: education, technical skills, and selected projects"
                  loading="lazy"
                />
                <span className="sheet-bottom">
                  OPEN DOCUMENT <span>↗</span>
                </span>
              </a>
              <div className="resume-actions">
                <a
                  className="big-link"
                  href="/Sai-Madhav-Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  View résumé <span>↗</span>
                </a>
                <a className="text-link" href="/Sai-Madhav-Resume.pdf" download>
                  Download PDF <span>↓</span>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section
          className="contact section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-label">
            <span>05 / CONTACT</span>
            <span>GOOD THINGS START WITH A CONVERSATION</span>
          </div>
          <div className="contact-heading" data-reveal>
            <p>Have an idea, a question, or a shared curiosity?</p>
            <h2 id="contact-title">
              Connect
              <br />
              <em>with me.</em>
              <span>↗</span>
            </h2>
          </div>
          <div className="contact-layout">
            <div className="socials">
              <a
                href="https://www.linkedin.com/in/saimadhav1"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <span>↗</span>
              </a>
              <a
                href="https://github.com/saimadhav10"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span>↗</span>
              </a>
              <p>
                Open to conversations,
                <br />
                collaborations, and new perspectives.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#home">
          sm<span>•</span>
        </a>
        <p>SAI MADHAV © {new Date().getFullYear()}</p>
        <p>MADE WITH CURIOSITY</p>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>
    </>
  );
}
