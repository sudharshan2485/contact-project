import React, {
  useState,
  useEffect,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaTrash,
  FaStar,
  FaRegStar,
  FaEdit,
  FaUserAlt,
} from "react-icons/fa";

import {
  BsThreeDotsVertical,
} from "react-icons/bs";

import {
  IoMdAdd,
} from "react-icons/io";

import {
  MdOutlinePhoneInTalk,
  MdAttachEmail,
} from "react-icons/md";

import {
  IoCalendarNumber,
} from "react-icons/io5";

import {
  BsBuildingsFill,
} from "react-icons/bs";

import {
  FaLocationPinLock,
} from "react-icons/fa6";

import {
  TfiWrite,
} from "react-icons/tfi";

import {
  db,
} from "../Firebase";

import {
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  collection,
  setDoc,
} from "firebase/firestore";

import "./ContactList.css";
import "./ViewContact.css";

function ViewContact({
  user,
  logout,
}) {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const contact =
    location.state;

  const [sidebarOpen, setSidebarOpen] =
    useState(
      window.innerWidth > 768
    );

  const [openMenu, setOpenMenu] =
    useState(false);

  useEffect(() => {

    const handleClick = (
      e
    ) => {

      if (
        window.innerWidth <=
          768 &&
        !e.target.closest(
          ".sidebar"
        ) &&
        !e.target.closest(
          ".nav-icon"
        )
      ) {

        setSidebarOpen(false);
      }

      if (
        !e.target.closest(
          ".menu-wrapper"
        )
      ) {

        setOpenMenu(false);
      }
    };

    document.addEventListener(
      "click",
      handleClick
    );

    return () => {

      document.removeEventListener(
        "click",
        handleClick
      );
    };
  }, []);

  // DELETE CONTACT

  const deleteContact =
    async () => {

      const trashData = {
        ...contact,
        deletedAt:
          new Date(),
      };

      await setDoc(
        doc(
          db,
          "users",
          user.uid,
          "trash",
          contact.id
        ),
        trashData
      );

      await deleteDoc(
        doc(
          db,
          "users",
          user.uid,
          "contacts",
          contact.id
        )
      );

      navigate("/");
    };

  // FAVOURITE

  const toggleFavourite =
    async () => {

      await updateDoc(
        doc(
          db,
          "users",
          user.uid,
          "contacts",
          contact.id
        ),
        {
          favourite:
            !contact.favourite,
        }
      );

      navigate("/");
    };

  // PROFILE COLOR

  const getColor = (
    name = ""
  ) => {

    const colors = [
      "#ff6b6b",
      "#5f27cd",
      "#10ac84",
      "#ff9f43",
    ];

    return colors[
      name.charCodeAt(0) %
        colors.length
    ];
  };

  return (

    <div className="home-main">

      {/* NAVBAR */}

      <div className="navbar">

        <div className="nav-left">

          <FaBars
            className="nav-icon"
            size={22}
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          />

          <h2 className="nav-title">
            Contact Details
          </h2>

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search"
            />

          </div>

        </div>

        <div className="nav-right">

          <FaCog
            className="setting-icon"
            size={22}
          />

          <button
            className="logout-btn"
            onClick={logout}
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </div>

      {/* BODY */}

      <div className="body-section">

        {/* SIDEBAR */}

        {sidebarOpen && (

          <div className="sidebar">

            <div className="sidebar-profile">

              {user?.photoURL ? (

                <img
                  src={
                    user.photoURL
                  }
                  alt=""
                />

              ) : (

                <div className="profile-letter">

                  {user?.email
                    ?.charAt(0)
                    .toUpperCase()}

                </div>

              )}

              <p>
                {user?.email}
              </p>

            </div>

            <button
              className="create-btn"
              onClick={() =>
                navigate(
                  "/create"
                )
              }
            >

              <IoMdAdd />

              Create Contact

            </button>

            <div className="sidebar-menu">

              <p
                onClick={() =>
                  navigate("/")
                }
              >
                All Contacts
              </p>

              <p
                onClick={() =>
                  navigate(
                    "/?page=favourite"
                  )
                }
              >
                Favourite
              </p>

              <p
                onClick={() =>
                  navigate(
                    "/?page=trash"
                  )
                }
              >
                Trash
              </p>

            </div>

          </div>

        )}

        {/* VIEW SECTION */}

        <div
          className={`table-container scroll-container ${
            sidebarOpen
              ? "small"
              : "full"
          }`}
        >

          <div className="view-contact-card">

            {/* TOP */}

            <div className="view-top">

              <div className="view-profile">

                {contact.image ? (

                  <img
                    src={
                      contact.image
                    }
                    alt=""
                    className="view-img"
                  />

                ) : (

                  <div
                    className="view-letter"
                    style={{
                      background:
                        getColor(
                          contact.name
                        ),
                    }}
                  >

                    {contact.name
                      ?.charAt(0)
                      .toUpperCase()}

                  </div>

                )}

                <div>

                  <h2>
                    {
                      contact.name
                    }
                  </h2>

                  <p>
                    {
                      contact.number
                    }
                  </p>

                  <p>
                    {
                      contact.email
                    }
                  </p>

                </div>

              </div>

              {/* MENU */}

              <div className="menu-wrapper">

                <BsThreeDotsVertical
                  className="dot-icon"
                  onClick={() =>
                    setOpenMenu(
                      !openMenu
                    )
                  }
                />

                {openMenu && (

                  <div className="dropdown-menu view-menu">

                    <p
                      onClick={() =>
                        navigate(
                          "/create",
                          {
                            state:
                              contact,
                          }
                        )
                      }
                    >

                      <FaEdit />

                      Edit

                    </p>

                    <p
                      onClick={
                        toggleFavourite
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

                    <p
                      onClick={
                        deleteContact
                      }
                    >

                      <FaTrash />
                      Delete

                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* DETAILS */}

            <div className="view-details">

              <div className="view-row">

                <i>
                  <FaUserAlt />
                </i>

                <div>
                  <h4>Name</h4>

                  <p>
                    {
                      contact.name
                    }
                  </p>
                </div>

              </div>

              <div className="view-row">

                <i>
                  <MdOutlinePhoneInTalk />
                </i>

                <div>
                  <h4>
                    Phone
                  </h4>

                  <p>
                    {
                      contact.number
                    }
                  </p>
                </div>

              </div>

              <div className="view-row">

                <i>
                  <MdAttachEmail />
                </i>

                <div>
                  <h4>
                    Email
                  </h4>

                  <p>
                    {
                      contact.email
                    }
                  </p>
                </div>

              </div>

              <div className="view-row">

                <i>
                  <IoCalendarNumber />
                </i>

                <div>
                  <h4>DOB</h4>

                  <p>
                    {
                      contact.dob
                    }
                  </p>
                </div>

              </div>

              <div className="view-row">

                <i>
                  <BsBuildingsFill />
                </i>

                <div>
                  <h4>Job</h4>

                  <p>
                    {
                      contact.job
                    }
                  </p>
                </div>

              </div>

              <div className="view-row">

                <i>
                  <FaLocationPinLock />
                </i>

                <div>
                  <h4>
                    Location
                  </h4>

                  <p>
                    {
                      contact.location
                    }
                  </p>
                </div>

              </div>

              <div className="view-row notes-row">

                <i>
                  <TfiWrite />
                </i>

                <div>
                  <h4>
                    Notes
                  </h4>

                  <p>
                    {
                      contact.notes
                    }
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ViewContact;