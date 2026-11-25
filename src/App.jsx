import { useEffect, useMemo, useState } from "react";
import "./App.css";

const seed = [
  ["The Midnight Library","Matt Haig","Fiction","9780525559474","A novel about all the choices that shape a life.",4.6],
  ["Atomic Habits","James Clear","Self Development","9780735211292","Small changes that create remarkable results.",4.8],
  ["The Alchemist","Paulo Coelho","Fiction","9780061122415","A journey about listening to your heart.",4.5],
  ["Sapiens","Yuval Noah Harari","History","9780062316097","A sweeping exploration of humankind.",4.7],
  ["Deep Work","Cal Newport","Productivity","9781455586691","Focused success in a distracted world.",4.4],
  ["Educated","Tara Westover","Biography","9780399590504","A memoir about family and the power of education.",4.6],
  ["The Psychology of Money","Morgan Housel","Business","9780857197689","Timeless lessons on wealth and happiness.",4.7],
  ["Dune","Frank Herbert","Science Fiction","9780441172719","An epic set on the desert planet Arrakis.",4.5],
  ["Pride and Prejudice","Jane Austen","Classic","9780141439518","A beloved story of manners and first impressions.",4.6],
  ["The Hobbit","J.R.R. Tolkien","Fantasy","9780547928227","A reluctant hobbit joins an unexpected adventure.",4.8],
  ["Ikigai","Hector Garcia","Lifestyle","9780143130727","A guide to finding purpose in everyday life.",4.2],
  ["The Book Thief","Markus Zusak","Fiction","9780375842207","A moving story of words, courage, and humanity.",4.7],
  ["Thinking, Fast and Slow","Daniel Kahneman","Psychology","9780374533557","An exploration of the two systems that drive thought.",4.3],
  ["The Great Gatsby","F. Scott Fitzgerald","Classic","9780743273565","A portrait of ambition, love, and the American dream.",4.2],
  ["Clean Code","Robert C. Martin","Technology","9780132350884","A handbook of software craftsmanship.",4.5],
  ["A Brief History of Time","Stephen Hawking","Science","9780553380163","An introduction to cosmology and the universe.",4.3],
  ["The Design of Everyday Things","Don Norman","Design","9780465050659","A guide to making products easier to understand.",4.4],
  ["Man's Search for Meaning","Viktor Frankl","Psychology","9780807014271","A reflection on meaning, resilience, and purpose.",4.7]
];

const colors = ["#e8d8bb","#d8e5dc","#e7d7d0","#d9def0","#e7e1c8","#d6e6e3","#e9d7a8","#d9d5e8"];

const books = Array.from({ length: 1000 }, (_, i) => {
  const s = seed[i % seed.length];

  return {
    id: i + 1,
    title: s[0] + (i >= seed.length ? ` · Collection ${Math.floor(i / seed.length) + 1}` : ""),
    author: s[1],
    category: s[2],
    isbn: s[3],
    description: s[4],
    rating: s[5],
    year: 2010 + i % 15,
    pages: 180 + (i * 17) % 420,
    color: colors[i % colors.length],
    isNew: i < 18,
    trending: i % 7 < 3
  };
});

const cats = ["All", ...new Set(seed.map(x => x[2]))];

const posts = [
  ["How to build a reading habit that lasts","Reading tips","Start small, choose books you enjoy, and make reading part of your daily routine."],
  ["Five timeless classics to add to your list","Curated lists","Explore enduring stories that continue to inspire readers."],
  ["The joy of discovering a new author","Community","A new author can open the door to unfamiliar ideas and worlds."]
];

const events = [
  ["Community Reading Hour","December 05, 2026","A relaxed gathering to share what everyone is reading."],
  ["The Art of Storytelling","December 12, 2026","Discover story structure, character, and memorable narratives."],
  ["Classic Book Club","December 19, 2026","Join a friendly discussion of a much-loved literary classic."]
];


