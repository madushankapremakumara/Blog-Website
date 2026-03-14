import "./App.css";
import GlassNavbar from "./components/GlassNavbar";

function App() {
  return (
    <>
      <div className="App">
        <GlassNavbar />
        <main>
          <div className="hero-section">
            <div className="container hero-content text-center">
              <h1 className="hero-title">
                The Future of <br />
                <span style={{ color: "var(--accent-color)" }}>
                  Tech Blogging
                </span>
              </h1>
              <p className="hero-subtitle">
                A high-performance space for deep dives into AI, web evolution,
                and futuristic engineering.
              </p>
              <button className="btn-primary-custom btn-lg">
                Explore Blogs
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
