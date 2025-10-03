import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../store.js";
import "../styles/table.css";

export default function AddUser() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [phone, setPhone] = useState("");
    const [website, setWebsite] = useState("");
    const [street, setStreet] = useState("");
    const [suite, setSuite] = useState("");
    const [city, setCity] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [error, setError] = useState(null);

    function validate() {
        if (!name.trim()) return "Name is required.";
        if (!email.trim()) return "Email is required.";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "Enter a valid email.";
        return null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const v = validate();
        if (v) return setError(v);

        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            company: { name: company.trim() || "—" },
            phone: phone.trim(),
            website: website.trim(),
            address: {
                street: street.trim(),
                suite: suite.trim(),
                city: city.trim(),
                zipcode: zipcode.trim(),
            },
            addedAt: Date.now(), // used for "recent" sort
        };

        dispatch(addUser(newUser));
        navigate("/");
    }

    return (
        <div className="page">
            <div className="page-head">
                <h1>Users App</h1>
                <nav>
                    <Link to="/" className="page-link">Home</Link>
                    <Link to="/add" className="page-link">Add User</Link>
                </nav>
            </div>
            <div className="form-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h2 style={{ margin: 0 }}>Add New User</h2>
                    <Link to="/" className="btn-secondary" style={{ textDecoration: "none", color: "var(--text)" }}>← Back to list</Link>
                </div>

                {error && (
                    <div style={{ marginBottom: 12, color: "#b91c1c", fontWeight: 600 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Top grid */}
                    <div className="grid-2">
                        <div>
                            <div className="label">Name *</div>
                            <input
                                className="input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Jane Doe"
                                aria-label="Full name"
                            />
                        </div>

                        <div>
                            <div className="label">Email *</div>
                            <input
                                className="input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="jane@example.com"
                                type="email"
                                aria-label="Email"
                            />
                        </div>

                        <div>
                            <div className="label">Company</div>
                            <input
                                className="input"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="ACME Inc."
                                aria-label="Company"
                            />
                        </div>

                        <div>
                            <div className="label">Phone</div>
                            <input
                                className="input"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1234567890"
                                aria-label="Phone"
                            />
                        </div>

                        <div>
                            <div className="label">Website</div>
                            <input
                                className="input"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="example.com"
                                aria-label="Website"
                            />
                        </div>
                    </div>

                    {/* Address block */}
                    <div style={{ marginTop: 20 }}>
                        <div className="label" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: ".02em" }}>
                            Address
                        </div>

                        <div className="grid-2">
                            <div>
                                <div className="label">Street</div>
                                <input
                                    className="input"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    placeholder="123 Main St"
                                    aria-label="Street"
                                />
                            </div>

                            <div>
                                <div className="label">Suite</div>
                                <input
                                    className="input"
                                    value={suite}
                                    onChange={(e) => setSuite(e.target.value)}
                                    placeholder="Apt 4B"
                                    aria-label="Suite"
                                />
                            </div>

                            <div>
                                <div className="label">City</div>
                                <input
                                    className="input"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Springfield"
                                    aria-label="City"
                                />
                            </div>

                            <div>
                                <div className="label">Zip Code</div>
                                <input
                                    className="input"
                                    value={zipcode}
                                    onChange={(e) => setZipcode(e.target.value)}
                                    placeholder="10001"
                                    aria-label="Zip Code"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="card-actions">
                        <Link to="/" className="btn-secondary" style={{ textDecoration: "none", color: "var(--text)" }}>Discard</Link>
                        <button type="submit" className="btn-primary">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