function Cover({ b, large = false }) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg?default=false`;

  return (
    <div
      className={"cover " + (large ? "large" : "")}
      style={{ "--c": b.color }}
    >
      {!imageError ? (
        <img
          src={imageUrl}
          alt={b.title}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="fallback-cover">
          <small>LIBRENTIS LIBRARY</small>
          <strong>{b.title.split(" · ")[0]}</strong>
          <span>{b.author}</span>
          <i>BOOK COLLECTION</i>
        </div>
      )}
    </div>
  );
}


function App() {
  const [page, setPage] = useState("Home");
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");
  const [chosen, setChosen] = useState(null);

  const [favs, setFavs] = useState(() =>
    JSON.parse(localStorage.getItem("lf-favs") || "[]")
  );

  const [list, setList] = useState(() =>
    JSON.parse(localStorage.getItem("lf-list") || "[]")
  );

  const [theme, setTheme] = useState(() =>
    localStorage.getItem("lf-theme") || "light"
  );

  const [reviews, setReviews] = useState(() =>
    JSON.parse(localStorage.getItem("lf-reviews") || "{}")
  );

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(5);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [tour, setTour] = useState(0);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("lf-favs", JSON.stringify(favs));
  }, [favs]);

  useEffect(() => {
    localStorage.setItem("lf-list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("lf-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("lf-reviews", JSON.stringify(reviews));
  }, [reviews]);

  const filtered = useMemo(() => {
    let a = books.filter(
      b =>
        (cat === "All" || b.category === cat) &&
        `${b.title} ${b.author} ${b.category} ${b.isbn}`
          .toLowerCase()
          .includes(query.toLowerCase())
    );

    if (sort === "title") a.sort((x, y) => x.title.localeCompare(y.title));
    if (sort === "rating") a.sort((x, y) => y.rating - x.rating);
    if (sort === "new") a.sort((x, y) => y.year - x.year);

    return a;
  }, [query, cat, sort]);

  const go = p => {
    setPage(p);
    setChosen(null);
    setMenu(false);
    window.scrollTo(0, 0);
  };

  const toggle = (arr, set, id) =>
    set(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);

  const nav = [
    "Home","Books","Categories","New Arrivals","Popular Books",
    "Favourites","Reading List","About","Services",
    "Events & Blog","Virtual Tour","Contact"
  ];

  const header = (tag, title, desc, action) => (
    <div className="section-head">
      <div>
        <small className="eyebrow">{tag}</small>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
      {action}
    </div>
  );

  const card = b => (
    <article className="book-card" key={b.id}>
      <div
        className="book-art"
        onClick={() => {
          setChosen(b);
          window.scrollTo(0, 0);
        }}
      >
        <Cover b={b} />
        {b.isNew && <label className="new">NEW</label>}
        <button
          className={"heart " + (favs.includes(b.id) ? "on" : "")}
          onClick={e => {
            e.stopPropagation();
            toggle(favs, setFavs, b.id);
          }}
        >
          ♥
        </button>
      </div>

      <div className="book-info">
        <small className="eyebrow">{b.category}</small>
        <h3 onClick={() => setChosen(b)}>{b.title.split(" · ")[0]}</h3>
        <p>{b.author}</p>
        <div className="book-foot">
          <b>★ {b.rating.toFixed(1)}</b>
          <button onClick={() => setChosen(b)}>Details →</button>
        </div>
      </div>
    </article>
  );

  const grid = a =>
    a.length ? (
      <div className="book-grid">{a.map(card)}</div>
    ) : (
      <div className="empty">
        <h3>No books found</h3>
        <p>Try another search or category.</p>
      </div>
    );

  const articles = (
    <div className="post-grid">
      {posts.map((p, i) => (
        <article className="post" key={p[0]}>
          <div className={"post-art p" + i}>
            <b>0{i + 1}</b>
            <strong>{["MAKE TIME FOR STORIES","TIMELESS READS","MEET A NEW VOICE"][i]}</strong>
          </div>
          <small className="eyebrow">{p[1]}</small>
          <h3>{p[0]}</h3>
          <p>{p[2]}</p>
        </article>
      ))}
    </div>
  );

  let content;

  if (chosen) {
    const rs = reviews[chosen.id] || [];

    content = (
      <main className="container detail">
        <button className="back" onClick={() => setChosen(null)}>
          ← Back to {page}
        </button>

        <div className="detail-grid">
          <div className="detail-art">
            <Cover b={chosen} large />
          </div>

          <div>
            <small className="eyebrow">{chosen.category} · {chosen.year}</small>
            <h1>{chosen.title.split(" · ")[0]}</h1>
            <p className="muted">By {chosen.author}</p>
            <p className="stars">★ {chosen.rating.toFixed(1)} · {rs.length} community reviews</p>
            <p className="description">{chosen.description}</p>

            <div className="facts">
              <span>ISBN<b>{chosen.isbn}</b></span>
              <span>Pages<b>{chosen.pages}</b></span>
              <span>Year<b>{chosen.year}</b></span>
            </div>

            <button className="btn" onClick={() => toggle(favs, setFavs, chosen.id)}>
              {favs.includes(chosen.id) ? "♥ Saved" : "♡ Add to favourites"}
            </button>

<button
  className="btn" style={{ marginLeft: "16px" }}
  onClick={() =>
    window.open(
      `https://books.google.com/books?vid=ISBN${chosen.isbn}`,
      "_blank",
      "noopener,noreferrer"
    )
  }
