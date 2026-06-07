// About (Profile) view

function Profile() {
  return (
    <main className="profile">
      <div className="profile__head">
        <div className="profile__mono">[ About ]</div>
        <h1 className="profile__name">
          Adam Majger<br />
          Designer<br />
          Art Director<br />
          Cultural Worker<br />
          Bratislava
        </h1>
      </div>

      <div className="profile__body">
        <section className="profile__cv">
          <h2 className="profile__h2">CV</h2>
          <ol className="cv">
            {CV.map((entry, i) => (
              <li key={i} className="cv__row">
                <span className="cv__period">{entry.period}</span>
                <div className="cv__content">
                  <span className="cv__role">{entry.role}</span>
                  <span className="cv__place">{entry.place}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="profile__awards">
          <h2 className="profile__h2">Selected awards</h2>
          <ol className="awards">
            {AWARDS.map((a, i) => (
              <li key={i} className="awards__row">
                <div className="awards__content">
                  <span className="awards__title">{a.title}</span>
                  <span className="awards__year">{a.year}</span>
                </div>
                <div className="awards__content">
                  <span className="awards__cat">{a.category}</span>
                  <span className="awards__project">{a.project}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="profile__contact-cta">
          <h2 className="profile__h2">Get in touch</h2>
          <a className="big-link" href="mailto:adam.majger@gmail.com">adam.majger@gmail.com →</a>
          <div className="profile__contact-sub">FOR COLLABORATIONS</div>
        </section>
      </div>
    </main>
  );
}

Object.assign(window, { Profile });
