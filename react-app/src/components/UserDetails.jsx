import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/table.css";
import { updateUser, deleteUser } from "../store.js";
import { splitName } from './../../utils/splitName';

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const users = useSelector((s) => s.users) ?? [];
    const user = useMemo(() => users.find((u) => String(u.id) === String(id)), [users, id]);
    const dispatch = useDispatch();
    const isEditQuery = new URLSearchParams(useLocation().search).get("edit") === "1";

    if (!user) {
        return (
            <div className="page">
                <div className="details-card">
                    <p>User not found.</p>
                    <Link to="/" className="btn-secondary">← Back</Link>
                </div>
            </div>
        );
    }

    const [form, setForm] = useState(() => ({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        website: user.website || "",
        company: user.company?.name || "",
        street: user.address?.street || "",
        suite: user.address?.suite || "",
        city: user.address?.city || "",
        zipcode: user.address?.zipcode || ""
    }));

    const { first, middle, last } =  splitName(user.name);

    function save() {
        if (!form.name.trim() || !form.email.trim()) return;
        dispatch(updateUser({
            ...user,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim(),
            website: form.website.trim(),
            company: { name: form.company.trim() || "—" },
            address: {
                street: form.street.trim(),
                suite: form.suite.trim(),
                city: form.city.trim(),
                zipcode: form.zipcode.trim()
            }
        }));
        navigate(`/users/${id}`);
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
            <div className="details-card">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                    <h2 style={{ margin: 0 }}>{first} {middle && <span>{middle} </span>}{last}</h2>
                    <div style={{ display:"flex", gap:8 }}>
                        {!isEditQuery && (
                            <>
                                <button className="btn-secondary" onClick={() => navigate(`/users/${id}?edit=1`)}>Edit</button>
                                <button className="btn-secondary" onClick={() => {dispatch(deleteUser(user.id)); navigate("/");}}>Delete</button>
                            </>
                        )}
                        <Link to="/" className="btn-primary">Back to list</Link>
                    </div>
                </div>

                {!isEditQuery ? (
                    <div className="grid-2">
                        <div>
                            <div className="label">Email</div>
                            <div className="nowrap">{(user.email || "—").toLowerCase()}</div>
                        </div>
                        <div>
                            <div className="label">Phone</div>
                            <div className="nowrap">{user.phone || "—"}</div>
                        </div>
                        <div>
                            <div className="label">Company</div>
                            <div>{user.company?.name || "—"}</div>
                        </div>
                        <div>
                            <div className="label">Website</div>
                            <div>{user.website || "—"}</div>
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <div className="label">Address</div>
                            <div className="address-lines" style={{ display: "grid", rowGap: 4 }}>
                                <div><span className="inline-label">Street:</span> {user.address?.street || "—"}</div>
                                <div><span className="inline-label">Suite:</span> {user.address?.suite || "—"}</div>
                                <div><span className="inline-label">City:</span> {user.address?.city || "—"}</div>
                                <div><span className="inline-label">Zip code:</span> {user.address?.zipcode || "—"}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid-2">
                            <div><div className="label">Name *</div><input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} /></div>
                            <div><div className="label">Email *</div><input className="input" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} /></div>
                            <div><div className="label">Phone</div><input className="input" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} /></div>
                            <div><div className="label">Website</div><input className="input" value={form.website} onChange={(e)=>setForm({...form, website:e.target.value})} /></div>
                            <div><div className="label">Company</div><input className="input" value={form.company} onChange={(e)=>setForm({...form, company:e.target.value})} /></div>
                            <div><div className="label">Street</div><input className="input" value={form.street} onChange={(e)=>setForm({...form, street:e.target.value})} /></div>
                            <div><div className="label">Suite</div><input className="input" value={form.suite} onChange={(e)=>setForm({...form, suite:e.target.value})} /></div>
                            <div><div className="label">City</div><input className="input" value={form.city} onChange={(e)=>setForm({...form, city:e.target.value})} /></div>
                            <div><div className="label">Zip</div><input className="input" value={form.zipcode} onChange={(e)=>setForm({...form, zipcode:e.target.value})} /></div>
                        </div>
                        <div className="card-actions">
                            <button className="btn-secondary" onClick={() => navigate(`/users/${id}`)}>Discard</button>
                            <button className="btn-primary" onClick={save}>Save changes</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