>
  📖 Read Book Online
</button>


            {" "}

            <button className="btn outline" onClick={() => toggle(list, setList, chosen.id)}>
              {list.includes(chosen.id) ? "Remove from list" : "＋ Reading list"}
            </button>
          </div>
        </div>

        <section className="reviews">
          <h2>Ratings & reviews</h2>

          <form
            onSubmit={e => {
              e.preventDefault();

              if (review.trim()) {
                setReviews(o => ({
                  ...o,
                  [chosen.id]: [
                    {
                      text: review,
                      rating: stars,
                      date: new Date().toLocaleDateString()
                    },
                    ...(o[chosen.id] || [])
                  ]
                }));

                setReview("");
              }
            }}
          >
            <label>
              Your rating
              <select value={stars} onChange={e => setStars(+e.target.value)}>
                {[5,4,3,2,1].map(n => <option key={n}>{n}</option>)}
              </select>
            </label>

            <textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share your thoughts about this book..."
              required
            />

            <button className="btn">Post review</button>
          </form>

          {rs.length ? rs.map((r, i) => (
            <p className="review" key={i}>
              <b>Reader · ★ {r.rating}</b>
              <small>{r.date}</small>
              <br />
              {r.text}
            </p>
          )) : <p className="muted">Be the first to review this book.</p>}
        </section>
      </main>
    );
  }

  else if (page === "Home") {
    content = (
      <>
        <section className="hero container">
          <div>
            <small className="eyebrow">A WORLD OF STORIES, ONE PLACE</small>
            <h1>Find your next <em>favourite</em> chapter.</h1>
            <p>
              Discover thoughtful reads, timeless classics, and fresh perspectives.
              Your next great read is waiting at Librentis.
            </p>
            <button className="btn" onClick={() => go("Books")}>
              Explore the collection →
            </button>
            {" "}
            <button className="btn outline" onClick={() => go("Virtual Tour")}>
              Take a virtual tour
            </button>
            <p className="hero-note">● Curated reading for curious minds</p>
          </div>

          <div className="hero-visual">
            <div className="hero-book back">
              <small>THE CLASSICS</small>
              <b>Stories<br />for tomorrow.</b>
            </div>
            <div className="hero-book front">
              <small>LIBRENTIS COLLECTION</small>
              <b>Stories<br />that stay.</b>
              <small>READ · DISCOVER · GROW</small>
            </div>
            <span className="sticker">OPEN A<br />NEW WORLD</span>
          </div>
        </section>

        <div className="stats">
          <div><b>1,000+</b><span>Books to explore</span></div>
          <div><b>15+</b><span>Reading categories</span></div>
          <div><b>Anytime</b><span>Your reading space</span></div>
          <div><b>Curated</b><span>For curious minds</span></div>
        </div>

        <section className="section container">
          {header(
            "A GOOD PLACE TO BEGIN",
            "Trending this week",
            "Reader favourites and stories making their way onto more bookshelves.",
            <button className="link" onClick={() => go("Popular Books")}>View all →</button>
          )}
          {grid(books.filter(b => b.trending).slice(0, 4))}
        </section>

        <section className="feature">
          <div className="container feature-inner">
            <div>
              <small className="eyebrow">FRESH OFF THE SHELF</small>
              <h2>New stories.<br /><em>New perspectives.</em></h2>
              <p>Meet the latest additions to our growing collection.</p>
              <button className="btn light" onClick={() => go("New Arrivals")}>
                Discover new arrivals →
              </button>
            </div>
            <div className="feature-books">
              {books.slice(7, 10).map(b => <Cover b={b} key={b.id} />)}
            </div>
          </div>
        </section>

        <section className="section container">
          {header(
            "FROM THE READING ROOM",
            "Ideas worth turning a page for",
            "Notes, recommendations, and inspiration for your reading life.",
            <button className="link" onClick={() => go("Events & Blog")}>Read the journal →</button>
          )}
          {articles}
        </section>
      </>
    );
  }

  else if (["Books","Categories","New Arrivals","Popular Books","Favourites","Reading List"].includes(page)) {
    let a =
      page === "New Arrivals" ? books.filter(b => b.isNew) :
      page === "Popular Books" ? books.filter(b => b.trending).sort((x,y) => y.rating - x.rating) :
      page === "Favourites" ? books.filter(b => favs.includes(b.id)) :
      page === "Reading List" ? books.filter(b => list.includes(b.id)) :
      filtered;

    content = (
      <main className="container catalog">
        <div className="page-title">
          <small className="eyebrow">THE LIBRENTIS COLLECTION</small>
          <h1>
            {({
              Books:"Find a book that moves you.",
              Categories:"Explore by interest.",
              Favourites:"Your saved stories.",
              "Reading List":"Your reading list.",
              "New Arrivals":"Fresh from the shelf.",
              "Popular Books":"Reader favourites."
            })[page]}
          </h1>
          <p>Browse stories, ideas, and knowledge for every curious mind.</p>
        </div>

        {["Books","Categories"].includes(page) && (
          <div className="tools">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by title, author, ISBN or subject..."
            />

            <select value={cat} onChange={e => setCat(e.target.value)}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </select>

            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="title">Title A–Z</option>
              <option value="rating">Top rated</option>
              <option value="new">Newest</option>
            </select>
          </div>
        )}

        {page === "Categories" && (
          <div className="pills">
            {cats.slice(1).map(c => (
              <button key={c} onClick={() => { setCat(c); setPage("Books"); }}>
                {c}
              </button>
            ))}
          </div>
        )}

        <p className="result-count">
          {a.length.toLocaleString()} books · 1,000 demo catalogue entries
        </p>

        {grid(a.slice(0, 40))}
      </main>
    );
  }

  else if (page === "About") {
    content = (
      <main className="container content">
        <div className="page-title">
          <small className="eyebrow">OUR STORY</small>
          <h1>A little space for <em>big ideas.</em></h1>
          <p>
            Librentis is a welcoming digital library concept built around the
            simple joy of discovering a good book.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-art">
            LIBRENTIS
            <strong>Every book<br />opens a door.</strong>
          </div>

          <div>
            <h2>Reading brings us closer to new worlds.</h2>
            <p>
              We believe a library should feel inviting, easy to explore, and full
              of possibility. Librentis brings books, reading inspiration, and
              community moments together in one calm digital space.
            </p>
            <button className="btn" onClick={() => go("Books")}>Explore books →</button>
          </div>
        </div>
      </main>
    );
  }

  else if (page === "Services") {
    content = (
      <main className="container content">
        <div className="page-title">
          <small className="eyebrow">WHAT YOU CAN DO</small>
          <h1>More ways to enjoy <em>reading.</em></h1>
          <p>Explore tools and experiences designed to make discovering books easier.</p>
        </div>

        <div className="services">
          {[
            ["01","Discover & search","Find titles by name, author, ISBN, or subject."],
            ["02","Personal collections","Save favourites and build a reading list."],
            ["03","Reader reviews","Explore ratings and share your thoughts."],
            ["04","Reading inspiration","Browse new arrivals, trending titles, and events."],
            ["05","Virtual tour","Take a guided look around Librentis."],
            ["06","Stay connected","Subscribe for reading ideas and updates."]
          ].map(x => (
            <article key={x[0]}>
              <small>{x[0]}</small>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </article>
          ))}
        </div>
      </main>
    );
  }

  else if (page === "Events & Blog") {
    content = (
      <main className="container content">
        <div className="page-title">
          <small className="eyebrow">THE READING ROOM</small>
          <h1>Stories, ideas & <em>gatherings.</em></h1>
          <p>Reading inspiration and community moments from Librentis.</p>
        </div>

        {articles}

        <h2 className="subhead">Upcoming events</h2>

        {events.map(e => (
          <article className="event" key={e[0]}>
            <b>{e[1]}</b>
            <div>
              <h3>{e[0]}</h3>
              <p>{e[2]}</p>
            </div>
            <button
              className="btn outline"
              onClick={() => alert("Thanks for your interest! This is a prototype.")}
            >
              I'm interested
            </button>
          </article>
        ))}
      </main>
    );
  }

  else if (page === "Virtual Tour") {
    content = (
      <main className="container content">
        <div className="page-title">
          <small className="eyebrow">STEP INSIDE</small>
          <h1>Your library, <em>wherever you are.</em></h1>
          <p>Take a short guided tour of the Librentis experience.</p>
        </div>

        <div className="tour">
          <div className="tour-art">
            <Cover b={books[0]} />
            <Cover b={books[1]} />
            <Cover b={books[2]} />
          </div>

          <div>
            <small className="eyebrow">GUIDED TOUR · {tour + 1} OF 4</small>
            <h2>
              {[
                "Welcome to Librentis",
                "Discover your next read",
                "Make it your own",
                "Stay inspired"
              ][tour]}
            </h2>
            <p>
              {[
                "A welcoming space to explore books and reading inspiration.",
                "Search by title, author, ISBN, or subject.",
                "Save favourites, create reading lists, and share reviews.",
                "Find new arrivals, trending stories, events, and updates."
              ][tour]}
            </p>

            <button className="btn outline" disabled={!tour} onClick={() => setTour(t => t - 1)}>
              Previous
            </button>

            {" "}

            <button className="btn" onClick={() => tour === 3 ? go("Books") : setTour(t => t + 1)}>
              {tour === 3 ? "Explore books" : "Next step →"}
            </button>

            <div className="dots">
              {[0,1,2,3].map(n => (
                <button
                  key={n}
                  className={tour === n ? "active" : ""}
                  onClick={() => setTour(n)}
                  aria-label={`Tour step ${n + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  else {
    content = (
      <main className="container content">
        <div className="page-title">
          <small className="eyebrow">SAY HELLO</small>
          <h1>We'd love to <em>hear from you.</em></h1>
          <p>Questions, suggestions, or a book recommendation? Send us a note.</p>
        </div>

        <form
          className="contact"
          onSubmit={e => {
            e.preventDefault();
            alert("Thank you! Your message was recorded in this prototype.");
          }}
        >
          <label>Your name<input required placeholder="Your name" /></label>
          <label>Email address<input type="email" required placeholder="you@example.com" /></label>
          <label>Subject<input required placeholder="How can we help?" /></label>
          <label>Message<textarea required placeholder="Write your message..." /></label>
          <button className="btn">Send message →</button>
        </form>
      </main>
    );
  }

  return (
    <div className="app">
      <header>
        <div className="container nav">
          <button className="brand" onClick={() => go("Home")}>
            <span className="mark">L</span>
            <span>
              <b>Librentis</b>
              <small>THE DIGITAL READING SPACE</small>
            </span>
          </button>

          <nav className={menu ? "open" : ""}>
            {nav.map(n => (
              <button
                key={n}
                className={page === n ? "active" : ""}
                onClick={() => go(n)}
              >
                {n}
              </button>
            ))}
          </nav>

          <div className="nav-tools">
            <button
              className="circle"
              onClick={() => setTheme(t => t === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "☾" : "☀"}
            </button>

            <button className="circle" onClick={() => go("Favourites")}>
              ♥ {favs.length}
            </button>

            <button className="hamb" onClick={() => setMenu(v => !v)}>☰</button>
          </div>
        </div>
      </header>

      {content}

      <section className="newsletter">
        <div className="container news-inner">
          <div>
            <small className="eyebrow">A LETTER FOR BOOK LOVERS</small>
            <h2>A little reading inspiration, <em>delivered.</em></h2>
            <p>Get new arrivals, recommendations, and Librentis updates.</p>
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              setSubscribed(true);
              setEmail("");
            }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="Your email address"
            />
            <button>→</button>
            {subscribed && <small>Thanks for subscribing!</small>}
          </form>
        </div>
      </section>

      <footer>
        <div className="container foot">
          <div>
            <b>Librentis</b>
            <p>Discover stories. Explore ideas.<br />Find your next favourite chapter.</p>
          </div>

          <div>
            <b>Explore</b>
            {["Books","Categories","New Arrivals","Popular Books"].map(n => (
              <button key={n} onClick={() => go(n)}>{n}</button>
            ))}
          </div>

          <div>
            <b>About</b>
            {["About","Services","Events & Blog","Virtual Tour","Contact"].map(n => (
              <button key={n} onClick={() => go(n)}>{n}</button>
            ))}
          </div>

          <div>
            <b>Your space</b>
            {["Favourites","Reading List"].map(n => (
              <button key={n} onClick={() => go(n)}>{n}</button>
            ))}
          </div>
        </div>

        <div className="container copyright">
          © 2026 Librentis · Public library UI/UX prototype
        </div>
      </footer>
    </div>
  );
}

export default App;