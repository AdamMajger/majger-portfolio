// Profile + Contact views

function Profile({ accent }) {
  return (
    <main className="profile" data-screen-label="Profile">
      <div className="profile__head">
        <div className="profile__mono">[ About ]</div>
        <h1 className="profile__name">
          Adam Majger<br />
          Designer<br />
          Art Director<br />
          Cultural Worker<br />
          Bratislava
          <span className="profile__name-soft" style={{ fontFamily: "\"Hanken Grotesk\"" }}>


          </span>
        </h1>
      </div>

      <div className="profile__body">
        <section className="profile__cv">
          <h2 className="profile__h2">CV</h2>
          <ol className="cv">
            {CV.map((entry, i) => <li key={i} className="cv__row">
                <span className="cv__period">{entry.period}</span>
                <div className="cv__content">
                  <span className="cv__role">{entry.role}</span>
                  <span className="cv__place">{entry.place}</span>
                </div>
              </li>)}
          </ol>
        </section>

        <section className="profile__awards">
          <h2 className="profile__h2">Selected awards</h2>
          <ol className="awards">
            {AWARDS.map((a, i) => <li key={i} className="awards__row">
                <div className="awards__content">
                  <span className="awards__title">{a.title}</span>
                  <span className="awards__year">{a.year}</span>
                </div>
                <div className="awards__content">
                  <span className="awards__cat">{a.category}</span>
                  <span className="awards__project">{a.project}</span>
                </div>
              </li>
            )}
          </ol>
        </section>

        <section className="profile__contact-cta">
          <h2 className="profile__h2">Get in touch</h2>
          <a className="big-link" href="mailto:hi@majger.sk">adam.majger@gmail.com →</a>
          <div className="profile__contact-sub">FOR COLLABORATIONS</div>
        </section>
      </div>
    </main>);

}

function Contact({ accent }) {
  return (
    <main className="contact" data-screen-label="Contact">
      <div className="contact__head">
        <div className="contact__mono">[ Contact ]</div>
        <h1 className="contact__title">
          Get in Touch<br />
          <span style={{ color: accent }}></span>
        </h1>
      </div>
      <div className="contact__grid">
        <div className="contact__col">
          <div className="contact__label">Email</div>
          <a className="contact__big" href="mailto:hi@majger.sk">hi@majger.sk</a>
          <div className="contact__muted">Reply within 48 hours, Mon — Fri.</div>
        </div>
      </div>
    </main>);

}

Object.assign(window, { Profile, Contact });