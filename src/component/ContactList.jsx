import React, {
  useEffect,
  useState,
} from "react";

import { db } from "../Firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { Menu, Search, Settings, LogOut, Plus } from "lucide-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaStar, FaRegStar } from "react-icons/fa";

import "./ContactList.css";

function ContactList({ user, logout }) {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [trashContacts, setTrashContacts] = useState([]);
  const [sidebar, setSidebar] = useState(window.innerWidth > 768);
  const [search, setSearch] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [page, setPage] = useState("contacts");

  // ================= FETCH =================
  const fetchContacts = async () => {
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "contacts"),
      orderBy("nameLower", "asc")
    );
    const data = await getDocs(q);
    const arr = [];
    data.forEach((doc) => {
      arr.push({ id: doc.id, ...doc.data() });
    });
    setContacts(arr);

    const trashQ = query(
      collection(db, "users", user.uid, "trash"),
      orderBy("nameLower", "asc")
    );
    const trashData = await getDocs(trashQ);
    const trashArr = [];
    trashData.forEach((doc) => {
      trashArr.push({ id: doc.id, ...doc.data() });
    });
    setTrashContacts(trashArr);
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  useEffect(() => {
    const handleClick = (e) => {
      if (
        window.innerWidth <= 768 &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".nav-icon")
      ) {
        setSidebar(false);
      }
      if (!e.target.closest(".menu-wrapper")) {
        setSelectedMenu(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // ================= PROFILE COLOR =================
  const getColor = (name = "") => {
    const colors = ["#ff6b6b", "#5f27cd", "#10ac84", "#ff9f43"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  // ================= DELETE =================
  const deleteContact = async (contact) => {
    try {
      await setDoc(
        doc(db, "users", user.uid, "trash", contact.id),
        contact
      );
      await deleteDoc(
        doc(db, "users", user.uid, "contacts", contact.id)
      );
      fetchContacts();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= RESTORE =================
  const restoreContact = async (contact) => {
    try {
      await setDoc(
        doc(db, "users", user.uid, "contacts", contact.id),
        contact
      );
      await deleteDoc(
        doc(db, "users", user.uid, "trash", contact.id)
      );
      fetchContacts();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= PERMANENT DELETE =================
  const permanentDelete = async (contact) => {
    try {
      await deleteDoc(
        doc(db, "users", user.uid, "trash", contact.id)
      );
      fetchContacts();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FAVOURITE =================
  const toggleFavourite = async (contact) => {
    try {
      await updateDoc(
        doc(db, "users", user.uid, "contacts", contact.id),
        {
          favourite: !contact.favourite,
        }
      );
      fetchContacts();
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FILTER =================
  let displayData = page === "contacts"
    ? contacts
    : page === "favourite"
    ? contacts.filter((c) => c.favourite)
    : trashContacts;

  const filteredContacts = displayData.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(search.toLowerCase()) ||
      contact.number?.includes(search) ||
      contact.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-main">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <Menu
            className="nav-icon"
            onClick={() => setSidebar(!sidebar)}
          />
          <h2 className="contact-title">Contacts</h2>
          <div className="search-box">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search Contact"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="nav-right">
          <Settings className="setting-icon" size={22} />
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="body-section">
        {/* SIDEBAR */}
        {sidebar && (
          <div className="sidebar">
            <div className="sidebar-profile">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" />
              ) : (
                <div className="profile-letter">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <p>{user?.email}</p>
            </div>
            <button
              className="create-btn"
              onClick={() => navigate("/create")}
            >
              <Plus />
              Create Contact
            </button>
            <div className="sidebar-menu">
              <p onClick={() => setPage("contacts")}>
                Contacts ({contacts.length})
              </p>
              <p onClick={() => setPage("favourite")}>
                Favourite (
                {contacts.filter((c) => c.favourite).length}
                )
              </p>
              <p onClick={() => setPage("trash")}>
                Trash ({trashContacts.length})
              </p>
            </div>
          </div>
        )}

        {/* TABLE */}
        <div
          className={`table-container ${sidebar ? "small" : "full"}`}
        >
          <h2 className="page-title">
            {page === "contacts"
              ? "Contacts"
              : page === "favourite"
              ? "Favourite"
              : "Trash"}
          </h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {/* PROFILE */}
                  <th>Profile</th>
                  {/* NAME */}
                  <th>Name</th>

                  {/* 📱 MOBILE ONLY: number + 3‑dot */}
                  {window.innerWidth <= 768 && (
                    <>
                      <th>Number</th>
                      <th>Action</th>
                    </>
                  )}

                  {/* 💻 LAPTOP SIDEBAR OPEN (no change for you) */}
                  {window.innerWidth > 768 && sidebar && (
                    <>
                      <th>Number</th>
                      <th>Email</th>
                      <th>Action</th>
                    </>
                  )}

                  {/* 💻 LAPTOP SIDEBAR CLOSE (no change for you) */}
                  {window.innerWidth > 768 && !sidebar && (
                    <>
                      <th>Number</th>
                      <th>Email</th>
                      <th>Job</th>
                      <th>DOB</th>
                      <th>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => {
                      if (page !== "trash") {
                        navigate("/view", { state: contact });
                      }
                    }}
                  >
                    {/* PROFILE */}
                    <td>
                      {contact.image ? (
                        <img
                          src={contact.image}
                          alt=""
                          className="profile-img"
                        />
                      ) : (
                        <div
                          className="profile-letter table-letter"
                          style={{ background: getColor(contact.name) }}
                        >
                          {contact.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* NAME */}
                    <td>{contact.name}</td>

                    {/* MOBILE: number + 3‑dot dropdown */}
                    {window.innerWidth <= 768 && (
                      <>
                        <td>{contact.number}</td>
                        <td
                          className="menu-wrapper"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BsThreeDotsVertical
                            className="dot-icon"
                            onClick={() =>
                              setSelectedMenu(
                                selectedMenu === contact.id
                                  ? null
                                  : contact.id
                              )
                            }
                          />
                          {selectedMenu === contact.id && (
                            <div className="dropdown-menu">
                              {page !== "trash" ? (
                                <>
                                  <p
                                    onClick={() =>
                                      navigate("/create", {
                                        state: contact,
                                      })
                                    }
                                  >
                                    Edit
                                  </p>
                                  <p
                                    onClick={() =>
                                      toggleFavourite(contact)
                                    }
                                  >
                                    {contact.favourite ? (
                                      <>
                                        <FaStar color="gold" />
                                        Unfavourite
                                      </>
                                    ) : (
                                      <>
                                        <FaRegStar />
                                        Favourite
                                      </>
                                    )}
                                  </p>
                                  <p onClick={() => deleteContact(contact)}>
                                    Delete
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p
                                    onClick={() =>
                                      navigate("/create", {
                                        state: contact,
                                      })
                                    }
                                  >
                                    Edit
                                  </p>
                                  <p onClick={() => restoreContact(contact)}>
                                    Restore
                                  </p>
                                  <p
                                    onClick={() =>
                                      permanentDelete(contact)
                                    }
                                  >
                                    Permanent Delete
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </>
                    )}

                    {/* LAPTOP SIDEBAR OPEN – NO CHANGE – visible only >768 */}
                    {window.innerWidth > 768 && sidebar && (
                      <>
                        <td>{contact.number}</td>
                        <td>{contact.email}</td>
                        <td
                          className="menu-wrapper"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BsThreeDotsVertical
                            className="dot-icon"
                            onClick={() =>
                              setSelectedMenu(
                                selectedMenu === contact.id
                                  ? null
                                  : contact.id
                              )
                            }
                          />
                          {selectedMenu === contact.id && (
                            <div className="dropdown-menu">
                              {page !== "trash" ? (
                                <>
                                  <p
                                    onClick={() =>
                                      navigate("/create", {
                                        state: contact,
                                      })
                                    }
                                  >
                                    Edit
                                  </p>
                                  <p
                                    onClick={() =>
                                      toggleFavourite(contact)
                                    }
                                  >
                                    {contact.favourite ? (
                                      <>
                                        <FaStar color="gold" />
                                        Unfavourite
                                      </>
                                    ) : (
                                      <>
                                        <FaRegStar />
                                        Favourite
                                      </>
                                    )}
                                  </p>
                                  <p onClick={() => deleteContact(contact)}>
                                    Delete
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p
                                    onClick={() =>
                                      navigate("/create", {
                                        state: contact,
                                      })
                                    }
                                  >
                                    Edit
                                  </p>
                                  <p onClick={() => restoreContact(contact)}>
                                    Restore
                                  </p>
                                  <p
                                    onClick={() =>
                                      permanentDelete(contact)
                                    }
                                  >
                                    Permanent Delete
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </>
                    )}

                    {/* LAPTOP SIDEBAR CLOSE – NO CHANGE – visible only >768 */}
                    {window.innerWidth > 768 && !sidebar && (
                      <>
                        <td>{contact.number}</td>
                        <td>{contact.email}</td>
                        <td>{contact.job}</td>
                        <td>{contact.dob}</td>
                        <td
                          className="menu-wrapper"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <BsThreeDotsVertical
                            className="dot-icon"
                            onClick={() =>
                              setSelectedMenu(
                                selectedMenu === contact.id
                                  ? null
                                  : contact.id
                              )
                            }
                          />
                          {selectedMenu === contact.id && (
                            <div className="dropdown-menu">
                              {page !== "trash" ? (
                                <>
                                  <p
                                    onClick={() =>
                                      navigate("/create", {
                                        state: contact,
                                      })
                                    }
                                  >
                                    Edit
                                  </p>
                                  <p
                                    onClick={() =>
                                      toggleFavourite(contact)
                                    }
                                  >
                                    {contact.favourite ? (
                                      <>
                                        <FaStar color="gold" />
                                        Unfavourite
                                      </>
                                    ) : (
                                      <>
                                        <FaRegStar />
                                        Favourite
                                      </>
                                    )}
                                  </p>
                                  <p onClick={() => deleteContact(contact)}>
                                    Delete
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p
                                    onClick={() =>
                                      navigate("/create", {
                                        state: contact,
                                      })
                                    }
                                  >
                                    Edit
                                  </p>
                                  <p onClick={() => restoreContact(contact)}>
                                    Restore
                                  </p>
                                  <p
                                    onClick={() =>
                                      permanentDelete(contact)
                                    }
                                  >
                                    Permanent Delete
                                  </p>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactList;