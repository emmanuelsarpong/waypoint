import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  const pageStyle = {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    paddingBottom: "80px",
  };

  const heroStyle = {
    padding: "80px 20px 60px",
    textAlign: "center",
    background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
  };

  const sectionStyle = {
    padding: "60px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const cardStyle = {
    background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
    border: "1px solid #2a2a2a",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
  };

  const statsCardStyle = {
    ...cardStyle,
    textAlign: "center",
    padding: "40px 24px",
  };

  const highlightStyle = {
    background: "linear-gradient(90deg, #ff7eb3, #ff758c, #a29bfe)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: "bold",
  };

  const _teamMembers = [
    {
      name: "Alex Rodriguez",
      role: "CEO & Founder",
      bio: "Former athlete turned tech entrepreneur. 15+ years in fitness technology.",
      image:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&auto=format&q=80",
    },
    {
      name: "Marcus Johnson",
      role: "CTO",
      bio: "Software architect with expertise in mobile apps and GPS technology.",
      image:
        "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&auto=format&q=80",
    },
    {
      name: "David Thompson",
      role: "Head of Product",
      bio: "UX designer and outdoor enthusiast. Designs experiences that inspire adventure.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format&q=80",
    },
    {
      name: "Dr. Kevin Washington",
      role: "Fitness Advisor",
      bio: "Sports scientist and marathon runner. Ensures our metrics are scientifically accurate.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format&q=80",
    },
  ];

  const stats = [
    { number: "500K+", label: "Active Users" },
    { number: "2M+", label: "Miles Tracked" },
    { number: "15K+", label: "Trails Mapped" },
    { number: "98%", label: "User Satisfaction" },
  ];

  return (
    <div style={pageStyle}>
      {/* Hero Section */}
      <section style={heroStyle}>
        <h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "bold",
            marginBottom: "24px",
          }}
        >
          About <span style={highlightStyle}>Waypoint</span>
        </h1>
        <p
          style={{
            fontSize: "1.5rem",
            color: "#9ca3af",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Empowering adventurers to discover, track, and conquer their fitness
          goals through cutting-edge technology and community-driven
          exploration.
        </p>
      </section>

      {/* Mission Section */}
      <section style={sectionStyle}>
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            Our Mission
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ff7eb3",
                }}
              >
                🎯 Purpose-Driven
              </h3>
              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  fontSize: "1.1rem",
                }}
              >
                We believe everyone deserves access to the outdoors. Waypoint
                breaks down barriers by making trail discovery, fitness
                tracking, and outdoor exploration accessible to adventurers of
                all skill levels.
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#a29bfe",
                }}
              >
                🌟 Innovation First
              </h3>
              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.7",
                  fontSize: "1.1rem",
                }}
              >
                Using advanced GPS technology, AI-powered route recommendations,
                and real-time community insights, we're constantly pushing the
                boundaries of what's possible in outdoor fitness technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={sectionStyle}>
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "48px",
            textAlign: "center",
          }}
        >
          Our Impact
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          {stats.map((stat, index) => (
            <div key={index} style={statsCardStyle}>
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  color: "#ff7eb3",
                  marginBottom: "8px",
                }}
              >
                {stat.number}
              </div>
              <div style={{ fontSize: "1.2rem", color: "#9ca3af" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section style={sectionStyle}>
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "32px",
              textAlign: "center",
            }}
          >
            Our Story
          </h2>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <p
              style={{
                color: "#9ca3af",
                lineHeight: "1.8",
                fontSize: "1.1rem",
                marginBottom: "24px",
              }}
            >
              Waypoint was born from a simple frustration: finding quality
              trails and tracking outdoor activities shouldn't be complicated.
              Founded in 2023 by a team of outdoor enthusiasts and tech
              professionals, we set out to create the most intuitive and
              comprehensive fitness tracking platform for adventurers.
            </p>
            <p
              style={{
                color: "#9ca3af",
                lineHeight: "1.8",
                fontSize: "1.1rem",
                marginBottom: "24px",
              }}
            >
              What started as a weekend project quickly grew into a movement.
              Our community of hikers, runners, cyclists, and outdoor
              enthusiasts helped shape every feature, ensuring Waypoint truly
              serves the needs of real adventurers in the field.
            </p>
            <p
              style={{
                color: "#9ca3af",
                lineHeight: "1.8",
                fontSize: "1.1rem",
              }}
            >
              Today, we're proud to be the trusted companion for hundreds of
              thousands of outdoor enthusiasts worldwide, helping them discover
              new trails, achieve personal bests, and connect with like-minded
              adventurers in their communities.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section - Commented out for now
      <section style={sectionStyle}>
        <h2
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "48px",
            textAlign: "center",
          }}
        >
          Meet Our Team
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "32px",
          }}
        >
          {teamMembers.map((member, index) => (
            <div key={index} style={teamMemberStyle}>
              <img
                src={member.image}
                alt={member.name}
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  marginBottom: "20px",
                  objectFit: "cover",
                }}
              />
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "8px",
                }}
              >
                {member.name}
              </h3>
              <p
                style={{
                  color: "#ff7eb3",
                  fontWeight: "500",
                  marginBottom: "16px",
                }}
              >
                {member.role}
              </p>
              <p
                style={{
                  color: "#9ca3af",
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                }}
              >
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </section>
      */}

      {/* Values Section */}
      <section style={sectionStyle}>
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "48px",
              textAlign: "center",
            }}
          >
            What Drives Us
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "40px",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ff7eb3",
                }}
              >
                🌱 Sustainability
              </h3>
              <p style={{ color: "#9ca3af", lineHeight: "1.7" }}>
                We're committed to protecting the environments we explore. Our
                carbon-neutral hosting and trail conservation partnerships
                ensure future generations can enjoy these spaces.
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#a29bfe",
                }}
              >
                🤝 Community
              </h3>
              <p style={{ color: "#9ca3af", lineHeight: "1.7" }}>
                Adventure is better together. We foster connections between
                outdoor enthusiasts, creating a supportive community that
                celebrates every milestone and shares valuable insights.
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#ff758c",
                }}
              >
                🔒 Privacy
              </h3>
              <p style={{ color: "#9ca3af", lineHeight: "1.7" }}>
                Your adventures are yours to share. We believe in transparent
                data practices and give you complete control over your personal
                information and activity data.
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#22d3ee",
                }}
              >
                ⚡ Excellence
              </h3>
              <p style={{ color: "#9ca3af", lineHeight: "1.7" }}>
                We're obsessed with creating exceptional experiences. Every
                feature is thoughtfully designed and rigorously tested to ensure
                it enhances your outdoor adventures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "24px",
            }}
          >
            Ready to Start Your Adventure?
          </h2>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "1.2rem",
              marginBottom: "32px",
              maxWidth: "600px",
              margin: "0 auto 32px",
            }}
          >
            Join hundreds of thousands of adventurers who trust Waypoint to
            guide their outdoor journeys.
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "16px 40px",
              background: "linear-gradient(90deg, #ff7eb3, #ff758c)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "1.2rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;
