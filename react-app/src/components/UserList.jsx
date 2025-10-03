import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./../styles/table.css";
import { deleteUser } from "../store.js";
import { splitName } from './../../utils/splitName';

export default function UserList() {
    const users = useSelector((s) => s.users) ?? [];
    const [q, setQ] = useState("");
    const [sort, setSort] = useState({ key: "recent", dir: "desc" });
    const dispatch = useDispatch();
    const nav = useNavigate();

    function setSortKey(key) {
        setSort((prev) =>
            prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
        );
    }

    const rows = useMemo(() => {
        let list = [...users];

        // search by name or email
        const term = q.trim().toLowerCase();
        if (term) {
            list = list.filter(
                (u) =>
                    (u.name || "").toLowerCase().includes(term) ||
                    (u.email || "").toLowerCase().includes(term)
            );
        }

        // sorting
        const dir = sort.dir === "asc" ? 1 : -1;
        switch (sort.key) {
            case "name":
                list.sort((a, b) => (a.name || "").localeCompare(b.name || "") * dir);
                break;
            case "email":
                list.sort((a, b) => (a.email || "").localeCompare(b.email || "") * dir);
                break;
            case "company":
                list.sort(
                    (a, b) => ((a.company?.name) || "").localeCompare((b.company?.name) || "") * dir
                );
                break;
            case "recent":
            default:
                list.sort((a, b) => ((b.addedAt || 0) - (a.addedAt || 0)) * (sort.dir === "asc" ? -1 : 1));
        }

        return list.map((u) => {
            const { first, middle, last } = splitName(u.name);
            return { ...u, first, middle, last, email: (u.email || "").toLowerCase() };
        });
    }, [users, q, sort]);

    const SortButton = ({ id, children }) => (
        <button
            onClick={() => setSortKey(id)}
            title="Sort"
            style={{ border: 0, background: "transparent", cursor: "pointer", font: "inherit", color: "inherit" }}
        >
            {children} {sort.key === id ? (sort.dir === "asc" ? "▲" : "▼") : ""}
        </button>
    );

    return (
        <div className="page">
            <div className="page-head">
                <h1>Users App</h1>
                <nav>
                    <Link to="/" className="page-link">Home</Link>
                    <Link to="/add" className="page-link">Add User</Link>
                </nav>
            </div>
            <div className="toolbar">
                <input
                    className="search"
                    placeholder="Search users"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <Link to="/add" className="btn">Add User</Link>
            </div>

            <div className="table-wrap">
                <table className="table">
                    <thead>
                    <tr>
                        <th><SortButton id="name">First Name</SortButton></th>
                        <th><SortButton id="name">Last Name</SortButton></th>
                        <th><SortButton id="email">Email</SortButton></th>
                        <th>Phone</th>
                        <th><SortButton id="company">Company</SortButton></th>
                        <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((u) => (
                        <tr key={u.id}>
                            <td>{u.first || "—"}</td>
                            <td>{u.last || "—"}</td>
                            <td className="nowrap">{(u.email || "—")}</td>
                            <td className="nowrap">{u.phone ? <span className="phone-pill">{u.phone}</span> : "—"}</td>
                            <td className="nowrap">{u.company?.name || "—"}</td>
                            <td>
                                <div className="row-actions">
                                    <button className="icon-btn view" onClick={() => nav(`/users/${u.id}`)} title="Details">👁</button>
                                    <button className="icon-btn edit" onClick={() => nav(`/users/${u.id}?edit=1`)} title="Edit">✏️</button>
                                    <button
                                        className="icon-btn del"
                                        onClick={() => dispatch(deleteUser(u.id))}
                                        title="Delete"
                                    >🗑️</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr><td colSpan={6} style={{ color: "var(--muted)", padding: 24 }}>No users match your search.</td></tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
